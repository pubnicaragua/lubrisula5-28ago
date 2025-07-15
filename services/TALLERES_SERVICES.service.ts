import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module";  
  
export type TallerType = {  
    id?: string;  
    nombre?: string;  
    direccion?: string;  
    telefono?: string;  
    email?: string;  
    created_at?: string;  
}  
  
const TALLERES_SERVICES = {  
    async GET_ALL_TALLERES(): Promise<TallerType[]> {  
        const talleres: TallerType[] = await AxiosGet({ path: '/talleres' })  
        return talleres;  
    },  
  
    async GET_TALLER_BY_ID(id: string): Promise<TallerType> {  
        const taller: TallerType[] = await AxiosGet({ path: `/talleres?id=eq.${id}` })  
        return taller[0];  
    },  
  
    async INSERT_TALLER(taller: TallerType): Promise<TallerType> {  
        const res = await AxiosPost({ path: '/talleres', payload: taller })  
        return res[0];  
    },  
  
    async UPDATE_TALLER(taller: TallerType): Promise<TallerType> {  
        const res = await AxiosPatch({   
            path: `/talleres?id=eq.${taller.id}`,   
            payload: taller   
        })  
        return res[0];  
    },  
  
    async DELETE_TALLER(id: string): Promise<any> {  
        const res = await AxiosDelete({ path: `/talleres?id=eq.${id}` })  
        return res[0];  
    }  
};  
  
export default TALLERES_SERVICES;