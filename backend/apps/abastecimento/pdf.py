from io import BytesIO
from decimal import Decimal
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4, letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Spacer, Paragraph
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
from .models import GuiaAbastecimento


def _format_decimal(value):
    if value is None:
        return "-"
    if isinstance(value, Decimal):
        return f"{value:.3f}"
    return str(value)


def _format_litros(value):
    value_text = _format_decimal(value)
    if value_text == "-":
        return value_text
    return f"{value_text} L"


def _format_usuario(usuario):
    full_name = usuario.get_full_name().strip()
    return full_name or usuario.username


def _format_decimal_min1_keep_rest(value):
    if value is None:
        return "-"

    if isinstance(value, Decimal):
        text = format(value, "f")
    else:
        text = str(value)

    if "." not in text:
        return f"{text}.0"

    integer, frac = text.split(".", 1)
    frac_stripped = frac.rstrip("0")
    if len(frac_stripped) < 1:
        frac_stripped = frac_stripped.ljust(1, "0")
    return f"{integer}.{frac_stripped}"


def _get_choice_display(instance, field_name: str) -> str:
    fn = getattr(instance, f"get_{field_name}_display", None)
    if callable(fn):
        return fn()
    return str(getattr(instance, field_name, ""))


def _draw_signature_line(pdf: canvas.Canvas, x_center: float, y: float, width_mm: float = 90):
    line_w = width_mm * mm
    x1 = x_center - (line_w / 2)
    x2 = x_center + (line_w / 2)
    pdf.setLineWidth(1)
    pdf.line(x1, y, x2, y)


def _draw_guia_impressao_copy(pdf: canvas.Canvas, guia: GuiaAbastecimento, y_bottom: float, y_top: float):
    page_w, _ = A4
    x_left = 18 * mm
    x_center = page_w / 2

    tipo_servico_raw = (guia.tipo_servico or "").upper().strip()
    tipo_servico_display = _get_choice_display(guia, "tipo_servico")
    tipo_combustivel_display = _get_choice_display(guia, "tipo_combustivel")

    vehicle_services = {"CAMINHONETE", "ONIBUS", "MOTOCICLETA", "CARRO"}
    escola_services = {"CAMINHONETE", "ONIBUS", "MOTOCICLETA", "CARRO", "BARQUEIRO"}

    if tipo_servico_raw in {"ROCAGEM", "COROTE"}:
        label_nome = "Nome do Responsável"
    elif tipo_servico_raw == "BARQUEIRO":
        label_nome = "Nome do Catraeiro"
    else:
        label_nome = "Nome do condutor"

    if tipo_servico_raw in escola_services:
        label_instituicao = "Escola Atendida"
    else:
        label_instituicao = "Instituição Atendida"

    data_emissao = guia.data_emissao.strftime("%d/%m/%Y")
    nome_condutor = guia.condutor.nome_completo
    instituicao = guia.instituicao.nome

    litros = _format_decimal_min1_keep_rest(guia.qtd_combustivel)

    modelo = guia.veiculo.modelo if guia.veiculo else ""
    placa = guia.veiculo.placa if guia.veiculo else ""
    veiculo_text = (f"{modelo} - {placa}").strip()
    veiculo_text = veiculo_text.strip("-").strip() or "-"

    periodo = ""
    if tipo_servico_raw in {"CAMINHONETE", "ONIBUS"}:
        periodo = "30"

    y = y_top - 14 * mm
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawCentredString(x_center, y, "GUIA PARA LIBERAÇÃO DE ABASTECIMENTO")

    y -= 7 * mm
    pdf.setFont("Helvetica-Oblique", 11)
    pdf.drawCentredString(x_center, y, f"{tipo_servico_display}")

    y -= 11 * mm
    pdf.setFont("Helvetica", 11)
    pdf.drawString(x_left, y, f"Data: {data_emissao}")

    y -= 8 * mm
    pdf.drawString(x_left, y, f"{label_nome}: {nome_condutor}")

    if tipo_servico_raw in vehicle_services:
        y -= 8 * mm
        pdf.drawString(x_left, y, f"Modelo/placa do Veículo: {veiculo_text}")

    y -= 8 * mm
    pdf.drawString(x_left, y, f"{label_instituicao}: {instituicao}")

    y -= 8 * mm
    pdf.drawString(x_left, y, f"Quantidade de Litros: {litros} L {tipo_combustivel_display}")

    if tipo_servico_raw != "ROCAGEM":
        y -= 8 * mm
        pdf.drawString(x_left, y, f"Período de uso (em dias): {periodo}")

    y_sig_coord = y_bottom + 44 * mm
    pdf.setFont("Helvetica", 10)
    _draw_signature_line(pdf, x_center, y_sig_coord)
    pdf.drawCentredString(x_center, y_sig_coord - 6 * mm, "Duan de Souza Soares")
    pdf.drawCentredString(x_center, y_sig_coord - 11 * mm, "Coordenador de Transporte Escolar")

    y_sig_cond = y_bottom + 20 * mm
    _draw_signature_line(pdf, x_center, y_sig_cond)
    pdf.drawCentredString(x_center, y_sig_cond - 6 * mm, "Assinatura do Condutor")


def gerar_pdf_guia(guia_id):
    """
    Gera um PDF de impressão no formato A4 com duas vias (metade superior e inferior).
    Retorna bytes do PDF.
    """
    try:
        guia = GuiaAbastecimento.objects.select_related(
            "veiculo",
            "condutor__secretaria",
            "rota",
            "instituicao",
            "usuario",
            "secretaria",
        ).get(id=guia_id)
    except GuiaAbastecimento.DoesNotExist:
        raise ValueError(f"Guia {guia_id} não encontrada")

    buf = BytesIO()
    pdf = canvas.Canvas(buf, pagesize=A4)
    w, h = A4
    half = h / 2

    _draw_guia_impressao_copy(pdf, guia, y_bottom=half, y_top=h)
    _draw_guia_impressao_copy(pdf, guia, y_bottom=0, y_top=half)

    pdf.setDash(3, 3)
    pdf.setLineWidth(0.8)
    pdf.line(12 * mm, half, w - 12 * mm, half)
    pdf.setDash()

    pdf.showPage()
    pdf.save()
    return buf.getvalue()


def gerar_pdf_guia_detalhado(guia_id):
    """
    Gera um PDF com os dados da Guia de Abastecimento
    Retorna bytes do PDF
    """
    
    # Busca a guia no banco
    try:
        guia = GuiaAbastecimento.objects.select_related(
            "veiculo",
            "condutor__secretaria",
            "rota",
            "instituicao",
            "usuario",
            "secretaria",
        ).get(id=guia_id)

    except GuiaAbastecimento.DoesNotExist:
        raise ValueError(f"Guia {guia_id} não encontrada")
    
    # Cria buffer para o PDF
    pdf_buffer = BytesIO()
    
    # Cria documento PDF
    doc = SimpleDocTemplate(
        pdf_buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    
    # Lista de elementos para o PDF
    elements = []
    
    # Estilos
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=18,
        textColor=colors.HexColor('#1f4788'),
        spaceAfter=20,
        alignment=1  # Centralizado
    )
    
    heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontSize=12,
        textColor=colors.HexColor('#1f4788'),
        spaceAfter=10,
        spaceBefore=15,
        borderPadding=5
    )
    
    # Título
    elements.append(Paragraph(f"GUIA DE ABASTECIMENTO #{guia.id}", title_style))
    elements.append(Spacer(1, 0.2 * inch))
    
    # ===== DADOS GERAIS =====
    elements.append(Paragraph("DADOS GERAIS", heading_style))
    
    dados_gerais = [
        ['Data de Emissão:', str(guia.data_emissao.strftime('%d/%m/%Y'))],
        ['Tipo de Serviço:', guia.tipo_servico],
        ['Tipo de Combustível:', guia.tipo_combustivel],
        ['Observação:', guia.observacao or '-'],
    ]
    
    table_gerais = Table(dados_gerais, colWidths=[2.5 * inch, 4 * inch])
    table_gerais.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#e8e8e8')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
    ]))
    
    elements.append(table_gerais)
    elements.append(Spacer(1, 0.2 * inch))
    
    # ===== INFORMAÇÕES DO VEÍCULO =====
    elements.append(Paragraph("INFORMAÇÕES DO VEÍCULO", heading_style))

    placa = guia.veiculo.placa if guia.veiculo else "-"
    modelo = guia.veiculo.modelo if guia.veiculo else "-"
    ano = str(guia.veiculo.ano) if guia.veiculo else "-"
    hodometro = f"{guia.hodometro} km" if guia.hodometro is not None else "-"

    dados_veiculo = [
        ['Placa:', placa],
        ['Modelo:', modelo],
        ['Ano:', ano],
        ['Hodômetro:', hodometro],
    ]
    
    table_veiculo = Table(dados_veiculo, colWidths=[2.5 * inch, 4 * inch])
    table_veiculo.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#e8e8e8')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
    ]))
    
    elements.append(table_veiculo)
    elements.append(Spacer(1, 0.2 * inch))
    
    # ===== INFORMAÇÕES DO CONDUTOR =====
    elements.append(Paragraph("INFORMAÇÕES DO CONDUTOR", heading_style))
    
    dados_condutor = [
        ['Nome:', guia.condutor.nome_completo],
        ['CPF:', guia.condutor.cpf],
        ['Secretaria:', guia.condutor.secretaria.sigla],
    ]
    
    table_condutor = Table(dados_condutor, colWidths=[2.5 * inch, 4 * inch])
    table_condutor.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#e8e8e8')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
    ]))
    
    elements.append(table_condutor)
    elements.append(Spacer(1, 0.2 * inch))
    
    # ===== QUANTIDADES =====
    elements.append(Paragraph("QUANTIDADES", heading_style))

    dados_quantidades = [
        ['Combustível:', _format_litros(guia.qtd_combustivel)],
        ['Óleo Lubrificante:', _format_litros(guia.qtd_oleo_lubrificante)],
    ]
    
    table_quantidades = Table(dados_quantidades, colWidths=[2.5 * inch, 4 * inch])
    table_quantidades.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#e8e8e8')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
    ]))
    
    elements.append(table_quantidades)
    elements.append(Spacer(1, 0.3 * inch))
    
    # ===== INFORMAÇÕES ADICIONAIS =====
    elements.append(Paragraph("INFORMAÇÕES ADICIONAIS", heading_style))

    rota = guia.rota.descricao if guia.rota else "-"

    dados_adicionais = [
        ['Rota:', rota],
        ['Instituição:', guia.instituicao.nome],
        ['Usuário:', _format_usuario(guia.usuario)],
    ]
    
    table_adicionais = Table(dados_adicionais, colWidths=[2.5 * inch, 4 * inch])
    table_adicionais.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#e8e8e8')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
    ]))
    
    elements.append(table_adicionais)
    
    # Constrói o PDF
    doc.build(elements)
    
    # Retorna bytes
    pdf_buffer.seek(0)
    return pdf_buffer.getvalue()
