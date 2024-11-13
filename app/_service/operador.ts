import axios from 'axios';
import { API_URL } from '@service';

export type Operador = {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  antiguedad: string; // Make sure this is formatted as YYYY-MM-DD
  sucursal_id: string; // Sucursal relationship, explicitly a NUMERIC ID
  clave: number;
  createdClave: string;
  needToChangePassword: boolean;
}

export async function fetchOperadoresData() {
  try {
    const response = await axios.get(`${API_URL}/operador`)
    return response.data.operadores.map((operador: any) => ({
      id: operador.id,
      nombre: operador.nombre,
      apellidoPaterno: operador.apellido_paterno,
      apellidoMaterno: operador.apellido_materno,
      telefono: operador.telefono,
      antiguedad: operador.antiguedad,
      sucursal_id: operador.sucursal_id,
      clave: operador.clave,
      createdClave: operador.created_clave,
      needToChangePassword: operador.need_to_change_password,
    }));
  } catch (error) {
    console.error("Error fetching operadores data: ", error);
    throw error;
  }
}

export async function addOperador(newOperador: Operador): Promise<Operador> {
  try {
    console.log("Sending data:", {
      nombre: newOperador.nombre,
      apellido_paterno: newOperador.apellidoPaterno,
      apellido_materno: newOperador.apellidoMaterno,
      sucursal_id: newOperador.sucursal_id,
      telefono: newOperador.telefono,
      antiguedad: newOperador.antiguedad,
    });
    
    const response = await axios.post(`${API_URL}/operador`, {
      nombre: newOperador.nombre,
      apellido_paterno: newOperador.apellidoPaterno,
      apellido_materno: newOperador.apellidoMaterno,
      sucursal_id: newOperador.sucursal_id, 
      telefono: newOperador.telefono,
      antiguedad: newOperador.antiguedad,
      needToChangePassword: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding operador: ", error);
    throw error;
  }
}

export const editOperador = async (id: number, operador: Operador): Promise<Operador> => {
  try {
    const updatedData = {
      nombre: operador.nombre,
      apellido_paterno: operador.apellidoPaterno,
      apellido_materno: operador.apellidoMaterno,
      telefono: operador.telefono,
      antiguedad: operador.antiguedad,
      sucursal_id: operador.sucursal_id,
    };
    const response = await axios.put(`${API_URL}/operador/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error editing operador: ${error}`);
    throw new Error(`Error editing operador: ${error}`);
  }
};

export async function wipeAllOperadores() {
  if (process.env.NODE_ENV !== 'development') {
    console.error('This function can only be run in a development environment!');
    return;
  }

  try {
    const operadores: Operador[] = await fetchOperadoresData();

    for (const operador of operadores) {
      await axios.delete(`${API_URL}/operador/${operador.id}`);
      console.log(`Deleted operador with ID: ${operador.id}`);
    }

    console.log('All operadores deleted succesfully.');
  } catch (error) {
    console.error('Error wiping all operadores: ', error);
    throw error;
  }
}
