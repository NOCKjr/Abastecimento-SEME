import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/FormPage.css";
import { coreApi } from "../../api/coreApi";
import { getApiErrorMessage } from "../../api/errorMessage";
import { logout } from "../../auth/auth";

export default function DatabaseDangerPage() {
  const navigate = useNavigate();
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState<null | "seed" | "reset">(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const canReset = confirmText.trim().toUpperCase() === "APAGAR TUDO";

  async function handleSeedForce() {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading("seed");
    try {
      const res = await coreApi.seedForce();
      setSuccessMsg(res.data?.detail || "Seed carregado.");
    } catch (err: unknown) {
      setErrorMsg(getApiErrorMessage(err, "Falha ao carregar seed."));
    } finally {
      setLoading(null);
    }
  }

  async function handleResetAndSeed() {
    setErrorMsg("");
    setSuccessMsg("");
    if (!canReset) {
      setErrorMsg('Digite "APAGAR TUDO" para habilitar esta ação.');
      return;
    }

    setLoading("reset");
    try {
      const res = await coreApi.resetAndSeed();
      setSuccessMsg(res.data?.detail || "Banco resetado e seed carregado.");
      setConfirmText("");
      logout();
      navigate("/login", { replace: true });
    } catch (err: unknown) {
      setErrorMsg(getApiErrorMessage(err, "Falha ao resetar banco e carregar seed."));
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="form-page">
      <div className="form-header">
        <h2>Sistema: Banco de Dados</h2>
      </div>

      <div className="alert alert-warning">
        Estas ações são perigosas e podem apagar dados. Após resetar, você será desconectado. Disponível apenas para
        superadmin.
      </div>

      {errorMsg && <div className="alert alert-error">{errorMsg}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <div className="form-container">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Confirmação</label>
            <input
              className="form-input"
              placeholder='Digite "APAGAR TUDO"'
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
            <div className="form-error" style={{ visibility: canReset ? "hidden" : "visible" }}>
              Obrigatório para resetar o banco.
            </div>
          </div>
        </div>

        <div className="form-actions" style={{ justifyContent: "space-between" }}>
          <button
            className="btn btn-secondary"
            type="button"
            disabled={loading !== null}
            onClick={handleSeedForce}
          >
            {loading === "seed" ? (
              <>
                <span className="spinner" /> Carregando...
              </>
            ) : (
              "Carregar dados padrão (force)"
            )}
          </button>

          <button
            className="btn btn-primary"
            type="button"
            disabled={!canReset || loading !== null}
            onClick={handleResetAndSeed}
          >
            {loading === "reset" ? (
              <>
                <span className="spinner" /> Resetando...
              </>
            ) : (
              "Apagar tudo e carregar padrão"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
