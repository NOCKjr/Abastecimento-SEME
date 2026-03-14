import { Outlet, Link, useLocation } from "react-router-dom";
import "../assets/css/Layout.css";

export default function Layout() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isActiveGroup = (startPath: string) => location.pathname.startsWith(startPath);

  return (
    <div className="layout-container">
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/" className="brand-logo">
            📦 SEME
          </Link>

          <ul className="nav-menu">
            <li>
              <Link
                to="/"
                className={`nav-link ${isActive("/") ? "active" : ""}`}
              >
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/abastecimento/guias"
                className={`nav-link ${isActiveGroup("/abastecimento") ? "active" : ""}`}
              >
                Abastecimentos
              </Link>
            </li>

            <li className="nav-item">
              <button className="nav-dropdown-btn">
                Cadastros
              </button>
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
              <button className="nav-dropdown-btn">
                Frota
              </button>
              <div className="nav-dropdown">
                <Link to="/frota/condutores" className="nav-dropdown-link">
                  Condutores
                </Link>
                <Link to="/frota/veiculos" className="nav-dropdown-link">
                  Veículos
                </Link>
              </div>
            </li>

            <li>
              <Link
                to="/usuarios"
                className={`nav-link ${isActiveGroup("/usuarios") ? "active" : ""}`}
              >
                Usuários
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>&copy; 2026 Sistema de Abastecimento SEME. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}