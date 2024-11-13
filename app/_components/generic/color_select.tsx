'use client';

import { useState, useEffect, useRef } from 'react';
import { CirclePicker, ColorResult } from 'react-color';

interface ColorSelectProps {
  disabled?: boolean;
  color?: string;  // Use color instead of initialColor
  className?: string;
  onChange?: (newColor: string) => void;  // Optional prop for updating color in parent component
}

export default function ColorSelect({ disabled = false, color = '#2451E3', className = '', onChange }: ColorSelectProps) {
  const [internalColor, setInternalColor] = useState(color);  // Initialize with passed color
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Sync internal state when external color prop changes
  useEffect(() => {
    setInternalColor(color);
  }, [color]);

  const handleColorChange = (color: ColorResult) => {
    setInternalColor(color.hex);  // Update color locally
    if (onChange) onChange(color.hex);  // Call onChange prop if provided

    // Close the picker with fade-out effect
    setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setPickerVisible(false);
        setIsFadingOut(false);
      }, 500);
    }, 100);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
      setIsFadingOut(true);
      setTimeout(() => {
        setPickerVisible(false);
        setIsFadingOut(false);
      }, 500);
    }
  };

  useEffect(() => {
    if (isPickerVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPickerVisible]);

  return (
    <div className='flex flex-col items-center'>
      <div
        onClick={() => !disabled && setPickerVisible(!isPickerVisible)}  // Toggle picker visibility
        style={{ backgroundColor: internalColor }}
        className={`rounded-full border border-qt_mid transition-all ${disabled ? 'cursor-default' : 'cursor-pointer'} ${className}`}
        title={disabled ? `${internalColor}` : 'Click to change color'}
      />
      {/* Popup Input */} 
      {isPickerVisible && !disabled && (
        <div
          ref={pickerRef}
          className={`absolute mt-4 p-4 z-50 transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
        >
          <CirclePicker color={internalColor} onChange={handleColorChange} />
        </div>
      )}
    </div>
  );
}
