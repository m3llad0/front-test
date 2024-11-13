import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export default function Button({ children, className = '', ...props }: ButtonProps) {
  const defaultStyles = 'bg-qt_blue rounded-lg font-roboto py-2 px-4';
  const defaultTextColor = !className.includes('text-') ? 'text-white' : '';

  return (
    <button
      {...props}
      className={`${defaultStyles} ${defaultTextColor} ${className}`}
    >
      {children}
    </button>
  );
}