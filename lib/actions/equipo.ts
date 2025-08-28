"use server"

import { getSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getMiembrosEquipo() {
  const supabase = getSupabaseServer()

  const { data, error } = await supabase.from("miembros_equipo").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching miembros del equipo:", error)
    return []
  }

  return data
}

export async function getMiembroEquipoById(id: string) {
  const supabase = getSupabaseServer()

  const { data, error } = await supabase.from("miembros_equipo").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching miembro with id ${id}:`, error)
    return null
  }

  return data
}

export async function getHorariosByMiembroId(miembroId: string) {
  const supabase = getSupabaseServer()

  const { data, error } = await supabase
    .from("horarios")
    .select("*")
    .eq("miembro_id", miembroId)
    .order("dia", { ascending: true })

  if (error) {
    console.error(`Error fetching horarios for miembro ${miembroId}:`, error)
    return []
  }

  return data
}

export async function createMiembroEquipo(formData: FormData) {
  const supabase = getSupabaseServer()

  const nombre = formData.get("nombre") as string
  const apellido = formData.get("apellido") as string
  const cargo = formData.get("cargo") as string
  const tipo = formData.get("tipo") as string
  const email = formData.get("email") as string
  const telefono = formData.get("telefono") as string

  const { data, error } = await supabase
    .from("miembros_equipo")
    .insert([
      {
        nombre,
        apellido,
        cargo,
        tipo,
        email,
        telefono,
      },
    ])
    .select()

  if (error) {
    console.error("Error creating miembro del equipo:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/equipo")
  return { success: true, data }
}

export async function updateMiembroEquipo(id: string, formData: FormData) {
  const supabase = getSupabaseServer()

  const nombre = formData.get("nombre") as string
  const apellido = formData.get("apellido") as string
  const cargo = formData.get("cargo") as string
  const tipo = formData.get("tipo") as string
  const email = formData.get("email") as string
  const telefono = formData.get("telefono") as string

  const { data, error } = await supabase
    .from("miembros_equipo")
    .update({
      nombre,
      apellido,
      cargo,
      tipo,
      email,
      telefono,
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error(`Error updating miembro with id ${id}:`, error)
    return { success: false, error: error.message }
  }

  revalidatePath("/equipo")
  revalidatePath(`/equipo/${id}`)
  return { success: true, data }
}

export async function deleteMiembroEquipo(id: string) {
  const supabase = getSupabaseServer()

  const { error } = await supabase.from("miembros_equipo").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting miembro with id ${id}:`, error)
    return { success: false, error: error.message }
  }

  revalidatePath("/equipo")
  return { success: true }
}

export async function createHorario(formData: FormData) {
  const supabase = getSupabaseServer()

  const miembro_id = formData.get("miembro_id") as string
  const dia = formData.get("dia") as string
  const hora_inicio = formData.get("hora_inicio") as string
  const hora_fin = formData.get("hora_fin") as string

  const { data, error } = await supabase
    .from("horarios")
    .insert([
      {
        miembro_id,
        dia,
        hora_inicio,
        hora_fin,
      },
    ])
    .select()

  if (error) {
    console.error("Error creating horario:", error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/equipo/${miembro_id}`)
  return { success: true, data }
}

export async function deleteHorario(id: string, miembroId: string) {
  const supabase = getSupabaseServer()

  const { error } = await supabase.from("horarios").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting horario with id ${id}:`, error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/equipo/${miembroId}`)
  return { success: true }
}
