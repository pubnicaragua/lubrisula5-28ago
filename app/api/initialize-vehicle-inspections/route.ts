import { NextResponse } from "next/server"
import { initializeVehicleInspections } from "@/lib/scripts/initialize-vehicle-inspections"

export async function GET() {
  try {
    const result = await initializeVehicleInspections()

    if (!result.success) {
      return NextResponse.json({ error: result.message, details: result.error }, { status: 500 })
    }

    return NextResponse.json({ message: result.message })
  } catch (error) {
    console.error("Error in initialize-vehicle-inspections API:", error)
    return NextResponse.json({ error: "Error al inicializar la tabla de inspecciones de vehículos" }, { status: 500 })
  }
}
