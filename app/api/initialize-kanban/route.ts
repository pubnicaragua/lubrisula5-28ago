import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin-client"

export async function POST() {
  try {
    // Crear tabla kanban_columns si no existe con BIGSERIAL
    const { error: createColumnsError } = await supabaseAdmin.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS kanban_columns (
          id BIGSERIAL PRIMARY KEY,
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
    const { error: createCardsError } = await supabaseAdmin.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS kanban_cards (
          id BIGSERIAL PRIMARY KEY,
          column_id BIGINT REFERENCES kanban_columns(id) ON DELETE CASCADE,
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
    const { data: existingColumns, error: checkError } = await supabaseAdmin.from("kanban_columns").select("id")

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

    // Si no hay columnas, crear columnas de ejemplo usando SQL directo
    if (!existingColumns || existingColumns.length === 0) {
      const { error: insertColumnsError } = await supabaseAdmin.rpc("execute_sql", {
        sql_query: `
          INSERT INTO kanban_columns (title, description, color, position, created_at, updated_at)
          VALUES 
            ('Por Hacer', 'Tareas pendientes', '#1890ff', 0, NOW(), NOW()),
            ('En Progreso', 'Tareas en curso', '#faad14', 1, NOW(), NOW()),
            ('En Revisión', 'Tareas en revisión', '#722ed1', 2, NOW(), NOW()),
            ('Completado', 'Tareas finalizadas', '#52c41a', 3, NOW(), NOW());
        `,
      })

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
