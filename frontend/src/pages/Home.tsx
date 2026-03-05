import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>Olá, User.</p>
      <Link to="/cadastros/secretarias">Ver Secretarias</Link>
    </div>
  );
}