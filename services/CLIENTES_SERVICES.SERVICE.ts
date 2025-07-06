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
        console.log(Id)
        const UsuariosData: ClienteType[] = await AxiosGet({ path: `/view_clients?id=eq.${Id}` })
        console.log(UsuariosData)
        return UsuariosData[0];
    },
    async ADD_NEW_CLIENTE(cliente: ClienteType): Promise<ClienteType[]> {
        console.log('ADD_NEW_CLIENTE', cliente);
        const name = `${cliente.name}`;
        const res: ClienteType[] = await AxiosPost({ path: '/clients', payload: cliente });
        return res
    },
    async UPDATE_CLIENTE(cliente: ClienteType): Promise<ClienteType[]> {
        console.log('UPDATE_CLIENTE', cliente);
        const clientId = cliente.id;
        delete cliente.id; // Remove id from payload to avoid conflict
        delete cliente.status; // Remove status if not needed in update
        console.log('CARGA SIN ID y status', cliente);

        const res: ClienteType[] = await AxiosPatch({ path: `/clients?id=eq.${clientId}`, payload: cliente })

        console.log('UPDATE_CLIENTE', res);
        return res;
    },
    async DELETE_CLIENTE(id: string) {
        console.log('DELETE_CLIENTE', id);
        const res = await AxiosDelete({ path: `/clients?id=eq.${id}` })

        console.log('DELETE_CLIENTE', res);
        return res;
    }
};

export default CLIENTS_SERVICES
