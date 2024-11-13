'use client';

import React, { useEffect, useState } from 'react';
import { GrilledTable, IconButton, ProfileView } from '@components';
import { EditIcon } from '@icons';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '@service/firebaseConfig';
import { fetchSucursalData, Sucursal } from '@service/sucursal';
import { fetchOperadoresData, Operador } from '@service/operador';

export default function ProfilePage() {
  const [sucursal, setSucursal] = useState<Sucursal | null>(null); // Sucursal data state
  const [operadores, setOperadores] = useState<Operador[]>([]); // Operadores data state
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Fetch sucursal data based on current user's UID
          const sucursalData = await fetchSucursalData(currentUser.uid);
          setSucursal(sucursalData);

          // Fetch operadores linked to this sucursal
          const operadoresData = await fetchOperadoresData(); // Pass sucursal id to filter operadores
          setOperadores(operadoresData);
        } catch (error) {
          console.error('Error fetching sucursal or operadores data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push('/login'); // Redirect to login if no user
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, [auth, router]);

  if (loading) {
    return <div>Loading...</div>;  // You can show a loading spinner here
  }

  return (
    <div className="flex flex-col md:flex-row bg-qt_light min-h-screen justify-center items-center md:space-x-8 space-y-8 md:space-y-0 p-4">
      {sucursal && (
        <ProfileView
          name={sucursal.nombre}
          email={sucursal.email!}
          permisos="Sucursal"
          direccion={sucursal.direccion || '---'}
        />
      )}

      <GrilledTable
        columns={[
          { header: 'Operador', key: 'nombre' },
          { header: 'Clave', key: 'clave' },
          { header: 'Último movimiento', key: 'movimiento' },
          { header: '', key: 'edit', render: (row) => <IconButton icon={<EditIcon />} /> },
        ]}
        rows={operadores.map((operador) => ({
          nombre: operador.nombre,
          clave: operador.clave || '---',
          // movimiento: operador.ultimoMovimiento || 'No Data', // Assuming `ultimoMovimiento` exists in your data
        }))}
      />
    </div>
  );
}