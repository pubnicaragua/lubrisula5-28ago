import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module";

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
        return UsuariosData;
    },
    async GET_CLIENTS_BY_ID(Id:string): Promise<ClienteType> {
        const UsuariosData: ClienteType[] = await AxiosGet({ path: `/view_clients?id=eq.${Id}` })
        return UsuariosData[0];
    },
    async ADD_NEW_CLIENTE(cliente: ClienteType): Promise<ClienteType[]> {
        const name = `${cliente.name}`;
        const res: ClienteType[] = await AxiosPost({ path: '/clients', payload: cliente });
        return res
    },
    async UPDATE_CLIENTE(cliente: ClienteType): Promise<ClienteType[]> {
        const clientId = cliente.id;
        delete cliente.id; // Remove id from payload to avoid conflict
        delete cliente.status; // Remove status if not needed in update

        const res: ClienteType[] = await AxiosPatch({ path: `/clients?id=eq.${clientId}`, payload: cliente })

        return res;
    },
    async DELETE_CLIENTE(id: string) {
        const res = await AxiosDelete({ path: `/clients?id=eq.${id}` })

        return res;
    }
};

export default CLIENTS_SERVICES
