import { Link } from "react-router-dom";

import { useEffect, useState } from "react";

import { listarSecretarias } from "../../../api/client"
import type { Secretaria } from "../../../types/models";


export default function SecretariaPage() {
  const [dados, setDados] = useState<Secretaria[]>([]);

  useEffect(() => {
    listarSecretarias().then(setDados);
  }, []);

  return (
    <div>
      <h1>Lista de Secretarias</h1>
      <ul>
        {dados.map((item) => (
          <li key={item.id}>
            {item.id}: {item.sigla} - {item.nome}
          </li>
        ))}
      </ul>
        
      <Link to="/cadastros/secretarias/novo">Nova Secretaria</Link>
    </div>
  );
}