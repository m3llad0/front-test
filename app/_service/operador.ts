import api from '@service/axiosInstance';
import { API_URL } from '@service';

export type Operador = {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  antiguedad?: Date;
  sucursal_id: string; // Sucursal relationship, explicitly a NUMERIC ID
}

export async function fetchOperadoresData() {
  try {
    const response = await api.get(`${API_URL}/operador`)
    return response.data.operadores.map((operador: any) => ({
      id: operador.id,
      nombre: operador.nombre,
      apellidoPaterno: operador.apellido_paterno,
      apellidoMaterno: operador.apellido_materno,
      telefono: operador.telefono,
      antiguedad: operador.antiguedad,
      sucursal_id: operador.sucursal_id,
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
      antiguedad: newOperador.antiguedad,
      sucursal_id: newOperador.sucursal_id,
      telefono: newOperador.telefono,
    });
    
    const response = await api.post(`${API_URL}/operador`, {
      nombre: newOperador.nombre,
      apellido_paterno: newOperador.apellidoPaterno,
      apellido_materno: newOperador.apellidoMaterno,
      telefono: newOperador.telefono,
      antiguedad: newOperador.antiguedad,
      sucursal_id: newOperador.sucursal_id, 
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
    const response = await api.put(`${API_URL}/operador/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error editing operador: ${error}`);
    throw new Error(`Error editing operador: ${error}`);
  }
};

export async function deleteOperador(id: number): Promise<void> {
  try {
    await api.delete(`${API_URL}/operador/${id}`);
    console.log(`Deleted operador with ID: ${id}`);
  } catch (error) {
    console.error(`Error deleting operador with ID ${id}: `, error);
    throw error;
  }
}

export async function wipeAllOperadores() {
  if (process.env.NODE_ENV !== 'development') {
    console.error('This function can only be run in a development environment!');
    return;
  }

  try {
    const operadores: Operador[] = await fetchOperadoresData();

    for (const operador of operadores) {
      await deleteOperador(operador.id);
    }

    console.log('All operadores deleted succesfully.');
  } catch (error) {
    console.error('Error wiping all operadores: ', error);
    throw error;
  }
}
