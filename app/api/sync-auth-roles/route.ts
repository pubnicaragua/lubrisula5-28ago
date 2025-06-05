import { NextResponse } from "next/server"
import { syncAuthRoles } from "@/lib/scripts/sync-auth-roles"

export async function GET() {
  try {
    const result = await syncAuthRoles()

    if (result.success) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
