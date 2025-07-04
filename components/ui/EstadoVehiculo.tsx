import { Badge } from "./badge"

export default function EstadoVehiculoComponent({ estado }: { estado: string }) {
    const colors = {
        Activo: "bg-green-500 hover:bg-green-600",
        "En Servicio": "bg-blue-500 hover:bg-blue-600",
        Entregado: "bg-purple-500 hover:bg-purple-600",
        Inactivo: "bg-gray-500 hover:bg-gray-600",
    }
    return <Badge className={colors[estado]}>{estado}</Badge>
}