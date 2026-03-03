import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/abastecimentos">Abastecimentos</Link>
      </nav>

      <hr />

      {/* Aqui as páginas serão renderizadas */}
      <Outlet />
    </div>
  );
}