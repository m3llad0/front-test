import api from '@service/axiosInstance'
import axios from 'axios';
import { API_URL } from '@service'

export type Sucursal = {
  id: string;
  nombre: string;
  presupuesto: number;
  direccion: string;
  estado: string;
  telefono: string;
  email?: string; // FIREBASE 
  password?: string; // FIREBASE 
  saldoPesos?: number; // X ?
  saldoDolares?: number; // X ?
}

export async function fetchSucursalesData() {
  try {
    const response = await api.get(`${API_URL}/sucursal`)
    if (response.status === 200) {
      const sucursales = response.data;

      const completeSucursales = await Promise.all(
        sucursales.map(async (sucursal: any) => {
          if (sucursal.id) {
            try {
              const firebaseUser = await getFirebaseSucursalUser(sucursal.id);
              return {
                ...sucursal,
                email: firebaseUser.email || '---',
              };
            } catch (error) {
              console.error(`Error fetching email from sucursal ${sucursal.id}: `, error);
              return sucursal;
            }
          }
          return sucursal;
        })
      );
      return completeSucursales;
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching sucursales data: ', error);
    throw error;
  }
}

export async function fetchSucursalData(uid: string) {
  try {
    const response = await api.get(`${API_URL}/sucursal/${uid}`);

    if (response.status === 200) {
      const sucursal = response.data;

      if (sucursal.id) {
        try {
          // Fetch email from Firebase using UID
          const firebaseUser = await getFirebaseSucursalUser(sucursal.id);
          sucursal.email = firebaseUser?.email || '---'; // Assign fetched email
        } catch (error) {
          console.error(`Error fetching email for sucursal with ID ${sucursal.id}: `, error);
        }
      }

      return sucursal; // Return the updated sucursal data
    } else {
      throw new Error(`Unexpected response: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error fetching Sucursal data for UID ${uid}: `, error);
    throw error;
  }
}


export async function addSucursal(newSucursal: Sucursal) {
  try {
    const response = await api.post(`${API_URL}/sucursal`, {
      id: newSucursal.id,
      nombre: newSucursal.nombre,
      presupuesto: newSucursal.presupuesto,
      direccion: newSucursal.direccion,
      estado: newSucursal.estado,
      telefono: newSucursal.telefono,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating Sucursal: ', error);
    throw error;
  }
}

export async function editSucursal(updatedData: Sucursal) {
  try {
    await deleteSucursal(updatedData.id);
    await addSucursal(updatedData);
  } catch (error) {
    console.error('Error editing sucursal:', error);
    throw error;
  }
}

export async function deleteSucursal(id: string) {
  try {
    await deleteFirebaseSucursalUser(id);

    await api.delete(`${API_URL}/sucursal/${id}`);
    console.log(`Sucursal with ID ${id} deleted succesfully.`);
  } catch (error) {
    console.error(`Error deleting sucursal or Firebase user with ID ${id}:`, error);
    throw error;
  }
}

export async function wipeAllSucursales() {
  if (process.env.NODE_ENV !== 'development') {
    console.error('This function can only be run in a development environment!');
    return;
  }

  try {
    const sucursales = await fetchSucursalesData();
    for (const sucursal of sucursales) {
      try {
        await deleteSucursal(sucursal.id);
      } catch (error) {
        console.error(`Error deleting sucursal with ID ${sucursal.id}:`, error);
      }
    }
    console.log('All sucursales and Firebase sucursal users deleted successfully.');
  } catch (error) {
    console.error('Error wiping sucursales: ', error);
    throw error;
  }
}

export async function createFirebaseSucursalUser(email: string, password: string) {
  try {
    const response = await axios.post('/api/createUser', {
      email,
      password,
      userType: 'sucursal',
    });
    console.log('&&', response.data);
    if (response.status === 200 || response.status === 201) {
      console.log('Firebase sucursal user created and custom claim set');
      return { uid: response.data.uid };
    } else {
      throw new Error(`Unexpected response: ${response.status}`);
    }
  } catch (error) {
    console.error('Error creating Firebase sucursal user:', error);
    throw error;
  }
}

export async function getFirebaseSucursalUser(uid: string) {
  try {
    const response = await axios.post('/api/getUserByUid', { uid });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Unexpected response: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching Firebase sucursal user: ', error);
    throw error;
  }
}

export async function deleteFirebaseSucursalUser(uid: string) {
  try {
    await axios.post(`/api/deleteUserByUid`, { uid });
    console.log(`Firebase user with UID ${uid} deleted succesully.`);
  } catch (error) {
    console.warn(`Warning: Failed to delete Firebase user with UID ${uid}. Searching for entry.`);
    try {
      const firebaseUser = await getFirebaseSucursalUser(uid);
      if (firebaseUser) {
        console.error(`Firebase user with UID ${uid} still exists. Aborting backend deletion.`);
        return;
      }
    } catch (confirmError) {
      console.warn(`Warning: Unable to confirm existence of Firebase user with UID ${uid}.`);
    }
  }
}