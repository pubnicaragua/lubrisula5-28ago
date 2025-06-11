import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "./supabase/database.types"

export async function getVehicleById(id: string) {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: vehicle, error } = await supabase
    .from("vehiculos")
    .select(
      `
      *,
      cliente:cliente_id(*)
    `,
    )
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching vehicle:", error)
    return null
  }
  return vehicle
}
