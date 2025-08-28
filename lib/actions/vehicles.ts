"use server"

import { getSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Obtener todos los vehículos
export async function getVehicles() {
  try {
    const supabase = getSupabaseServer()

    // Verificar si la tabla existe
    const { error: tableCheckError } = await supabase.from("vehicles").select("id").limit(1).single()

    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      return {
        success: false,
        data: null,
        error: "La tabla 'vehicles' no existe en la base de datos",
        isTableMissing: true,
      }
    }

    const { data, error } = await supabase.from("vehicles").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching vehicles:", error)
      return {
        success: false,
        data: null,
        error: error.message,
      }
    }

    return {
      success: true,
      data,
      error: null,
    }
  } catch (error) {
    console.error("Error in getVehicles:", error)
    return {
      success: false,
      data: null,
      error: "Error al obtener los vehículos",
    }
  }
}

// Crear un nuevo vehículo
export async function createVehicle(vehicleData) {
  try {
    const supabase = getSupabaseServer()

    // Verificar si la tabla existe
    const { error: tableCheckError } = await supabase.from("vehicles").select("id").limit(1).single()

    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      return {
        success: false,
        data: null,
        error: "La tabla 'vehicles' no existe en la base de datos",
        isTableMissing: true,
      }
    }

    const { data, error } = await supabase.from("vehicles").insert(vehicleData).select().single()

    if (error) {
      console.error("Error creating vehicle:", error)
      return {
        success: false,
        data: null,
        error: error.message,
      }
    }

    revalidatePath("/taller/vehiculos")
    revalidatePath("/vehiculos")

    return {
      success: true,
      data,
      error: null,
    }
  } catch (error) {
    console.error("Error in createVehicle:", error)
    return {
      success: false,
      data: null,
      error: "Error al crear el vehículo",
    }
  }
}

// Obtener un vehículo por ID
export async function getVehicleById(id) {
  try {
    const supabase = getSupabaseServer()

    // Verificar si la tabla existe
    const { error: tableCheckError } = await supabase.from("vehicles").select("id").limit(1).single()

    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      return {
        success: false,
        data: null,
        error: "La tabla 'vehicles' no existe en la base de datos",
        isTableMissing: true,
      }
    }

    const { data, error } = await supabase.from("vehicles").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching vehicle with ID ${id}:`, error)
      return {
        success: false,
        data: null,
        error: error.message,
      }
    }

    return {
      success: true,
      data,
      error: null,
    }
  } catch (error) {
    console.error(`Error in getVehicleById for ID ${id}:`, error)
    return {
      success: false,
      data: null,
      error: "Error al obtener el vehículo",
    }
  }
}

// Actualizar un vehículo
export async function updateVehicle(id, vehicleData) {
  try {
    const supabase = getSupabaseServer()

    // Verificar si la tabla existe
    const { error: tableCheckError } = await supabase.from("vehicles").select("id").limit(1).single()

    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      return {
        success: false,
        data: null,
        error: "La tabla 'vehicles' no existe en la base de datos",
        isTableMissing: true,
      }
    }

    const { data, error } = await supabase.from("vehicles").update(vehicleData).eq("id", id).select().single()

    if (error) {
      console.error(
        `Error  id).select().single()

    if (error) {
      console.error(\`Error updating vehicle with ID ${id}:`,
        error,
      )
      return {
        success: false,
        data: null,
        error: error.message,
      }
    }

    revalidatePath("/taller/vehiculos")
    revalidatePath("/vehiculos")

    return {
      success: true,
      data,
      error: null,
    }
  } catch (error) {
    console.error(`Error in updateVehicle for ID ${id}:`, error)
    return {
      success: false,
      data: null,
      error: "Error al actualizar el vehículo",
    }
  }
}

// Eliminar un vehículo
export async function deleteVehicle(id) {
  try {
    const supabase = getSupabaseServer()

    // Verificar si la tabla existe
    const { error: tableCheckError } = await supabase.from("vehicles").select("id").limit(1).single()

    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      return {
        success: false,
        error: "La tabla 'vehicles' no existe en la base de datos",
        isTableMissing: true,
      }
    }

    const { error } = await supabase.from("vehicles").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting vehicle with ID ${id}:`, error)
      return {
        success: false,
        error: error.message,
      }
    }

    revalidatePath("/taller/vehiculos")
    revalidatePath("/vehiculos")

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    console.error(`Error in deleteVehicle for ID ${id}:`, error)
    return {
      success: false,
      error: "Error al eliminar el vehículo",
    }
  }
}

// Obtener vehículos por cliente
export async function getVehiclesByClient(clientId) {
  try {
    const supabase = getSupabaseServer()

    // Verificar si la tabla existe
    const { error: tableCheckError } = await supabase.from("vehicles").select("id").limit(1).single()

    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      return {
        success: false,
        data: null,
        error: "La tabla 'vehicles' no existe en la base de datos",
        isTableMissing: true,
      }
    }

    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error(`Error fetching vehicles for client ${clientId}:`, error)
      return {
        success: false,
        data: null,
        error: error.message,
      }
    }

    return {
      success: true,
      data,
      error: null,
    }
  } catch (error) {
    console.error(`Error in getVehiclesByClient for client ${clientId}:`, error)
    return {
      success: false,
      data: null,
      error: "Error al obtener los vehículos del cliente",
    }
  }
}
