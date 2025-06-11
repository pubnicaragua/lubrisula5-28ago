import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { HojaInspeccionExacta } from "@/components/vehiculos/hoja-inspeccion-exacta"
import { notFound } from "next/navigation"

export default async function InspeccionExactaVehiculoPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  // Verificar si el vehículo existe
  const { data: vehiculo, error } = await supabase.from("vehiculos").select("*").eq("id", params.id).single()

  if (error || !vehiculo) {
    notFound()
  }

  return <HojaInspeccionExacta vehiculoId={params.id} />
}
