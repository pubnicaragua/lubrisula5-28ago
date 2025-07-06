import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module";


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
}


export type InsertTecnicoType = {
    info: TecnicoType;
    habilidades: string[];
    horarios: TecnicoHorarioType[],
    certificaciones: string[]
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

    async INSERT_TECNICO(InsertTecnicoData: InsertTecnicoType) {
        console.log(InsertTecnicoData)
        const newTecnico: TecnicoType[] = await AxiosPost({ path: '/tecnicos', payload: InsertTecnicoData.info })
        const IdTecnico = newTecnico[0].id;
        console.log(IdTecnico)
        const Habilidades: TecnicoHabilidadType[] = InsertTecnicoData.habilidades.map(hab => ({ tecnico_id: IdTecnico, habilidad: hab }))
        console.log(Habilidades)
        const ResHabilidades: TecnicoType[] = await AxiosPost({ path: '/tecnicos_habilidades', payload: Habilidades })
        console.log(ResHabilidades)
        const horarios: TecnicoHorarioType[] = InsertTecnicoData.horarios.map(h => ({ tecnico_id: IdTecnico, dia: h.dia, horario: h.horario }))
        console.log(horarios)
        const ResHorarios: TecnicoType[] = await AxiosPost({ path: '/tecnicos_horarios', payload: horarios })
        console.log(ResHorarios)
        const certificaciones: TecnicoCertificacionType[] = InsertTecnicoData.certificaciones.map(c => ({ tecnico_id: IdTecnico, certificacion: c }))
        const ResCertificacion: TecnicoType[] = await AxiosPost({ path: '/tecnicos_certificaciones', payload: certificaciones })
        console.log(ResCertificacion)
        return true;
    },
    // async UPDATE_VEHICULO(vehicle: VehiculoType): Promise<VehiculoType[]> {
    //     const Id_Vehiculo = vehicle.id; // Use vehicle.id if available, otherwise use Id
    //     delete vehicle.id; // Remove id from payload if it's not needed for update
    //     delete vehicle.client_name; 
    //     console.log(vehicle)
    //     const res: VehiculoType[] = await AxiosPatch({ path: `/vehicles?id=eq.${Id_Vehiculo}`, payload: vehicle })
    //     return res;
    // },
    // async DELETE_VEHICULO(Id: string): Promise<VehiculoType[]> {
    //     const res: VehiculoType[] = await AxiosDelete({ path: `/vehicles?id=eq.${Id}` })
    //     return res;
    // }
};

export default TECNICO_SERVICES
