'use client';

import { P } from '@components';
import { useEffect, useState } from 'react';

interface SelectProps {
  options: { value: number; label: string; }[];
  value?: number;
  onChange?: ((value: number) => void);
  className?: string;
  placeholder?: string;
  label?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  className = '',
  placeholder = 'Elige una opción',
  label,
}) => {
  const [selectedValue, setSelectedValue] = useState<string | number>(value ?? '');

  useEffect(() => {
    if (value !== undefined && value !== null && value !== -1) {
      setSelectedValue(value);
    } else {
      setSelectedValue(-1); // Set empty when new operador
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = Number(e.target.value);
    setSelectedValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={`relative inline-block w-full ${className}`}>
      {label && <P className="text-qt_primary mb-2">{label}</P>}
      <select
        value={selectedValue}
        onChange={handleChange}
        className={`w-full p-2 rounded-xl border py-1.5 pl-4 pr-8 focus:outline-none cursor-pointer ${
          selectedValue === -1 ? 'text-[#A7AAB4]' : 'text-black'
        } ${className}`}>
        {selectedValue === -1 && (
          <option value={-1} disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;