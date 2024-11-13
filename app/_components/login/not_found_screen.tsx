'use client';

import React from 'react';
import { Button, H1, P } from '@components';
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';
import app from '@service/firebaseConfig';

export default function NotFound() {
  const router = useRouter();
  const auth = getAuth(app);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      // Log the user out and redirect to the login page if there's no previous page
      signOut(auth).then(() => {
        router.push('/login');
      }).catch((error) => {
        console.error('Error logging out:', error);
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white text-center px-4">
      <H1 className="mb-4 text-6xl mb-10">404</H1>
      <H1>Página no encontrada</H1>
      <P className="mb-8">
        Parece que la página que estás buscando no existe o no tienes permiso para acceder.
      </P>
      <Button
        onClick={handleGoBack}
        className="bg-blue-600 text-white py-2 px-6 rounded-md"
      >
        Regresar
      </Button>
    </div>
  );
}