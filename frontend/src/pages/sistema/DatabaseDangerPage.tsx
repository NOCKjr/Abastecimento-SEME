import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/FormPage.css";
import { coreApi } from "../../api/coreApi";
import { getApiErrorMessage } from "../../api/errorMessage";
import { logout } from "../../auth/auth";

type DbStats = {
  database_engine?: string;
  is_sqlite?: boolean;
  counts?: Record<string, number>;
};

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function DatabaseDangerPage() {
  const navigate = useNavigate();
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState<
    null | "seed" | "reset" | "flush" | "backup_json" | "backup_sqlite" | "stats"
  >(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [stats, setStats] = useState<DbStats | null>(null);

  const canDestructive = confirmText.trim().toUpperCase() === "APAGAR TUDO";
  const isSqlite = Boolean(stats?.is_sqlite);

  const countsText = useMemo(() => {
    const c = stats?.counts;
    if (!c) return "";
    return [
      `Secretarias: ${c.secretarias ?? 0}`,
      `Instituições: ${c.instituicoes ?? 0}`,
      `Rotas: ${c.rotas ?? 0}`,
      `Condutores: ${c.condutores ?? 0}`,
      `Veículos: ${c.veiculos ?? 0}`,
      `Lotações: ${c.lotacoes ?? 0}`,
      `Guias: ${c.guias_abastecimento ?? 0}`,
      `Usuários: ${c.usuarios ?? 0}`,
    ].join(" | ");
  }, [stats]);

  async function refreshStats() {
    setLoading("stats");
    try {
      const res = await coreApi.stats();
      setStats(res.data as DbStats);
    } catch {
      setStats(null);
    } finally {
      setLoading(null);
    }
  }

  useEffect(() => {
    refreshStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSeedForce() {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading("seed");
    try {
      const res = await coreApi.seedForce();
      setSuccessMsg(res.data?.detail || "Seed carregado.");
      refreshStats();
    } catch (err: unknown) {
      setErrorMsg(getApiErrorMessage(err, "Falha ao carregar seed."));
    } finally {
      setLoading(null);
    }
  }

  async function handleFlushOnly() {
    setErrorMsg("");
    setSuccessMsg("");
    if (!canDestructive) {
      setErrorMsg('Digite "APAGAR TUDO" para habilitar esta ação.');
      return;
    }

    setLoading("flush");
    try {
      const res = await coreApi.flushOnly();
      setSuccessMsg(res.data?.detail || "Banco apagado.");
      setConfirmText("");
      logout();
      navigate("/login", { replace: true });
    } catch (err: unknown) {
      setErrorMsg(getApiErrorMessage(err, "Falha ao apagar o banco."));
    } finally {
      setLoading(null);
    }
  }

  async function handleResetAndSeed() {
    setErrorMsg("");
    setSuccessMsg("");
    if (!canDestructive) {
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

  async function handleBackupJson() {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading("backup_json");
    try {
      const res = await coreApi.backupDumpdata();
      const ts = new Date().toISOString().replace(/[:.]/g, "-");
      downloadBlob(res.data as Blob, `backup_dumpdata_${ts}.json`);
      setSuccessMsg("Backup (JSON) baixado.");
    } catch (err: unknown) {
      setErrorMsg(getApiErrorMessage(err, "Falha ao gerar backup (JSON)."));
    } finally {
      setLoading(null);
    }
  }

  async function handleBackupSqlite() {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading("backup_sqlite");
    try {
      const res = await coreApi.backupSqlite();
      const ts = new Date().toISOString().replace(/[:.]/g, "-");
      downloadBlob(res.data as Blob, `db_backup_${ts}.sqlite3`);
      setSuccessMsg("Backup (SQLite) baixado.");
    } catch (err: unknown) {
      setErrorMsg(getApiErrorMessage(err, "Falha ao gerar backup do arquivo do banco."));
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
        Estas ações são perigosas e podem apagar dados. Após apagar/resetar, você será desconectado. Disponível apenas para
        superadmin.
      </div>

      {errorMsg && <div className="alert alert-error">{errorMsg}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <div className="form-container">
        <div className="alert alert-info" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", gap: 12, flexWrap: "wrap" }}>
            <div>
              <strong>Status:</strong>&nbsp;{stats?.database_engine || "—"}
              {countsText ? <div style={{ marginTop: 6 }}>{countsText}</div> : null}
            </div>
            <button className="btn btn-secondary btn-small" type="button" disabled={loading !== null} onClick={refreshStats}>
              Atualizar
            </button>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Confirmação (ações destrutivas)</label>
            <input
              className="form-input"
              placeholder='Digite "APAGAR TUDO"'
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
            <div className="form-error" style={{ visibility: canDestructive ? "hidden" : "visible" }}>
              Obrigatório para apagar/resetar o banco.
            </div>
          </div>
        </div>

        <div className="form-actions" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-secondary" type="button" disabled={loading !== null} onClick={handleBackupJson}>
              {loading === "backup_json" ? (
                <>
                  <span className="spinner" /> Gerando...
                </>
              ) : (
                "Backup (JSON)"
              )}
            </button>

            <button
              className="btn btn-secondary"
              type="button"
              disabled={loading !== null || !isSqlite}
              onClick={handleBackupSqlite}
              title={isSqlite ? "Baixar arquivo do banco SQLite" : "Disponível apenas quando o banco é SQLite"}
            >
              {loading === "backup_sqlite" ? (
                <>
                  <span className="spinner" /> Gerando...
                </>
              ) : (
                "Backup (SQLite)"
              )}
            </button>
          </div>

          <button className="btn btn-secondary" type="button" disabled={loading !== null} onClick={handleSeedForce}>
            {loading === "seed" ? (
              <>
                <span className="spinner" /> Carregando...
              </>
            ) : (
              "Carregar dados padrão (force)"
            )}
          </button>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-secondary" type="button" disabled={!canDestructive || loading !== null} onClick={handleFlushOnly}>
              {loading === "flush" ? (
                <>
                  <span className="spinner" /> Apagando...
                </>
              ) : (
                "Apenas apagar (manter superadmin)"
              )}
            </button>

            <button className="btn btn-primary" type="button" disabled={!canDestructive || loading !== null} onClick={handleResetAndSeed}>
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
    </div>
  );
}

