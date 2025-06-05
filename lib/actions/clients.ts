"use server"

import { getSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Tipo para el cliente
type ClientInput = {
  name: string
  company?: string
  phone: string
  email?: string
  client_type: "Individual" | "Empresa" | "Flota" | "Aseguradora"
}

// Obtener todos los clientes
export async function getClients() {
  const supabase = getSupabaseServer()

  try {
    const { data, error } = await supabase.from("clients").select("*").order("name", { ascending: true })

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

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching clients:", error)
    return {
      success: false,
      error: (error as Error).message,
      data: [],
      isTableMissing:
        (error as Error).message.includes("relation") && (error as Error).message.includes("does not exist"),
    }
  }
}

// Crear un nuevo cliente
export async function createClient(data: ClientInput) {
  const supabase = getSupabaseServer()

  try {
    const { data: client, error } = await supabase
      .from("clients")
      .insert({
        name: data.name,
        company: data.company || null,
        phone: data.phone,
        email: data.email || null,
        client_type: data.client_type,
      })
      .select("id")
      .single()

    if (error) {
      // Verificar si el error es porque la tabla no existe
      if (error.message.includes("relation") && error.message.includes("does not exist")) {
        return {
          success: false,
          error:
            "La tabla 'clients' no existe en la base de datos. Por favor, configure la base de datos correctamente.",
          isTableMissing: true,
        }
      }
      throw error
    }

    revalidatePath("/clientes")
    return { success: true, id: client.id }
  } catch (error) {
    console.error("Error creating client:", error)
    return {
      success: false,
      error: (error as Error).message,
      isTableMissing:
        (error as Error).message.includes("relation") && (error as Error).message.includes("does not exist"),
    }
  }
}

// Obtener un cliente por ID
export async function getClientById(id: string) {
  const supabase = getSupabaseServer()

  try {
    const { data, error } = await supabase.from("clients").select("*").eq("id", id).single()

    if (error) {
      // Verificar si el error es porque la tabla no existe
      if (error.message.includes("relation") && error.message.includes("does not exist")) {
        return {
          success: false,
          error:
            "La tabla 'clients' no existe en la base de datos. Por favor, configure la base de datos correctamente.",
          isTableMissing: true,
        }
      }
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching client:", error)
    return {
      success: false,
      error: (error as Error).message,
      isTableMissing:
        (error as Error).message.includes("relation") && (error as Error).message.includes("does not exist"),
    }
  }
}

// Actualizar un cliente
export async function updateClient(id: string, data: Partial<ClientInput>) {
  const supabase = getSupabaseServer()

  try {
    const { error } = await supabase
      .from("clients")
      .update({
        name: data.name,
        company: data.company,
        phone: data.phone,
        email: data.email,
        client_type: data.client_type,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      // Verificar si el error es porque la tabla no existe
      if (error.message.includes("relation") && error.message.includes("does not exist")) {
        return {
          success: false,
          error:
            "La tabla 'clients' no existe en la base de datos. Por favor, configure la base de datos correctamente.",
          isTableMissing: true,
        }
      }
      throw error
    }

    revalidatePath("/clientes")
    revalidatePath(`/clientes/${id}`)
    return { success: true }
  } catch (error) {
    console.error("Error updating client:", error)
    return {
      success: false,
      error: (error as Error).message,
      isTableMissing:
        (error as Error).message.includes("relation") && (error as Error).message.includes("does not exist"),
    }
  }
}

// Eliminar un cliente
export async function deleteClient(id: string) {
  const supabase = getSupabaseServer()

  try {
    const { error } = await supabase.from("clients").delete().eq("id", id)

    if (error) {
      // Verificar si el error es porque la tabla no existe
      if (error.message.includes("relation") && error.message.includes("does not exist")) {
        return {
          success: false,
          error:
            "La tabla 'clients' no existe en la base de datos. Por favor, configure la base de datos correctamente.",
          isTableMissing: true,
        }
      }
      throw error
    }

    revalidatePath("/clientes")
    return { success: true }
  } catch (error) {
    console.error("Error deleting client:", error)
    return {
      success: false,
      error: (error as Error).message,
      isTableMissing:
        (error as Error).message.includes("relation") && (error as Error).message.includes("does not exist"),
    }
  }
}
