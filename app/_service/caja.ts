import api from '@service/axiosInstance';
import { API_URL } from '@service';

export type Billete = { [key: string]: number };
export type Caja = {
  id?: number;
  sucursal_id: string;
  divisa_id: number;
  fecha_inicio?: string;
  billetes: Billete;
}

export async function fetchCajasData() {
  try {
    const response = await api.get(`${API_URL}/caja`)
    if (response.status === 200) {
      return response.data as Caja[];
    } else {
      throw new Error(`Failed to fetch cajas data: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error fetching cajas data: ', error);
    throw error;
  }
}

export async function addCaja(caja: Caja): Promise<Caja> {
  try {
    console.log('Caja data: ', {
      sucursal_id: caja.sucursal_id,
      divisa_id: caja.divisa_id,
      billetes: caja.billetes,
    });
    
    const response = await api.post(`${API_URL}/caja`, {
      sucursal_id: caja.sucursal_id,
      divisa_id: caja.divisa_id,
      billetes: caja.billetes,
    });
    return response.data;  
  } catch (error) {
    console.error('Error adding caja: ', error);
    throw error;
  }
}

export async function editCaja(id: number, updatedCaja: Caja): Promise<Caja> {
  try {
    const response = await api.put(`${API_URL}/caja/${id}`, {
      sucursal_id: updatedCaja.sucursal_id,
      divisa_id: updatedCaja.divisa_id,
      billetes: updatedCaja.billetes,
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating caja with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteCaja(id: number): Promise<void> {
  try {
    await api.delete(`${API_URL}/caja/${id}`);
    console.log(`Deleted caja with ID: ${id}`);
  } catch (error) {
    console.error(`Error deleting caja with ID ${id}:`, error);
    throw error;
  }
}

