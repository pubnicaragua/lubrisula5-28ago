import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module";

export type TecnicoType = {
  id: number
  created_at: string // formato ISO 8601 con zona horaria
  nombre: string
  apellido: string
  telefono: string | null
  disponible: boolean | null
  cargo: string
  area: string
}


const TECNICO_SERVICES = {
    async GET_ALL_TECNICOS(): Promise<TecnicoType[]> {
        const data: TecnicoType[] = await AxiosGet({ path: '/tecnicos' })
        return data;
    },
  
    async INSERT_TECNICO(tecnico: TecnicoType): Promise<TecnicoType[]> {
        const res: TecnicoType[] = await AxiosPost({ path: '/tecnicos', payload: tecnico })
        return res;
    },
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

export default TECNICO_SERVICES
