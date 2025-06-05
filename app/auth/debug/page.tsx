import { AuthDebug } from "@/components/auth/auth-debug"

export default function AuthDebugPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Diagnóstico de Autenticación</h1>
      <AuthDebug />
    </div>
  )
}
