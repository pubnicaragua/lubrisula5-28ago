import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = createClient()

  try {
    // Verificar si la tabla existe
    const { data: tableExists, error: tableError } = await supabase.rpc("execute_sql", {
      sql_query: `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public'
          AND table_name = 'suppliers'
        );
      `,
    })

    if (tableError) {
      console.error("Error al verificar tabla suppliers:", tableError)
      return NextResponse.json({ error: "Error al verificar tabla suppliers" }, { status: 500 })
    }

    const exists = tableExists && tableExists.length > 0 && tableExists[0].exists

    if (!exists) {
      return NextResponse.json([])
    }

    const { data, error } = await supabase.from("suppliers").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Error al obtener proveedores:", error)
      return NextResponse.json({ error: "Error al obtener proveedores" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error en la API de proveedores:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = createClient()

  try {
    const body = await request.json()

    // Validar datos requeridos
    if (!body.name) {
      return NextResponse.json({ error: "Nombre es un campo requerido" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("suppliers")
      .insert([
        {
          name: body.name,
          contact_name: body.contact_name,
          email: body.email,
          phone: body.phone,
          address: body.address,
          notes: body.notes,
        },
      ])
      .select()

    if (error) {
      console.error("Error al crear proveedor:", error)
      return NextResponse.json({ error: "Error al crear proveedor" }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error en la API de proveedores:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
