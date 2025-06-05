import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.from("procesos_taller").select("*").eq("id", params.id).single()

    if (error) {
      console.error(`Error al obtener proceso ${params.id}:`, error)
      return NextResponse.json({ error: "Error al obtener proceso" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Proceso no encontrado" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error en la API de procesos:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()

  try {
    const body = await request.json()

    // Validar datos requeridos
    if (!body.nombre || !body.tipo) {
      return NextResponse.json({ error: "Nombre y tipo son campos requeridos" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("procesos_taller")
      .update({
        nombre: body.nombre,
        descripcion: body.descripcion,
        tiempo_estimado: body.tiempo_estimado || 0,
        orden: body.orden || 0,
        tipo: body.tipo,
        validaciones: body.validaciones,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()

    if (error) {
      console.error(`Error al actualizar proceso ${params.id}:`, error)
      return NextResponse.json({ error: "Error al actualizar proceso" }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Proceso no encontrado" }, { status: 404 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error en la API de procesos:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()

  try {
    // Verificar si hay materiales asociados
    const { data: materiales, error: materialesError } = await supabase
      .from("materiales")
      .select("id")
      .eq("proceso_id", params.id)

    if (materialesError) {
      console.error(`Error al verificar materiales para proceso ${params.id}:`, materialesError)
      return NextResponse.json({ error: "Error al verificar materiales asociados" }, { status: 500 })
    }

    if (materiales && materiales.length > 0) {
      return NextResponse.json(
        { error: "No se puede eliminar el proceso porque tiene materiales asociados" },
        { status: 400 },
      )
    }

    const { error } = await supabase.from("procesos_taller").delete().eq("id", params.id)

    if (error) {
      console.error(`Error al eliminar proceso ${params.id}:`, error)
      return NextResponse.json({ error: "Error al eliminar proceso" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error en la API de procesos:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
