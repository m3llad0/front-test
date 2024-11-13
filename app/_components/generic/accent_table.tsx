import React from 'react';

interface ColumnConfig {
  header: React.ReactNode;
  key: string;
  render?: (row: any) => React.ReactNode;
  width?: string;
}

interface OpTableProps {
  header?: React.ReactNode;
  columns: ColumnConfig[];
  rows: any[];  // Each row contains header and column data
  pin?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export default function AccentTable({ header, columns, rows, pin, footer, className }: OpTableProps) {
  return (
    <div className={`flex flex-col bg-white rounded-lg border border-qt_mid py-4 px-6 ${className}`}>
      {header && (
        <>
          <div className='flex flex-row'>{header}</div>
          <div className="w-full border-b border-qt_mid mb-4"></div>
        </>
      )}
      <div className="flex-1 overflow-x-auto">
        <table className="min-w-full h-full table-fixed">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} style={{ width: column.width }} className="px-6 py-3 text-xs text-qt_primary">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className={`px-6 py-2 whitespace-nowrap text-sm text-center text-qt_dark`}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
            {pin && (
              <tr>
                <td className="px-6 py-2 text-sm text-center text-qt_dark">
                  {pin}
                </td>
                {columns.slice(1).map((_, index) => (
                  <td key={index} className="px-6 py-2"></td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {footer && (
        <>
          <div className="w-full border-b border-qt_mid mt-4"></div>
          <div className="mt-4">
            {footer}
          </div>
        </>
      )}
    </div>
  );
}