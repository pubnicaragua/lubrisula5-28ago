import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module";
import SIGNUP_SERVICES from "./SIGNUP_SERVICE.service";


export type TecnicoType = {
    id?: number
    created_at?: string // formato ISO 8601
    nombre?: string
    apellido?: string
    telefono?: string | null
    disponible?: boolean | null
    cargo?: string
    area?: string
    email?: string | null
    tiempo_experciencia?: string | null
    direccion?: string | null
    cant_ordenes_completadas?: number | null;
    calificacion?: number;
    estado?: string;
}

export type TecnicoHabilidadType = {
    id?: number;
    tecnico_id?: number;
    habilidad: string;
    created_at?: string;
}
export type TecnicoCertificacionType = {
    id?: number;
    tecnico_id?: number;
    certificacion: string;
    created_at?: string;
}

export type TecnicoHorarioType = {
    id?: number;
    tecnico_id?: number;
    dia: string;
    horario: string;
    created_at?: string;
    update_at?: string;
}


export type InsertTecnicoType = {
    info: TecnicoType;
    habilidades: string[];
    horarios: TecnicoHorarioType[],
    certificaciones: string[],
    password: string
}
export type UpdateTecnicoType = {
    info: TecnicoType;
    habilidades: TecnicoHabilidadType[];
    horarios: TecnicoHorarioType[],
    certificaciones: TecnicoCertificacionType[]
}


export type TecnicoConDetallesType = {
    id: number;
    created_at: string; // ISO 8601
    nombre: string;
    apellido: string;
    telefono: string;
    disponible: boolean;
    cargo: string;
    area: string;
    email: string;
    tiempo_experciencia: string;
    direccion: string;
    cant_ordenes_completadas: number;
    calificacion: number;
    estado: string;
    tecnicos_habilidades: TecnicoHabilidadType[];
    tecnicos_horarios: TecnicoHorarioType[];
    tecnicos_certificaciones: TecnicoCertificacionType[];
}



const TECNICO_SERVICES = {
    async GET_ALL_TECNICOS(): Promise<TecnicoType[]> {
        const data: TecnicoType[] = await AxiosGet({ path: '/tecnicos' })
        return data;
    },
    async GET_ALL_DETALLE_TECNICOS(): Promise<TecnicoConDetallesType[]> {
        const data: TecnicoConDetallesType[] = await AxiosGet({ path: '/tecnicos?select=*,tecnicos_habilidades(*), tecnicos_horarios(*), tecnicos_certificaciones(*)' })
        return data;
    },

    async INSERT_TECNICO(InsertTecnicoData: InsertTecnicoType): Promise<{ success: boolean, error: string | null }> {
        //Guardar usuario y contraseña en tabla usuarios

        const user = await SIGNUP_SERVICES.SignUp({
            apellido: InsertTecnicoData.info.apellido,
            nombre: InsertTecnicoData.info.nombre,
            correo: InsertTecnicoData.info.email,
            telefono: InsertTecnicoData.info.telefono,
            role: 'tecnico',
            estado: true,
            taller_id: localStorage.getItem('taller_id') || '',
            rol_id: 6, // Asumiendo que 3 es el ID del rol 'tecnico',
            password: InsertTecnicoData.password
        })
        console.log(user)
        if (user.error) return { success: false, error: user.error }
        const newTecnico: TecnicoType[] = await AxiosPost({ path: '/tecnicos', payload: InsertTecnicoData.info })
        const IdTecnico = newTecnico[0].id;
        const Habilidades: TecnicoHabilidadType[] = InsertTecnicoData.habilidades.map(hab => ({ tecnico_id: IdTecnico, habilidad: hab }))
        const ResHabilidades: TecnicoType[] = await AxiosPost({ path: '/tecnicos_habilidades', payload: Habilidades })
        const horarios: TecnicoHorarioType[] = InsertTecnicoData.horarios.map(h => ({ tecnico_id: IdTecnico, dia: h.dia, horario: h.horario }))
        const ResHorarios: TecnicoType[] = await AxiosPost({ path: '/tecnicos_horarios', payload: horarios })
        const certificaciones: TecnicoCertificacionType[] = InsertTecnicoData.certificaciones.map(c => ({ tecnico_id: IdTecnico, certificacion: c }))
        const ResCertificacion: TecnicoType[] = await AxiosPost({ path: '/tecnicos_certificaciones', payload: certificaciones })
        return { success: true, error: null }
    },
    async UPDATE_TECNICO(UpdateTecnicoData: UpdateTecnicoType) {
        await AxiosPatch({ path: `/tecnicos?id=eq.${UpdateTecnicoData.info.id}`, payload: UpdateTecnicoData.info })
        //eliminamos todas las habilidades que tiene actualmente el tecnico
        await AxiosDelete({ path: `/tecnicos_habilidades?tecnico_id=eq.${UpdateTecnicoData.info.id}` })
        for (let habilidad of UpdateTecnicoData.habilidades) {
            //insertamos las nuevas habilidades
            const ResHabilidades: TecnicoHabilidadType[] = await AxiosPost({ path: `/tecnicos_habilidades`, payload: habilidad })
        }
        //eliminamos todas las certificaciones de ese tecnico
        await AxiosDelete({ path: `/tecnicos_certificaciones?tecnico_id=eq.${UpdateTecnicoData.info.id}` })
        for (let cert of UpdateTecnicoData.certificaciones) {
            // const certificaciones: TecnicoCertificacionType[] = UpdateTecnicoData.certificaciones.map(c => ({ tecnico_id: IdTecnico, certificacion: c }))
            const ResCertificacion: TecnicoCertificacionType[] = await AxiosPost({ path: `/tecnicos_certificaciones`, payload: cert })
            // const ResCertificacion: TecnicoType[] = await AxiosPatch({ path: '/tecnicos_certificaciones', payload: certificaciones })

        }
        return true;
    },
    async UPDATE_HORARIO_TECNICO(horarios: TecnicoHorarioType[]) {
        const update_at = new Date().toISOString()
        for (let horario of horarios) {
            await AxiosPatch({ path: `/tecnicos_horarios?id=eq.${horario.id}`, payload: { ...horario, update_at } })
        }
        return true;
    },
    async DELETE_TECNICO(Id: number) {
        await AxiosDelete({ path: `/tecnicos?id=eq.${Id}` })
        return true;
    }
};

export default TECNICO_SERVICES
