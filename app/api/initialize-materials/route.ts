import { NextResponse } from "next/server"
import { createMaterialsTables } from "@/lib/scripts/create-materials-tables"

export async function GET() {
  try {
    const result = await createMaterialsTables()

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ message: "Tablas de materiales inicializadas correctamente" })
  } catch (error) {
    console.error("Error al inicializar tablas de materiales:", error)
    return NextResponse.json({ error: "Error al inicializar tablas de materiales" }, { status: 500 })
  }
}
