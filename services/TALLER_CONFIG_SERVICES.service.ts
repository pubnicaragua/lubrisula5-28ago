import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module";  
  
export type TallerConfigType = {  
    id?: string;  
    taller_id?: string;  
    nombre_taller?: string;  
    direccion?: string;  
    telefono?: string;  
    email?: string;  
    horario_apertura?: string;  
    horario_cierre?: string;  
    dias_laborales?: string[];  
    servicios_disponibles?: any;  
    configuracion_general?: any;  
    created_at?: string;  
    updated_at?: string;  
}  
  
const TALLER_CONFIG_SERVICES = {  
    async GET_CONFIGURACION_TALLER(taller_id: string): Promise<TallerConfigType> {  
        const config: TallerConfigType[] = await AxiosGet({   
            path: `/taller_configuracion?taller_id=eq.${taller_id}`   
        });  
        return config[0] || {};  
    },  
  
    async UPDATE_CONFIGURACION_TALLER(config: TallerConfigType): Promise<TallerConfigType> {  
        console.log('UPDATE CONFIGURACION TALLER', config);  
        const res = await AxiosPatch({  
            path: `/taller_configuracion?taller_id=eq.${config.taller_id}`,   
            payload: {  
                nombre_taller: config.nombre_taller,  
                direccion: config.direccion,  
                telefono: config.telefono,  
                email: config.email,  
                horario_apertura: config.horario_apertura,  
                horario_cierre: config.horario_cierre,  
                dias_laborales: config.dias_laborales,  
                servicios_disponibles: config.servicios_disponibles,  
                configuracion_general: config.configuracion_general,  
                updated_at: new Date().toISOString()  
            }  
        });  
        return res[0];  
    },  
  
    async INSERT_CONFIGURACION_TALLER(config: TallerConfigType): Promise<TallerConfigType> {  
        console.log('INSERT CONFIGURACION TALLER', config);  
        const res = await AxiosPost({  
            path: `/taller_configuracion`,   
            payload: config  
        });  
        return res[0];  
    }  
};  
  
export default TALLER_CONFIG_SERVICES;