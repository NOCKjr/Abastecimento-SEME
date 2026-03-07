// Tabela genérica para listar dados

interface Props<T> {
  data: T[]
  onEdit: (item: T) => void
  onDelete: (item: T) => void
}

export default function DataTable<T extends { id?: number }>(
  { data, onEdit, onDelete }: Props<T>
) {

  if (!data.length) return <p>Nenhum registro</p>

  const columns = Object.keys(data[0])
  console.log("data", data);
  return (

    <table>

      <thead>
        <tr>
          {columns.map(col =>
            <th key={col}>{col}</th>
          )}
          <th>Ações</th>
        </tr>
      </thead>

      <tbody>

        {data.map(item => (

          <tr key={item.id}>

            {columns.map(col =>
              <td key={col}>
                {(item as any)[col]}
              </td>
            )}

            <td>

              <button
                onClick={() => onEdit(item)}
              >
                Editar
              </button>

              <button
                onClick={() => onDelete(item)}
              >
                Excluir
              </button>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  )
}