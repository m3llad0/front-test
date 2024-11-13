'use client';

import React from 'react';
import { Button, H1, P } from '@components'; // Assuming you have Button, H1, and P components
import { useRouter } from 'next/navigation';

export default function SessionEndedScreen() {
  const router = useRouter();

  const handleLoginAgain = () => {
    router.push('/login');
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white text-center px-4">
      <H1 className="mb-4">Tu sesión ha terminado</H1>
      <P className="mb-8">
        Parece que tu sesión ha finalizado. Por favor, inicia sesión de nuevo para continuar.
      </P>
      <Button onClick={handleLoginAgain} className="bg-blue-600 text-white py-2 px-6 rounded-md">
        Iniciar sesión nuevamente
      </Button>
    </div>
  );
}
