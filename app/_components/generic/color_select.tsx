'use client'

import { useState, useEffect, useRef } from "react"
import { CirclePicker } from 'react-color';

export default function ColorSelect() {
  const [color, setColor] = useState('#2451E3') // Or any other default color
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleColorChange = (color) => { 
    setColor(color.hex);
    setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setPickerVisible(false);
        setIsFadingOut(false);
      }, 500)
    }, 100)
  }

  const handleClickOutside = (e) => {
    if (pickerRef.current && !pickerRef.current.contains(e.target)) {
      setIsFadingOut(true);
      setTimeout(() => {
        setPickerVisible(false);
        setIsFadingOut(false);
      }, 500);
    }
  }

  useEffect(() => {
    if (isPickerVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPickerVisible]);

  return (
    <div className='flex flex-col items-center'>
      <div
        onClick={() => setPickerVisible(!isPickerVisible)}
        style={{ backgroundColor: color }}
        className="w-6 h-6 rounded-full cursor-pointer transition-all "
        title="Click to change color"
      />
      {/* Popup Input */}
      {isPickerVisible && (
        <div
          ref={pickerRef}
          className={`absolute mt-4 p-4 z-50 transition-opacity duration-500 ${ isFadingOut ? 'opacity-0' : 'opacity-100' }`}
        >
          <CirclePicker
            color={color}
            onChange={handleColorChange}
          />
        </div>
      )}
    </div>
  )
}