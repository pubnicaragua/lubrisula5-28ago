import { NextResponse } from "next/server"
import { setAdminRole } from "@/lib/auth"

export async function POST() {
  try {
    const result = await setAdminRole()

    if (result.success) {
      return NextResponse.json({ success: true, message: "Rol de administrador establecido correctamente" })
    } else {
      return NextResponse.json(
        { success: false, message: "Error al establecer rol de administrador", error: result.error },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error en la API de establecer rol de administrador:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al establecer rol de administrador",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
