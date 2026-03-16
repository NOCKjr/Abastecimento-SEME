# Abastecimento-SEME

## Profiles (dev / validation / prod)

### Backend (Django)

O backend usa a variável `DJANGO_PROFILE` para definir o perfil:

- `dev`: desenvolvimento local (padrão). `DEBUG=True` por padrão e banco SQLite se `DATABASE_URL` não existir.
- `validation`: ambiente “tipo produção” para validar deploy. `DEBUG=False` e **exige** `DATABASE_URL`.
- `prod`: produção final. `DEBUG=False` e **exige** `DATABASE_URL`.

Arquivos exemplo (copie e ajuste para criar seus `.env.<profile>` locais):

- `backend/.env.dev.example`
- `backend/.env.validation.example`
- `backend/.env.prod.example`

Variáveis principais por perfil:

- `DJANGO_PROFILE` = `dev` | `validation` | `prod`
- `DEBUG` = `True` | `False` (se não definir, o backend escolhe automaticamente pelo profile)
- `SECRET_KEY` (obrigatório em produção/validação)
- `DATABASE_URL` (obrigatório em `prod` e `validation`)
- `ALLOWED_HOSTS` (recomendado em `prod` e `validation`), separado por vírgula
- `CORS_ALLOWED_ORIGINS` (opcional; se não definir, permanece liberado como hoje)
- `CSRF_TRUSTED_ORIGINS` (opcional; recomendado se for usar cookies/CSRF)

Rodando local (Windows PowerShell):

```powershell
cd backend
$env:DJANGO_PROFILE="dev"
python manage.py runserver
```

### Frontend (Vite)

O frontend já usa:

- `frontend/.env.development` (modo padrão do `vite`)
- `frontend/.env.production` (build de produção)

Adicionado:

- `frontend/.env.validation` (para rodar/buildar contra o backend de validação)

Comandos:

```bash
cd frontend
npm run dev               # usa .env.development
npm run dev:validation    # usa .env.validation
npm run build             # usa .env.production
npm run build:validation  # usa .env.validation
```

#### SPA (rotas) e 404 ao acessar URL diretamente

Como o frontend usa `BrowserRouter`, o servidor precisa reescrever rotas (ex.: `/cadastros/rota`) para `index.html`.

Para facilitar deploy em static hosting (incluindo Render), este repositório inclui arquivos que vão para a pasta `dist`
no build do Vite:

- `frontend/public/_redirects` (regra `/* -> /index.html`)
- `frontend/public/static.json` (regra `rewrites` para `index.html`)

[![Figma Design](https://img.shields.io/badge/Figma-Design-blue?logo=figma&logoColor=white)](https://www.figma.com/design/iyTMnJRem5A4SyjrpKxiOO/SEME?node-id=0-1&t=aqXvkX3mVawrXngo-1)

---
