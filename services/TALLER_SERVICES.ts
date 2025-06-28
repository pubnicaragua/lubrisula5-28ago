import { AxiosGet } from "./AxiosServices";
// type UserProfile = {
//     auth_id?: number,
//     nombre?: string,
//     apellido?: string,
//     telefono?: string
// };
// type UserRole = {
//     id?: number;
//     nombre?: string;
// };
// export type UserType = {
//     id: string;
//     created_at: string;
//     nombre: string;
//     apellido: string;
//     correo: string;
//     telefono: string;
//     estado: string | null;
//     actualizado: string;
//     auth_id: string;
//     last_sign_in_at: string,
//     is_active: boolean,
//     profile?: UserProfile,
//     role?: UserRole
// };
export type TallerType = {
    id: string;
    nombre: string;
    direccion: string;
    telefono: string;
    gerente_id: string;
};

const TALLER_SERVICES = {
    async GET_ALL_TALLERES(): Promise<TallerType[]> {
        const TalleresData: TallerType[] = await AxiosGet({ path: '/talleres' })

        console.log('GET ALL TALLERES', TalleresData);
        return TalleresData;
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

export default TALLER_SERVICES
