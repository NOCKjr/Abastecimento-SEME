import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { usuarioApi } from "../../api/usuarioApi";
import { getApiErrorMessage } from "../../api/errorMessage";
import type { Usuario } from "../../types/models";
import "../../assets/css/FormPage.css";

export default function PerfilPage() {
  const [me, setMe] = useState<Usuario | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    usuarioApi
      .me()
      .then((res) => setMe(res.data))
      .catch((err) => setErrorMsg(getApiErrorMessage(err, "Falha ao carregar perfil.")));
  }, []);

  const nomeCompleto = useMemo(() => {
    const first = (me?.first_name || "").trim();
    const last = (me?.last_name || "").trim();
    const full = `${first} ${last}`.trim();
    return full || me?.cpf || "";
  }, [me]);

  return (
    <div className="form-page">
      <div className="form-header usuario">
        <h2>Perfil</h2>
      </div>

      {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

      <div className="form-container">
        {!me ? (
          <p>Carregando...</p>
        ) : (
          <>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Nome completo</label>
                <input className="form-input" readOnly value={nomeCompleto} />
              </div>

              <div className="form-group">
                <label className="form-label">CPF</label>
                <input className="form-input" readOnly value={me.cpf} />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" readOnly value={me.email || ""} />
              </div>

              <div className="form-group">
                <label className="form-label">Tipo</label>
                <input
                  className="form-input"
                  readOnly
                  value={me.is_superuser ? "Superadmin" : me.is_staff ? "Admin" : "Usuário"}
                />
              </div>
            </div>

            <div className="form-actions">
              <Link className="btn btn-primary" to="/perfil/editar">
                Editar
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

