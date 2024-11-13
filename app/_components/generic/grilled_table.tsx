interface ColumnConfig {
  header: React.ReactNode;
  key: string;
  render?: (row: any) => React.ReactNode;
  divided?: boolean;  // Optional property for adding dividers
}

interface GrilledTableProps {
  title?: React.ReactNode;
  header?: React.ReactNode;
  columns: ColumnConfig[];
  rows: any[];
  footer?: React.ReactNode;
  className?: string;
}

export default function GrilledTable({ title, header, columns, rows, footer, className }: GrilledTableProps) {
  return (
    <>
      {title && title}
      <div className={`flex flex-col bg-white rounded-xl border border-qt_mid ${className}`}>
        {header && (
          <>
            <div className="flex flex-row px-6 py-4">{header}</div>
            <div className="w-full border-b border-qt_mid"></div>
          </>
        )}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={column.key}
                      className={`px-6 py-3 text-sm text-qt_primary text-center border-b border-qt_mid ${
                        column.divided ? 'border-l border-qt_mid' : ''
                      }`}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                   <tr key={row.id ?? `row-${rowIndex}`} className={`${rowIndex < rows.length - 1 ? 'border-b border-qt_mid' : ''}`}>
                    {columns.map((column, colIndex) => (
                      <td
                      key={`${rowIndex}-${colIndex}`} // Ensure a unique key for each cell
                        className={`px-6 py-3 whitespace-nowrap text-sm text-center text-qt_primary ${
                          column.divided ? 'border-l border-qt_mid' : ''
                        }`}
                      >
                        {column.render ? column.render(row) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {footer && (
          <div className="px-6 py-4 border-t border-qt_mid">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}
