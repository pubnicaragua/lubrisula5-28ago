import { AxiosGet } from "./AxiosServices.module";

// export type SolicitudesTalleresType = {
//     id: number
//     user_auth_id: string | null
//     nombre_taller: string
//     direccion: string
//     ciudad: string
//     estado: string
//     codigo_postal: string
//     nombre_contacto: string
//     telefono: string
//     email: string
//     descripcion: string | null
//     modulos_seleccionados: string[]
//     estado_solicitud: "pendiente" | "aprobada" | "rechazada"
//     fecha_solicitud: string
//     fecha_actualizacion: string | null
// }

export type TallerSolicitudType = {
    id: number;
    user_auth_id: string;
    nombre_taller: string;
    direccion: string;
    ciudad: string;
    estado: string;
    codigo_postal: string;
    nombre_contacto: string;
    telefono: string;
    email: string;
    descripcion: string;
    modulos_seleccionados: string[];
    estado_solicitud: "pendiente" | "aprobada" | "rechazada";
    fecha_solicitud: string;
    fecha_actualizacion: string;
}
const TALLER_SERVICES = {
    async GET_ALL_TALLERES(): Promise<TallerSolicitudType[]> {
        const TalleresData: TallerSolicitudType[] = await AxiosGet({ path: '/solicitudes_talleres' })

        console.log('GET ALL TALLERES', TalleresData);
        return TalleresData;
    },
};

export default TALLER_SERVICES
