import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module";

export type ReparacionType = {
    id?: string;
    siniestro_id?: string;
    taller_id?: string;
    fecha_inicio?: string;
    fecha_fin_estimada?: string;
    fecha_fin_real?: string;
    estado?: string;
    costo_total?: number;
    descripcion_trabajo?: string;
    created_at?: string;
    // Relaciones  
    siniestros?: any;
    talleres?: any;
}

const REPARACIONES_SERVICES = {
    async GET_REPARACIONES(): Promise<ReparacionType[]> {
        const reparaciones: ReparacionType[] = await AxiosGet({
            path: '/reparaciones?select=*,siniestros(*),talleres(*)'
        });
        return reparaciones;
    },

    async GET_REPARACIONES_BY_TALLER(taller_id: string): Promise<ReparacionType[]> {
        const reparaciones: ReparacionType[] = await AxiosGet({
            path: `/reparaciones?taller_id=eq.${taller_id}&select=*,siniestros(*)`
        });
        return reparaciones;
    },

    async GET_REPARACIONES_BY_SINIESTRO(siniestro_id: string): Promise<ReparacionType[]> {
        const reparaciones: ReparacionType[] = await AxiosGet({
            path: `/reparaciones?siniestro_id=eq.${siniestro_id}&select=*,talleres(*)`
        });
        return reparaciones;
    },

    async GET_REPARACION_BY_ID(id: string): Promise<ReparacionType> {
        const reparacion: ReparacionType[] = await AxiosGet({
            path: `/reparaciones?id=eq.${id}&select=*,siniestros(*),talleres(*)`
        });
        return reparacion[0];
    },

    async INSERT_REPARACION(reparacion: ReparacionType): Promise<ReparacionType> {
        console.log('INSERT REPARACION', reparacion);
        const res = await AxiosPost({
            path: `/reparaciones`,
            payload: {
                siniestro_id: reparacion.siniestro_id,
                taller_id: reparacion.taller_id,
                fecha_inicio: reparacion.fecha_inicio,
                fecha_fin_estimada: reparacion.fecha_fin_estimada,
                fecha_fin_real: reparacion.fecha_fin_real,
                estado: reparacion.estado || 'pendiente',
                costo_total: reparacion.costo_total,
                descripcion_trabajo: reparacion.descripcion_trabajo
            }
        });
        console.log('INSERT REPARACION RESULT', res);
        return res[0];
    },

    async UPDATE_REPARACION(reparacion: ReparacionType): Promise<ReparacionType> {
        console.log('UPDATE REPARACION', reparacion);
        const res = await AxiosPatch({
            path: `/reparaciones?id=eq.${reparacion.id}`,
            payload: {
                siniestro_id: reparacion.siniestro_id,
                taller_id: reparacion.taller_id,
                fecha_inicio: reparacion.fecha_inicio,
                fecha_fin_estimada: reparacion.fecha_fin_estimada,
                fecha_fin_real: reparacion.fecha_fin_real,
                estado: reparacion.estado,
                costo_total: reparacion.costo_total,
                descripcion_trabajo: reparacion.descripcion_trabajo
            }
        });
        return res[0];
    },

    async DELETE_REPARACION(id: string): Promise<any> {
        console.log('DELETE REPARACION', id);
        const res = await AxiosDelete({
            path: `/reparaciones?id=eq.${id}`,
            payload: {}
        });
        return res[0];
    },

    async UPDATE_ESTADO_REPARACION(id: string, estado: string): Promise<ReparacionType> {
        const res = await AxiosPatch({
            path: `/reparaciones?id=eq.${id}`,
            payload: { estado }
        });
        return res[0];
    },

    async FINALIZAR_REPARACION(id: string, fecha_fin_real: string, costo_total: number): Promise<ReparacionType> {
        const res = await AxiosPatch({
            path: `/reparaciones?id=eq.${id}`,
            payload: {
                estado: 'completada',
                fecha_fin_real,
                costo_total
            }
        });
        return res[0];
    }
};

export default REPARACIONES_SERVICES;