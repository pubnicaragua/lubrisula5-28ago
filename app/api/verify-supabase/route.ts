import { NextResponse } from "next/server"
import { verifySupabaseConfig } from "@/lib/scripts/verify-supabase-config"

export async function GET() {
  const result = await verifySupabaseConfig()

  if (!result.success) {
    return NextResponse.json(result, { status: 500 })
  }

  return NextResponse.json(result)
}
