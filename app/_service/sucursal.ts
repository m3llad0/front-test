import axios from 'axios'
import { API_URL } from '@service'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

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
    const response = await axios.get(`${API_URL}/sucursal`)
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
      throw new Error(`nexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching sucursales data: ', error);
    throw error;
  }
}

export async function fetchSucursalData(uid: string) {
  try {
    const response = await axios.get(`${API_URL}/sucursal/${uid}`);

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
    const response = await axios.post(`${API_URL}/sucursal`, {
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

export async function wipeAllSucursales() {
  if (process.env.NODE_ENV !== 'development') {
    console.error('This function can only be run in a development environment!');
    return;
  }

  try {
    // Fetch all sucursales data
    const sucursales = await fetchSucursalesData();

    // Iterate through each sucursal and delete the Firebase user and the sucursal
    for (const sucursal of sucursales) {
      try {
        // Delete the user in Firebase Authentication
        if (sucursal.id) {
          await axios.post('/api/deleteUserByUid', { uid: sucursal.id });
          console.log(`Firebase user with UID ${sucursal.id} deleted successfully.`);
        }

        // Delete the sucursal from the database
        await axios.delete(`${API_URL}/sucursal/${sucursal.id}`);
        console.log(`Sucursal with ID ${sucursal.id} deleted successfully.`);
      } catch (error) {
        console.error(`Error deleting sucursal or Firebase user with ID ${sucursal.id}:`, error);
      }
    }

    console.log('All sucursales and Firebase users deleted successfully.');
  } catch (error) {
    console.error('Error wiping sucursales:', error);
    throw error;
  }
}

export async function createFirebaseSucursalUser(email: string, password: string) {
  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await axios.post('/api/setUserClaims', {
      uid: user.uid,
      userType: 'sucursal' // MUST MATCH ENTRIES CHECKED IN LOGIN AND LAYOUTS
    });

    console.log('Firebase sucursal user created and custom claim set');
    return user;
  } catch (error) {
    console.error('Error creating Firebase sucursal user: ', error);
    throw error;
  }
}

export async function getFirebaseSucursalUser(uid: string) {
  try {
    const response = await axios.post('/api/getUserByUid', { uid});

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