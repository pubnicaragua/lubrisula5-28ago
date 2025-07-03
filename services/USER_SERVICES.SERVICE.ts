import { AxiosDelete, AxiosGet } from "./AxiosServices.module";

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

const USER_SERVICE = {
    async GET_ALL_USERS(): Promise<UserType[]> {
        const UsuariosData: UserType[] = await AxiosGet({ path: '/users_with_roles' })

        console.log('GET_ALL_USERS', UsuariosData);
        return UsuariosData;
    },
    async INSERT_USER(): Promise<UserType[]> {
        const UsuariosData: UserType[] = await AxiosGet({ path: '/usarios' })

        console.log('GET_ALL_USERS', UsuariosData);
        return UsuariosData;
    },
    async DELETE_USER() {
        const res: UserType[] = await AxiosDelete({ path: '/usarios' })
        console.log('DELETE_USER', res);
        return res;
    }
};

export default USER_SERVICE
