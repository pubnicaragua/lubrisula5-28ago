import { getSupabaseClient } from "@/lib/supabase/client";
import { AxiosPost } from "./AxiosServices.module";

export interface PerfilUsuario {
    id: number;                 // bigint, primary key
    created_at: string;         // timestamp with time zone
    nombre?: string;            // text, nullable
    apellido?: string;          // text, nullable
    correo?: string;            // text, nullable
    telefono?: string;          // text, nullable
    estado?: boolean;           // boolean, nullable
    actualizado?: string;       // timestamp with time zone, nullable
    auth_id?: string;           // uuid, nullable
    user_id?: string;           // uuid, nullable
    role?: string;              // text, nullable (valor por defecto 'client')
    taller_id?: string;         // uuid, nullable
    rol_id?: number;           // number, nullable
}
export interface SingUpType {
    nombre?: string;            // text, nullable
    apellido?: string;          // text, nullable
    correo?: string;            // text, nullable
    telefono?: string;          // text, nullable
    estado?: boolean;           // boolean, nullable
    actualizado?: string;       // timestamp with time zone, nullable
    auth_id?: string;           // uuid, nullable
    taller_id?: string;         // uuid, nullable
    user_id?: string;           // uuid, nullable
    role?: string;              // text, nullable (valor por defecto 'client')
    rol_id?: number;
    password: string;           // number, nullable
}

const SIGNUP_SERVICES = {
    guardarPerfil: async (perfil: Omit<PerfilUsuario, 'id' | 'created_at' | 'actualizado' | 'auth_id' | 'user_id'>): Promise<PerfilUsuario> => {
        console.log(perfil)
        const user = await AxiosPost({ path: '/perfil_usuario', payload: perfil });
        console.log(user)
        return user[0];
    },
    SignUp: async (perfil: Omit<SingUpType, 'id' | 'created_at' | 'actualizado' | 'auth_id' | 'user_id'>): Promise<{ success: boolean, data: PerfilUsuario, error: string }> => {
        try {
            const { data, error: ErrorSignUp } = await getSupabaseClient().auth.signUp({
                email: perfil.correo || '',
                password: perfil.password,
                options: {

                    data: { role: perfil.role } // metadata opcional
                },
            })
            if (ErrorSignUp) throw new Error(ErrorSignUp.message);
            console.log(data)
            console.log(perfil)
            delete perfil.password
            const user = await AxiosPost({ path: '/perfil_usuario', payload: { ...perfil, auth_id: data.user.id } });
            console.log(user)
            return { success: true, data: user[0], error: null };
        } catch (error) {
            console.error("Error en SignUp:", error);
            return { success: false, data: null, error: error.message }
        }
    },
}

export default SIGNUP_SERVICES