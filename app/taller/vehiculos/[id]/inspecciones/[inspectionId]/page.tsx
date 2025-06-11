import { getVehicleById } from "@/lib/actions/vehicles"
import { getVehicleInspectionById } from "@/lib/actions/vehicle-inspections"
import { InspeccionVehiculoForm } from "@/components/vehiculos/inspeccion-vehiculo-form"
import { redirect } from "next/navigation"
import {
  defaultInteriorItems,
  defaultExteriorItems,
  defaultEngineItems,
  defaultBodyItems,
} from "@/types/vehicle-inspection"

interface VerInspeccionPageProps {
  params: {
    id: string
    inspectionId: string
  }
}

export default async function VerInspeccionPage({ params }: VerInspeccionPageProps) {
  // Verificar que el vehículo existe
  const vehicleResult = await getVehicleById(params.id)

  if (!vehicleResult.success || !vehicleResult.data) {
    redirect("/taller/vehiculos")
  }

  // Obtener la inspección
  const inspectionResult = await getVehicleInspectionById(params.inspectionId)

  if (!inspectionResult.success || !inspectionResult.data) {
    redirect(`/taller/vehiculos/${params.id}`)
  }

  // Preparar los datos de la inspección
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
      <InspeccionVehiculoForm inspection={inspection} vehicleId={params.id} readOnly={true} />
    </div>
  )
}
