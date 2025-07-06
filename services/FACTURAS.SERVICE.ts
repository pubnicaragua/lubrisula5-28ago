import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module";


export type FacturaType = {
    id?: string
    client_id?: string
    fecha_emision?: string // formato ISO 8601
    estado?: "Pendiente" | "Pagado" | "Cancelado" | string
    entidad_bancaria_id?: string | null
    metodo_pago_id?: number
    subtotal?: number
    impuesto?: number
    total?: number
    descuento?: number
    num_factura?: string
    client_name?: string
    metodo_pago_name?: string;
    orden_trabajo_id?: string;
    orden_numero?: number
    orden_client_name?: string
    orden_servicio_name?: string
    orden_estado?: "Completada" | "En proceso" | "Pendiente" | string
    nota?: string;
}

export type FacturaTableType = {
    id?: string
    client_id?: string
    fecha_emision?: string // formato ISO 8601
    estado?: "Pendiente" | "Pagado" | "Cancelado" | string
    entidad_bancaria_id?: string | null
    metodo_pago_id?: number
    subtotal?: number
    impuesto?: number
    total?: number
    descuento?: number
    num_factura?: string;
    orden_trabajo_id?: string;
    nota: string;
}



export type MetodoPagoType = {
    id: number
    created_at: string // formato ISO 8601
    nombre: string
}



const FACTURAS_SERVICES = {
    async GET_ALL_FACTURAS(): Promise<FacturaType[]> {
        const facturas: FacturaType[] = await AxiosGet({ path: '/view_facturas' })
        return facturas;
    },
    async GET_ALL_METODOS_PAGO(): Promise<MetodoPagoType[]> {
        const facturas: MetodoPagoType[] = await AxiosGet({ path: '/metodo_pago' })
        return facturas;
    },
    async INSERT_FACTURA(factura: FacturaType): Promise<FacturaTableType> {
        const res: FacturaTableType[] = await AxiosPost({ path: '/facturas', payload: factura });
        return res[0]
    },
    async UPDATE_FACTURA(factura: FacturaTableType): Promise<FacturaTableType> {
        console.log(factura)
        const IdFactura = factura.id;
        delete factura.id
        const res: FacturaTableType[] = await AxiosPatch({ path: `/facturas?id=eq.${IdFactura}`, payload: factura });
        return res[0]
    },
    async DELTE_FACTURA(Id: string): Promise<FacturaTableType> {
        const res: FacturaTableType[] = await AxiosDelete({ path: `/facturas?id=eq.${Id}` });
        return res[0]
    },

};

export default FACTURAS_SERVICES
