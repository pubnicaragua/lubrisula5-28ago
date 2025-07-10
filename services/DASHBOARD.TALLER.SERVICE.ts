import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module";
import { OrdenTrabajoType } from "./ORDENES.SERVICE";


export type CabeceraDashboardType = {
    tipo: string;
    cantidad: number;
    porcentaje_comparacion_mes_pasado: number | null;
};

export type RendimientoOrdenesSemanalesType = {
    dia: string;
    completadas: number;
    pendientes: number;
};

export type EstadoOrdenType = {
    estado: string;
    porcentaje: number;
    cantidad: number;
};
export type TipoOrdenPorcentajeType = {
    tipo_orden: string;
    porcentaje: string;
};
export type CitaConDetalleType = {
    id: string;
    vehiculo_id: string;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    tipo_servicio_id: string;
    estado: string;
    created_at: string;
    updated_at: string;
    client_id: string;
    tecnico_id: number;
    nota: string;
    clients: {
        id: string;
        name: string;
        email: string;
        phone: string;
        company: string | null;
        user_id: string | null;
        created_at: string;
        updated_at: string;
        client_type: string;
    };
    tecnicos: {
        id: number;
        area: string;
        cargo: string;
        email: string;
        estado: string;
        nombre: string;
        apellido: string;
        telefono: string;
        direccion: string;
        created_at: string;
        disponible: boolean;
        calificacion: number;
        tiempo_experciencia: string;
        cant_ordenes_completadas: number;
    };
    vehicles: {
        id: string;
        ano: number;
        vin: string;
        color: string;
        marca: string;
        placa: string;
        estado: string;
        modelo: string;
        client_id: string;
        created_at: string;
        updated_at: string;
        kilometraje: number;
    };
    tipos_operacion: {
        id: string;
        codigo: string;
        nombre: string;
        created_at: string;
        updated_at: string;
        descripcion: string;
    }
}
export type DistribucionEspecialidadType = {
    especialidad: string;
    cantidad_total: number;
}
export type RendimientoTecnicoType = {
    tecnico_name: string;
    tiempo_promedio_hora: number;
    ordenes_completadas: number;
};
const DASHBOARD_TALLER_SERVICES = {
    async GET_CABECERA(): Promise<CabeceraDashboardType[]> {
        const data: CabeceraDashboardType[] = await AxiosGet({ path: '/vista_cabecera_dashboard' })
        return data;
    },
    async GET_RENDIMIENTO_ORDENES_SEMANALES(): Promise<RendimientoOrdenesSemanalesType[]> {
        const data: RendimientoOrdenesSemanalesType[] = await AxiosGet({ path: '/vista_rendimientono_ordenes_semanales' })
        return data;
    },
    async GET_ESTADO_ORDENES(): Promise<EstadoOrdenType[]> {
        const data: EstadoOrdenType[] = await AxiosGet({ path: '/vista_estado_ordenes' })
        return data;
    },
    async GET_ORDENES_RECIENTES(): Promise<OrdenTrabajoType[]> {
        const data: OrdenTrabajoType[] = await AxiosGet({ path: '/vista_ordenes_recientes' })
        return data;
    },
    async GET_PORCENTAJE_ORDENES_POR_TIPO(): Promise<TipoOrdenPorcentajeType[]> {
        const data: TipoOrdenPorcentajeType[] = await AxiosGet({ path: '/vista_ordenes_por_tipo' })
        return data;
    },
    async GET_CITAS_PENDIENTES(): Promise<CitaConDetalleType[]> {
        const data: CitaConDetalleType[] = await AxiosGet({ path: '/citas?select=*,clients(*), tecnicos(*), vehicles(*), tipos_operacion(*)&estado=eq.programada' })
        return data;
    },
    async GET_DISTRIBUCION_DE_ESPECIALIDADES(): Promise<DistribucionEspecialidadType[]> {
        const data: DistribucionEspecialidadType[] = await AxiosGet({ path: '/vista_rendimiento_tecnicos' })
        return data;
    },
    async GET_RENDIMIENTO_DE_TECNICOS(): Promise<RendimientoTecnicoType[]> {
        const data: RendimientoTecnicoType[] = await AxiosGet({ path: '/vista_rendimiento_tecnicos' })
        return data;
    },

};

export default DASHBOARD_TALLER_SERVICES
