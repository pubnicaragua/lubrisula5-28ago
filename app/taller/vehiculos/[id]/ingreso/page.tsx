import { HojaIngreso } from "@/components/vehiculos/hoja-ingreso"

interface HojaIngresoPageProps {
  params: {
    id: string
  }
}

export default function HojaIngresoPage({ params }: HojaIngresoPageProps) {
  return <HojaIngreso vehiculoId={params.id} />
}
