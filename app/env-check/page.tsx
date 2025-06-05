"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabaseClient } from "@/lib/supabase/client"

export default function EnvCheckPage() {
  const [envVars, setEnvVars] = useState<{ [key: string]: string | undefined }>({})
  const [connectionStatus, setConnectionStatus] = useState<"loading" | "success" | "error">("loading")
  const [connectionError, setConnectionError] = useState<string | null>(null)

  useEffect(() => {
    // Solo podemos acceder a las variables NEXT_PUBLIC en el cliente
    setEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10)}...`
        : undefined,
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY
        ? `${process.env.VITE_SUPABASE_ANON_KEY.substring(0, 10)}...`
        : undefined,
    })

    // Probar la conexión a Supabase
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      setConnectionStatus("loading")
      setConnectionError(null)

      const supabase = getSupabaseClient()

      // Intenta hacer una consulta simple para verificar la conexión
      const { error } = await supabase.from("clients").select("count").limit(1)

      if (error) throw error

      setConnectionStatus("success")
    } catch (err: any) {
      console.error("Error al probar la conexión:", err)
      setConnectionError(err.message || "Error al conectar con Supabase")
      setConnectionStatus("error")
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Verificación de Variables de Entorno</h1>
      <div className="max-w-md mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Variables de Entorno</CardTitle>
            <CardDescription>Verifica si las variables de entorno están disponibles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="font-medium">{key}:</span>
                {value ? (
                  <Alert className="bg-green-50 border-green-200 text-green-800 py-1 px-2 inline-flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <AlertDescription>{value}</AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive" className="py-1 px-2 inline-flex items-center">
                    <XCircle className="h-4 w-4 mr-2" />
                    <AlertDescription>No disponible</AlertDescription>
                  </Alert>
                )}
              </div>
            ))}

            <div className="mt-4 text-sm text-gray-500">
              <p>
                Nota: Las variables de servidor (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) solo son accesibles en el
                servidor y no se pueden verificar aquí.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prueba de Conexión a Supabase</CardTitle>
            <CardDescription>Verifica si la aplicación puede conectarse a tu proyecto de Supabase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {connectionStatus === "loading" ? (
              <div className="flex items-center justify-center p-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span className="ml-2">Verificando conexión...</span>
              </div>
            ) : connectionStatus === "success" ? (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <CheckCircle className="h-4 w-4 mr-2" />
                <AlertDescription>Conexión exitosa a Supabase</AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Error al conectar con Supabase: {connectionError}
                  <div className="text-xs mt-1">Verifica tus credenciales en el archivo .env.local</div>
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={testConnection} className="w-full">
              Probar Conexión Nuevamente
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
