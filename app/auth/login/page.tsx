import type { Metadata } from "next"
import LoginForm from "@/components/auth/login-form"
import SupabaseConnectionStatus from "@/components/supabase-connection-status"

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Iniciar sesión en el sistema de gestión de taller automotriz",
}

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black">Iniciar sesiónnnnn</h1>
          <p className="text-sm text-muted-foreground">Ingresa tus credenciales para acceder al sistema</p>
        </div>
        <SupabaseConnectionStatus />
        <LoginForm />
      </div>
    </div>
  )
}
