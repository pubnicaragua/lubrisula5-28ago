"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import {
  defaultInteriorItems,
  defaultExteriorItems,
  defaultEngineItems,
  defaultBodyItems,
  type VehicleInspection,
} from "@/types/vehicle-inspection"

// Crear una nueva inspección
export async function createVehicleInspection(vehicleId: string) {
  try {
    const supabase = createClient()

    const newInspection = {
      vehicle_id: vehicleId,
      interior_items: defaultInteriorItems,
      exterior_items: defaultExteriorItems,
      engine_items: defaultEngineItems,
      body_items: defaultBodyItems,
      fuel_level: { level: 0 },
      status: "draft",
    }

    const { data, error } = await supabase.from("vehicle_inspections").insert(newInspection).select().single()

    if (error) {
      console.error("Error creating vehicle inspection:", error)
      return {
        success: false,
        data: null,
        error: error.message,
      }
    }

    revalidatePath("/taller/vehiculos")
    revalidatePath(`/taller/vehiculos/${vehicleId}`)

    return {
      success: true,
      data,
      error: null,
    }
  } catch (error) {
    console.error("Error in createVehicleInspection:", error)
    return {
      success: false,
      data: null,
      error: "Error al crear la inspección del vehículo",
    }
  }
}

// Obtener una inspección por ID
export async function getVehicleInspectionById(id: string) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("vehicle_inspections").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching vehicle inspection with ID ${id}:`, error)
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
    console.error(`Error in getVehicleInspectionById for ID ${id}:`, error)
    return {
      success: false,
      data: null,
      error: "Error al obtener la inspección del vehículo",
    }
  }
}

// Obtener inspecciones por vehículo
export async function getVehicleInspectionsByVehicleId(vehicleId: string) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("vehicle_inspections")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error(`Error fetching vehicle inspections for vehicle ${vehicleId}:`, error)
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
    console.error(`Error in getVehicleInspectionsByVehicleId for vehicle ${vehicleId}:`, error)
    return {
      success: false,
      data: null,
      error: "Error al obtener las inspecciones del vehículo",
    }
  }
}

// Actualizar una inspección
export async function updateVehicleInspection(id: string, inspectionData: Partial<VehicleInspection>) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("vehicle_inspections")
      .update(inspectionData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating vehicle inspection with ID ${id}:`, error)
      return {
        success: false,
        data: null,
        error: error.message,
      }
    }

    revalidatePath("/taller/vehiculos")
    revalidatePath(`/taller/vehiculos/${data.vehicle_id}`)
    revalidatePath(`/taller/vehiculos/inspecciones/${id}`)

    return {
      success: true,
      data,
      error: null,
    }
  } catch (error) {
    console.error(`Error in updateVehicleInspection for ID ${id}:`, error)
    return {
      success: false,
      data: null,
      error: "Error al actualizar la inspección del vehículo",
    }
  }
}

// Eliminar una inspección
export async function deleteVehicleInspection(id: string) {
  try {
    const supabase = createClient()

    // Primero obtenemos el vehicle_id para revalidar la ruta después
    const { data: inspection } = await supabase.from("vehicle_inspections").select("vehicle_id").eq("id", id).single()

    const { error } = await supabase.from("vehicle_inspections").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting vehicle inspection with ID ${id}:`, error)
      return {
        success: false,
        error: error.message,
      }
    }

    if (inspection) {
      revalidatePath("/taller/vehiculos")
      revalidatePath(`/taller/vehiculos/${inspection.vehicle_id}`)
    }

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    console.error(`Error in deleteVehicleInspection for ID ${id}:`, error)
    return {
      success: false,
      error: "Error al eliminar la inspección del vehículo",
    }
  }
}

// Guardar imágenes de inspección
export async function saveInspectionImages(id: string, imageUrls: string[]) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("vehicle_inspections")
      .update({ images: imageUrls })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error(`Error saving inspection images for ID ${id}:`, error)
      return {
        success: false,
        data: null,
        error: error.message,
      }
    }

    revalidatePath(`/taller/vehiculos/inspecciones/${id}`)

    return {
      success: true,
      data,
      error: null,
    }
  } catch (error) {
    console.error(`Error in saveInspectionImages for ID ${id}:`, error)
    return {
      success: false,
      data: null,
      error: "Error al guardar las imágenes de la inspección",
    }
  }
}

// Guardar firmas
export async function saveInspectionSignatures(
  id: string,
  clientSignature: string | null,
  technicianSignature: string | null,
) {
  try {
    const supabase = createClient()

    const updateData: any = {}
    if (clientSignature !== undefined) updateData.client_signature = clientSignature
    if (technicianSignature !== undefined) updateData.technician_signature = technicianSignature

    const { data, error } = await supabase.from("vehicle_inspections").update(updateData).eq("id", id).select().single()

    if (error) {
      console.error(`Error saving inspection signatures for ID ${id}:`, error)
      return {
        success: false,
        data: null,
        error: error.message,
      }
    }

    revalidatePath(`/taller/vehiculos/inspecciones/${id}`)

    return {
      success: true,
      data,
      error: null,
    }
  } catch (error) {
    console.error(`Error in saveInspectionSignatures for ID ${id}:`, error)
    return {
      success: false,
      data: null,
      error: "Error al guardar las firmas de la inspección",
    }
  }
}
