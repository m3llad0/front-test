'use client';

import React, { useEffect, useState } from 'react';
import { GrilledTable, IconButton, ProfileView } from '@components';
import { EditIcon } from '@icons';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '@service/firebaseConfig';
import { fetchSucursalData, Sucursal } from '@service/sucursal';
import { fetchSupervisorData, Supervisor } from '@app/_service/supervisor';
import { fetchOperadoresData, Operador } from '@service/operador';

export default function ProfilePage() {
  const [supervisor, setSupervisor] = useState<Supervisor | null>(null); // Sucursal data state
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Fetch supervisor data based on current user's UID
          const supervisorData = await fetchSupervisorData(currentUser.uid);
          setSupervisor(supervisorData);
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
      {supervisor && (
        <ProfileView
          name={`${supervisor.nombre} ${supervisor.apellido_paterno} ${supervisor.apellido_materno}`}
          email={supervisor.email!}
          permisos="Supervisor"
        />
      )}
    </div>
  );
}