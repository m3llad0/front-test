'use client'

import { useEffect, useState } from "react";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  defaultCloseButton?: boolean; // Add the prop to include a generic x close button.
  children: React.ReactNode;
  className?: string;
  customContentStyle?: boolean;
}

export default function Modal({ isVisible, onClose, defaultCloseButton=false, children, className, customContentStyle=false }: ModalProps) {
  const [showModal, setShowModal] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShowModal(true);
    } else {
      // Delay hiding the modal to allow the fade-out effect to finish
      const timer = setTimeout(() => setShowModal(false), 300); // Match this duration with the transition time
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!showModal) return null; // Don't render the modal if it's not visible

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 z-50 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className={`p-6 transition-transform transform duration-300 ${
        isVisible ? 'scale-100' : 'scale-95'
      } ${!customContentStyle ? 'bg-white rounded-xl shadow-lg' : ''} ${className}`}>
        {children}
        {defaultCloseButton && (
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">Close</button>
        )}
      </div>
    </div>
  );
}
