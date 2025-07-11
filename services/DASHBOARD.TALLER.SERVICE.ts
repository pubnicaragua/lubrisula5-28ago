import { AxiosGet } from "./AxiosServices.module";


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

    async GET_PORCENTAJE_ORDENES_POR_TIPO(): Promise<TipoOrdenPorcentajeType[]> {
        const data: TipoOrdenPorcentajeType[] = await AxiosGet({ path: '/vista_ordenes_por_tipo' })
        return data;
    },
    async GET_DISTRIBUCION_DE_ESPECIALIDADES(): Promise<DistribucionEspecialidadType[]> {
        const data: DistribucionEspecialidadType[] = await AxiosGet({ path: '/vista_distribucion_de_especialidades' })
        return data;
    },
    async GET_RENDIMIENTO_DE_TECNICOS(): Promise<RendimientoTecnicoType[]> {
        const data: RendimientoTecnicoType[] = await AxiosGet({ path: '/vista_rendimiento_tecnicos' })
        return data;
    },

};

export default DASHBOARD_TALLER_SERVICES
