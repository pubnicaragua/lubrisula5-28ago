import { RegistroTallerForm } from "@/components/auth/registro-taller-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Registro de Taller | AutoFlowX",
  description: "Registra tu taller en la plataforma AutoFlowX y comienza a optimizar tus operaciones.",
}

export default function RegistroTallerPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[550px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Registro de Taller</h1>
          <p className="text-sm text-muted-foreground">Completa la información para registrar tu taller en AutoFlowX</p>
        </div>
        <RegistroTallerForm />
      </div>
    </div>
  )
}
