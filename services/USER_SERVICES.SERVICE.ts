import { AxiosDelete, AxiosGet, AxiosPatch } from "./AxiosServices.module";

export type UserType = {
    user_auth_id: string;
    user_email: string;
    user_created_at: string;
    perfil_id: string;
    perfil_nombre: string | null;
    perfil_apellido: string | null;
    perfil_correo: string | null;
    perfil_telefono: string | null;
    perfil_estado: string | null;
    perfil_actualizado: string | null;
    role_id: number | null;
    role_name: string | null;
    role_description: string | null;
}
export type UsuarioTallerType = {
    id?: string;
    nombre?: string;
    apellido?: string;
    correo?: string;
    telefono?: string;
    estado?: boolean;
    taller_name?: string;
    taller_id?: string;
    acceso?: boolean;
    created_at?:string;
};


const USER_SERVICE = {
    async GET_ALL_USERS(): Promise<UserType[]> {
        const UsuariosData: UserType[] = await AxiosGet({ path: '/users_with_roles' })
        return UsuariosData;
    },
    async GET_TALLER_ID(user_id: string): Promise<string> {
        const data = await AxiosGet({ path: `/usuarios_taller?user_id=eq.${user_id}` })
        return data[0]?.taller_id;
    },
    async GET_USUARIOS_BY_TALLER_ID(taller_id: string): Promise<UsuarioTallerType[]> {
        const data: UsuarioTallerType[] = await AxiosGet({ path: `/view_usuarios_taller?taller_id=eq.${taller_id}` })
        return data;
    },
    async UPDATE_ACCESO_USER_TALLER(user_id: string, acceso: boolean): Promise<boolean> {
        await AxiosPatch({ path: `/usuarios_taller?user_id=eq.${user_id}`, payload: { acceso } })
        return true;
    },
    async INSERT_USER(): Promise<UserType[]> {
        const UsuariosData: UserType[] = await AxiosGet({ path: '/usarios' })
        return UsuariosData;
    },
    async DELETE_USER() {
        const res: UserType[] = await AxiosDelete({ path: '/usarios' })
        return res;
    }
};

export default USER_SERVICE
