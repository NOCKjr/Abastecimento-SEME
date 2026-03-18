# Abastecimento DITRAM

Sistema de controle e emissão de guias de abastecimento para a Diretoria de Transporte Municipal (DITRAM) de Sena Madureira - AC.

[![Figma Design](https://img.shields.io/badge/Figma-Design-blue?logo=figma&logoColor=white)](https://www.figma.com/design/iyTMnJRem5A4SyjrpKxiOO/SEME?node-id=0-1&t=aqXvkX3mVawrXngo-1)

## 📋 Requisitos Funcionais (RF)

| ID | Requisito Funcional | Descrição |
| :--- | :--- | :--- |
| **RF01** | **Gestão de Secretarias** | Cadastro e edição de secretarias (Nome e Sigla). |
| **RF02** | **Gestão de Condutores** | Cadastro de condutores com Nome, CPF e vínculo com secretaria. |
| **RF03** | **Gestão de Frota** | Cadastro de veículos com Placa, Modelo, Ano e Combustível. |
| **RF04** | **Gestão de Destinos** | Cadastro de Escolas, Postos de Saúde e Rotas por secretaria. |
| **RF05** | **Emissão de Guias** | Formulário inteligente com hodômetro opcional para medidores quebrados. |
| **RF06** | **Autopreenchimento** | Carrega veículo, rota e combustível automaticamente ao selecionar condutor. |
| **RF07** | **Cálculo Sugerido** | Sugestão de litragem baseada no consumo médio da rota/veículo. |
| **RF08** | **Geração de PDF** | Exportação da guia em formato PDF para impressão (duas vias idênticas). |
| **RF09** | **Relatórios por Período** | Geração de consolidados baseados em intervalos de datas customizáveis. |
| **RF10** | **Histórico** | Consulta de guias emitidas para fins de conferência e auditoria. |
| **RF11** | **Gestão de Perfil** | Alteração de dados (nome, e-mail e senha) pelo próprio usuário. |
| **RF12** | **Controle de Usuários** | Gestão de operadores e permissões realizada pelo Diretor (Admin). |
| **RF13** | **Favoritos de Relatório** | Salvar filtros recorrentes para geração em um clique. |

## 🛠️ Requisitos Não Funcionais (RNF)

| ID | Categoria | Requisito | Classificação |
| :--- | :--- | :--- | :--- |
| **RNF01** | **Disponibilidade** | Aplicação Web acessível via rede local ou internet. | Essencial |
| **RNF02** | **Portabilidade** | Interface responsiva (Mobile/Tablet/Desktop). | Essencial |
| **RNF03** | **Segurança** | Armazenamento de senhas com Hash BCrypt. | Essencial |
| **RNF04** | **Auditoria** | Registro do ID do usuário emissor em cada guia gerada. | Essencial |
| **RNF05** | **Hierarquia** | Funções críticas (Reset de DB) restritas ao Super Admin. | Essencial |

## 📐 Regras de Operação

### Tipos de Serviço Suportados
* **Veículos:** Caminhonete, Ônibus, Motocicleta, Carro.
* **Serviços Especiais:** Roçagem, Barqueiro (Catraieiro).
* **Outros:** Recipientes Avulsos (Corote).

### Automações de Campo
* **Concatenação:** Modelo e Placa são unidos automaticamente no PDF (`L200 - MXX-0000`).
* **Rótulos Dinâmicos:** A guia altera termos conforme o serviço (ex: "Catraieiro" para barcos, "Responsável" para roçagem).
* **Validação de Hodômetro:** O sistema bloqueia KM inferior à última registrada, mas permite confirmação manual caso o campo seja deixado vazio (medidor quebrado).

---

## ⚙️ Configuração e Instalação (Profiles)

### Backend (Django)
O backend usa a variável `DJANGO_PROFILE` para definir o perfil:
- `dev`: Desenvolvimento local (SQLite/Debug On).
- `validation`: Ambiente de testes (PostgreSQL/Debug Off).
- `prod`: Produção final (PostgreSQL/Debug Off).

**Rodando local:**
```powershell
cd backend
$env:DJANGO_PROFILE="dev"
python manage.py runserver
```

### Frontend (Vite)
O frontend utiliza arquivos `.env` específicos para direcionar as requisições à API e configurar o comportamento do build de acordo com o ambiente:

| Arquivo | Finalidade |
| :--- | :--- |
| `.env.development` | Modo padrão para desenvolvimento local. |
| `.env.validation` | Aponta para o ambiente de homologação/validação. |
| `.env.production` | Configurações para o ambiente final de produção. |

**Comandos de Execução e Build:**

```bash
cd frontend

# Executar em modo desenvolvimento (padrão)
npm run dev

# Executar contra o backend de validação
npm run dev:validation

# Build para produção final
npm run build

# Build para o ambiente de validação
npm run build:validation
```


