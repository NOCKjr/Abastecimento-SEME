import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginService } from "../../api/login";
import { usuarioApi } from "../../api/usuarioApi";
import { isAuthenticated } from "../../auth/auth";
import { getApiErrorMessage } from "../../api/errorMessage";

export function RegisterPage() {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const cpfDigits = cpf.replace(/\D/g, "");
      if (cpfDigits.length !== 11) {
        throw new Error("CPF deve conter 11 dígitos.");
      }

      await usuarioApi.registrar({
        cpf: cpfDigits,
        password,
        first_name: firstName || undefined,
        last_name: lastName || undefined,
        email: email || undefined,
      });

      await loginService(cpfDigits, password);
      navigate("/home", { replace: true });
    } catch (err: unknown) {
      setErrorMsg(getApiErrorMessage(err, "Falha ao realizar cadastro."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Criar conta</h2>

        {errorMsg && <p style={styles.error}>{errorMsg}</p>}

        <div style={styles.inputGroup}>
          <label htmlFor="cpf">CPF</label>
          <input
            id="cpf"
            type="text"
            placeholder="00000000000"
            value={cpf}
            onChange={(e) => setCpf(e.target.value.replace(/\D/g, "").slice(0, 11))}
            required
            maxLength={11}
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="firstName">Primeiro nome</label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="lastName">Sobrenome</label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={loading ? styles.buttonDisabled : styles.button}
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>

        <p style={styles.smallText}>
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  form: {
    padding: "2rem",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "420px",
  },
  inputGroup: { marginBottom: "1rem", display: "flex", flexDirection: "column" },
  error: { color: "red", fontSize: "0.85rem", marginBottom: "1rem" },
  button: {
    padding: "0.8rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
  },
  buttonDisabled: {
    padding: "0.8rem",
    backgroundColor: "#ccc",
    border: "none",
    borderRadius: "4px",
    cursor: "not-allowed",
    width: "100%",
  },
  smallText: { marginTop: "1rem", fontSize: "0.9rem", textAlign: "center" },
};
