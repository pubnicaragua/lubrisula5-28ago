import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module";

export type TipoServicioType = {
  id: string
  codigo: string
  nombre: string
  descripcion: string
  created_at: string // ISO 8601 con zona horaria
  updated_at: string // ISO 8601 con zona horaria
}


const SERVICIOS_SERVICES = {
    async GET_ALL_SERVICIOS(): Promise<TipoServicioType[]> {
        const data: TipoServicioType[] = await AxiosGet({ path: '/tipos_operacion' })
        return data;
    },
  
    // async INSERT_TECNICO(tecnico: TecnicoType): Promise<TecnicoType[]> {
    //     const res: TecnicoType[] = await AxiosPost({ path: '/tecnicos', payload: tecnico })
    //     return res;
    // },
    // async UPDATE_VEHICULO(vehicle: VehiculoType): Promise<VehiculoType[]> {
    //     const Id_Vehiculo = vehicle.id; // Use vehicle.id if available, otherwise use Id
    //     delete vehicle.id; // Remove id from payload if it's not needed for update
    //     delete vehicle.client_name; 
    //     console.log(vehicle)
    //     const res: VehiculoType[] = await AxiosPatch({ path: `/vehicles?id=eq.${Id_Vehiculo}`, payload: vehicle })
    //     return res;
    // },
    // async DELETE_VEHICULO(Id: string): Promise<VehiculoType[]> {
    //     const res: VehiculoType[] = await AxiosDelete({ path: `/vehicles?id=eq.${Id}` })
    //     return res;
    // }
};

export default SERVICIOS_SERVICES
