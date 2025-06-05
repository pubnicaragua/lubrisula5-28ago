import { performQACheck } from "@/lib/scripts/qa-check"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const results = await performQACheck()
    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error("Error al realizar la verificación de QA:", error)
    return NextResponse.json({ success: false, error: "Error al realizar la verificación de QA" }, { status: 500 })
  }
}
