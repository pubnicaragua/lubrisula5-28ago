import { AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module";

export type HojaIngresoType = {
    vehiculo_id: string;
    fecha: string; // ISO string
    interiores: {
        documentos: { cantidad: string; si: boolean; no: boolean };
        radio: { cantidad: string; si: boolean; no: boolean };
        portafusil: { cantidad: string; si: boolean; no: boolean };
        encendedor: { cantidad: string; si: boolean; no: boolean };
        tapetes_tela: { cantidad: string; si: boolean; no: boolean };
        tapetes_plastico: { cantidad: string; si: boolean; no: boolean };
        medidor_gasolina: { cantidad: string; si: boolean; no: boolean };
        kilometraje: { cantidad: string; si: boolean; no: boolean };
    };
    exteriores: {
        antena: { cantidad: string; si: boolean; no: boolean };
        falanges: { cantidad: string; si: boolean; no: boolean };
        centro_rin: { cantidad: string; si: boolean; no: boolean };
        placas: { cantidad: string; si: boolean; no: boolean };
    };
    coqueta: {
        herramienta: { cantidad: string; si: boolean; no: boolean };
        reflejantes: { cantidad: string; si: boolean; no: boolean };
        cables_corriente: { cantidad: string; si: boolean; no: boolean };
        llanta_refaccion: { cantidad: string; si: boolean; no: boolean };
        llave_cruceta: { cantidad: string; si: boolean; no: boolean };
        gato: { cantidad: string; si: boolean; no: boolean };
        latero: { cantidad: string; si: boolean; no: boolean };
        otro: { cantidad: string; si: boolean; no: boolean };
    };
    motor: {
        bateria: { cantidad: string; si: boolean; no: boolean };
        computadora: { cantidad: string; si: boolean; no: boolean };
        tapones_deposito: { cantidad: string; si: boolean; no: boolean };
    };
    nivel_gasolina: string;
    comentarios: string;
    imagenes_carroceria: string[] | null;
    puntos: {
        x: number;
        y: number;
        id: string;
        descripcion: string;
    }[];
    firmas: {
        firmaCliente: string | null;
        firmaEncargado: string | null;
    }
}
export type HojaIngresoDBType = Omit<HojaIngresoType, "firmas"> & {
    firma_cliente: string | null;
    firma_encargado: string | null;
};
const HOJA_INGRESO_SERVICE = {
    ObtenerInspeccion: async (vehiculoId: string): Promise<HojaIngresoDBType | null> => {
        const data = await AxiosGet({ path: `/hoja_ingreso?vehiculo_id=eq.${vehiculoId}` })
        return data[0] || null;
    },
    guardarInspeccion: async (vehiculoId: string, inspeccionData: HojaIngresoType) => {
        const firma_cliente = inspeccionData.firmas.firmaCliente ? inspeccionData.firmas.firmaCliente : null;
        const firma_encargado = inspeccionData.firmas.firmaEncargado ? inspeccionData.firmas.firmaEncargado : null;
        //validamos si ya existe una inspeccion para ese vehiculo
        delete inspeccionData.firmas;
        const hoja = await HOJA_INGRESO_SERVICE.ObtenerInspeccion(vehiculoId);
        //si existe actualizamos
        if (hoja) {
            const data = await AxiosPatch({ path: `/hoja_ingreso?vehiculo_id=eq.${vehiculoId}`, payload: { ...inspeccionData, firma_cliente, firma_encargado } })
            return data
        }
        //si no existe creamos
        const data = await AxiosPost({ path: '/hoja_ingreso', payload: { ...inspeccionData, firma_cliente, firma_encargado } })
        return data
    },
}

export default HOJA_INGRESO_SERVICE