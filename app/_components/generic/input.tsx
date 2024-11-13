'use client';

import { P } from '@components';
import { ChangeEvent, useEffect, useState } from 'react';

interface InputProps {
  type?: string;
  value?: string | number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
  label?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  className = '',
  placeholder = '',
  label,
}) => {
  const [inputValue, setInputValue] = useState<string | number>(value || '');

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) {
      if (typeof onChange === 'function' && e && e.target) {
        // If `onChange` expects an event
        (onChange as (event: ChangeEvent<HTMLInputElement>) => void)(e);
      } else {
        // If `onChange` expects a value
        (onChange as (value: string | number) => void)(newValue);
      }
    }
  };

  return (
    <div className={`relative inline-block w-full ${className}`}>
      {label && <P className='text-qt_primary mb-2'>{label}</P>}
      <input
        type={type}
        value={inputValue}
        placeholder={placeholder}
        onChange={handleChange}
        className={`w-full p-2 rounded-xl border py-1.5 pl-4 pr-8 focus:outline-none `}
      />
    </div>
  );
};

export default Input;
