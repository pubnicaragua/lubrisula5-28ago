import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module";  
  
export type ReporteType = {  
    id?: string;  
    tipo_reporte?: 'siniestros' | 'reparaciones' | 'financiero' | 'operacional';  
    parametros?: any;  
    resultado?: any;  
    generado_por?: string;  
    created_at?: string;  
    titulo?: string;  
    descripcion?: string;  
}  
  
const REPORTES_SERVICES = {  
    async GET_REPORTES(): Promise<ReporteType[]> {  
        const reportes: ReporteType[] = await AxiosGet({   
            path: '/reportes?select=*&order=created_at.desc'   
        });  
        return reportes;  
    },  
  
    async GET_REPORTES_BY_USER(user_id: string): Promise<ReporteType[]> {  
        const reportes: ReporteType[] = await AxiosGet({   
            path: `/reportes?generado_por=eq.${user_id}&select=*&order=created_at.desc`   
        });  
        return reportes;  
    },  
  
    async GET_REPORTE_BY_ID(id: string): Promise<ReporteType> {  
        const reporte: ReporteType[] = await AxiosGet({   
            path: `/reportes?id=eq.${id}&select=*`   
        });  
        return reporte[0];  
    },  
  
    async GENERAR_REPORTE(reporte: ReporteType): Promise<ReporteType> {  
        const res = await AxiosPost({  
            path: `/reportes`,   
            payload: {  
                tipo_reporte: reporte.tipo_reporte,  
                parametros: reporte.parametros,  
                resultado: reporte.resultado,  
                generado_por: reporte.generado_por,  
                titulo: reporte.titulo,  
                descripcion: reporte.descripcion  
            }  
        });  
        return res[0];  
    },  
  
    async DELETE_REPORTE(id: string): Promise<any> {  
        const res = await AxiosDelete({  
            path: `/reportes?id=eq.${id}`,   
            payload: {}  
        });  
        return res[0];  
    },  
  
    // Reportes específicos  
    async GENERAR_REPORTE_SINIESTROS(parametros: any): Promise<any> {  
        const siniestros = await AxiosGet({   
            path: `/siniestros?select=*,aseguradoras(*),clientes:cliente_id(*),vehiculos:vehiculo_id(*)`   
        });  
          
        // Procesar datos para el reporte  
        const resultado = {  
            total_siniestros: siniestros.length,  
            por_estado: siniestros.reduce((acc: any, s: any) => {  
                acc[s.estado] = (acc[s.estado] || 0) + 1;  
                return acc;  
            }, {}),  
            monto_total: siniestros.reduce((sum: number, s: any) => sum + (s.monto_estimado || 0), 0),  
            datos: siniestros  
        };  
          
        return resultado;  
    },  
  
    async GENERAR_REPORTE_REPARACIONES(parametros: any): Promise<any> {  
        const reparaciones = await AxiosGet({   
            path: `/reparaciones?select=*,siniestros(*),talleres(*)`   
        });  
          
        const resultado = {  
            total_reparaciones: reparaciones.length,  
            por_estado: reparaciones.reduce((acc: any, r: any) => {  
                acc[r.estado] = (acc[r.estado] || 0) + 1;  
                return acc;  
            }, {}),  
            costo_total: reparaciones.reduce((sum: number, r: any) => sum + (r.costo_total || 0), 0),  
            tiempo_promedio: this.calcularTiempoPromedio(reparaciones),  
            datos: reparaciones  
        };  
          
        return resultado;  
    },  
  
    calcularTiempoPromedio(reparaciones: any[]): number {  
        const completadas = reparaciones.filter(r => r.fecha_fin_real && r.fecha_inicio);  
        if (completadas.length === 0) return 0;  
          
        const tiempos = completadas.map(r => {  
            const inicio = new Date(r.fecha_inicio);  
            const fin = new Date(r.fecha_fin_real);  
            return (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24); // días  
        });  
          
        return tiempos.reduce((sum, t) => sum + t, 0) / tiempos.length;  
    }  
};  
  
export default REPORTES_SERVICES;