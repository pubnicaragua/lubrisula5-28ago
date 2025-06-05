"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getFlotas() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("flotas")
    .select("*, clientes(nombre)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching flotas:", error)
    return []
  }

  return data
}

export async function getFlotaById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("flotas").select("*, clientes(id, nombre)").eq("id", id).single()

  if (error) {
    console.error(`Error fetching flota with id ${id}:`, error)
    return null
  }

  return data
}

export async function getConductoresByFlotaId(flotaId: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("conductores").select("*").eq("flota_id", flotaId)

  if (error) {
    console.error(`Error fetching conductores for flota ${flotaId}:`, error)
    return []
  }

  return data
}

export async function createFlota(formData: FormData) {
  const supabase = createClient()

  const nombre = formData.get("nombre") as string
  const cliente_id = formData.get("cliente_id") as string
  const descripcion = formData.get("descripcion") as string
  const cantidad_vehiculos = Number.parseInt(formData.get("cantidad_vehiculos") as string) || 0

  const { data, error } = await supabase
    .from("flotas")
    .insert([
      {
        nombre,
        cliente_id,
        descripcion,
        cantidad_vehiculos,
      },
    ])
    .select()

  if (error) {
    console.error("Error creating flota:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/flotas")
  return { success: true, data }
}

export async function updateFlota(id: string, formData: FormData) {
  const supabase = createClient()

  const nombre = formData.get("nombre") as string
  const cliente_id = formData.get("cliente_id") as string
  const descripcion = formData.get("descripcion") as string
  const cantidad_vehiculos = Number.parseInt(formData.get("cantidad_vehiculos") as string) || 0

  const { data, error } = await supabase
    .from("flotas")
    .update({
      nombre,
      cliente_id,
      descripcion,
      cantidad_vehiculos,
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error(`Error updating flota with id ${id}:`, error)
    return { success: false, error: error.message }
  }

  revalidatePath("/flotas")
  revalidatePath(`/flotas/${id}`)
  return { success: true, data }
}

export async function deleteFlota(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("flotas").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting flota with id ${id}:`, error)
    return { success: false, error: error.message }
  }

  revalidatePath("/flotas")
  return { success: true }
}

export async function createConductor(formData: FormData) {
  const supabase = createClient()

  const nombre = formData.get("nombre") as string
  const apellido = formData.get("apellido") as string
  const flota_id = formData.get("flota_id") as string
  const licencia = formData.get("licencia") as string
  const telefono = formData.get("telefono") as string

  const { data, error } = await supabase
    .from("conductores")
    .insert([
      {
        nombre,
        apellido,
        flota_id,
        licencia,
        telefono,
      },
    ])
    .select()

  if (error) {
    console.error("Error creating conductor:", error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/flotas/${flota_id}`)
  return { success: true, data }
}

export async function deleteConductor(id: string, flotaId: string) {
  const supabase = createClient()

  const { error } = await supabase.from("conductores").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting conductor with id ${id}:`, error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/flotas/${flotaId}`)
  return { success: true }
}
