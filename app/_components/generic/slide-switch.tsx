'use client'

import { useState } from "react"

interface SlideSwitchProps {
  defaultState?: boolean;
  onChange?: (value: boolean) => void;
  onIcon?: React.ReactNode;
  offIcon?: React.ReactNode;
  className?: string;
}

export default function SlideSwitch({defaultState=false, onChange, onIcon, offIcon, className}: SlideSwitchProps) {
  const [isOn, setIsOn] = useState(defaultState);

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    if (onChange) {
      onChange(newState)
    }
  }
  return (
    <div
      onClick={handleToggle}
      className={`flex items-center w-12 h-7 p-1 cursor-pointer rounded-full transition-colors duration-300 ${
        isOn ? 'bg-qt_dark' : 'bg-qt_blue'} ${className}`}
        >
          <div
            className={`flex items-center justify-center w-5 h-5 rounded-full bg-white transform transition-transform duration-300 ${
              isOn ? 'translate-x-0' : 'translate-x-5'
            }`}
          >
            {isOn ? (
              onIcon
            ) : (
              offIcon
            )}
          </div>
        </div>
  )
}