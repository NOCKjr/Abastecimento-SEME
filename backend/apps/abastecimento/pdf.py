from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Spacer, Paragraph
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from .models import GuiaAbastecimento


def gerar_pdf_guia(guia_id):
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
    
    dados_veiculo = [
        ['Placa:', guia.veiculo.placa],
        ['Modelo:', guia.veiculo.modelo],
        ['Ano:', str(guia.veiculo.ano)],
        ['Hodômetro:', f"{guia.hodometro} km"],
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
        ['Combustível:', f"{guia.qtd_combustivel} L"],
        ['Óleo Lubrificante:', f"{guia.qtd_oleo_lubrificante} L"],
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
    
    dados_adicionais = [
        ['Rota:', guia.rota.descricao],
        ['Instituição:', guia.instituicao.nome],
        ['Usuário:', guia.usuario.nome],
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