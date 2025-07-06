"use server"

import { getServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Tipo para la parte de cotización
type QuotationPart = {
  id?: string
  category: "Estructural" | "Carrocería" | "Pintura"
  name: string
  quantity: number
  operation: "Cor" | "Rep" | "Cam"
  material_type: "HI" | "PL"
  repair_type: "MM" | "OU" | "GN"
  repair_hours: number
  labor_cost: number
  materials_cost: number
  parts_cost: number
  total: number
}

// Tipo para la cotización
type QuotationInput = {
  quotation_number: string
  client_id: string
  vehicle_id: string
  date: string
  status: "Pendiente" | "Aprobada" | "Rechazada" | "Convertida a Orden"
  total_labor: number
  total_materials: number
  total_parts: number
  total: number
  repair_hours: number
  estimated_days: number
  parts: QuotationPart[]
}

// Obtener todas las cotizaciones
export async function getQuotations() {
  const supabase = await getServerClient()

  try {
    const { data, error } = await supabase
      .from("quotations")
      .select(
        `
        *,
        client:clients(*),
        vehicle:vehicles(*)
      `,
      )
      .order("created_at", { ascending: false })
      console.log(data)
      console.log(error)

    if (error) {
      // Verificar si el error es porque la tabla no existe
      if (error.message.includes("relation") && error.message.includes("does not exist")) {
        return {
          success: false,
          error: error.message,
          data: [],
          isTableMissing: true,
        }
      }
      throw error
    }
    console.log('pasa')

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching quotations:", error)
    return {
      success: false,
      error: (error as Error).message,
      data: [],
      isTableMissing:
        (error as Error).message.includes("relation") && (error as Error).message.includes("does not exist"),
    }
  }
}

// Crear una nueva cotización
export async function createQuotation(data: QuotationInput) {
  const supabase = await getServerClient()
  console.log(data)

  try {
    // 1. Crear la cotización principal
    const { data: quotation, error: quotationError } = await supabase
      .from("quotations")
      .insert({
        quotation_number: data.quotation_number,
        client_id: data.client_id,
        vehicle_id: data.vehicle_id,
        date: data.date,
        status: data.status,
        total_labor: data.total_labor,
        total_materials: data.total_materials,
        total_parts: data.total_parts,
        total: data.total,
        repair_hours: data.repair_hours,
        estimated_days: data.estimated_days,
      })
      .select("id")
      .single()

    if (quotationError) {
      // Verificar si el error es porque la tabla no existe
      if (quotationError.message.includes("relation") && quotationError.message.includes("does not exist")) {
        return {
          success: false,
          error:
            "La tabla 'quotations' no existe en la base de datos. Por favor, configure la base de datos correctamente.",
          isTableMissing: true,
        }
      }
      throw quotationError
    }

    // 2. Crear las partes de la cotización
    if (data.parts && data.parts.length > 0) {
      const quotationParts = data.parts.map((part) => ({
        quotation_id: quotation.id,
        category: part.category,
        name: part.name,
        quantity: part.quantity,
        operation: part.operation,
        material_type: part.material_type,
        repair_type: part.repair_type,
        repair_hours: part.repair_hours,
        labor_cost: part.labor_cost,
        materials_cost: part.materials_cost,
        parts_cost: part.parts_cost,
        total: part.total,
      }))

      const { error: partsError } = await supabase.from("quotation_parts").insert(quotationParts)

      if (partsError) {
        // Si hay un error al insertar las partes, eliminamos la cotización principal
        await supabase.from("quotations").delete().eq("id", quotation.id)

        // Verificar si el error es porque la tabla no existe
        if (partsError.message.includes("relation") && partsError.message.includes("does not exist")) {
          return {
            success: false,
            error:
              "La tabla 'quotation_parts' no existe en la base de datos. Por favor, configure la base de datos correctamente.",
            isTableMissing: true,
          }
        }
        throw partsError
      }
    }

    revalidatePath("/cotizaciones")
    return { success: true, id: quotation.id }
  } catch (error) {
    console.error("Error creating quotation:", error)
    return {
      success: false,
      error: (error as Error).message,
      isTableMissing:
        (error as Error).message.includes("relation") && (error as Error).message.includes("does not exist"),
    }
  }
}

// Modificar la función getQuotationById para no depender de relaciones automáticas
// Reemplazar la función getQuotationById con esta versión actualizada:

export async function getQuotationById(id: string) {
  const supabase = await getServerClient()

  try {
    // 1. Obtener la cotización principal
    const { data: quotation, error: quotationError } = await supabase
      .from("quotations")
      .select("*")
      .eq("id", id)
      .single()

    if (quotationError) {
      // Verificar si el error es porque la tabla no existe
      if (quotationError.message.includes("relation") && quotationError.message.includes("does not exist")) {
        return {
          success: false,
          error:
            "La tabla 'quotations' no existe en la base de datos. Por favor, configure la base de datos correctamente.",
          isTableMissing: true,
        }
      }
      throw quotationError
    }

    // 2. Obtener el cliente relacionado
    let client = null
    if (quotation.client_id) {
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("id", quotation.client_id)
        .single()

      if (!clientError) {
        client = clientData
      }
    }

    // 3. Obtener el vehículo relacionado
    let vehicle = null
    if (quotation.vehicle_id) {
      const { data: vehicleData, error: vehicleError } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", quotation.vehicle_id)
        .single()

      if (!vehicleError) {
        vehicle = vehicleData
      }
    }

    // 4. Obtener las partes de la cotización
    const { data: parts, error: partsError } = await supabase
      .from("quotation_parts")
      .select("*")
      .eq("quotation_id", id)
      .order("id", { ascending: true })

    if (partsError && !partsError.message.includes("does not exist")) {
      throw partsError
    }

    return {
      success: true,
      data: {
        ...quotation,
        client,
        vehicle,
        parts: parts || [],
      },
    }
  } catch (error) {
    console.error("Error fetching quotation:", error)
    return {
      success: false,
      error: (error as Error).message,
      isTableMissing:
        (error as Error).message.includes("relation") && (error as Error).message.includes("does not exist"),
    }
  }
}

// Actualizar una cotización
export async function updateQuotation(id: string, data: Partial<QuotationInput>) {
  const supabase = await getServerClient()

  try {
    // 1. Actualizar la cotización principal
    const { error: quotationError } = await supabase
      .from("quotations")
      .update({
        quotation_number: data.quotation_number,
        client_id: data.client_id,
        vehicle_id: data.vehicle_id,
        date: data.date,
        status: data.status,
        total_labor: data.total_labor,
        total_materials: data.total_materials,
        total_parts: data.total_parts,
        total: data.total,
        repair_hours: data.repair_hours,
        estimated_days: data.estimated_days,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (quotationError) {
      // Verificar si el error es porque la tabla no existe
      if (quotationError.message.includes("relation") && quotationError.message.includes("does not exist")) {
        return {
          success: false,
          error:
            "La tabla 'quotations' no existe en la base de datos. Por favor, configure la base de datos correctamente.",
          isTableMissing: true,
        }
      }
      throw quotationError
    }

    // 2. Actualizar las partes de la cotización
    if (data.parts && data.parts.length > 0) {
      // Primero eliminamos todas las partes existentes
      const { error: deleteError } = await supabase.from("quotation_parts").delete().eq("quotation_id", id)

      if (deleteError) {
        // Verificar si el error es porque la tabla no existe
        if (deleteError.message.includes("relation") && deleteError.message.includes("does not exist")) {
          return {
            success: false,
            error:
              "La tabla 'quotation_parts' no existe en la base de datos. Por favor, configure la base de datos correctamente.",
            isTableMissing: true,
          }
        }
        throw deleteError
      }

      // Luego insertamos las nuevas partes
      const quotationParts = data.parts.map((part) => ({
        quotation_id: id,
        category: part.category,
        name: part.name,
        quantity: part.quantity,
        operation: part.operation,
        material_type: part.material_type,
        repair_type: part.repair_type,
        repair_hours: part.repair_hours,
        labor_cost: part.labor_cost,
        materials_cost: part.materials_cost,
        parts_cost: part.parts_cost,
        total: part.total,
      }))

      const { error: insertError } = await supabase.from("quotation_parts").insert(quotationParts)

      if (insertError) {
        // Verificar si el error es porque la tabla no existe
        if (insertError.message.includes("relation") && insertError.message.includes("does not exist")) {
          return {
            success: false,
            error:
              "La tabla 'quotation_parts' no existe en la base de datos. Por favor, configure la base de datos correctamente.",
            isTableMissing: true,
          }
        }
        throw insertError
      }
    }

    revalidatePath("/cotizaciones")
    revalidatePath(`/cotizaciones/${id}`)
    return { success: true }
  } catch (error) {
    console.error("Error updating quotation:", error)
    return {
      success: false,
      error: (error as Error).message,
      isTableMissing:
        (error as Error).message.includes("relation") && (error as Error).message.includes("does not exist"),
    }
  }
}

// Eliminar una cotización
export async function deleteQuotation(id: string) {
  const supabase = await getServerClient()

  try {
    // 1. Eliminar las partes de la cotización
    const { error: partsError } = await supabase.from("quotation_parts").delete().eq("quotation_id", id)

    if (partsError && !partsError.message.includes("does not exist")) {
      throw partsError
    }

    // 2. Eliminar la cotización principal
    const { error: quotationError } = await supabase.from("quotations").delete().eq("id", id)

    if (quotationError) {
      // Verificar si el error es porque la tabla no existe
      if (quotationError.message.includes("relation") && quotationError.message.includes("does not exist")) {
        return {
          success: false,
          error:
            "La tabla 'quotations' no existe en la base de datos. Por favor, configure la base de datos correctamente.",
          isTableMissing: true,
        }
      }
      throw quotationError
    }

    revalidatePath("/cotizaciones")
    return { success: true }
  } catch (error) {
    console.error("Error deleting quotation:", error)
    return {
      success: false,
      error: (error as Error).message,
      isTableMissing:
        (error as Error).message.includes("relation") && (error as Error).message.includes("does not exist"),
    }
  }
}
