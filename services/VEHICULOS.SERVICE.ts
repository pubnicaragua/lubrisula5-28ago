import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module";

export type VehiculoType = {
    id?: string // uuid
    client_id?: string // uuid
    client_name?: string,
    client_phone?: string;
    client_email?: string;
    marca?: string
    modelo?: string
    ano?: number
    color?: string
    placa?: string
    vin?: string
    kilometraje?: number
    created_at?: string // ISO 8601 (timestamp with time zone)
    updated_at?: string // ISO 8601 (timestamp with time zone)
    estado?: string // Assuming estado is a string, adjust as necessary
}

const VEHICULO_SERVICES = {
    async GET_ALL_VEHICULOS(): Promise<VehiculoType[]> {
        const data: VehiculoType[] = await AxiosGet({ path: '/view_vehicles' })

        console.log('GET_ALL_USERS', data);
        return data;
    },
    async GET_ALL_VEHICULOS_BY_CLIENT(client_id: string): Promise<VehiculoType[]> {
        const data: VehiculoType[] = await AxiosGet({ path: `/view_vehicles?client_id=eq.${client_id}` })

        console.log('GET_ALL_USERS', data);
        return data;
    },
    async GET_VEHICULOS_BY_ID(Id: string): Promise<VehiculoType> {
        const data: VehiculoType[] = await AxiosGet({ path: `/view_vehicles?id=eq.${Id}` })
        return data[0];
    },
    async INSERT_VEHICULO(vehicles: VehiculoType): Promise<VehiculoType[]> {
        const res: VehiculoType[] = await AxiosPost({ path: '/vehicles', payload: vehicles })

        console.log('INSERT_USER', res);
        return res;
    },
    async UPDATE_VEHICULO(vehicle: VehiculoType): Promise<VehiculoType[]> {
        const Id_Vehiculo = vehicle.id; // Use vehicle.id if available, otherwise use Id
        delete vehicle.id; // Remove id from payload if it's not needed for update
        delete vehicle.client_name;
        console.log(vehicle)
        const res: VehiculoType[] = await AxiosPatch({ path: `/vehicles?id=eq.${Id_Vehiculo}`, payload: vehicle })
        return res;
    },
    async DELETE_VEHICULO(Id: string): Promise<VehiculoType[]> {
        const res: VehiculoType[] = await AxiosDelete({ path: `/vehicles?id=eq.${Id}` })
        return res;
    }
};

export default VEHICULO_SERVICES
