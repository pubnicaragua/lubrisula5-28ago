import { AxiosGet, AxiosPatch } from "./AxiosServices.module";

export type AseguradoraType = {
    id: number
    nombre: string | null
    corrreo: string | null
    telefono: string | null
    estado_tributario: string | null
    nivel_tarifa: string | null
}// Assuming status is a string, adjust as necessary

const ASEGURADORA_SERVICE = {
    async GET_ASEGURADORAS(): Promise<AseguradoraType[]> {
        const UsuariosData: AseguradoraType[] = await AxiosGet({ path: '/view_clients' })

        console.log('GET_ALL_USERS', UsuariosData);
        return UsuariosData;
    },
    async UPDATE_ASEGURADORA(aseguradora: AseguradoraType) {
        console.log('UPDATE ASEGURADORA', aseguradora);

        const res = await AxiosPatch({
            path: `/aseguradoras?id=eq.${aseguradora.id}`, payload: {
                nombre: aseguradora.nombre,
                correo: aseguradora.corrreo,
                telefono: aseguradora.telefono,
                estado_tributario: aseguradora.estado_tributario,
                nivel_tarifa: aseguradora.nivel_tarifa
            }
        },)
        console.log('UPDATE ASEGURADORA', res);
        return res[0];
    }
};

export default ASEGURADORA_SERVICE
