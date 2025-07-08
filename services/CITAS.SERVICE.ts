import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module"

type Client = {
    id: string
    name: string
    email: string
    phone: string
    company: string
    user_id: string | null
    created_at: string
    updated_at: string
    client_type: string
}

type Tecnico = {
    id: number
    area: string
    cargo: string
    email: string
    estado: string
    nombre: string
    apellido: string
    telefono: string
    direccion: string
    created_at: string
    disponible: boolean
    calificacion: number
    tiempo_experciencia: string
    cant_ordenes_completadas: number
}

type Vehicle = {
    id: string
    ano: number
    vin: string
    color: string
    marca: string
    placa: string
    estado: string
    modelo: string
    client_id: string
    created_at: string
    updated_at: string
    kilometraje: number
}

type TipoOperacion = {
    id: string
    codigo: string
    nombre: string
    created_at: string
    updated_at: string
    descripcion: string
}

export type CitasDetalleType = {
    id?: string;
    vehiculo_id?: string;
    fecha?: string; // "YYYY-MM-DD"
    hora_inicio?: string; // "HH:mm:ss"
    hora_fin?: string; // "HH:mm:ss"
    tipo_servicio_id?: string;
    estado?: string;
    created_at?: string;
    updated_at?: string;
    client_id?: string;
    tecnico_id?: number;
    clients?: Client;
    tecnicos?: Tecnico;
    vehicles?: Vehicle;
    tipos_operacion?: TipoOperacion;
    nota?: string
};

export type CitaType = Omit<CitasDetalleType, 'vehicles' | 'tipos_operacion' | 'clients' | 'tecnicos'>


const CITAS_SERVICES = {
    async GET_ALL_CITAS(): Promise<CitasDetalleType[]> {
        const CitasData: CitasDetalleType[] = await AxiosGet({ path: '/citas?select=*,clients(*), tecnicos(*), vehicles(*), tipos_operacion(*)' })
        console.log('GET_CITAS', CitasData);
        return CitasData;
    },
    async GET_CITA_BY_ID(Id: string): Promise<CitasDetalleType> {
        const CitasData: CitasDetalleType[] = await AxiosGet({ path: `/citas?id=eq.${Id}` })
        return CitasData[0];
    },
    async INSERT_CITA(Data: Omit<CitaType, 'id' | 'updated_at'>): Promise<CitaType> {
        const res: CitaType[] = await AxiosPost({ path: '/citas', payload: Data })
        return res[0]
    },
    async UPDATE_CITA(Data: CitaType): Promise<CitaType> {
        const res: CitaType[] = await AxiosPatch({ path: `/citas?id=eq.${Data.id}`, payload: Data })
        return res[0]
    },
    async CONFIRMAR_CITA(cita_id: string): Promise<CitaType> {
        const res: CitaType[] = await AxiosPatch({ path: `/citas?id=eq.${cita_id}`, payload: {estado:'Confirmada'} })
        return res[0]
    },
    async DELETE_CITA(cita_id: string) {
        await AxiosDelete({ path: `/citas?id=eq.${cita_id}` })
        return true;
    }
};

export default CITAS_SERVICES

