import { AxiosGet } from "./AxiosServices";
type UserProfile = {
    auth_id?: number,
    nombre?: string,
    apellido?: string,
    telefono?: string
};
type UserRole = {
    id?: number;
    nombre?: string;
};
export type UserType = {
    id: string;
    created_at: string;
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string;
    estado: string | null;
    actualizado: string;
    auth_id: string;
    last_sign_in_at: string,
    is_active: boolean,
    profile?: UserProfile,
    role?: UserRole
};

const USER_SERVICE = {
    async GET_ALL_USERS(): Promise<UserType[]> {
        const res: UserType[] = await AxiosGet({ path: '/perfil_usuario' })
        console.log('GET_ALL_USERS', res);
        return res;
    },
    async getUserById(userId: string) {
        const res = await AxiosGet({ path: '/users' })
        return res;
    },

    async updateUser(userId: string, updates: Record<string, any>) {
        return 1
    },

    async deleteUser(userId: string) {
        return 1
    },
};

export default USER_SERVICE
