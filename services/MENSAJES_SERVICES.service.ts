import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module";

export type UsuarioType = {
    id: string;
    email: string;
    created_at: string;
};

export type MensajeType = {
    id?: string;
    remitente_id?: string;
    destinatario_id?: string;
    asunto?: string;
    contenido?: string;
    leido?: boolean;
    created_at?: string;
    // Relaciones para mostrar nombres de usuarios  
    remitente?: UsuarioType;
    destinatario?: UsuarioType;
};

const MENSAJES_SERVICES = {
    async GET_MENSAJES_RECIBIDOS(user_id: string): Promise<MensajeType[]> {
        const mensajes: MensajeType[] = await AxiosGet({
            path: `/view_mensajes?destinatario_id=eq.${user_id}&order=created_at.desc`
        });
        return mensajes;
    },

    async GET_MENSAJES_ENVIADOS(user_id: string): Promise<MensajeType[]> {
        const mensajes: MensajeType[] = await AxiosGet({
            path: `/view_mensajes?remitente_id=eq.${user_id}&order=created_at.desc`
        });
        return mensajes;
    },

    async GET_CONVERSACION(user1_id: string, user2_id: string): Promise<MensajeType[]> {
        const mensajes: MensajeType[] = await AxiosGet({
            path: `/mensajes?or=(and(remitente_id.eq.${user1_id},destinatario_id.eq.${user2_id}),and(remitente_id.eq.${user2_id},destinatario_id.eq.${user1_id}))&select=*&order=created_at.asc`
        });
        return mensajes;
    },

    async GET_MENSAJE_BY_ID(id: string): Promise<MensajeType> {
        const mensaje: MensajeType[] = await AxiosGet({
            path: `/mensajes?id=eq.${id}&select=*,remitente:remitente_id(*),destinatario:destinatario_id(*)`
        });
        return mensaje[0];
    },

    async ENVIAR_MENSAJE(mensaje: MensajeType): Promise<MensajeType> {
        console.log('ENVIAR MENSAJE', mensaje);
        const res = await AxiosPost({
            path: `/mensajes`,
            payload: {
                remitente_id: mensaje.remitente_id,
                destinatario_id: mensaje.destinatario_id,
                asunto: mensaje.asunto,
                contenido: mensaje.contenido,
                leido: false
            }
        });
        console.log('ENVIAR MENSAJE RESULT', res);
        return res[0];
    },

    async MARCAR_COMO_LEIDO(id: string): Promise<MensajeType> {
        const res = await AxiosPatch({
            path: `/mensajes?id=eq.${id}`,
            payload: { leido: true }
        });
        return res[0];
    },

    async MARCAR_MENSAJES_COMO_LEIDOS(user_id: string, remitente_id: string): Promise<any> {
        const res = await AxiosPatch({
            path: `/mensajes?destinatario_id=eq.${user_id}&remitente_id=eq.${remitente_id}`,
            payload: { leido: true }
        });
        return res;
    },

    async DELETE_MENSAJE(id: string): Promise<any> {
        console.log('DELETE MENSAJE', id);
        const res = await AxiosDelete({
            path: `/mensajes?id=eq.${id}`,
            payload: {}
        });
        return res[0];
    },

    async GET_MENSAJES_NO_LEIDOS(user_id: string): Promise<number> {
        const mensajes: MensajeType[] = await AxiosGet({
            path: `/mensajes?destinatario_id=eq.${user_id}&leido=eq.false&select=id`
        });
        return mensajes.length;
    },

    async GET_CONTACTOS_RECIENTES(user_id: string): Promise<any[]> {
        // Obtener usuarios con los que ha intercambiado mensajes  
        const contactos = await AxiosGet({
            path: `/mensajes?or=(remitente_id.eq.${user_id},destinatario_id.eq.${user_id})&select=remitente_id,destinatario_id,remitente:remitente_id(*),destinatario:destinatario_id(*)&order=created_at.desc&limit=20`
        });
        return contactos;
    }
};

export default MENSAJES_SERVICES;