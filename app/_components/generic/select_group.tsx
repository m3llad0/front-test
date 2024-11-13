import React from 'react';
import { H1 } from '@components'; // Adjust the import path as necessary

interface ColumnConfig {
  label?: string | React.ReactNode; // Can be a string or any React node
  render: (row: any) => React.ReactNode; // Render function for custom content
}

interface SelectGroupProps {
  columns: ColumnConfig[]; // Array of column configurations
  footer?: React.ReactNode; // Optional footer for the component
  className?: string; // Optional additional class names for styling
}

export default function SelectGroup({ columns = [], footer, className }: SelectGroupProps) {
  return (
    <div className={` flex flex-col bg-white rounded-xl border border-qt_mid w-full py-4 px-6 ${className}`}>
    <div className={``}>
      <div className="flex w-full space-x-4 overflow-x-auto"> {/* Use flex and w-full to stretch container */}
        {columns.map((column, index) => (
          <div key={index} className="flex-1 flex flex-col"> {/* Use flex-1 to ensure even distribution */}
            {column.label && (
              <div className="text-xs mb-2 font-medium">{column.label}</div>
            )}
            <div>
              {column.render({})}
            </div>
          </div>
        ))}
      </div>
    </div>
      {footer && <div className="overflow-x-auto w-full mt-4">{footer}</div>}
    </div>
  );
}
