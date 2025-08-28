"use server"

import { getSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getCitas() {
  const supabase = getSupabaseServer()

  const { data, error } = await supabase
    .from("citas")
    .select("*, clientes(nombre), vehiculos(marca, modelo, placa), miembros_equipo(nombre, apellido)")
    .order("fecha", { ascending: true })

  if (error) {
    console.error("Error fetching citas:", error)
    return []
  }

  return data
}

export async function getCitaById(id: string) {
  const supabase = getSupabaseServer()

  const { data, error } = await supabase
    .from("citas")
    .select("*, clientes(id, nombre), vehiculos(id, marca, modelo, placa), miembros_equipo(id, nombre, apellido)")
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching cita with id ${id}:`, error)
    return null
  }

  return data
}

export async function getCitasByFecha(fecha: string) {
  const supabase = getSupabaseServer()

  const { data, error } = await supabase
    .from("citas")
    .select("*, clientes(nombre), vehiculos(marca, modelo, placa), miembros_equipo(nombre, apellido)")
    .eq("fecha", fecha)
    .order("hora_inicio", { ascending: true })

  if (error) {
    console.error(`Error fetching citas for date ${fecha}:`, error)
    return []
  }

  return data
}

export async function getTecnicosDisponibles(fecha: string, horaInicio: string, horaFin: string) {
  const supabase = getSupabaseServer()

  // Primero obtenemos todos los técnicos
  const { data: tecnicos, error: tecnicosError } = await supabase
    .from("miembros_equipo")
    .select("id, nombre, apellido")
    .eq("tipo", "tecnico")

  if (tecnicosError) {
    console.error("Error fetching tecnicos:", tecnicosError)
    return []
  }

  // Luego obtenemos las citas para esa fecha
  const { data: citas, error: citasError } = await supabase
    .from("citas")
    .select("miembro_id, hora_inicio, hora_fin")
    .eq("fecha", fecha)

  if (citasError) {
    console.error(`Error fetching citas for date ${fecha}:`, citasError)
    return tecnicos
  }

  // Filtramos los técnicos que están disponibles
  const tecnicosDisponibles = tecnicos.filter((tecnico) => {
    const citasTecnico = citas.filter((cita) => cita.miembro_id === tecnico.id)

    // Verificar si hay alguna cita que se solape con el horario solicitado
    const hayConflicto = citasTecnico.some((cita) => {
      return (
        (horaInicio >= cita.hora_inicio && horaInicio < cita.hora_fin) ||
        (horaFin > cita.hora_inicio && horaFin <= cita.hora_fin) ||
        (horaInicio <= cita.hora_inicio && horaFin >= cita.hora_fin)
      )
    })

    return !hayConflicto
  })

  return tecnicosDisponibles
}

export async function createCita(formData: FormData) {
  const supabase = getSupabaseServer()

  const cliente_id = formData.get("cliente_id") as string
  const vehiculo_id = formData.get("vehiculo_id") as string
  const miembro_id = formData.get("miembro_id") as string
  const fecha = formData.get("fecha") as string
  const hora_inicio = formData.get("hora_inicio") as string
  const hora_fin = formData.get("hora_fin") as string
  const tipo_servicio = formData.get("tipo_servicio") as string
  const descripcion = formData.get("descripcion") as string
  const estado = (formData.get("estado") as string) || "programada"

  const { data, error } = await supabase
    .from("citas")
    .insert([
      {
        cliente_id,
        vehiculo_id,
        miembro_id,
        fecha,
        hora_inicio,
        hora_fin,
        tipo_servicio,
        descripcion,
        estado,
      },
    ])
    .select()

  if (error) {
    console.error("Error creating cita:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/calendario")
  return { success: true, data }
}

export async function updateCita(id: string, formData: FormData) {
  const supabase = getSupabaseServer()

  const cliente_id = formData.get("cliente_id") as string
  const vehiculo_id = formData.get("vehiculo_id") as string
  const miembro_id = formData.get("miembro_id") as string
  const fecha = formData.get("fecha") as string
  const hora_inicio = formData.get("hora_inicio") as string
  const hora_fin = formData.get("hora_fin") as string
  const tipo_servicio = formData.get("tipo_servicio") as string
  const descripcion = formData.get("descripcion") as string
  const estado = formData.get("estado") as string

  const { data, error } = await supabase
    .from("citas")
    .update({
      cliente_id,
      vehiculo_id,
      miembro_id,
      fecha,
      hora_inicio,
      hora_fin,
      tipo_servicio,
      descripcion,
      estado,
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error(`Error updating cita with id ${id}:`, error)
    return { success: false, error: error.message }
  }

  revalidatePath("/calendario")
  revalidatePath(`/calendario/${id}`)
  return { success: true, data }
}

export async function updateEstadoCita(id: string, estado: string) {
  const supabase = getSupabaseServer()

  const { data, error } = await supabase.from("citas").update({ estado }).eq("id", id).select()

  if (error) {
    console.error(`Error updating estado for cita ${id}:`, error)
    return { success: false, error: error.message }
  }

  revalidatePath("/calendario")
  revalidatePath(`/calendario/${id}`)
  return { success: true, data }
}

export async function deleteCita(id: string) {
  const supabase = getSupabaseServer()

  const { error } = await supabase.from("citas").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting cita with id ${id}:`, error)
    return { success: false, error: error.message }
  }

  revalidatePath("/calendario")
  return { success: true }
}
