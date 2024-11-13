import api from '@service/axiosInstance';
import axios from 'axios';
import { API_URL } from "@service";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirebaseSucursalUser } from './sucursal';

export type Supervisor = {
  id: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  telefono?: string;
  email?: string; // FIREBASE
  password?: string; // FIREBASE
}

export async function fetchSupervisoresData() {
  try {
    const response = await api.get(`${API_URL}/supervisor`)
    if (response.status === 200) {
      const supervisores = response.data;

      const completeSupervisores = await Promise.all(
        supervisores.map(async (supervisor: any) => {
          if (supervisor.id) {
            try {
              const firebaseUser = await getFirebaseSupervisorUser(supervisor.id);
              return {
                ...supervisor,
                email: firebaseUser.email || '---',
              };
            } catch (error) {
              console.error(`Error fetching email and phone number from supervisor ${supervisor.id}: `, error);
              return supervisor;
            }
          }
          return supervisor;
        })
      );
      return completeSupervisores;
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching supervisores data: ', error);
    throw error;
  }
}

export async function fetchSupervisorData(uid: string) {
  try {
    const response = await api.get(`${API_URL}/supervisor/${uid}`);

    if (response.status === 200) {
      const supervisor = response.data;

      if (supervisor.id) {
        try {
          const firebaseUser = await getFirebaseSupervisorUser(supervisor.id);
          supervisor.email = firebaseUser?.email || '---';
        } catch (error) {
          console.error(`Error fetching email for supervisor with ID ${supervisor.id}: `, error);
        }
      }

      return supervisor;
    } else {
      throw new Error(`Unexpected response: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error fetching Supervisor data for UID ${uid}: `, error);
    throw error;
  }
}

export async function addSupervisor(newSupervisor: Supervisor) {
  try {
    const response = await api.post(`${API_URL}/supervisor`, {
      id: newSupervisor.id,
      nombre: newSupervisor.nombre,
      apellido_paterno: newSupervisor.apellido_paterno,
      apellido_materno: newSupervisor.apellido_materno,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating supervisor: ', error);
    throw error;
  }
}

export async function deleteSupervisor(id: string) {
  try {
    await deleteFirebaseSupervisorUser(id);

    await api.delete(`${API_URL}/supervisor/${id}`);
    console.log(`Supervisor with ID ${id} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting supervisor with ID ${id}:`, error);
    throw error;
  }
}

export async function wipeAllSupervisores () {
  if (process.env.NODE_ENV !== 'development') {
    console.error('This function can only be run in a development environment!');
    return;
  }

  try {
    const supervisores = await fetchSupervisoresData();
    for (const supervisor of supervisores) {
      try {
        await deleteSupervisor(supervisor.id);
      } catch (error) {
        console.error(`Error deleting supervisor with ID ${supervisor.id}: `, error);
      }
    }
    console.log('All supervisores and Firebase supervisor users deleted successfully');
  } catch (error) {
    console.error('Error wiping supervisores: ', error);
    throw error;
  }
}

export async function createFirebaseSupervisorUser(email: string, password: string) {
  try {
    const response = await axios.post('/api/createUser', {
      email,
      password,
      userType: 'supervisor',
    });
    console.log('&&', response.data);
    if (response.status === 200 || response.status === 201) {
      console.log('Firebase sucursal user created and custom claim set');
      return { uid: response.data.uid };
    } else {
      throw new Error(`Unexpected response: ${response.status}`);
    }
  } catch (error) {
    console.error('Error creating Firebase sucursal uer:', error);
    throw error;
  }
}

export async function getFirebaseSupervisorUser(uid: string) {
  try {
    const response = await axios.post('/api/getUserByUid', {uid});

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Unexpected response: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching Firebase supervisor user: ', error);
    throw error;
  }
}

export async function deleteFirebaseSupervisorUser(uid: string) {
  try {
    await axios.post('/api/deleteUserByUid', { uid });
    console.log(`Firebase supervisor user with UID ${uid} deleted successfully.`);
  } catch (error) {
    console.warn(`Warning: Failed to delete Firebase user with UID ${uid}. Searching for entry.`, error);
    try {
      const firebaseUser = await getFirebaseSupervisorUser(uid);
      if (firebaseUser) {
        console.error(`Firebase user with UID ${uid} still exists. Aborting backend deletion.`)
        return;
      }
    } catch (confirmError) {
      console.warn(`Warning: Unable to confirm existence of Firebase user with UID ${uid}.`)
    }
  }
}