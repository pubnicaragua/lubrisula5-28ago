import { NextResponse } from "next/server"
import { initializeNewTables } from "@/lib/scripts/initialize-new-tables"

export async function GET() {
  try {
    const result = await initializeNewTables()

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ message: result.message })
  } catch (error) {
    console.error("Error in initialize-new-tables route:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
