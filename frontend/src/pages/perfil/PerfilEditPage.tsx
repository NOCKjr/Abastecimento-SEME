import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usuarioApi } from "../../api/usuarioApi";
import { getApiErrorMessage } from "../../api/errorMessage";
import type { Usuario } from "../../types/models";
import "../../assets/css/FormPage.css";

export default function PerfilEditPage() {
  const navigate = useNavigate();

  const [me, setMe] = useState<Usuario | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    usuarioApi
      .me()
      .then((res) => {
        setMe(res.data);
        setFirstName(res.data.first_name || "");
        setLastName(res.data.last_name || "");
        setEmail(res.data.email || "");
      })
      .catch((err) => setErrorMsg(getApiErrorMessage(err, "Falha ao carregar perfil.")));
  }, []);

  const nomeCompleto = useMemo(() => {
    const full = `${firstName} ${lastName}`.trim();
    return full || me?.cpf || "";
  }, [firstName, lastName, me]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (password || password2) {
      if (password !== password2) {
        setErrorMsg("As senhas n\u00e3o conferem.");
        return;
      }
    }

    setLoading(true);
    try {
      await usuarioApi.atualizarMe({
        first_name: firstName || undefined,
        last_name: lastName || undefined,
        email: email || undefined,
        ...(password ? { password } : {}),
      });

      navigate("/perfil", { replace: true });
    } catch (err: unknown) {
      setErrorMsg(getApiErrorMessage(err, "Falha ao atualizar perfil."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-page">
      <div className="form-header usuario">
        <h2>Editar perfil</h2>
      </div>

      {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

      <div className="form-container">
        {!me ? (
          <p>Carregando...</p>
        ) : (
          <form onSubmit={handleSubmit} className={loading ? "loading" : ""}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">CPF</label>
                <input className="form-input" readOnly value={me.cpf} />
              </div>

              <div className="form-group">
                <label className="form-label">Nome completo</label>
                <input className="form-input" readOnly value={nomeCompleto} />
              </div>

              <div className="form-group">
                <label className="form-label">Primeiro nome</label>
                <input
                  className="form-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sobrenome</label>
                <input
                  className="form-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Nova senha (opcional)</label>
                <input
                  className="form-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirmar nova senha</label>
                <input
                  className="form-input"
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                />
              </div>
            </div>

            <div className="form-actions">
              <Link className="btn btn-secondary" to="/perfil">
                Cancelar
              </Link>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner" /> Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

