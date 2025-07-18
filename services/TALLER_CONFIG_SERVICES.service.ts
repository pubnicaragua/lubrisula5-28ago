import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module";
import { TallerType } from "./TALLER_SERVICES.SERVICE";

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
    async GET_CONFIGURACION_TALLER(taller_id: string): Promise<TallerType> {
        const taller: TallerType[] = await AxiosGet({
            path: `/talleres?id=eq.${taller_id}`
        });
        return taller[0];
    },

    async UPDATE_CONFIGURACION_TALLER(config: TallerType): Promise<TallerType> {
        console.log('UPDATE CONFIGURACION TALLER', config);
        const res = await AxiosPatch({
            path: `/talleres?id=eq.${config.id}`,
            payload: config
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