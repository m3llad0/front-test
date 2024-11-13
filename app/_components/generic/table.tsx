import React from "react";

interface TableConfig {
    header: React.ReactNode;
    key: string;
    isButton?: boolean;
}

interface TableProps {
    columns: TableConfig[];
    rows: any[];
    renderActionButton?: (row: any) => React.ReactNode;
    className?: string;
}

export default function Table({ columns, rows, renderActionButton, className }: TableProps) {
    return (
        <div className={`overflow-hidden rounded-xl border border-qt_mid ${className}`}>
            <table className="min-w-full bg-white p-6 table-auto">
                <thead className="w-full">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 text-lg text-qt_primary text-center"
                            >
                                {column.header}
                            </th>
                        ))}
                        {renderActionButton && (
                            <th className="px-6 py-3 text-lg text-qt_primary">
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((column, colIndex) => (
                                <td key={colIndex} className="px-6 py-3 text-center text-sm">
                                    {row[column.key]}
                                </td>
                            ))}
                            {renderActionButton && (
                                <td className="px-6 py-3 text-center">
                                    {renderActionButton(row)}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
