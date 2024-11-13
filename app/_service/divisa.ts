import api from '@service/axiosInstance';
import { API_URL } from '@service';

export type Divisa = {
  id?: number, // ONLY GET
  sucursal_id: string, // PASSED IN POST URL
  nombre: string,
  mnemonico: string,
  vip: number,
  monto_aprobacion: number,
  tc_compra: number,
  li_compra: number,
  ls_compra: number,
  tc_venta: number,
  li_venta: number,
  ls_venta: number,
  color: string
}

export async function fetchDivisasData() {
  try {
    const response = await api.get(`${API_URL}/divisa`);
    if (response.status === 200) {
      return response.data as Divisa[];
    } else {
      throw new Error(`Failed to fetch divisas data: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error fetching divisas data: ', error);
    throw error;
  }
}

export async function addDivisa(newDivisa: Divisa): Promise<Divisa> {
  try {
    console.log('Sending data: ', {
      newDivisa
    })
    const response = await api.post(`${API_URL}/divisa`, {
      sucursal_id: newDivisa.sucursal_id,
      nombre: newDivisa.nombre,
      mnemonico: newDivisa.mnemonico,
      vip: newDivisa.vip,
      monto_aprobacion: newDivisa.monto_aprobacion,
      tc_compra: newDivisa.tc_compra,
      li_compra: newDivisa.li_compra,
      ls_compra: newDivisa.ls_compra,
      tc_venta: newDivisa.tc_venta,
      li_venta: newDivisa.li_venta,
      ls_venta: newDivisa.ls_venta,
      color: newDivisa.color,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding divisa: ', error);
    throw error;
  }
}

export async function editDivisa(updatedDivisa: Divisa): Promise<Divisa> {
  try {
    const response = await api.put(`${API_URL}/divisa/${updatedDivisa.id}`, {
      nombre: updatedDivisa.nombre,
      mnemonico: updatedDivisa.mnemonico,
      vip: updatedDivisa.vip,
      monto_aprobacion: updatedDivisa.monto_aprobacion,
      tc_compra: updatedDivisa.tc_compra,
      li_compra: updatedDivisa.li_compra,
      ls_compra: updatedDivisa.ls_compra,
      tc_venta: updatedDivisa.tc_venta,
      li_venta: updatedDivisa.li_venta,
      ls_venta: updatedDivisa.ls_venta,
      color: updatedDivisa.color,
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating divisa with ID ${updatedDivisa.id}:`, error);
    throw error;
  }
}

export async function deleteDivisa(id: number): Promise<void> {
  try {
    await api.delete(`${API_URL}/divisa/${id}`);
    console.log(`Deleted divisa with ID: ${id}`);
  } catch (error) {
    console.error(`Error deleting divisa with ID ${id}:`, error);
    throw error;
  }
}