import os
from io import BytesIO
from decimal import Decimal
from django.conf import settings
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
    x_right = page_w - 18 * mm
    x_center = page_w / 2
    
    # Configuração de Estilo e Imagens
    
    # Altura e largura do brasão no PDF
    logo_size = 22 * mm 
    y_logo = y_top - 25 * mm
    
    # Configuração da linha (espessura e cor)
    pdf.setLineWidth(0.5)
    line_offset = 1.5 * mm # Distância abaixo da linha de base do texto

    # Caminhos das imagens
    # Assume que a imagem está em: backend/staticfiles/ditram/assets/img/brasao.png
    path_brasao_esq = os.path.join(settings.BASE_DIR, 'staticfiles', 'ditram', 'assets', 'img', 'brasao_ditram.png')
    path_brasao_dir = os.path.join(settings.BASE_DIR, 'staticfiles', 'ditram', 'assets', 'img', 'brasao_prefeitura.png')

    if os.path.exists(path_brasao_esq):
        # Brasão Esquerdo
        pdf.drawImage(path_brasao_esq, x_left, y_logo, width=logo_size, height=logo_size, preserveAspectRatio=True, mask='auto')
    
    if os.path.exists(path_brasao_dir):
        # Brasão Direito
        pdf.drawImage(path_brasao_dir, x_right - logo_size, y_logo, width=logo_size, height=logo_size, preserveAspectRatio=True, mask='auto')

    tipo_servico_raw = (guia.tipo_servico or "").upper().strip()
    tipo_servico_display = _get_choice_display(guia, "tipo_servico")
    tipo_combustivel_display = _get_choice_display(guia, "tipo_combustivel")

    vehicle_services = {"CAMINHONETE", "ONIBUS", "MOTOCICLETA", "CARRO"}
    escola_services = {"CAMINHONETE", "ONIBUS", "MOTOCICLETA", "CARRO", "BARQUEIRO"}

    if tipo_servico_raw in {"ROCAGEM", "COROTE"}:
        label_servico = "Responsável"
    elif tipo_servico_raw == "BARQUEIRO":
        label_servico = "Catraeiro"
    else:
        label_servico = "condutor"
    
    label_nome = f"Nome do {label_servico}"

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
    observacao = guia.observacao
    hodometro = guia.hodometro

    periodo = ""
    if tipo_servico_raw in {"CAMINHONETE", "ONIBUS"}:
        periodo = "30"
    
    # Função auxiliar para desenhar Rótulo + Valor com linha apenas no Valor
    def draw_field_with_line(pdf, x, y, label, value, font_name="Helvetica", font_size=11, line_width_extra=0):
        # 1. Desenha o Rótulo
        pdf.setFont(f"{font_name}-Bold", font_size)
        pdf.drawString(x, y, label)
        
        # 2. Calcula a largura do rótulo para saber onde o valor começa
        label_width = pdf.stringWidth(label, f"{font_name}-Bold", font_size)
        x_value = x + label_width + 2 * mm # Pequeno espaço entre ':' e o valor
        
        # 3. Desenha o Valor
        pdf.setFont(font_name, font_size)
        pdf.drawString(x_value, y, str(value))
        
        # 4. Desenha a linha apenas sob o valor (até a margem ou largura fixa)
        x_end = x_right if line_width_extra == 0 else x_value + line_width_extra
        pdf.setLineWidth(0.5)
        pdf.line(x_value, y - line_offset, x_end, y - line_offset)
    
    y = y_top - 14 * mm
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawCentredString(x_center, y, "GUIA PARA LIBERAÇÃO DE ABASTECIMENTO")

    y -= 7 * mm
    pdf.setFont("Helvetica-Oblique", 11)
    pdf.drawCentredString(x_center, y, f"{tipo_servico_display}")

    y -= 14 * mm
    draw_field_with_line(pdf, x_left, y, "Data: ", data_emissao, line_width_extra=30 * mm)

    y -= 8 * mm
    draw_field_with_line(pdf, x_left, y, f"{label_nome}: ", nome_condutor)

    if tipo_servico_raw in vehicle_services:
        y -= 8 * mm
        draw_field_with_line(pdf, x_left, y, "Modelo/placa do Veículo: ", veiculo_text)

    y -= 8 * mm
    draw_field_with_line(pdf, x_left, y, f"{label_instituicao}: ", instituicao)

    y -= 8 * mm
    litros_val = f"{litros} L {tipo_combustivel_display}"
    draw_field_with_line(pdf, x_left, y, "Quantidade de Litros: ", litros_val, line_width_extra=50 * mm)

    if tipo_servico_raw != "ROCAGEM":
        y -= 8 * mm
        draw_field_with_line(pdf, x_left, y, "Período de uso (em dias): ", periodo, line_width_extra=50 * mm)

    if tipo_servico_raw in vehicle_services:
        y -= 8 * mm
        draw_field_with_line(pdf, x_left, y, "Hodômetro: ", hodometro, line_width_extra=50 * mm)
    
    y -= 8 * mm
    draw_field_with_line(pdf, x_left, y, "Observação: ", observacao)


    y_sig_coord = y_bottom + 38 * mm
    pdf.setFont("Helvetica", 10)
    _draw_signature_line(pdf, x_center, y_sig_coord)
    pdf.drawCentredString(x_center, y_sig_coord - 6 * mm, "Duan de Souza Soares")
    pdf.drawCentredString(x_center, y_sig_coord - 11 * mm, "Diretor de Transporte Municipal")

    y_sig_cond = y_bottom + 14 * mm
    _draw_signature_line(pdf, x_center, y_sig_cond)
    pdf.drawCentredString(x_center, y_sig_cond - 6 * mm, f"Assinatura do {label_servico}")


def gerar_pdf_guia(guia_id):
    """
    Gera um PDF de impressão no formato A4 com duas vias (metade superior e inferior).
    Retorna bytes do PDF.
    """
    try:
        guia = GuiaAbastecimento.objects.select_related(
            "veiculo",
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
