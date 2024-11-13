import api from '@service/axiosInstance';
import { API_URL } from '@service';

export type Operacion = {
  id: number;
  fecha: string;
  sucursalId: number;
  tipoDeOperacion: string;
  divisa: string;
  operadorId: number;
  recibido: number;
  entregado: number;
  tcRegistrado: number;
  tcPublicado: number;
  vip: boolean;
  intersucursal: boolean;
  estatus: boolean;
  revisado: number | null;
}

export async function fetchOperacionesData(): Promise<Operacion[]> {
  try {
    const response = await api.get(`${API_URL}/operacion`);
    return response.data.map((operacion: any) => ({
      id: operacion.id,
      fecha: operacion.fecha,
      sucursalId: operacion.sucursal_id,
      tipoDeOperacion: operacion.tipo_de_operacion,
      divisa: operacion.divisa,
      operadorId: operacion.operador_id,
      recibido: operacion.recibido,
      entregado: operacion.entregado,
      tcRegistrado: operacion.tc_registrado,
      tcPublicado: operacion.tc_publicado,
      vip: Boolean(operacion.vip),
      intersucursal: Boolean(operacion.intersucursal),
      estatus: operacion.estatus === "true",
      revisado: operacion.revisado,
    }))
  } catch (error) {
    console.error("Error fetching operaciones data: ", error);
    throw error;
  }
}