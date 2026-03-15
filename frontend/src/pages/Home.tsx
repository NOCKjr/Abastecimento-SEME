import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { secretariaApi } from "../api/secretariaApi";
import { ROUTES } from "../routes/routes";
import type { Secretaria } from "../types/models";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);

  useEffect(() => {
    secretariaApi
      .listar()
      .then((res) => setSecretarias(res.data))
      .catch(() => setSecretarias([]));
  }, [location.key]);

  const siglaToId = useMemo(() => {
    const normalize = (s: string) =>
      s
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .trim();

    const map = new Map<string, number>();
    for (const s of secretarias) {
      if (s.id && s.sigla) map.set(normalize(s.sigla), s.id);
    }
    return map;
  }, [secretarias]);

  const goToGuiaCreate = (sigla: string) => {
    const id =
      siglaToId.get(sigla) ||
      (sigla === "SEMA" ? siglaToId.get("SEMAS") : undefined);
    if (!id) return;
    navigate(`${ROUTES.GUIA_ABASTECIMENTO_CREATE}?secretaria=${id}`);
  };

  return (
    <div>
      <h1>Home</h1>
      <p>Olá, User.</p>

      <div style={{ display: "flex", gap: 12, margin: "16px 0", flexWrap: "wrap" }}>
        <button type="button" onClick={() => goToGuiaCreate("SEME")}>
          SEME
        </button>
        <button type="button" onClick={() => goToGuiaCreate("SAUDE")}>
          SAÚDE
        </button>
        <button type="button" onClick={() => goToGuiaCreate("SEMA")}>
          SEMA
        </button>
      </div>

      <Link to="/cadastros/secretarias">Ver Secretarias</Link>
    </div>
  );
}
