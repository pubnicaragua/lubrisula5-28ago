import { insertTestData } from "@/lib/scripts/insert-test-data"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await insertTestData()
    return NextResponse.json({ success: true, message: "Datos de prueba insertados correctamente" })
  } catch (error) {
    console.error("Error al insertar datos de prueba:", error)
    return NextResponse.json({ success: false, error: "Error al insertar datos de prueba" }, { status: 500 })
  }
}
