import { RegistroTallerForm } from "@/components/auth/registro-taller-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Registro de Taller | AutoFlowX",
  description: "Registra tu taller en la plataforma AutoFlowX y comienza a optimizar tus operaciones.",
}

export default function RegistroTallerPage() {
  return (
    <main className="container flex w-screen flex-col items-center justify-center overflow-auto h-[100vh] p-3">
        <div className="flex flex-col p-2 text-center h-[10%]">
          <h1 className="text-2xl font-semibold tracking-tight">Registro de Taller</h1>
          <p className="text-sm text-muted-foreground">Completa la información para registrar tu taller en AutoFlowX</p>
        </div>
        <div className="h-[90%]">

        <RegistroTallerForm />
        </div>
    </main>
  )
}
