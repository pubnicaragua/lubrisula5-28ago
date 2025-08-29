import { getSupabaseAdmin } from "@/lib/supabase/client";
import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module";
import SIGNUP_SERVICES from "./SIGNUP_SERVICE.service";

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
    taller_id?: string;
    activo?: boolean;
    status?: "Activo" | "Inactivo"; // Assuming status is a string, adjust as necessary,
    password: string
};

const CLIENTS_SERVICES = {
    async GET_ALL_CLIENTS(): Promise<ClienteType[]> {
        const taller_id = localStorage.getItem("taller_id") || "";
        const UsuariosData: ClienteType[] = await AxiosGet({ path: `/view_clients?taller_id=eq.${taller_id}` })
        return UsuariosData;
    },
    async GET_CLIENTS_BY_ID(Id: string): Promise<ClienteType> {
        const UsuariosData: ClienteType[] = await AxiosGet({ path: `/view_clients?id=eq.${Id}` })
        return UsuariosData[0];
    },
    async ADD_NEW_CLIENTE(cliente: ClienteType): Promise<{ success: boolean; data: ClienteType[]; error?: string | null }> {
        const user = await SIGNUP_SERVICES.SignUp({
            correo: cliente.email || '',
            password: cliente.password, // Default password, should be changed later
            role: 'cliente',
            nombre: cliente.name || '',
            apellido: '',
            estado: true,
            rol_id: 5,
            taller_id: localStorage.getItem('taller_id') || '',
            telefono: cliente.phone || ''
        })
        if (user.error) return { success: false, data: [], error: user.error };
        console.log(cliente)
        delete cliente.password; // Remove password before sending to clients table
        const res: ClienteType[] = await AxiosPost({ path: '/clients', payload: { ...cliente, user_id: user.data.auth_id, taller_id: localStorage.getItem('taller_id') } });
        return { success: true, data: res, error: null };
    },
    async UPDATE_CLIENTE(cliente: ClienteType): Promise<ClienteType[]> {
        const clientId = cliente.id;
        delete cliente.id; // Remove id from payload to avoid conflict
        delete cliente.status; // Remove status if not needed in update
        delete cliente?.password

        const res: ClienteType[] = await AxiosPatch({ path: `/clients?id=eq.${clientId}`, payload: cliente })

        return res;
    },
    async DELETE_CLIENTE(id: string) {
        console.log(id)
        const res = await AxiosGet({ path: `/clients?id=eq.${id}` })
        console.log(res)
        const { data, error } = await getSupabaseAdmin().auth.admin.deleteUser(res[0].user_id || '');
        if (error) console.log(error)
        // const res = await AxiosDelete({ path: `/perfil_usuario?id=eq.${id}` })

        return res;
    }
};

export default CLIENTS_SERVICES
