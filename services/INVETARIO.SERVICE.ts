
import { AxiosDelete, AxiosGet } from "./AxiosServices.module";

export type CategoriaMaterialType = {
    id: string;
    nombre: string;
    descripcion: string;
    categoria_padre_id: string | null;
    created_at: string;
}
export type ProveedorType = {
    id: string;
    name: string;
    contact_name: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
    created_at: string;
    updated_at: string;
}

export type InventarioType = {
    id: number;
    created_at: string;
    codigo: string;
    nombre: string;
    descripcion: string;
    categoria_id: string;
    estado: string;
    precio_compra: number;
    precio_venta: number;
    stock_actual: number;
    stock_minimo: number;
    proveedor_id: string;
    ubicacion_almacen: string;
    fecha_ingreso: string;
    categorias_materiales: CategoriaMaterialType;
    suppliers: ProveedorType;
}
const INVENTARIO_SERVICES = {
    async GET_INVENTARIO(): Promise<InventarioType[]> {
        const data: InventarioType[] = await AxiosGet({ path: '/inventario_test?select=*,categorias_materiales(*),suppliers(*)' })

        return data;
    },
    async GET_CATEGORIA_MATERIALES(): Promise<CategoriaMaterialType[]> {
        const data: CategoriaMaterialType[] = await AxiosGet({ path: '/categorias_materiales' })

        return data;
    },
    async GET_PROVEEDORES(): Promise<ProveedorType[]> {
        const data: ProveedorType[] = await AxiosGet({ path: '/suppliers' })

        return data;
    },
};

export default INVENTARIO_SERVICES
