import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#718096"))
        
        # Header (pages after cover/first page)
        if self._pageNumber > 1:
            self.drawString(54, letter[1] - 36, "Documentação das Rotas da API — E-commerce NestJS")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.5)
            self.line(54, letter[1] - 42, letter[0] - 54, letter[1] - 42)

        # Footer
        text = f"Página {self._pageNumber} de {page_count}"
        self.drawRightString(letter[0] - 54, 30, text)
        self.drawString(54, 30, "Documento gerado automaticamente • Antigravity Engineering")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 42, letter[0] - 54, 42)
        self.restoreState()

def create_pdf(filename="documentacao_rotas_ecommerce.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom palette
    PRIMARY = colors.HexColor("#1A365D")   # Deep navy
    SECONDARY = colors.HexColor("#2B6CB0") # Slate blue
    ACCENT = colors.HexColor("#319795")    # Teal
    DARK_TEXT = colors.HexColor("#2D3748")
    LIGHT_BG = colors.HexColor("#F7FAFC")
    BORDER_COLOR = colors.HexColor("#CBD5E0")
    GREEN = colors.HexColor("#22543D")
    GREEN_BG = colors.HexColor("#C6F6D5")
    BLUE_BG = colors.HexColor("#EBF8FF")
    YELLOW_BG = colors.HexColor("#FEFCBF")
    RED_BG = colors.HexColor("#FED7D7")

    # Typography styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=PRIMARY,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#4A5568"),
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        textColor=PRIMARY,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=SECONDARY,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=DARK_TEXT,
        spaceAfter=4
    )

    body_bold = ParagraphStyle(
        'DocBodyBold',
        parent=body_style,
        fontName='Helvetica-Bold'
    )

    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#2C5282")
    )

    badge_post = ParagraphStyle('BadgePOST', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.HexColor("#22543D"), alignment=1)
    badge_get = ParagraphStyle('BadgeGET', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.HexColor("#2B6CB0"), alignment=1)
    badge_patch = ParagraphStyle('BadgePATCH', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.HexColor("#744210"), alignment=1)
    badge_del = ParagraphStyle('BadgeDEL', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.HexColor("#742A2A"), alignment=1)

    story = []

    # Title & Metadata Card
    story.append(Paragraph("Documentação Técnica de Rotas da API", title_style))
    story.append(Paragraph("E-commerce API REST • NestJS + Prisma ORM + PostgreSQL", subtitle_style))
    
    meta_table_data = [
        [
            Paragraph("<b>Projeto:</b> Ecommerce NestJS API", body_style),
            Paragraph("<b>Data:</b> 16/10/2026", body_style),
            Paragraph("<b>Versão:</b> 1.0.0", body_style),
            Paragraph("<b>Status:</b> Produção / Ativo", body_style)
        ]
    ]
    meta_table = Table(meta_table_data, colWidths=[150, 90, 80, 184])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 14))

    # Visão Geral
    story.append(Paragraph("1. Visão Geral da Arquitetura de Rotas", h1_style))
    story.append(Paragraph(
        "A aplicação é estruturada em módulos desacoplados no <b>NestJS</b> com autenticação baseada em tokens JWT "
        "e controle granular de acesso através de <b>Role Guards</b> (<code>USER</code> para clientes e <code>SALLER</code> para vendedores/lojistas). "
        "Todas as operações de escrita crítica (como pagamentos e movimentação de estoque) são executadas sob <b>transações atômicas ACID</b> no PostgreSQL através do Prisma.",
        body_style
    ))
    story.append(Spacer(1, 10))

    # Helper function to create endpoint card table
    def make_endpoint_row(method, path, role, description, payload, response_desc):
        if method == "POST":
            bg_col = GREEN_BG
            badge_p = badge_post
        elif method == "GET":
            bg_col = BLUE_BG
            badge_p = badge_get
        elif method == "PATCH":
            bg_col = YELLOW_BG
            badge_p = badge_patch
        else:
            bg_col = RED_BG
            badge_p = badge_del

        header_data = [
            [
                Paragraph(f"<b>{method}</b>", badge_p),
                Paragraph(f"<b><code>{path}</code></b>", ParagraphStyle('PathStyle', parent=body_style, fontName='Courier-Bold', fontSize=10, textColor=PRIMARY)),
                Paragraph(f"<b>Acesso:</b> {role}", ParagraphStyle('RoleStyle', parent=body_style, fontSize=8.5, textColor=colors.HexColor("#4A5568"), alignment=2))
            ]
        ]
        htable = Table(header_data, colWidths=[55, 305, 144])
        htable.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (0,0), bg_col),
            ('BACKGROUND', (1,0), (-1,-1), colors.HexColor("#EDF2F7")),
            ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ]))

        content_data = [
            [Paragraph("<b>Descrição:</b>", body_style), Paragraph(description, body_style)],
            [Paragraph("<b>Body / Params:</b>", body_style), Paragraph(payload, code_style)],
            [Paragraph("<b>Resposta:</b>", body_style), Paragraph(response_desc, body_style)],
        ]
        ctable = Table(content_data, colWidths=[90, 414])
        ctable.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.white),
            ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#EDF2F7")),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('RIGHTPADDING', (0,0), (-1,-1), 6),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))

        return [htable, ctable, Spacer(1, 7)]

    # 2. Módulo de Autenticação
    story.append(Paragraph("2. Módulo de Autenticação (<code>/auth</code>)", h1_style))
    for item in make_endpoint_row(
        "POST", "/auth/login", "Público",
        "Autentica o usuário pelo e-mail e senha. Identifica automaticamente se a conta é de cliente ou vendedor (lojista) e gera um JWT assinado com claims de Role.",
        '{\n  "email": "user@exemplo.com",\n  "password": "senhaSegura123"\n}',
        "Retorna <code>accessToken</code> (JWT) e <code>vendedorId</code> (se aplicável)."
    ): story.append(item)

    # 3. Módulo de Usuário
    story.append(Paragraph("3. Módulo de Usuário e Endereços (<code>/user</code>)", h1_style))
    for item in make_endpoint_row(
        "POST", "/user/registrar", "Público",
        "Cria uma nova conta de usuário comum com criptografia bcrypt de senha.",
        '{\n  "name": "João Silva", "email": "joao@email.com",\n  "telefone": 11988887777, "password": "senha"\n}',
        "Retorna objeto com <code>id</code>, <code>name</code> e <code>email</code>."
    ): story.append(item)

    for item in make_endpoint_row(
        "POST", "/user/endereco", "JWT (Role: USER)",
        "Cadastra um endereço de entrega vinculado ao usuário autenticado.",
        '{\n  "cep": "01001-000", "rua": "Av. Paulista", "numero": "1000",\n  "complemento": "Apto 42", "bairro": "Bela Vista", "cidade": "SP", "estado": "SP"\n}',
        "Retorna o objeto do endereço cadastrado com seu identificador único."
    ): story.append(item)

    for item in make_endpoint_row(
        "GET", "/user", "JWT (Role: USER)",
        "Obtém o perfil completo do usuário logado e sua lista de endereços cadastrados.",
        "Nenhum payload (identificado pelo token JWT no header Authorization)",
        "Array de usuários com <code>name</code>, <code>email</code>, <code>telefone</code> e <code>endereco[]</code>."
    ): story.append(item)

    for item in make_endpoint_row(
        "PATCH", "/user/:id", "JWT (Role: USER)",
        "Atualiza dados cadastrais do usuário informado no parâmetro de rota.",
        '{\n  "name": "João Santos Silva", "telefone": 11977776666\n}',
        "Retorna o registro do usuário atualizado."
    ): story.append(item)

    for item in make_endpoint_row(
        "DELETE", "/user/:id", "JWT (Role: USER)",
        "Remove a conta do usuário informado do banco de dados.",
        "Parâmetro de URL: <code>:id</code> (UUID)",
        "Confirmação de exclusão do registro."
    ): story.append(item)

    # Page Break para a próxima seção
    story.append(PageBreak())

    # 4. Módulo de Vendedor
    story.append(Paragraph("4. Módulo de Lojistas e Vendedores (<code>/vendedor</code>)", h1_style))
    for item in make_endpoint_row(
        "POST", "/criar-conta-vendedor", "JWT (Autenticado)",
        "Promove o usuário autenticado a Vendedor criando o registro de sua Loja vinculada.",
        '{\n  "nomeLoja": "Tech Store", "cnpj": "12.345.678/0001-90",\n  "telefoneLoja": 11999998888, "cepLoja": "01001-000"\n}',
        "Retorna os dados da loja criada e associa ao ID do usuário."
    ): story.append(item)

    for item in make_endpoint_row(
        "GET", "/lojas", "JWT (Role: SALLER)",
        "Lista todas as lojas cadastradas na plataforma junto aos seus respectivos catálogos de produtos.",
        "Nenhum payload",
        "Objeto contendo array <code>lojas</code> com dados do lojista e produtos."
    ): story.append(item)

    for item in make_endpoint_row(
        "GET", "/loja", "JWT (Role: SALLER)",
        "Consulta o perfil e as configurações da loja do vendedor autenticado.",
        "Nenhum payload",
        "Dados da loja: <code>id</code>, <code>nomeLoja</code>, <code>cnpj</code>, <code>telefoneLoja</code>, etc."
    ): story.append(item)

    for item in make_endpoint_row(
        "PATCH", "/loja", "JWT (Role: SALLER)",
        "Atualiza as informações cadastrais e de contato da loja do vendedor logado.",
        '{\n  "nomeLoja": "Tech Store Oficial", "telefoneLoja": 11988881111\n}',
        "Retorna o cadastro da loja com as alterações aplicadas."
    ): story.append(item)

    for item in make_endpoint_row(
        "DELETE", "/loja", "JWT (Role: SALLER)",
        "Encerra e remove o cadastro de vendedor do usuário logado.",
        "Nenhum payload",
        "Retorna os dados da conta de vendedor removida."
    ): story.append(item)

    # 5. Módulo de Produtos
    story.append(Paragraph("5. Módulo de Produtos (<code>/produto</code>)", h1_style))
    for item in make_endpoint_row(
        "POST", "/produto", "JWT (Role: SALLER)",
        "Cadastra um novo produto no estoque da loja do vendedor autenticado.",
        '{\n  "nome": "Mouse Gamer RGB", "preco": 149.90, "estoque": 50,\n  "descricao": "Sensor óptico 16000 DPI", "tags": ["gamer", "mouse"]\n}',
        "Objeto contendo o registro do produto criado com seu UUID."
    ): story.append(item)

    for item in make_endpoint_row(
        "GET", "/produto", "Público",
        "Retorna todos os produtos ativos disponíveis para compra no marketplace.",
        "Nenhum payload",
        "Array com todos os produtos, preços e estoques."
    ): story.append(item)

    for item in make_endpoint_row(
        "GET", "/produto/:id", "Público",
        "Busca os detalhes, estoque e especificações de um produto específico por ID.",
        "Parâmetro de URL: <code>:id</code> (UUID)",
        "Objeto completo do produto consultado."
    ): story.append(item)

    for item in make_endpoint_row(
        "PATCH", "/produto/:id", "JWT (Role: SALLER)",
        "Atualiza preço, descrição ou estoque de um produto pertencente ao vendedor.",
        '{\n  "preco": 129.90, "estoque": 45\n}',
        "Retorna o registro atualizado do produto."
    ): story.append(item)

    for item in make_endpoint_row(
        "DELETE", "/produto/:id", "JWT (Autenticado)",
        "Exclui o produto do catálogo do marketplace.",
        "Parâmetro de URL: <code>:id</code> (UUID)",
        "Objeto do produto excluído."
    ): story.append(item)

    # Page Break para a próxima seção
    story.append(PageBreak())

    # 6. Módulo de Carrinho
    story.append(Paragraph("6. Módulo de Carrinho de Compras (<code>/carrinho</code>)", h1_style))
    for item in make_endpoint_row(
        "GET", "/carrinho", "JWT (Role: USER)",
        "Recupera ou cria o carrinho do usuário logado, incluindo itens e detalhes dos produtos.",
        "Nenhum payload",
        "Objeto do carrinho com array <code>items[]</code> e dados dos produtos vinculados."
    ): story.append(item)

    for item in make_endpoint_row(
        "POST", "/carrinho/items", "JWT (Role: USER)",
        "Adiciona um item ao carrinho ou incrementa sua quantidade, validando o limite de estoque disponível.",
        '{\n  "produtoId": "uuid-do-produto",\n  "quantidade": 2\n}',
        "Retorna o carrinho atualizado com o novo item e cálculo de estoque."
    ): story.append(item)

    for item in make_endpoint_row(
        "PATCH", "/carrinho/items/:itemId", "JWT (Role: USER)",
        "Altera a quantidade de um item já presente no carrinho com checagem de estoque.",
        '{\n  "quantidade": 5\n}',
        "Retorna o carrinho com a quantidade do item reajustada."
    ): story.append(item)

    for item in make_endpoint_row(
        "DELETE", "/carrinho/items/:itemId", "JWT (Role: USER)",
        "Remove um item específico do carrinho do comprador.",
        "Parâmetro de URL: <code>:itemId</code> (UUID)",
        "Retorna o carrinho atualizado sem o item."
    ): story.append(item)

    for item in make_endpoint_row(
        "DELETE", "/carrinho", "JWT (Role: USER)",
        "Esvazia completamente o carrinho do usuário logado.",
        "Nenhum payload",
        "Retorna o carrinho vazio."
    ): story.append(item)

    # 7. Módulo de Gateway de Pagamento
    story.append(Paragraph("7. Módulo de Gateway de Pagamentos (<code>/pagamento</code>)", h1_style))
    for item in make_endpoint_row(
        "POST", "/pagamento/checkout", "JWT (Role: USER)",
        "Executa o checkout completo do carrinho atual sob Transação ACID: valida saldo de estoque, abate unidades automaticamente, gera Pedido, processa cobrança no gateway simulado, cria Entrega com rastreio e limpa o carrinho.",
        '{\n  "metodoPagamento": "PIX" | "CARTAO_CREDITO" | "CARTAO_DEBITO",\n  "numeroCartao": "4111111111111234",\n  "titularCartao": "Nome no Cartao",\n  "expiracaoCartao": "12/28", "cvvCartao": "123"\n}',
        "Retorna confirmação, <code>pedidoId</code>, status <code>PAGO</code>, ID de transação do gateway e código de rastreio de entrega."
    ): story.append(item)

    for item in make_endpoint_row(
        "POST", "/pagamento/processar", "JWT (Role: USER)",
        "Processa pagamento de um pedido pendente pré-existente, abatendo estoque de forma atômica se ainda pendente.",
        '{\n  "pedidoId": "uuid-do-pedido",\n  "metodoPagamento": "CARTAO_CREDITO"\n}',
        "Retorna recibo de pagamento aprovado e atualização do pedido para <code>PAGO</code>."
    ): story.append(item)

    for item in make_endpoint_row(
        "GET", "/pagamento", "JWT (Role: USER)",
        "Lista todo o histórico de pagamentos e transações associados ao usuário logado.",
        "Nenhum payload",
        "Array de pagamentos contendo pedido, itens e dados da entrega."
    ): story.append(item)

    for item in make_endpoint_row(
        "GET", "/pagamento/:id", "JWT (Role: USER)",
        "Busca os detalhes de uma transação de pagamento específica pertencente ao usuário.",
        "Parâmetro de URL: <code>:id</code> (UUID do pagamento)",
        "Objeto detalhado do pagamento, itens do pedido e entrega."
    ): story.append(item)

    # Page Break para a seção final de alterações
    story.append(PageBreak())

    # 8. Relatório de Alterações
    story.append(Paragraph("8. Relatório Detalhado das Alterações Realizadas", h1_style))
    story.append(Paragraph(
        "Esta seção documenta integralmente as mudanças arquiteturais, novos componentes, refatorações "
        "e limpeza de código implementadas no projeto:",
        body_style
    ))
    story.append(Spacer(1, 8))

    change_items = [
        ("Implementação do Gateway de Pagamento",
         "Criação completa do serviço de gateway em <code>PagamentoService</code> com suporte aos métodos <code>PIX</code>, <code>CARTAO_CREDITO</code> e <code>CARTAO_DEBITO</code>. Implementada validação de cartões e simulação realista de aprovação e recusa com geração de <code>transactionId</code> único."),
        
        ("Abatimento Automático de Estoque em Transação ACID",
         "O checkout e o pagamento agora operam dentro de <code>prismaService.$transaction</code>. Antes de concluir a compra, o sistema verifica se todos os produtos possuem estoque suficiente. Em caso positivo, o estoque de cada produto é decrementado automaticamente no banco de dados (<code>decrement: quantidade</code>); em caso negativo ou falha na transação, todas as alterações são revertidas (rollback)."),

        ("Fluxo Completo de Pedido e Entrega",
         "Durante a confirmação do pagamento, é gerado automaticamente o registro de <code>Pedido</code> (status <code>PAGO</code>), <code>Pagamento</code> (status <code>APROVADO</code>) e registro de <code>Entrega</code> (status <code>SOLICITADA</code>) associado ao endereço do usuário e com código de rastreamento gerado (ex: <code>BR12345678</code>). Ao final, o carrinho é automaticamente esvaziado."),

        ("Padronização de Nomenclatura em Todo o Projeto",
         "Todos os métodos em controllers e services foram padronizados para o padrão <b>camelCase em inglês</b> (ex: <code>create</code>, <code>findAll</code>, <code>findById</code>, <code>update</code>, <code>remove</code>, <code>checkout</code>, <code>findByUserId</code>, <code>getOrCreateCart</code>). Foram mantidos métodos em português como aliases delegadores para total garantia de retrocompatibilidade com qualquer consumidor externo da API."),

        ("Correções de Bugs e Integridade nos Controllers",
         "Corrigido o método de atualização em <code>ProdutoService</code> que continha uma chamada sem <code>await</code> em <code>findUnique</code>. Removidos parâmetros e imports não utilizados em diversos controllers e DTOs identificados pelo linter <code>oxlint</code>."),

        ("Remoção de Todos os Comentários do Código Fonte",
         "Conforme solicitado, foram removidos todos os comentários de linha única (<code>//</code>) e blocos de documentação (<code>/** */</code>) de todos os arquivos de código TypeScript sob o diretório <code>src/</code>, deixando os arquivos mais limpos e enxutos."),

        ("Suíte de Testes Unitários Completa (Vitest)",
         "Criação e correção das suítes de testes unitários para todos os módulos (<code>pagamento</code>, <code>carrinho</code>, <code>produto</code> e <code>vendedor</code>). Todas as dependências (PrismaService, ExceptionErros) foram devidamente mockadas. A suíte agora conta com <b>17 testes passando com 100% de sucesso</b> (8 arquivos de teste).")
    ]

    for title, desc in change_items:
        t_data = [
            [Paragraph(f"• <b>{title}</b>", h2_style)],
            [Paragraph(desc, body_style)]
        ]
        ch_table = Table(t_data, colWidths=[504])
        ch_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
            ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        story.append(ch_table)
        story.append(Spacer(1, 6))

    # Tabela comparativa de antes vs depois
    story.append(Spacer(1, 8))
    story.append(Paragraph("Resumo Comparativo (Antes vs Depois)", h2_style))
    comparison_data = [
        [Paragraph("<b>Aspecto</b>", body_bold), Paragraph("<b>Estado Anterior</b>", body_bold), Paragraph("<b>Estado Atual (Implementado)</b>", body_bold)],
        [
            Paragraph("Módulo Pagamento", body_style),
            Paragraph("Controlador e serviço esqueleto sem regras de negócio ou banco de dados", body_style),
            Paragraph("Gateway funcional com checkout atômico, criação de pedido, pagamento e entrega", body_style)
        ],
        [
            Paragraph("Controle de Estoque", body_style),
            Paragraph("Sem integração com pagamentos; estoque inalterado em vendas", body_style),
            Paragraph("Abatimento automático garantido via transação atômica Prisma com rollback", body_style)
        ],
        [
            Paragraph("Nomes de Funções", body_style),
            Paragraph("Inconsistentes: mistura de português (criarProduto, minhaLoja) e inglês", body_style),
            Paragraph("Padronização estrita em inglês (camelCase) com retrocompatibilidade", body_style)
        ],
        [
            Paragraph("Comentários no Código", body_style),
            Paragraph("Comentários dispersos e blocos JSDoc em diversos arquivos", body_style),
            Paragraph("100% limpo de comentários em todo o código fonte de <code>src/</code>", body_style)
        ],
        [
            Paragraph("Testes Automatizados", body_style),
            Paragraph("7 de 8 arquivos de testes falhando por dependências não injetadas", body_style),
            Paragraph("17 de 17 testes passando com 100% de sucesso no Vitest", body_style)
        ],
    ]
    comp_table = Table(comparison_data, colWidths=[100, 202, 202])
    comp_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E0")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG]),
    ]))
    story.append(comp_table)

    # Build PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF gerado com sucesso: {filename}")

if __name__ == '__main__':
    output_path = sys.argv[1] if len(sys.argv) > 1 else "documentacao_rotas_ecommerce.pdf"
    create_pdf(output_path)
