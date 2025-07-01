import { AxiosGet } from "./AxiosServices.module";

export type ClienteType = {
    id?: string;
    user_id?: string | null;
    name?: string;
    company?: string | null;
    phone?: string;
    email?: string;
    client_type?: string;
    created_at?: string;
    updated_at?: string;
    status?: "Activo" | "Inactivo"; // Assuming status is a string, adjust as necessary
};

const CLIENTS_SERVICES = {
    async GET_ALL_CLIENTS(): Promise<ClienteType[]> {
        const UsuariosData: ClienteType[] = await AxiosGet({ path: '/view_clients' })

        console.log('GET_ALL_USERS', UsuariosData);
        return UsuariosData;
    }
};

export default CLIENTS_SERVICES
