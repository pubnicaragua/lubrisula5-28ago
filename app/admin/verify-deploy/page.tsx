"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"

interface VerificationResult {
  success: boolean
  message: string
  details: any
}

export default function VerifyDeployPage() {
  const [supabaseStatus, setSupabaseStatus] = useState<VerificationResult | null>(null)
  const [loading, setLoading] = useState(true)

  const verifySupabase = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/verify-supabase")
      const data = await response.json()
      setSupabaseStatus(data)
    } catch (error) {
      setSupabaseStatus({
        success: false,
        message: "Error al verificar Supabase",
        details: error instanceof Error ? error.message : "Error desconocido",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    verifySupabase()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Verificación del Deploy</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Configuración de Supabase</CardTitle>
          <CardDescription>Verifica la conexión con Supabase</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Verificando...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2 mb-4">
                {supabaseStatus?.success ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
                <span className={supabaseStatus?.success ? "text-green-600" : "text-red-600"}>
                  {supabaseStatus?.message}
                </span>
              </div>

              {!supabaseStatus?.success && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Error de configuración</AlertTitle>
                  <AlertDescription>
                    <p>Detalles del error:</p>
                    <pre className="mt-2 bg-slate-950 p-4 rounded-md overflow-x-auto text-xs">
                      {JSON.stringify(supabaseStatus?.details, null, 2)}
                    </pre>
                  </AlertDescription>
                </Alert>
              )}

              <Button onClick={verifySupabase} className="mt-4" variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Verificar de nuevo
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
        <h3 className="text-amber-800 font-medium mb-2">Pasos después del deploy</h3>
        <ol className="list-decimal list-inside text-amber-700 space-y-2">
          <li>
            Visita <code className="bg-amber-100 px-1 rounded">/initialize-all</code> para inicializar todas las tablas
          </li>
          <li>
            Visita <code className="bg-amber-100 px-1 rounded">/admin/set-superadmin</code> para configurar el primer
            usuario como superadmin
          </li>
          <li>Verifica que puedes iniciar sesión con el usuario superadmin</li>
          <li>Configura los roles y permisos para los demás usuarios</li>
        </ol>
      </div>
    </div>
  )
}
