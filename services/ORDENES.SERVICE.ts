import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module";

export type OrdenTrabajoType = {
    id: string;
    numero_orden: number,
    vehiculo_id: string;
    client_id: string;
    descripcion: string;
    costo: number;
    estado: "Pendiente" | "En Proceso" | "Completada" | "Cancelada"; // ajusta según tus constraints reales
    fecha_creacion: string; // formato ISO 8601
    fecha_ingreso: string; // formato ISO 8601
    fecha_entrega: string;
    prioridad: "Alta" | "Media" | "Baja"; // ajusta si es diferente
    tecnico_id: number | null;
    vehicle_marca: string;
    vehiculo_modelo: string;
    client_name: string;
    tecnico_name: string;
    observacion: string;
    servicio_id: string;
    servicio_name: string;
}
export type OrdenTrabajoInsertTablaType = {
    vehiculo_id: string
    client_id: string
    descripcion: string
    costo: number
    estado: "Pendiente" | "En proceso" | "Completada" | string
    prioridad: "Alta" | "Media" | "Baja" | string
    tecnico_id: number
    fecha_entrega: string // ISO 8601 date-time string
    tipo_servicio_id: string
    observacion: string
    fecha_ingreso: string | null // puede ser null
}



const ORDENES_TRABAJO_SERVICES = {
    async GET_ALL_ORDENES(): Promise<OrdenTrabajoType[]> {
        const data: OrdenTrabajoType[] = await AxiosGet({ path: '/view_ordenes_trabajo' })
        return data;
    },

    async INSERT_ORDEN(orden: OrdenTrabajoInsertTablaType): Promise<OrdenTrabajoType[]> {
        const res: OrdenTrabajoType[] = await AxiosPost({ path: '/ordenes_trabajo', payload: orden })
        return res;
    },
    async UPDATE_ORDEN(id: string, orden: OrdenTrabajoInsertTablaType): Promise<OrdenTrabajoType[]> {
        const res: OrdenTrabajoType[] = await AxiosPatch({ path: `/ordenes_trabajo?id=eq.${id}`, payload: orden })
        return res;
    },
    async DELETE_ORDEN(id: string) {
        const res: OrdenTrabajoType[] = await AxiosDelete({ path: `/ordenes_trabajo?id=eq.${id}` })
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
