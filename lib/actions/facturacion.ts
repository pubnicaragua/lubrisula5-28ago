"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getFacturas() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("facturas")
    .select("*, clientes(nombre), ordenes(numero_orden)")
    .order("fecha_emision", { ascending: false })

  if (error) {
    console.error("Error fetching facturas:", error)
    return []
  }

  return data
}

export async function getFacturaById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("facturas")
    .select(
      "*, clientes(id, nombre, email, telefono, direccion), ordenes(id, numero_orden, vehiculo_id, vehiculos(marca, modelo, placa))",
    )
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching factura with id ${id}:`, error)
    return null
  }

  // Obtener los items de la factura
  const { data: items, error: itemsError } = await supabase.from("items_factura").select("*").eq("factura_id", id)

  if (itemsError) {
    console.error(`Error fetching items for factura ${id}:`, itemsError)
    return data
  }

  return { ...data, items }
}

export async function getOrdenesNoFacturadas() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("ordenes")
    .select("id, numero_orden, cliente_id, clientes(nombre), vehiculo_id, vehiculos(marca, modelo, placa), total")
    .is("facturada", false)
    .eq("estado", "completada")
    .order("fecha_creacion", { ascending: false })

  if (error) {
    console.error("Error fetching ordenes no facturadas:", error)
    return []
  }

  return data
}

export async function createFactura(formData: FormData) {
  const supabase = createClient()

  const cliente_id = formData.get("cliente_id") as string
  const orden_id = formData.get("orden_id") as string
  const numero_factura = formData.get("numero_factura") as string
  const fecha_emision = formData.get("fecha_emision") as string
  const fecha_vencimiento = formData.get("fecha_vencimiento") as string
  const subtotal = Number.parseFloat(formData.get("subtotal") as string) || 0
  const impuestos = Number.parseFloat(formData.get("impuestos") as string) || 0
  const total = Number.parseFloat(formData.get("total") as string) || 0
  const estado = formData.get("estado") as string
  const metodo_pago = formData.get("metodo_pago") as string
  const notas = formData.get("notas") as string
  const items = JSON.parse((formData.get("items") as string) || "[]")

  // Crear la factura
  const { data, error } = await supabase
    .from("facturas")
    .insert([
      {
        cliente_id,
        orden_id,
        numero_factura,
        fecha_emision,
        fecha_vencimiento,
        subtotal,
        impuestos,
        total,
        estado,
        metodo_pago,
        notas,
      },
    ])
    .select()

  if (error) {
    console.error("Error creating factura:", error)
    return { success: false, error: error.message }
  }

  const facturaId = data[0].id

  // Crear los items de la factura
  if (items.length > 0) {
    const itemsData = items.map((item: any) => ({
      factura_id: facturaId,
      descripcion: item.descripcion,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
      subtotal: item.subtotal,
    }))

    const { error: itemsError } = await supabase.from("items_factura").insert(itemsData)

    if (itemsError) {
      console.error("Error creating factura items:", itemsError)
      return { success: false, error: itemsError.message }
    }
  }

  // Actualizar la orden como facturada
  const { error: ordenError } = await supabase.from("ordenes").update({ facturada: true }).eq("id", orden_id)

  if (ordenError) {
    console.error(`Error updating orden ${orden_id} as facturada:`, ordenError)
    // No retornamos error aquí para no afectar la creación de la factura
  }

  revalidatePath("/facturacion")
  return { success: true, data }
}

export async function updateEstadoFactura(id: string, estado: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("facturas").update({ estado }).eq("id", id).select()

  if (error) {
    console.error(`Error updating estado for factura ${id}:`, error)
    return { success: false, error: error.message }
  }

  revalidatePath("/facturacion")
  revalidatePath(`/facturacion/${id}`)
  return { success: true, data }
}

export async function deleteFactura(id: string, ordenId: string) {
  const supabase = createClient()

  // Primero eliminar los items
  const { error: itemsError } = await supabase.from("items_factura").delete().eq("factura_id", id)

  if (itemsError) {
    console.error(`Error deleting items for factura ${id}:`, itemsError)
    return { success: false, error: itemsError.message }
  }

  // Luego eliminar la factura
  const { error } = await supabase.from("facturas").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting factura with id ${id}:`, error)
    return { success: false, error: error.message }
  }

  // Actualizar la orden como no facturada
  const { error: ordenError } = await supabase.from("ordenes").update({ facturada: false }).eq("id", ordenId)

  if (ordenError) {
    console.error(`Error updating orden ${ordenId} as not facturada:`, ordenError)
    // No retornamos error aquí para no afectar la eliminación de la factura
  }

  revalidatePath("/facturacion")
  return { success: true }
}
