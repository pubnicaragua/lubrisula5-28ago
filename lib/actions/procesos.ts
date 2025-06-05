"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getProcesos() {
  const supabase = createClient()

  const { data, error } = await supabase.from("procesos").select("*").order("orden", { ascending: true })

  if (error) {
    console.error("Error fetching procesos:", error)
    return []
  }

  return data
}

export async function getProcesoById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("procesos").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching proceso with id ${id}:`, error)
    return null
  }

  return data
}

export async function getPaquetesServicio() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("paquetes_servicio")
    .select("*, procesos_paquete(proceso_id, procesos(nombre))")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching paquetes de servicio:", error)
    return []
  }

  return data
}

export async function getPaqueteServicioById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("paquetes_servicio")
    .select("*, procesos_paquete(proceso_id, procesos(id, nombre, descripcion))")
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching paquete with id ${id}:`, error)
    return null
  }

  return data
}

export async function createProceso(formData: FormData) {
  const supabase = createClient()

  const nombre = formData.get("nombre") as string
  const descripcion = formData.get("descripcion") as string
  const tiempo_estimado = Number.parseInt(formData.get("tiempo_estimado") as string) || 0
  const orden = Number.parseInt(formData.get("orden") as string) || 0
  const validaciones = formData.get("validaciones") as string

  const { data, error } = await supabase
    .from("procesos")
    .insert([
      {
        nombre,
        descripcion,
        tiempo_estimado,
        orden,
        validaciones,
      },
    ])
    .select()

  if (error) {
    console.error("Error creating proceso:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/procesos")
  return { success: true, data }
}

export async function updateProceso(id: string, formData: FormData) {
  const supabase = createClient()

  const nombre = formData.get("nombre") as string
  const descripcion = formData.get("descripcion") as string
  const tiempo_estimado = Number.parseInt(formData.get("tiempo_estimado") as string) || 0
  const orden = Number.parseInt(formData.get("orden") as string) || 0
  const validaciones = formData.get("validaciones") as string

  const { data, error } = await supabase
    .from("procesos")
    .update({
      nombre,
      descripcion,
      tiempo_estimado,
      orden,
      validaciones,
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error(`Error updating proceso with id ${id}:`, error)
    return { success: false, error: error.message }
  }

  revalidatePath("/procesos")
  revalidatePath(`/procesos/${id}`)
  return { success: true, data }
}

export async function deleteProceso(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("procesos").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting proceso with id ${id}:`, error)
    return { success: false, error: error.message }
  }

  revalidatePath("/procesos")
  return { success: true }
}

export async function createPaqueteServicio(formData: FormData) {
  const supabase = createClient()

  const nombre = formData.get("nombre") as string
  const descripcion = formData.get("descripcion") as string
  const precio_base = Number.parseFloat(formData.get("precio_base") as string) || 0
  const tiempo_estimado = Number.parseInt(formData.get("tiempo_estimado") as string) || 0
  const procesos = JSON.parse((formData.get("procesos") as string) || "[]")

  // Primero crear el paquete
  const { data, error } = await supabase
    .from("paquetes_servicio")
    .insert([
      {
        nombre,
        descripcion,
        precio_base,
        tiempo_estimado,
      },
    ])
    .select()

  if (error) {
    console.error("Error creating paquete de servicio:", error)
    return { success: false, error: error.message }
  }

  const paqueteId = data[0].id

  // Luego crear las relaciones con los procesos
  if (procesos.length > 0) {
    const procesosData = procesos.map((procesoId: string) => ({
      paquete_id: paqueteId,
      proceso_id: procesoId,
    }))

    const { error: relError } = await supabase.from("procesos_paquete").insert(procesosData)

    if (relError) {
      console.error("Error creating proceso-paquete relationships:", relError)
      return { success: false, error: relError.message }
    }
  }

  revalidatePath("/procesos")
  return { success: true, data }
}

export async function deletePaqueteServicio(id: string) {
  const supabase = createClient()

  // Primero eliminar las relaciones
  const { error: relError } = await supabase.from("procesos_paquete").delete().eq("paquete_id", id)

  if (relError) {
    console.error(`Error deleting relationships for paquete ${id}:`, relError)
    return { success: false, error: relError.message }
  }

  // Luego eliminar el paquete
  const { error } = await supabase.from("paquetes_servicio").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting paquete with id ${id}:`, error)
    return { success: false, error: error.message }
  }

  revalidatePath("/procesos")
  return { success: true }
}
