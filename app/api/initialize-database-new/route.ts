import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/scripts/initialize-database-new"

export async function GET() {
  try {
    const result = await initializeDatabase()

    if (result.success) {
      return NextResponse.json({ success: true, message: result.message })
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Error en la ruta de inicialización de la base de datos:", error)
    return NextResponse.json({ success: false, message: error.message || "Error desconocido" }, { status: 500 })
  }
}
