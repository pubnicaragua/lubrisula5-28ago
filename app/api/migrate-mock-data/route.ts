import { migrateMockDataToSupabase } from "@/lib/scripts/migrate-mock-data-to-supabase"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("🚀 Iniciando migración de datos mock...")

    const result = await migrateMockDataToSupabase()

    return NextResponse.json({
      success: true,
      message: "Migración completada exitosamente",
      data: result,
    })
  } catch (error) {
    console.error("❌ Error en la migración:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Error durante la migración",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Endpoint para migrar datos mock a Supabase",
    instructions: "Usa POST para ejecutar la migración",
  })
}
