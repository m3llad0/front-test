import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export default function Button({ 
  children,
  className = '',
  loading = false,
  ...props 
}: ButtonProps) {
  const defaultStyles = 'bg-qt_blue rounded-lg font-roboto py-2 px-4';
  const defaultTextColor = !className.includes('text-') ? 'text-white' : '';

  return (
    <button
      {...props}
      className={`${defaultStyles} ${defaultTextColor} ${className} ${
        loading ? 'cursor-not allowed opacity-50' : ''
      }`}
      disabled={loading || props.disabled}
    >
      {loading ? (
        <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
      ) : (
        children
      )}
    </button>
  );
}