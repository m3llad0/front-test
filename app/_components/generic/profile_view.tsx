'use client';

import React from 'react';
import Image from 'next/image';
import Button from './button';

interface ProfileViewProps {
  name: string;
  email: string;
  permisos: string;
  direccion?: string;
  image?: string; // Optional profile image URL
}

export default function ProfileView({ name, email, permisos, direccion, image }: ProfileViewProps) {
  const initials = name.charAt(0).toUpperCase(); // Get the first letter of the name

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl border border border-qt_mid w-full max-w-md mx-auto">
      {/* Profile Image or Initial */}
      <div className="flex-shrink-0 w-24 h-24 rounded-full bg-qt_highlight flex items-center justify-center text-qt_primary text-4xl font-bold mb-4">
        {image ? (
          <Image
            src={image}
            alt={name}
            width={96}
            height={96}
            className="object-cover rounded-full"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {/* Name and Email */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-qt_primary mb-1">{name}</h1>
        <p className="text-qt_dark mb-4">{email}</p>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gray-300 mb-4"></div>

      {/* Permisos and Dirección */}
      <div className="w-full text-left">
        <label className="text-qt_dark font-semibold">Permisos</label>
        <p className="text-qt_primary mb-4">{permisos}</p>
        {direccion && (
          <>
            <label className="text-qt_dark font-semibold">Dirección</label>
            <p className="text-qt_primary mb-4">{direccion}</p>
          </>
        )}
        <div className='flex justify-between'>
          <Button>
            Cambiar Contraseña
          </Button>
          <Button>
            Modificar datos
          </Button>
        </div>
      </div>
    </div>
  );
}
