import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module";  
  
export type EmpleadoPermisoType = {  
    id?: string;  
    user_id?: string;  
    taller_id?: string;  
    rol?: string;  
    permisos?: any;  
    activo?: boolean;  
    created_at?: string;  
    updated_at?: string;  
    // Relaciones  
    usuario?: any;  
}  
  
const ACCESOS_SERVICES = {  
    async GET_EMPLEADOS_TALLER(taller_id: string): Promise<EmpleadoPermisoType[]> {  
        const empleados: EmpleadoPermisoType[] = await AxiosGet({   
            path: `/empleado_permisos?taller_id=eq.${taller_id}&select=*,usuario:user_id(*)`   
        });  
        return empleados;  
    },  
  
    async GET_PERMISOS_USUARIO(user_id: string, taller_id: string): Promise<EmpleadoPermisoType> {  
        const permisos: EmpleadoPermisoType[] = await AxiosGet({   
            path: `/empleado_permisos?user_id=eq.${user_id}&taller_id=eq.${taller_id}`   
        });  
        return permisos[0];  
    },  
  
    async ASIGNAR_PERMISOS(permiso: EmpleadoPermisoType): Promise<EmpleadoPermisoType> {  
        console.log('ASIGNAR PERMISOS', permiso);  
        const res = await AxiosPost({  
            path: `/empleado_permisos`,   
            payload: {  
                user_id: permiso.user_id,  
                taller_id: permiso.taller_id,  
                rol: permiso.rol,  
                permisos: permiso.permisos,  
                activo: permiso.activo || true  
            }  
        });  
        return res[0];  
    },  
  
    async UPDATE_PERMISOS(permiso: EmpleadoPermisoType): Promise<EmpleadoPermisoType> {  
        console.log('UPDATE PERMISOS', permiso);  
        const res = await AxiosPatch({  
            path: `/empleado_permisos?id=eq.${permiso.id}`,   
            payload: {  
                rol: permiso.rol,  
                permisos: permiso.permisos,  
                activo: permiso.activo,  
                updated_at: new Date().toISOString()  
            }  
        });  
        return res[0];  
    },  
  
    async DESACTIVAR_EMPLEADO(id: string): Promise<EmpleadoPermisoType> {  
        const res = await AxiosPatch({  
            path: `/empleado_permisos?id=eq.${id}`,   
            payload: { activo: false }  
        });  
        return res[0];  
    }  
};  
  
export default ACCESOS_SERVICES;