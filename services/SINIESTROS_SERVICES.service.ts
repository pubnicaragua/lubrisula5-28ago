import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module";  
  
export type SiniestroType = {
  id?: number;
  created_at?: string;
  descripcion?: string;
  nivel_daño?: number;
  aseguradora_id?: number;
  cliente_id?: string;
  vehiculo_id?: string;
  numero_siniestro?: string;
  fecha_siniestro?: string | null;
  estado?: string;
  monto_estimado?: number;
  aseguradoras?: {
    id?: number;
    correo?: string;
    nombre?: string;
    flota_id?: string | null;
    telefono?: string;
    cliente_id?: string | null;
    created_at?: string;
    nivel_tarifa?: string;
    estado_tributario?: string;
  };
  clientes?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    user_id?: string | null;
    created_at?: string;
    updated_at?: string;
    client_type?: string;
  };
  vehiculos?: {
    id?: string;
    ano?: number;
    vin?: string;
    color?: string;
    marca?: string;
    placa?: string;
    estado?: string;
    modelo?: string;
    client_id?: string;
    created_at?: string;
    updated_at?: string;
    kilometraje?: number;
  };
};

  
const SINIESTROS_SERVICES = {  
    async GET_SINIESTROS(): Promise<SiniestroType[]> {  
        const siniestros: SiniestroType[] = await AxiosGet({   
            path: '/siniestros?select=*,aseguradoras(*),clientes:cliente_id(*),vehiculos:vehiculo_id(*)'   
        });  
        return siniestros;  
    },  
  
    async GET_SINIESTROS_BY_ASEGURADORA(aseguradora_id: string): Promise<SiniestroType[]> {  
        const siniestros: SiniestroType[] = await AxiosGet({   
            path: `/siniestros?aseguradora_id=eq.${aseguradora_id}&select=*,clientes:cliente_id(*),vehiculos:vehiculo_id(*)`   
        });  
        return siniestros;  
    },  
  
    async GET_SINIESTRO_BY_ID(id: string): Promise<SiniestroType> {  
        const siniestro: SiniestroType[] = await AxiosGet({   
            path: `/siniestros?id=eq.${id}&select=*,aseguradoras(*),clientes:cliente_id(*),vehiculos:vehiculo_id(*)`   
        });  
        return siniestro[0];  
    },  
  
    async INSERT_SINIESTRO(siniestro: SiniestroType): Promise<SiniestroType> {  
        console.log('INSERT SINIESTRO', siniestro);  
        const res = await AxiosPost({  
            path: `/siniestros`,   
            payload: {  
                aseguradora_id: siniestro.aseguradora_id,  
                cliente_id: siniestro.cliente_id,  
                vehiculo_id: siniestro.vehiculo_id,  
                numero_siniestro: siniestro.numero_siniestro,  
                fecha_siniestro: siniestro.fecha_siniestro,  
                descripcion: siniestro.descripcion,  
                estado: siniestro.estado || 'reportado',  
                monto_estimado: siniestro.monto_estimado  
            }  
        });  
        console.log('INSERT SINIESTRO RESULT', res);  
        return res[0];  
    },  
  
    async UPDATE_SINIESTRO(siniestro: SiniestroType): Promise<SiniestroType> {  
        console.log('UPDATE SINIESTRO', siniestro);  
        const res = await AxiosPatch({  
            path: `/siniestros?id=eq.${siniestro.id}`,   
            payload: {  
                aseguradora_id: siniestro.aseguradora_id,  
                cliente_id: siniestro.cliente_id,  
                vehiculo_id: siniestro.vehiculo_id,  
                numero_siniestro: siniestro.numero_siniestro,  
                fecha_siniestro: siniestro.fecha_siniestro,  
                descripcion: siniestro.descripcion,  
                estado: siniestro.estado,  
                monto_estimado: siniestro.monto_estimado  
            }  
        });  
        return res[0];  
    },  
  
    async DELETE_SINIESTRO(id: number): Promise<any> {  
        console.log('DELETE SINIESTRO', id);  
        const res = await AxiosDelete({  
            path: `/siniestros?id=eq.${id}`,   
            payload: {}  
        });  
        return res[0];  
    },  
  
    async UPDATE_ESTADO_SINIESTRO(id: string, estado: string): Promise<SiniestroType> {  
        const res = await AxiosPatch({  
            path: `/siniestros?id=eq.${id}`,   
            payload: { estado }  
        });  
        return res[0];  
    }  
};  
  
export default SINIESTROS_SERVICES;