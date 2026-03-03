import { useEffect, useState } from "react";
import { listarAbastecimentos } from "../api/abastecimento";
import type { Abastecimento } from "../types/abastecimento";

export default function Abastecimentos() {
  const [dados, setDados] = useState<Abastecimento[]>([]);

  useEffect(() => {
    listarAbastecimentos().then(setDados);
  }, []);

  return (
    <div>
      <h1>Lista de Abastecimentos</h1>
      <ul>
        {dados.map((item) => (
          <li key={item.id}>
            {item.veiculo} - {item.litros}L
          </li>
        ))}
      </ul>
    </div>
  );
}