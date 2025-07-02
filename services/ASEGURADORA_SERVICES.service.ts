import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module";


export type AseguradoraType = {
    id?: number;
    created_at?: string;
    nombre?: string;
    correo?: string;
    telefono?: string;
    estado_tributario?: string;
    nivel_tarifa?: string;
    cliente_id?: number | null;
    flota_id?: number | null;
    clientes?: any | null;
    flotas?: any
}// Assuming status is a string, adjust as necessary

const ASEGURADORA_SERVICE = {
    async GET_ASEGURADORAS(): Promise<AseguradoraType[]> {
        const aseguradoras: AseguradoraType[] = await AxiosGet({ path: '/aseguradoras' })
        return aseguradoras;
    },
    async INSERT_ASEGURADORA(aseguradora: AseguradoraType) {
        console.log('UPDATE ASEGURADORA', aseguradora);

        const res = await AxiosPost({
            path: `/aseguradoras`, payload: {
                nombre: aseguradora.nombre,
                correo: aseguradora.correo,
                telefono: aseguradora.telefono,
                estado_tributario: aseguradora.estado_tributario,
                nivel_tarifa: aseguradora.nivel_tarifa
            }
        },)
        console.log('INSERT ASEGURADORA', res);
        return res;
    },
    async UPDATE_ASEGURADORA(aseguradora: AseguradoraType) {
        console.log('UPDATE ASEGURADORA', aseguradora);

        const res = await AxiosPatch({
            path: `/aseguradoras?id=eq.${aseguradora.id}`, payload: {
                nombre: aseguradora.nombre,
                correo: aseguradora.correo,
                telefono: aseguradora.telefono,
                estado_tributario: aseguradora.estado_tributario,
                nivel_tarifa: aseguradora.nivel_tarifa
            }
        },)
        return res[0];
    },
    async DELETE_ASEGURADORA(id: number) {
        console.log('DELETE ASEGURADORA', id);
        const res = await AxiosDelete({
            path: `/aseguradoras?id=eq.${id}`, payload: {}
        })
        return res[0];
    }
};

export default ASEGURADORA_SERVICE
