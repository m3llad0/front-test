'use client';

import { useState } from "react";
import { ProfileChip } from "@components";

interface HeaderProps {
  role: string;
  name: string;
  SearchIcon?: React.ReactElement;
  BellIcon?: React.ReactElement;
  MoonIcon?: React.ReactElement;
  SunIcon?: React.ReactElement;
}

export default function Header({
  role,
  name,
  SearchIcon = <span>🔍</span>,  // Default emoji fallback
  BellIcon = <span>🔔</span>,     // Default emoji fallback
  MoonIcon = <span>🌙</span>,     // Default emoji fallback
  SunIcon = <span>☀️</span>      // Default emoji fallback
}: HeaderProps) {
  const [darkMode, setDarkMode] = useState(false);

  const handleToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className='sticky top-0 z-50 flex flex-row justify-between items-center bg-white border-b p-4'>
      {/* Searchbar */}
      <div className='flex items-center border rounded-[15px] py-[4px] pl-3 pr-20'>
        {SearchIcon}
        <input
          type='search'
          id='search'
          placeholder='Busca dentro de la app'
          className='focus:outline-none'
        />
      </div>

      {/* Right side with toggle, bell, and profile */}
      <div className='flex items-center space-x-6'>
        {/* Dark Mode Toggle (Optional) */}
        {/* CCD Section: */}
        {/* <div
          onClick={handleToggle}
          className={`flex items-center w-12 h-7 p-1 cursor-pointer rounded-full transition-colors duration-300 ${
            darkMode ? 'bg-qt_dark' : 'bg-yellow-400'
          }`}
        >
          <div
            className={`flex items-center justify-center w-5 h-5 rounded-full bg-white transform transition-transform duration-300 ${
              darkMode ? 'translate-x-0' : 'translate-x-5'
            }`}
          >
            {darkMode ? (
              MoonIcon
            ) : (
              SunIcon
            )}
          </div>
        </div> */}
        <div>
          {BellIcon}
        </div>
        <div>
          <ProfileChip name={name} detail={role} />
        </div>
      </div>
    </div>
  );
}