'use client';

import { P } from '@components';
import { ChangeEvent, useEffect, useState, useRef } from 'react';
import { CirclePicker } from 'react-color';

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
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(e);
    }
  };

  const handleColorChange = (color: any) => {
    const newColor = color.hex;
    setInputValue(newColor);
    setIsColorPickerVisible(false); // Close the picker after selection
    if (onChange) {
      onChange({
        target: { value: newColor }
      } as unknown as ChangeEvent<HTMLInputElement>); // Fake the input change event
    }
  };

  const toggleColorPicker = () => {
    setIsColorPickerVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsColorPickerVisible(false);
      }
    };
    if (isColorPickerVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isColorPickerVisible]);

  return (
    <div className={`relative inline-block w-full ${className}`}>
      {label && <P className="text-qt_primary mb-2">{label}</P>}

      {type === 'color' ? (
        <div className="flex items-center space-x-4 relative">
          {/* Hex Value Input */}
          <input
            type="text"
            value={inputValue}
            placeholder={placeholder}
            onChange={handleChange}
            className={`w-full p-2 rounded-xl border py-1.5 pl-4 pr-8 focus:outline-none`}
          />

          {/* Display Color Swatch */}
          <div
            onClick={toggleColorPicker}
            style={{ backgroundColor: inputValue as string }}
            className="w-6 h-6 rounded-full border border-gray-300 cursor-pointer"
            title={inputValue as string}
          />

          {/* Color Picker Popup */}
          {isColorPickerVisible && (
            <div
              ref={pickerRef}
              className="absolute z-50 mt-2"
            >
              <CirclePicker color={inputValue as string} onChange={handleColorChange} />
            </div>
          )}
        </div>
      ) : (
        <input
          type={type}
          value={inputValue}
          placeholder={placeholder}
          onChange={handleChange}
          className={`w-full p-2 rounded-xl border py-1.5 pl-4 pr-8 focus:outline-none`}
        />
      )}
    </div>
  );
};

export default Input;