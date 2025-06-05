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
          AND table_name = 'paquetes_servicio'
        );
      `,
    })

    if (tableError) {
      console.error("Error al verificar tabla paquetes_servicio:", tableError)
      return NextResponse.json({ error: "Error al verificar tabla paquetes_servicio" }, { status: 500 })
    }

    const exists = tableExists && tableExists.length > 0 && tableExists[0].exists

    if (!exists) {
      return NextResponse.json([])
    }

    // Obtener paquetes de servicio con sus procesos
    const { data, error } = await supabase
      .from("paquetes_servicio")
      .select(`
        *,
        procesos:procesos_paquete(
          proceso:proceso_id(
            id,
            nombre,
            tipo
          )
        )
      `)
      .order("nombre", { ascending: true })

    if (error) {
      console.error("Error al obtener paquetes de servicio:", error)
      return NextResponse.json({ error: "Error al obtener paquetes de servicio" }, { status: 500 })
    }

    // Transformar los datos para un formato más fácil de usar
    const paquetesFormateados = data.map((paquete) => {
      const procesos = paquete.procesos
        ? paquete.procesos
            .filter((p: any) => p.proceso) // Filtrar procesos nulos
            .map((p: any) => p.proceso)
        : []

      return {
        ...paquete,
        procesos,
      }
    })

    return NextResponse.json(paquetesFormateados)
  } catch (error) {
    console.error("Error en la API de paquetes de servicio:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
