"use server"

import { getSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getRepuestos() {
  const supabase = getSupabaseServer()

  const { data, error } = await supabase
    .from("repuestos")
    .select("*, proveedores(nombre)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching repuestos:", error)
    return []
  }

  return data
}

export async function getRepuestoById(id: string) {
  const supabase = getSupabaseServer()

  const { data, error } = await supabase.from("repuestos").select("*, proveedores(id, nombre)").eq("id", id).single()

  if (error) {
    console.error(`Error fetching repuesto with id ${id}:`, error)
    return null
  }

  return data
}

export async function getProveedores() {
  const supabase = getSupabaseServer()

  const { data, error } = await supabase.from("proveedores").select("*").order("nombre", { ascending: true })

  if (error) {
    console.error("Error fetching proveedores:", error)
    return []
  }

  return data
}

export async function createRepuesto(formData: FormData) {
  const supabase = getSupabaseServer()

  const nombre = formData.get("nombre") as string
  const codigo = formData.get("codigo") as string
  const descripcion = formData.get("descripcion") as string
  const proveedor_id = formData.get("proveedor_id") as string
  const precio = Number.parseFloat(formData.get("precio") as string) || 0
  const stock_actual = Number.parseInt(formData.get("stock_actual") as string) || 0
  const stock_minimo = Number.parseInt(formData.get("stock_minimo") as string) || 0
  const modelo_vehiculo = formData.get("modelo_vehiculo") as string
  const tiempo_entrega = Number.parseInt(formData.get("tiempo_entrega") as string) || 0

  const { data, error } = await supabase
    .from("repuestos")
    .insert([
      {
        nombre,
        codigo,
        descripcion,
        proveedor_id,
        precio,
        stock_actual,
        stock_minimo,
        modelo_vehiculo,
        tiempo_entrega,
      },
    ])
    .select()

  if (error) {
    console.error("Error creating repuesto:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/repuestos")
  return { success: true, data }
}

export async function updateRepuesto(id: string, formData: FormData) {
  const supabase = getSupabaseServer()

  const nombre = formData.get("nombre") as string
  const codigo = formData.get("codigo") as string
  const descripcion = formData.get("descripcion") as string
  const proveedor_id = formData.get("proveedor_id") as string
  const precio = Number.parseFloat(formData.get("precio") as string) || 0
  const stock_actual = Number.parseInt(formData.get("stock_actual") as string) || 0
  const stock_minimo = Number.parseInt(formData.get("stock_minimo") as string) || 0
  const modelo_vehiculo = formData.get("modelo_vehiculo") as string
  const tiempo_entrega = Number.parseInt(formData.get("tiempo_entrega") as string) || 0

  const { data, error } = await supabase
    .from("repuestos")
    .update({
      nombre,
      codigo,
      descripcion,
      proveedor_id,
      precio,
      stock_actual,
      stock_minimo,
      modelo_vehiculo,
      tiempo_entrega,
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error(`Error updating repuesto with id ${id}:`, error)
    return { success: false, error: error.message }
  }

  revalidatePath("/repuestos")
  revalidatePath(`/repuestos/${id}`)
  return { success: true, data }
}

export async function deleteRepuesto(id: string) {
  const supabase = getSupabaseServer()

  const { error } = await supabase.from("repuestos").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting repuesto with id ${id}:`, error)
    return { success: false, error: error.message }
  }

  revalidatePath("/repuestos")
  return { success: true }
}

export async function createProveedor(formData: FormData) {
  const supabase = getSupabaseServer()

  const nombre = formData.get("nombre") as string
  const contacto = formData.get("contacto") as string
  const telefono = formData.get("telefono") as string
  const email = formData.get("email") as string
  const direccion = formData.get("direccion") as string

  const { data, error } = await supabase
    .from("proveedores")
    .insert([
      {
        nombre,
        contacto,
        telefono,
        email,
        direccion,
      },
    ])
    .select()

  if (error) {
    console.error("Error creating proveedor:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/repuestos")
  return { success: true, data }
}

export async function deleteProveedor(id: string) {
  const supabase = getSupabaseServer()

  const { error } = await supabase.from("proveedores").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting proveedor with id ${id}:`, error)
    return { success: false, error: error.message }
  }

  revalidatePath("/repuestos")
  return { success: true }
}
