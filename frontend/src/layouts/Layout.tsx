import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/">Abastecimentos</Link> |{" "}
        <Link to="/cadastros/secretarias">Secretarias</Link> |{" "}
        <Link to="/cadastros/rotas">Rotas</Link> |{" "}
        <Link to="/cadastros/instituicoes">Instituições</Link> |{" "}
      </nav>

      <hr />

      {/* Aqui as páginas serão renderizadas */}
      <Outlet />
    </div>
  );
}