import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module";

export type OrdenTrabajoType = {
    id: string;
    numero_orden: number,
    vehiculo_id: string;
    cliente_id: string;
    descripcion: string;
    costo: number;
    estado: "Pendiente" | "En Proceso" | "Completada" | "Cancelada"; // ajusta según tus constraints reales
    fecha_creacion: string; // formato ISO 8601
    fecha_entrega: string;
    prioridad: "Alta" | "Media" | "Baja"; // ajusta si es diferente
    tecnico_id: number | null;
    vehicle_marca: string;
    vehiculo_modelo: string;
    client_name: string;
    tecnico_name: string;
    tipo_servicio_id:string;
    observacion:string;
}


const ORDENES_TRABAJO_SERVICES = {
    async GET_ALL_ORDENES(): Promise<OrdenTrabajoType[]> {
        const data: OrdenTrabajoType[] = await AxiosGet({ path: '/view_ordenes_trabajo' })

        console.log('GET_ALL_USERS', data);
        return data;
    },

    async INSERT_ORDEN(orden: OrdenTrabajoType): Promise<OrdenTrabajoType[]> {
        console.log(orden)
        const res: OrdenTrabajoType[] = await AxiosPost({ path: '/ordenes_trabajo', payload: orden })

        console.log('INSERT_USER', res);
        return res;
    },
    // async UPDATE_ORDENES(vehicle: OrdenTrabajoType): Promise<OrdenTrabajoType[]> {
    //     const Id_Vehiculo = vehicle.id; // Use vehicle.id if available, otherwise use Id
    //     return vehicle
    //   //
    // },
    // async DELETE_ORDENES(Id: string): Promise<OrdenTrabajoType[]> {
    //     const res: OrdenTrabajoType[] = await AxiosDelete({ path: `/vehicles?id=eq.${Id}` })
    //     return res;
    // }
};

export default ORDENES_TRABAJO_SERVICES
