"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getAseguradoras() {
  const supabaseClient = createServerSupabaseClient()

  try {
    const { data, error } = await supabaseClient
      .from("aseguradoras")
      .select(`
        *,
        clientes:cliente_id(*),
        flotas:flota_id(*)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error al obtener aseguradoras:", error.message)
      throw new Error(error.message)
    }

    return data || []
  } catch (error) {
    console.error("Error al obtener aseguradoras:", error)
    throw error
  }
}

export async function getAseguradoraById(id: number) {
  const supabaseClient = createServerSupabaseClient()

  try {
    const { data, error } = await supabaseClient
      .from("aseguradoras")
      .select(`
        *,
        clientes:cliente_id(*),
        flotas:flota_id(*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error(`Error al obtener aseguradora con ID ${id}:`, error.message)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error(`Error al obtener aseguradora con ID ${id}:`, error)
    throw error
  }
}

interface AseguradoraData {
  nombre: string
  corrreo?: string
  telefono?: string
  estado_tributario?: string
  nivel_tarifa?: string
}

export async function crearAseguradora(data: AseguradoraData) {
  const supabaseClient = createServerSupabaseClient()

  try {
    const { data: newAseguradora, error } = await supabaseClient.from("aseguradoras").insert([data]).select()

    if (error) {
      console.error("Error al crear aseguradora:", error.message)
      throw new Error(error.message)
    }

    revalidatePath("/admin/aseguradoras")
    return newAseguradora[0]
  } catch (error) {
    console.error("Error al crear aseguradora:", error)
    throw error
  }
}

export async function actualizarAseguradora(id: number, data: AseguradoraData) {
  const supabaseClient = createServerSupabaseClient()

  try {
    const { data: updatedAseguradora, error } = await supabaseClient
      .from("aseguradoras")
      .update(data)
      .eq("id", id)
      .select()

    if (error) {
      console.error(`Error al actualizar aseguradora con ID ${id}:`, error.message)
      throw new Error(error.message)
    }

    revalidatePath("/admin/aseguradoras")
    return updatedAseguradora[0]
  } catch (error) {
    console.error(`Error al actualizar aseguradora con ID ${id}:`, error)
    throw error
  }
}

export async function eliminarAseguradora(id: number) {
  const supabaseClient = createServerSupabaseClient()

  try {
    // Verificar si hay clientes o siniestros asociados a esta aseguradora
    const { data: clientes } = await supabaseClient.from("clientes").select("id").eq("aseguradora_id", id)

    if (clientes && clientes.length > 0) {
      throw new Error("No se puede eliminar la aseguradora porque tiene clientes asociados")
    }

    const { data: siniestros } = await supabaseClient.from("siniestros").select("id").eq("aseguradora_id", id)

    if (siniestros && siniestros.length > 0) {
      throw new Error("No se puede eliminar la aseguradora porque tiene siniestros asociados")
    }

    const { error } = await supabaseClient.from("aseguradoras").delete().eq("id", id)

    if (error) {
      console.error(`Error al eliminar aseguradora con ID ${id}:`, error.message)
      throw new Error(error.message)
    }

    revalidatePath("/admin/aseguradoras")
    return true
  } catch (error) {
    console.error(`Error al eliminar aseguradora con ID ${id}:`, error)
    throw error
  }
}
