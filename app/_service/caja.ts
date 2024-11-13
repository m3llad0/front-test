import axios from 'axios';
import { API_URL } from '@service';

export type Billete = { [key: string]: number };
export type Caja = {
  id: number;
  sucursal_id?: number;
  divisa_id: number;
  fecha_inicio?: string;
  billetes: { billetes: Billete };
  estatus?: boolean;
}

export async function fetchCajasData() {
  try {
    const response = await axios.get(`${API_URL}/caja`)
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

export async function addCaja(caja: Partial<Caja>) {
  try {
    // Extract only the needed fields. SUCURSAL ID MIGHT NEED TO BE PASSABLE @m3llad0
    const { divisa_id, billetes } = caja;
    if (divisa_id && billetes) {
      const filteredCaja = { divisa_id, billetes };
      const response = await axios.post(`${API_URL}/caja`, filteredCaja);

      if (response.status !== 201) {
        throw new Error(`Failed to add caja: ${response.statusText}`);
      }

      return response.data;
    } else {
      throw new Error('Invalid caja data: divisa_id and billetes are required.');
    }
  } catch (error) {
    console.error('Error adding caja: ', error);
    throw error;
  }
}