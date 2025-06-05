import { NextResponse } from "next/server"
import { initializeData } from "@/lib/scripts/initialize-data"

export async function GET() {
  try {
    await initializeData()
    return NextResponse.json({ success: true, message: "Datos inicializados correctamente" })
  } catch (error) {
    console.error("Error al inicializar datos:", error)
    return NextResponse.json(
      { success: false, message: "Error al inicializar datos", error: String(error) },
      { status: 500 },
    )
  }
}
