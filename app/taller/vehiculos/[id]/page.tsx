import { DetalleVehiculo } from "@/components/vehiculos/detalle-vehiculo"
import { getVehicleById } from "@/lib/data"

interface Props {
  params: {
    id: string
  }
}

export default async function Page({ params }: Props) {
  const { id } = params
  const vehicle = await getVehicleById(id)

  if (!vehicle) {
    return <div>Vehicle not found</div>
  }

  return (
    <div>
      <DetalleVehiculo vehicle={vehicle} />
    </div>
  )
}
