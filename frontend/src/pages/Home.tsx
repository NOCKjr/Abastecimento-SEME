import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { secretariaApi } from "../api/secretariaApi";
import { usuarioApi } from "../api/usuarioApi";
import { ROUTES } from "../routes/routes";
import type { Secretaria, Usuario } from "../types/models";
import "../assets/css/Home.css";

function normalizeSigla(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();
}

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [me, setMe] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([secretariaApi.listar(), usuarioApi.me()])
      .then(([secRes, meRes]) => {
        setSecretarias(secRes.data);
        setMe(meRes.data);
      })
      .catch(() => {
        setSecretarias([]);
        setMe(null);
      })
      .finally(() => setLoading(false));
  }, [location.key]);

  const siglaToId = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of secretarias) {
      if (s.id && s.sigla) map.set(normalizeSigla(s.sigla), s.id);
    }
    return map;
  }, [secretarias]);

  const nome = useMemo(() => {
    const first = (me?.first_name || "").trim();
    const last = (me?.last_name || "").trim();
    return `${first} ${last}`.trim() || me?.cpf || "usuário";
  }, [me]);

  const goToGuiaCreate = (sigla: string) => {
    const id = siglaToId.get(sigla) || (sigla === "SEMA" ? siglaToId.get("SEMAS") : undefined);
    if (!id) return;
    navigate(`${ROUTES.GUIA_ABASTECIMENTO_CREATE}?secretaria=${id}`);
  };

  const cards = [
    {
      sigla: "SEME",
      badgeClass: "seme",
      descricao: "Criar uma guia com a secretaria SEME pré-selecionada.",
      display: "Secretaria Municipal de Educação",
    },
    {
      sigla: "SAUDE",
      badgeClass: "saude",
      descricao: "Criar uma guia com a secretaria SAÚDE pré-selecionada.",
      display: "Secretaria Municipal de Saúde",
    },
    {
      sigla: "SEMA",
      badgeClass: "sema",
      descricao: "Criar uma guia com a secretaria SEMA pré-selecionada.",
      display: "Secretaria Municipal de Assistência Social",
    },
    {
      sigla: "SEMAF",
      badgeClass: "semaf",
      descricao: "Criar uma guia com a secretaria SEMAF pré-selecionada.",
      display: "Secretaria Municipal de Administração e Finanças",
    },
  ] as const;

  return (
    <div className="home">
      <div className="home-hero">
        <h1>Home</h1>
        <p>
          Olá, <strong>{nome}</strong>.
        </p>
        <p style={{ marginTop: 6, fontSize: 13, opacity: 0.9 }}>
          Use os atalhos abaixo para criar guias mais rápido.
        </p>
      </div>

      <div className="home-section">
        <h2 className="home-section-title">Atalhos por secretaria</h2>
        <div className="home-cards">
          {cards.map((c) => (
            <button
              key={c.sigla}
              className="home-card"
              type="button"
              disabled={loading || siglaToId.size === 0}
              onClick={() => goToGuiaCreate(c.sigla)}
              title={loading ? "Carregando..." : "Criar nova guia"}
            >
              <div className="home-card-head">
                <h3 className="home-card-title">{c.display}</h3>
                <span className={`home-card-badge ${c.badgeClass}`}>Nova guia</span>
              </div>
              <p className="home-card-desc">{c.descricao}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="home-section">
        <h2 className="home-section-title">Acesso rápido</h2>
        <div className="home-links">
          <Link className="home-link" to={ROUTES.GUIAS_ABASTECIMENTO}>
            Ver guias
          </Link>
          <Link className="home-link" to={ROUTES.SECRETARIAS}>
            Secretarias
          </Link>
          <Link className="home-link" to={ROUTES.CONDUTORES}>
            Condutores
          </Link>
          <Link className="home-link" to={ROUTES.VEICULOS}>
            Veículos
          </Link>
          {me?.is_staff && (
            <Link className="home-link" to="/usuarios/permissoes">
              Permissões
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

