"use server"

import { createClient } from "@/lib/supabase/server"
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
  const supabase = createClient()

  try {
    // 1. Eliminar todas las columnas existentes para el taller actual (simplificado para este ejemplo)
    // En una aplicación real, podrías querer actualizar o solo eliminar las que no están en la nueva lista.
    const { error: deleteError } = await supabase
      .from("kanban_columns")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000") // Delete all except a dummy ID to ensure RLS works

    if (deleteError) {
      console.error("Error al eliminar columnas existentes:", deleteError)
      return { success: false, error: deleteError.message }
    }

    // 2. Insertar las nuevas columnas
    const columnsToInsert = columnas.map((col, index) => ({
      title: col.nombre,
      description: `Columna para ${tipoTaller}`, // Puedes ajustar esto
      color: col.color,
      position: index, // Usar el índice como posición
    }))

    const { data, error: insertError } = await supabase.from("kanban_columns").insert(columnsToInsert).select()

    if (insertError) {
      console.error("Error al insertar nuevas columnas:", insertError)
      return { success: false, error: insertError.message }
    }

    // Opcional: Guardar las opciones de visualización en una tabla de configuración de taller
    // Por ahora, solo revalidamos la ruta.
    revalidatePath("/taller/kanban-personalizado")
    revalidatePath("/taller/kanban") // Revalidar también el tablero principal

    return { success: true, message: "Configuración Kanban guardada correctamente." }
  } catch (error: any) {
    console.error("Error en saveKanbanConfiguration:", error)
    return { success: false, error: error.message }
  }
}

export async function getKanbanColumns() {
  const supabase = createClient()
  const { data, error } = await supabase.from("kanban_columns").select("*").order("position", { ascending: true })

  if (error) {
    console.error("Error fetching kanban columns:", error)
    return []
  }
  return data
}
