import HojaIngreso from "@/components/vehiculos/hoja-ingreso"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Hoja de Ingreso | AUTOFLOWX",
    description: "Registro de ingreso de vehículo al taller",
}

interface PageProps {
    params: {
        id: string
    }
}

export default function HojaIngresoPage({ params }: PageProps) {
    return (
        <div className="container mx-auto py-6">
            <HojaIngreso vehiculoId={params.id} />
        </div>
    )
}