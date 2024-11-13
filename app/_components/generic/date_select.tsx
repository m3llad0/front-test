'use client'

import { useState, useRef, FC } from 'react';
import { CalendarIcon } from '@icons'; // Assumes you have a calendar icon
import DatePicker from "react-datepicker"; // Optional: For pop-up calendar
import "react-datepicker/dist/react-datepicker.css";
import { P } from '@components';

interface DateSelectProps {
  label?: string;
  value?: Date;
  onChange: (date: Date) => void;
  className?: string;
}

const DateSelect: FC<DateSelectProps> = ({
  label,
  value,
  onChange,
  className = ''
}) => {
  const [day, setDay] = useState(value ? new Date(value).getDate().toString().padStart(2, '0') : '');
  const [month, setMonth] = useState(value ? (new Date(value).getMonth() + 1).toString().padStart(2, '0') : '');
  const [year, setYear] = useState(value ? new Date(value).getFullYear().toString() : '');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDay = e.target.value.slice(0, 2);
    setDay(newDay);
    if (newDay.length === 2) monthRef.current?.focus();
    updateDate(newDay, month, year);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMonth = e.target.value.slice(0, 2);
    setMonth(newMonth);
    if (newMonth.length === 2) yearRef.current?.focus();
    else if (newMonth.length === 0) dayRef.current?.focus();
    updateDate(day, newMonth, year);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = e.target.value.slice(0, 4);
    setYear(newYear);
    if (newYear.length === 0) monthRef.current?.focus();
    updateDate(day, month, newYear);
  };

  const updateDate = (day: string, month: string, year: string) => {
    if (day && month && year) {
      const date = new Date(`${year}-${month}-${day}`);
      if (!isNaN(date.getTime())) onChange(date);
    }
  };

  const toggleCalendar = () => setIsCalendarOpen((prev) => !prev);

  return (
    <div className={`relative ${className}`}>
      {label && <P className="text-qt_primary mb-2">{label}</P>}
      <div className="flex items-center space-x-2 w-full">
        {/* Input container with flex-grow to take available space */}
        <div className="flex items-center border rounded-xl p-2 flex-grow">
          <input
            type="text"
            ref={dayRef}
            placeholder="DD"
            value={day}
            onChange={handleDayChange}
            className="w-10 text-center focus:outline-none"
          />
          <span>/</span>
          <input
            type="text"
            ref={monthRef}
            placeholder="MM"
            value={month}
            onChange={handleMonthChange}
            className="w-10 text-center focus:outline-none"
          />
          <span>/</span>
          <input
            type="text"
            ref={yearRef}
            placeholder="AAAA"
            value={year}
            onChange={handleYearChange}
            className="w-14 text-center focus:outline-none"
          />
        </div>
        
        {/* Calendar icon with no flex-grow, ensuring it doesn't expand */}
        <CalendarIcon 
          onClick={toggleCalendar} 
          className="ml-2 cursor-pointer text-qt_dark flex-shrink-0" 
          style={{ fontSize: '1.5rem' }}
        />
      </div>

      {/* Optional: Date picker pop-up for alternative selection */}
      {isCalendarOpen && (
        <div className="absolute z-50 mt-2">
          <DatePicker
            selected={value}
            onChange={(date: Date | null) => {
              if (date) {
                setDay(date.getDate().toString().padStart(2, '0'));
                setMonth((date.getMonth() + 1).toString().padStart(2, '0'));
                setYear(date.getFullYear().toString());
                onChange(date);
              }
              setIsCalendarOpen(false);
            }}
            inline
          />
        </div>
      )}
    </div>
  );
};

export default DateSelect;
