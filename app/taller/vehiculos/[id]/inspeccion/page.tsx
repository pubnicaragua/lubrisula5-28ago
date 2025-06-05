import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import HojaInspeccion from "@/components/vehiculos/hoja-inspeccion"
import { notFound } from "next/navigation"

export default async function InspeccionVehiculoPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  // Verificar si el vehículo existe
  const { data: vehiculo, error } = await supabase.from("vehiculos").select("*").eq("id", params.id).single()

  if (error || !vehiculo) {
    notFound()
  }

  return <HojaInspeccion vehiculoId={params.id} />
}
