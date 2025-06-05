import { TallerDashboard } from "@/components/taller/taller-dashboard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | AUTOFLOWX",
  description: "Panel de control del taller",
}

export default function DashboardPage() {
  return <TallerDashboard />
}
