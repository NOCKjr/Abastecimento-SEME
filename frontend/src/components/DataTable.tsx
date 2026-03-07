// Tabela genérica para listar dados

interface Props<T> {
  data: T[]
  onEdit: (item: T) => void
  onDelete: (item: T) => void
  onPdf?: (item: T) => void
}

export default function DataTable<T extends { id?: number }>(
  { data, onEdit, onDelete, onPdf }: Props<T>
) {

  if (!data.length) return <p>Nenhum registro</p>

  const columns = Object.keys(data[0])
  const getCellValue = (item: T, col: string) => {
    const value = (item as Record<string, unknown>)[col]
    return value == null ? "" : String(value)
  }

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
                {getCellValue(item, col)}
              </td>
            )}

            <td>

              {onPdf && (
                <button
                  onClick={() => onPdf(item)}
                >
                  PDF
                </button>
              )}

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