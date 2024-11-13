'use client'

import React, { useState } from 'react';

interface QuantityInputProps {
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number | undefined) => void;
  className?: string;
}

const QuantityInput: React.FC<QuantityInputProps> = ({ 
  initialValue = 0, 
  min = 0, 
  max = 100, 
  step = 1, 
  onChange, 
  className 
}) => {
  const [value, setValue] = useState<number | string>(initialValue);

  const handleDecrement = () => {
    if (typeof value === 'number' && value > min) {
      const newValue = value - step;
      setValue(newValue);
      onChange && onChange(newValue);
    }
  };

  const handleIncrement = () => {
    if (typeof value === 'number' && value < max) {
      const newValue = value + step;
      setValue(newValue);
      onChange && onChange(newValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === '') {
      setValue('');
      onChange && onChange(undefined);
      return;
    }

    const parsedValue = parseFloat(inputValue);

    if (!isNaN(parsedValue) && parsedValue >= min && parsedValue <= max) {
      setValue(parsedValue);
      onChange && onChange(parsedValue);
    }
  };

  const handleBlur = () => {
    if (value === '') {
      setValue(min);
      onChange && onChange(min);
    }
  }

  return (
    <div className={`inline-flex items-center ${className}`} style={{ width: '120px', flexShrink: 0 }}>
      <button
        type="button"
        onClick={handleDecrement}
        className="px-3 py-1 border rounded-l-md"
      >
        -
      </button>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className="px-3 py-1 border-t border-b text-center text-qt_dark focus:outline-none focus:ring-2 focus:ring-qt_blue"
        style={{ 
          minWidth: '40px',
          maxWidth: '80px',
          MozAppearance: 'textfield', 
          WebkitAppearance: 'none', 
          appearance: 'none' }}
      />
      <button
        type="button"
        onClick={handleIncrement}
        className="px-3 py-1 border rounded-r-md"
      >
        +
      </button>
      <style jsx>{`
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}

export default QuantityInput;
