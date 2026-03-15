import { useEffect, useMemo, useState } from "react";
import { usuarioApi } from "../../api/usuarioApi";
import type { Usuario } from "../../types/models";

type EditedMap = Record<number, Partial<Usuario>>;

export default function UsuariosPermissoesPage() {
  const [me, setMe] = useState<Usuario | null>(null);
  const [users, setUsers] = useState<Usuario[]>([]);
  const [edited, setEdited] = useState<EditedMap>({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const canEditAdmins = Boolean(me?.is_superuser);

  const canEditUser = (u: Usuario) => {
    if (u.is_superuser) return false;
    if (u.is_staff && !canEditAdmins) return false;
    return true;
  };

  useEffect(() => {
    setLoading(true);
    setErrorMsg("");

    Promise.all([usuarioApi.me(), usuarioApi.listarPermissoes()])
      .then(([meRes, listRes]) => {
        setMe(meRes.data);
        setUsers(listRes.data);
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : "Falha ao carregar permissões.";
        setErrorMsg(message);
      })
      .finally(() => setLoading(false));
  }, []);

  const sorted = useMemo(() => {
    return [...users].sort((a, b) => (a.id || 0) - (b.id || 0));
  }, [users]);

  const toggle = (id: number, field: keyof Usuario) => {
    setEdited((prev) => {
      const current = prev[id] || {};
      const base = users.find((u) => u.id === id) || {};
      const currentValue = (current[field] ?? base[field]) as boolean | undefined;
      return {
        ...prev,
        [id]: { ...current, [field]: !currentValue },
      };
    });
  };

  const save = async (u: Usuario) => {
    if (!u.id) return;
    const patch = edited[u.id];
    if (!patch || Object.keys(patch).length === 0) return;

    await usuarioApi.atualizarPermissoes(u.id, patch);
    const refreshed = await usuarioApi.listarPermissoes();
    setUsers(refreshed.data);
    setEdited((prev) => {
      const next = { ...prev };
      delete next[u.id as number];
      return next;
    });
  };

  if (loading) return <div style={{ padding: 16 }}>Carregando...</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Permissões de usuários</h2>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>CPF</th>
              <th style={th}>Nome</th>
              <th style={th}>Admin</th>
              <th style={th}>Cadastros (write)</th>
              <th style={th}>Frota (write)</th>
              <th style={th}>Guia (create)</th>
              <th style={th}>Guia (edit)</th>
              <th style={th}>Guia (delete)</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((u) => {
              const disabled = !canEditUser(u);
              const patch = u.id ? edited[u.id] : undefined;
              const dirty = Boolean(patch && Object.keys(patch).length > 0);

              const getBool = (field: keyof Usuario) =>
                Boolean((patch?.[field] ?? u[field]) as boolean | undefined);

              return (
                <tr key={u.id}>
                  <td style={td}>{u.cpf}</td>
                  <td style={td}>{`${u.first_name || ""} ${u.last_name || ""}`.trim()}</td>
                  <td style={tdCenter}>
                    <input
                      type="checkbox"
                      checked={getBool("is_staff")}
                      disabled={disabled || !canEditAdmins}
                      onChange={() => u.id && toggle(u.id, "is_staff")}
                    />
                  </td>
                  <td style={tdCenter}>
                    <input
                      type="checkbox"
                      checked={getBool("can_write_cadastros")}
                      disabled={disabled}
                      onChange={() => u.id && toggle(u.id, "can_write_cadastros")}
                    />
                  </td>
                  <td style={tdCenter}>
                    <input
                      type="checkbox"
                      checked={getBool("can_write_frota")}
                      disabled={disabled}
                      onChange={() => u.id && toggle(u.id, "can_write_frota")}
                    />
                  </td>
                  <td style={tdCenter}>
                    <input
                      type="checkbox"
                      checked={getBool("can_create_guia_abastecimento")}
                      disabled={disabled}
                      onChange={() =>
                        u.id && toggle(u.id, "can_create_guia_abastecimento")
                      }
                    />
                  </td>
                  <td style={tdCenter}>
                    <input
                      type="checkbox"
                      checked={getBool("can_edit_guia_abastecimento")}
                      disabled={disabled}
                      onChange={() =>
                        u.id && toggle(u.id, "can_edit_guia_abastecimento")
                      }
                    />
                  </td>
                  <td style={tdCenter}>
                    <input
                      type="checkbox"
                      checked={getBool("can_delete_guia_abastecimento")}
                      disabled={disabled}
                      onChange={() =>
                        u.id && toggle(u.id, "can_delete_guia_abastecimento")
                      }
                    />
                  </td>
                  <td style={td}>
                    {u.is_superuser ? (
                      <span>superadmin</span>
                    ) : (
                      <button
                        disabled={disabled || !dirty}
                        onClick={() => save(u)}
                      >
                        Salvar
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: 12, fontSize: 12, color: "#555" }}>
        Observação: apenas o superadmin pode promover usuários para admin e alterar
        permissões de usuários admin.
      </p>
    </div>
  );
}

const th: React.CSSProperties = {
  borderBottom: "1px solid #ddd",
  textAlign: "left",
  padding: 8,
  whiteSpace: "nowrap",
};

const td: React.CSSProperties = {
  borderBottom: "1px solid #eee",
  padding: 8,
  whiteSpace: "nowrap",
};

const tdCenter: React.CSSProperties = { ...td, textAlign: "center" };

