import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module";
import CLIENTS_SERVICES, { ClienteType } from "./CLIENTES_SERVICES.SERVICE";
import VEHICULO_SERVICES, { VehiculoType } from "./VEHICULOS.SERVICE";
export type CotizacionesType = {
    id: string;
    quotation_number: string;
    client_id: string;
    vehicle_id: string;
    date: string; // formato: "YYYY-MM-DD"
    status: "Pendiente" | "Aprobada" | "Rechazada" | string;
    total_labor: number;
    total_materials: number;
    total_parts: number;
    total: number;
    repair_hours: number;
    estimated_days: number;
    created_at: string; // formato ISO 8601
    updated_at: string; // formato ISO 8601
    client_name: string;
    vehiculo_marca: string;
    vehiculo_modelo: string;
    vehiculo_year: string;
    vehiculo_placa: string;
};
export type CotizacionInsertTableType = {
    id?: string;
    quotation_number: string;
    client_id: string;
    vehicle_id: string;
    date: string; // formato: "YYYY-MM-DD"
    status: "Pendiente" | "Aprobada" | "Rechazada" | string;
    total_labor: number;
    total_materials: number;
    total_parts: number;
    total: number;
    repair_hours: number;
    estimated_days: number;
    // created_at: string; // formato ISO 8601
    updated_at?: string; // formato ISO 8601
}
export type ParteCotizacionType = {
    id?: string
    quotation_id?: string
    category?: string
    name?: string
    quantity?: number
    operation?: string // Ej: "Rep" (puedes reemplazar por enum si conoces todos los posibles)
    material_type?: string // Ej: "PL"
    repair_type?: string // Ej: "OU"
    repair_hours?: number
    labor_cost?: number
    materials_cost?: number
    parts_cost?: number
    total?: number
    created_at?: string // ISO 8601 timestamp
    updated_at?: string // ISO 8601 timestamp

}
export type DetalleCotyzacionesType = {
    cotizacion: CotizacionesType,
    client: ClienteType,
    vehiculo: VehiculoType,
    partesCotizacion?: ParteCotizacionType[]
}

const COTIZACIONES_SERVICES = {
    async GET_ALL_COTIZACIONES(): Promise<CotizacionesType[]> {
        const taller_id = localStorage.getItem("taller_id") || "";
        const data: CotizacionesType[] = await AxiosGet({ path: '/view_cotizaciones?taller_id=eq.' + taller_id })
        return data;
    },
    async GET_PARTS_BY_COTIZACION_ID(cotizacion_id: string): Promise<ParteCotizacionType[]> {
        const data: ParteCotizacionType[] = await AxiosGet({ path: `/quotation_parts?quotation_id=eq.${cotizacion_id}` })
        return data;
    },
    async GET_DETALLE_COTIZACIONES_BY_ID(Id: string): Promise<DetalleCotyzacionesType> {
        const data: CotizacionesType[] = await AxiosGet({ path: `/view_cotizaciones?id=eq.${Id}` })
        const cotizacion: CotizacionesType = data[0]
        const client = await CLIENTS_SERVICES.GET_CLIENTS_BY_ID(cotizacion.client_id);
        const vehiculo = await VEHICULO_SERVICES.GET_VEHICULOS_BY_ID(cotizacion.vehicle_id);
        const partes = await COTIZACIONES_SERVICES.GET_PARTS_BY_COTIZACION_ID(cotizacion.id);
        let detalle: DetalleCotyzacionesType = {
            cotizacion,
            client,
            vehiculo,
            partesCotizacion: partes
        };
        return detalle

    },
    async INSERT_COTIZACION(cotizacion: CotizacionInsertTableType, partes: ParteCotizacionType[]) {
        const taller_id = localStorage.getItem("taller_id") || "";

        const newCotizacion: CotizacionInsertTableType[] = await AxiosPost({ path: '/quotations', payload: { ...cotizacion, taller_id } })
        const PartesDeCotizaciones = partes.map(part => ({ ...part, quotation_id: newCotizacion[0].id }))
        await AxiosPost({ path: '/quotation_parts', payload: PartesDeCotizaciones })
        return true;
    }
    // async GET_ALL_VEHICULOS_BY_CLIENT(client_id:string): Promise<VehiculoType[]> {
    //     const data: VehiculoType[] = await AxiosGet({ path: `/view_vehicles?client_id=eq.${client_id}` })

    //     return data;
    // },
    // async UPDATE_VEHICULO(vehicle: VehiculoType): Promise<VehiculoType[]> {
    //     const Id_Vehiculo = vehicle.id; // Use vehicle.id if available, otherwise use Id
    //     delete vehicle.id; // Remove id from payload if it's not needed for update
    //     delete vehicle.client_name; 
    //     const res: VehiculoType[] = await AxiosPatch({ path: `/vehicles?id=eq.${Id_Vehiculo}`, payload: vehicle })
    //     return res;
    // },
    // async DELETE_VEHICULO(Id: string): Promise<VehiculoType[]> {
    //     const res: VehiculoType[] = await AxiosDelete({ path: `/vehicles?id=eq.${Id}` })
    //     return res;
    // }
};

export default COTIZACIONES_SERVICES
