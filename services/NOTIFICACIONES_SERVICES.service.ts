import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module";  
  
export type NotificacionType = {  
    id?: string;  
    user_id?: string;  
    tipo?: string;  
    titulo?: string;  
    mensaje?: string;  
    leida?: boolean;  
    datos?: any;  
    prioridad?: 'baja' | 'normal' | 'alta' | 'critica';  
    created_at?: string;  
}  
  
const NOTIFICACIONES_SERVICES = {  
    async GET_NOTIFICACIONES_USUARIO(user_id: string): Promise<NotificacionType[]> {  
        const notificaciones: NotificacionType[] = await AxiosGet({   
            path: `/notificaciones?user_id=eq.${user_id}&order=created_at.desc`   
        });  
        return notificaciones;  
    },  
  
    async GET_NOTIFICACIONES_NO_LEIDAS(user_id: string): Promise<NotificacionType[]> {  
        const notificaciones: NotificacionType[] = await AxiosGet({   
            path: `/notificaciones?user_id=eq.${user_id}&leida=eq.false&order=created_at.desc`   
        });  
        return notificaciones;  
    },  
  
    async CREAR_NOTIFICACION(notificacion: NotificacionType): Promise<NotificacionType> {  
        console.log('CREAR NOTIFICACION', notificacion);  
        const res = await AxiosPost({  
            path: `/notificaciones`,   
            payload: {  
                user_id: notificacion.user_id,  
                tipo: notificacion.tipo,  
                titulo: notificacion.titulo,  
                mensaje: notificacion.mensaje,  
                datos: notificacion.datos,  
                prioridad: notificacion.prioridad || 'normal',  
                leida: false  
            }  
        });  
        return res[0];  
    },  
  
    async MARCAR_COMO_LEIDA(id: string): Promise<NotificacionType> {  
        const res = await AxiosPatch({  
            path: `/notificaciones?id=eq.${id}`,   
            payload: { leida: true }  
        });  
        return res[0];  
    },  
  
    async MARCAR_TODAS_COMO_LEIDAS(user_id: string): Promise<any> {  
        const res = await AxiosPatch({  
            path: `/notificaciones?user_id=eq.${user_id}&leida=eq.false`,   
            payload: { leida: true }  
        });  
        return res;  
    },  
  
    async DELETE_NOTIFICACION(id: string): Promise<any> {  
        const res = await AxiosDelete({  
            path: `/notificaciones?id=eq.${id}`,   
            payload: {}  
        });  
        return res[0];  
    }  
};  
  
export default NOTIFICACIONES_SERVICES;