import { getVehicleById } from "@/lib/actions/vehicles"
import { createVehicleInspection } from "@/lib/actions/vehicle-inspections"
import { InspeccionVehiculoForm } from "@/components/vehiculos/inspeccion-vehiculo-form"
import { redirect } from "next/navigation"
import {
  defaultInteriorItems,
  defaultExteriorItems,
  defaultEngineItems,
  defaultBodyItems,
} from "@/types/vehicle-inspection"

interface NuevaInspeccionPageProps {
  params: {
    id: string
  }
}

export default async function NuevaInspeccionPage({ params }: NuevaInspeccionPageProps) {
  // Verificar que el vehículo existe
  const vehicleResult = await getVehicleById(params.id)

  if (!vehicleResult.success || !vehicleResult.data) {
    redirect("/taller/vehiculos")
  }

  // Crear una nueva inspección
  const inspectionResult = await createVehicleInspection(params.id)

  if (!inspectionResult.success || !inspectionResult.data) {
    redirect(`/taller/vehiculos/${params.id}`)
  }

  // Preparar los datos iniciales de la inspección
  const inspection = {
    ...inspectionResult.data,
    interior_items: inspectionResult.data.interior_items || defaultInteriorItems,
    exterior_items: inspectionResult.data.exterior_items || defaultExteriorItems,
    engine_items: inspectionResult.data.engine_items || defaultEngineItems,
    body_items: inspectionResult.data.body_items || defaultBodyItems,
    fuel_level: inspectionResult.data.fuel_level || { level: 0 },
    images: inspectionResult.data.images || [],
  }

  return (
    <div className="container mx-auto py-6">
      <InspeccionVehiculoForm inspection={inspection} vehicleId={params.id} />
    </div>
  )
}
