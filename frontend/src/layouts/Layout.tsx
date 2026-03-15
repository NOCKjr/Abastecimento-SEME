import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "../assets/css/Layout.css";
import { usuarioApi } from "../api/usuarioApi";
import type { Usuario } from "../types/models";
import { logout } from "../auth/auth";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [me, setMe] = useState<Usuario | null>(null);

  const isActive = (path: string) => location.pathname === path;
  const isActiveGroup = (startPath: string) =>
    location.pathname.startsWith(startPath);

  useEffect(() => {
    usuarioApi
      .me()
      .then((res) => setMe(res.data))
      .catch(() => setMe(null));
  }, []);

  return (
    <div className="layout-container">
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/home" className="brand-logo">
            SEME
          </Link>

          <ul className="nav-menu">
            <li>
              <Link
                to="/home"
                className={`nav-link ${isActive("/home") ? "active" : ""}`}
              >
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/abastecimento/guias"
                className={`nav-link ${
                  isActiveGroup("/abastecimento") ? "active" : ""
                }`}
              >
                Abastecimentos
              </Link>
            </li>

            <li className="nav-item">
              <button className="nav-dropdown-btn">Cadastros</button>
              <div className="nav-dropdown">
                <Link to="/cadastros/secretarias" className="nav-dropdown-link">
                  Secretarias
                </Link>
                <Link to="/cadastros/rotas" className="nav-dropdown-link">
                  Rotas
                </Link>
                <Link to="/cadastros/instituicoes" className="nav-dropdown-link">
                  Instituições
                </Link>
              </div>
            </li>

            <li className="nav-item">
              <button className="nav-dropdown-btn">Frota</button>
              <div className="nav-dropdown">
                <Link to="/frota/condutores" className="nav-dropdown-link">
                  Condutores
                </Link>
                <Link to="/frota/veiculos" className="nav-dropdown-link">
                  Veículos
                </Link>
                <Link to="/frota/lotacoes" className="nav-dropdown-link">
                  Lotação
                </Link>
              </div>
            </li>

            {me?.is_staff && (
              <>
                <li>
                  <Link
                    to="/usuarios"
                    className={`nav-link ${
                      isActiveGroup("/usuarios") ? "active" : ""
                    }`}
                  >
                    Usuários
                  </Link>
                </li>
                <li>
                  <Link
                    to="/usuarios/permissoes"
                    className={`nav-link ${
                      isActive("/usuarios/permissoes") ? "active" : ""
                    }`}
                  >
                    Permissões
                  </Link>
                </li>
              </>
            )}

            <li className="nav-logout">
              <button
                className="nav-link"
                type="button"
                onClick={() => {
                  logout();
                  navigate("/login", { replace: true });
                }}
              >
                Sair
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>
          &copy; 2026 Sistema de Abastecimento SEME. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
