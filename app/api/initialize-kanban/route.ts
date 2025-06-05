import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  const supabase = createClient()

  try {
    // Crear tabla kanban_columns si no existe
    const { error: createColumnsError } = await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS kanban_columns (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          description TEXT,
          color TEXT,
          position INTEGER NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (createColumnsError) {
      return NextResponse.json(
        {
          success: false,
          error: "Error al crear tabla kanban_columns",
          detalle: createColumnsError.message,
        },
        { status: 500 },
      )
    }

    // Crear tabla kanban_cards si no existe
    const { error: createCardsError } = await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS kanban_cards (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          column_id UUID REFERENCES kanban_columns(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          description TEXT,
          order_id UUID,
          vehicle_id UUID,
          client_id UUID,
          assigned_to UUID,
          priority TEXT,
          due_date TIMESTAMP WITH TIME ZONE,
          position INTEGER NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (createCardsError) {
      return NextResponse.json(
        {
          success: false,
          error: "Error al crear tabla kanban_cards",
          detalle: createCardsError.message,
        },
        { status: 500 },
      )
    }

    // Verificar si ya existen columnas
    const { data: existingColumns, error: checkError } = await supabase.from("kanban_columns").select("id")

    if (checkError) {
      return NextResponse.json(
        {
          success: false,
          error: "Error al verificar columnas existentes",
          detalle: checkError.message,
        },
        { status: 500 },
      )
    }

    // Si no hay columnas, crear columnas de ejemplo
    if (!existingColumns || existingColumns.length === 0) {
      const columnasEjemplo = [
        { title: "Por Hacer", description: "Tareas pendientes", color: "#1890ff", position: 1 },
        { title: "En Progreso", description: "Tareas en curso", color: "#faad14", position: 2 },
        { title: "En Revisión", description: "Tareas en revisión", color: "#722ed1", position: 3 },
        { title: "Completado", description: "Tareas finalizadas", color: "#52c41a", position: 4 },
      ]

      const { error: insertColumnsError } = await supabase.from("kanban_columns").insert(columnasEjemplo)

      if (insertColumnsError) {
        return NextResponse.json(
          {
            success: false,
            error: "Error al insertar columnas de ejemplo",
            detalle: insertColumnsError.message,
          },
          { status: 500 },
        )
      }

      // Obtener las columnas creadas
      const { data: columns, error: getColumnsError } = await supabase
        .from("kanban_columns")
        .select("id")
        .order("position", { ascending: true })

      if (getColumnsError || !columns || columns.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Error al obtener columnas creadas",
            detalle: getColumnsError?.message || "No se pudieron crear las columnas",
          },
          { status: 500 },
        )
      }

      // Obtener clientes y vehículos para crear tarjetas de ejemplo
      const { data: clients } = await supabase.from("clients").select("id").limit(2)
      const { data: vehicles } = await supabase.from("vehicles").select("id").limit(2)

      if (clients && clients.length > 0 && vehicles && vehicles.length > 0) {
        // Crear tarjetas de ejemplo
        const tarjetasEjemplo = [
          {
            column_id: columns[0].id,
            title: "Revisión inicial",
            description: "Realizar diagnóstico completo del vehículo",
            vehicle_id: vehicles[0].id,
            client_id: clients[0].id,
            priority: "Alta",
            position: 1,
          },
          {
            column_id: columns[0].id,
            title: "Presupuesto",
            description: "Elaborar presupuesto detallado",
            vehicle_id: vehicles[0].id,
            client_id: clients[0].id,
            priority: "Media",
            position: 2,
          },
          {
            column_id: columns[1].id,
            title: "Reparación de carrocería",
            description: "Reparar abolladuras en puerta delantera",
            vehicle_id: vehicles[1].id,
            client_id: clients[1].id,
            priority: "Alta",
            position: 1,
          },
        ]

        const { error: insertCardsError } = await supabase.from("kanban_cards").insert(tarjetasEjemplo)

        if (insertCardsError) {
          return NextResponse.json(
            {
              success: false,
              error: "Error al insertar tarjetas de ejemplo",
              detalle: insertCardsError.message,
            },
            { status: 500 },
          )
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Tablero Kanban inicializado correctamente",
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
        detalle: error.message,
      },
      { status: 500 },
    )
  }
}
