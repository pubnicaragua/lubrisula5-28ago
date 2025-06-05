import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.from("procesos_taller").select("*").order("orden", { ascending: true })

    if (error) {
      console.error("Error al obtener procesos:", error)
      return NextResponse.json({ error: "Error al obtener procesos" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error en la API de procesos:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = createClient()

  try {
    const body = await request.json()

    // Validar datos requeridos
    if (!body.nombre || !body.tipo) {
      return NextResponse.json({ error: "Nombre y tipo son campos requeridos" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("procesos_taller")
      .insert([
        {
          nombre: body.nombre,
          descripcion: body.descripcion,
          tiempo_estimado: body.tiempo_estimado || 0,
          orden: body.orden || 0,
          tipo: body.tipo,
          validaciones: body.validaciones,
        },
      ])
      .select()

    if (error) {
      console.error("Error al crear proceso:", error)
      return NextResponse.json({ error: "Error al crear proceso" }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error en la API de procesos:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
