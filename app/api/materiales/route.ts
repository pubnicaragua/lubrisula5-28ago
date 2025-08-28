import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const supabase = getSupabaseServer()
  const url = new URL(request.url)
  const proceso_id = url.searchParams.get("proceso_id")

  try {
    let query = supabase.from("materiales").select(`
        *,
        procesos_taller(id, nombre, tipo),
        suppliers(id, name)
      `)

    if (proceso_id) {
      query = query.eq("proceso_id", proceso_id)
    }

    const { data, error } = await query.order("nombre", { ascending: true })

    if (error) {
      console.error("Error al obtener materiales:", error)
      return NextResponse.json({ error: "Error al obtener materiales" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error en la API de materiales:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = getSupabaseServer()

  try {
    const body = await request.json()

    // Validar datos requeridos
    if (!body.nombre || !body.unidad || !body.proceso_id) {
      return NextResponse.json({ error: "Nombre, unidad y proceso_id son campos requeridos" }, { status: 400 })
    }

    // Calcular precio unitario si no se proporciona
    if (!body.precio_unitario && body.precio_total && body.cantidad && body.cantidad > 0) {
      body.precio_unitario = body.precio_total / body.cantidad
    }

    const { data, error } = await supabase
      .from("materiales")
      .insert([
        {
          nombre: body.nombre,
          unidad: body.unidad,
          proceso_id: body.proceso_id,
          proveedor_id: body.proveedor_id,
          precio_total: body.precio_total || 0,
          cantidad: body.cantidad || 0,
          precio_unitario: body.precio_unitario || 0,
          rendimiento_vehiculo: body.rendimiento_vehiculo || 0,
          rendimiento_hora_reparar: body.rendimiento_hora_reparar || 0,
          rendimiento_hora_pintura: body.rendimiento_hora_pintura || 0,
          inventario_inicial: body.inventario_inicial || 0,
          inventario_final: body.inventario_final || 0,
          ajustes: body.ajustes || 0,
          stock_minimo: body.stock_minimo || 0,
          categoria: body.categoria,
        },
      ])
      .select()

    if (error) {
      console.error("Error al crear material:", error)
      return NextResponse.json({ error: "Error al crear material" }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error en la API de materiales:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
