import React from "react"

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactElement;
  className?: string;
}

export default function IconButton({ icon=<span>🔘?</span>, children, className, ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      className={`w-full flex items-center justify-end text-qt_dark ${className}`}
    >
      {React.cloneElement(icon, { className: 'h-6 w-6' })}
    </button>
  )
}