"use server"

import { getSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface KanbanColumn {
  id: string
  nombre: string
  color: string
  porcentaje: number
}

export async function saveKanbanConfiguration(
  tipoTaller: string,
  columnas: KanbanColumn[],
  mostrarPorcentajes: boolean,
  mostrarTiempoEstimado: boolean,
  mostrarAsignados: boolean,
) {
  const supabase = getSupabaseServer()

  try {
    // Obtener el ID del usuario autenticado
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error("Error obteniendo usuario:", userError)
      return { success: false, error: "Usuario no autenticado." }
    }

    // 1. Eliminar todas las columnas existentes asociadas a este usuario/taller
    // Asumimos que cada taller tiene su propia configuración de Kanban.
    // Si las columnas no tienen un user_id, se eliminarán todas.
    // Para una solución multi-taller, necesitarías una columna `taller_id` en `kanban_columns`.
    const { error: deleteError } = await supabase.from("kanban_columns").delete().not("id", "is", null) // Elimina todas las filas (ajusta si tienes un ID de taller)

    if (deleteError) {
      console.error("Error al eliminar columnas existentes:", deleteError)
      return { success: false, error: deleteError.message }
    }

    // 2. Insertar las nuevas columnas
    const columnsToInsert = columnas.map((col, index) => ({
      title: col.nombre,
      description: `Columna para ${tipoTaller}`,
      color: col.color,
      position: index,
      // Si tu tabla kanban_columns tiene user_id o taller_id, agrégalo aquí:
      // user_id: user.id,
      // taller_id: 'tu_taller_id_aqui',
    }))

    const { data, error: insertError } = await supabase.from("kanban_columns").insert(columnsToInsert).select()

    if (insertError) {
      console.error("Error al insertar nuevas columnas:", insertError)
      return { success: false, error: insertError.message }
    }

    // Opcional: Guardar las opciones de visualización en una tabla de configuración de taller
    // Por ahora, solo revalidamos la ruta.
    revalidatePath("/taller/kanban-personalizado")
    revalidatePath("/taller/kanban")

    return { success: true, message: "Configuración Kanban guardada correctamente." }
  } catch (error: any) {
    console.error("Error en saveKanbanConfiguration:", error)
    return { success: false, error: error.message }
  }
}

export async function getKanbanConfiguration() {
  const supabase = getSupabaseServer()
  const { data: columns, error: columnsError } = await supabase
    .from("kanban_columns")
    .select("*")
    .order("position", { ascending: true })

  if (columnsError) {
    console.error("Error fetching kanban columns:", columnsError)
    return {
      tipoTaller: "mecanica",
      columnas: [],
      mostrarPorcentajes: true,
      mostrarTiempoEstimado: true,
      mostrarAsignados: true,
    }
  }

  // Aquí podrías cargar también las opciones de visualización si las guardas en otra tabla
  // Por ahora, se devuelven los valores por defecto si no hay columnas guardadas
  if (columns.length === 0) {
    return {
      tipoTaller: "mecanica", // O el tipo por defecto que quieras
      columnas: [],
      mostrarPorcentajes: true,
      mostrarTiempoEstimado: true,
      mostrarAsignados: true,
    }
  }

  // Asumimos que si hay columnas, el tipo de taller es "personalizado" o el que corresponda
  // Si necesitas guardar el `tipoTaller` en la DB, deberías tener una tabla de configuración.
  return {
    tipoTaller: "personalizado", // Si se cargan desde DB, es personalizado
    columnas: columns.map((col) => ({
      id: col.id,
      nombre: col.title,
      color: col.color || "#64748b", // Asegura un color por defecto
      porcentaje: col.position * (100 / (columns.length > 1 ? columns.length - 1 : 1)), // Calcula un porcentaje aproximado
    })),
    mostrarPorcentajes: true, // Cargar desde DB si se guardan
    mostrarTiempoEstimado: true, // Cargar desde DB si se guardan
    mostrarAsignados: true, // Cargar desde DB si se guardan
  }
}
