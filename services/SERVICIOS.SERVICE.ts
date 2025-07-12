import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module";

export type TipoServicioType = {
  id: string
  codigo: string
  nombre: string
  descripcion: string
  created_at: string // ISO 8601 con zona horaria
  updated_at: string // ISO 8601 con zona horaria
}

export type CategoriaServicioType = {
  id: number;
  nombre: string;
  created_at: string;
};

export type ServicioType = {
  id?: number;
  paquete_id?: number;
  created_at?: string;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  tiempo_estimado?: number;
  tipo_tiempo_estimado?: string;
  categoria_servicio_id?: number;
  activo?: boolean;
  nivel_tarifa?: string;
  vehiculo_id?: string;
  materiales?: string;
  orden_trabajo_id?: string | null;
  categorias_servicio?: CategoriaServicioType;
};

export type PaqueteServicioType = {
  id?: number;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  tiempo_estimado?: number;
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
  categoria_servicio_id?: number;
  tipo_tiempo_estimado?: string;
  categorias_servicio?: CategoriaServicioType;
  servicios?: Omit<ServicioType, "categorias_servicio">[];
}


const SERVICIOS_SERVICES = {
  async GET_ALL_TIPO_SERVICIOS(): Promise<TipoServicioType[]> {
    const data: TipoServicioType[] = await AxiosGet({ path: '/tipos_operacion' })
    return data;
  },
  async GET_GATEGORIAS_SERVICIO(): Promise<CategoriaServicioType[]> {
    const data: CategoriaServicioType[] = await AxiosGet({ path: '/categorias_servicio' })
    return data;
  },
  async GET_ALL_SERVICIOS(): Promise<ServicioType[]> {
    const data: ServicioType[] = await AxiosGet({ path: '/servicios?select=*,categorias_servicio(*)' })
    return data;
  },
  async GET_ALL_PAQUETES_SERVICIOS(): Promise<PaqueteServicioType[]> {
    const data: PaqueteServicioType[] = await AxiosGet({ path: '/paquetes_servicio?select=*,categorias_servicio(*),servicios(*)' })
    return data;
  },
  async INSERT_PAQUETES_SERVICIOS(paquete: Omit<PaqueteServicioType, "categorias_servicio" | "servicios">, ListIdServices: number[]): Promise<Omit<PaqueteServicioType, "categorias_servicio" | "servicios">> {
    const ResPaquete: PaqueteServicioType[] = await AxiosPost({ path: '/paquetes_servicio', payload: paquete })

    for (let servId of ListIdServices) {
      await AxiosPatch({ path: `/servicios?id=eq.${servId}`, payload: { paquete_id: ResPaquete[0].id } })
    }

    return ResPaquete[0];
  },
  async ACTIVAR_DESACTIVAR_PAQUETE(paquete_id: number, activo: boolean) {
    await AxiosPatch({ path: `/paquetes_servicio?id=eq.${paquete_id}`, payload: { activo: activo } })
    return true;
  },
  async ACTIVAR_DESACTIVAR_SERVICIO(servicio_id: number, activo: boolean) {
    await AxiosPatch({ path: `/servicios?id=eq.${servicio_id}`, payload: { activo: activo } })
    return true;
  },
  async AGREGAR_SERVICIO_AL_PAQUETE(servicio_id: number, paquete_id: number) {
    await AxiosPatch({ path: `/servicios?id=eq.${servicio_id}`, payload: { paquete_id } })
    return true;
  },
  async GET_SERVICIO_BY_ID(servicio_id: number): Promise<ServicioType> {
    const data: ServicioType[] = await AxiosGet({ path: `/servicios?select=*,categorias_servicio(*)&id=eq.${servicio_id}` })
    return data[0];
  },

  async INSERT_SERVICIO(serv: ServicioType): Promise<ServicioType> {
    const res: ServicioType[] = await AxiosPost({ path: '/servicios', payload: serv })
    return res[0];
  },
  async UPDATE_SERVICIO(serv: ServicioType): Promise<ServicioType> {
    const res: ServicioType[] = await AxiosPatch({ path: `/servicios?id=eq.${serv.id}`, payload: serv })
    return res[0];
  },
  // async DELETE_VEHICULO(Id: string): Promise<VehiculoType[]> {
  //     const res: VehiculoType[] = await AxiosDelete({ path: `/vehicles?id=eq.${Id}` })
  //     return res;
  // }
};

export default SERVICIOS_SERVICES
