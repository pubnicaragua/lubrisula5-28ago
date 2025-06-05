"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"

export default function SupabaseConnectionChecker() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [supabaseUrl, setSupabaseUrl] = useState<string>("")

  const checkConnection = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Intentar obtener la URL de Supabase (solo para mostrar, no para uso en la conexión)
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "No disponible"
      setSupabaseUrl(url)

      // Llamar a la ruta de API en el servidor para verificar la conexión
      const response = await fetch("/api/check-supabase-connection")
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al conectar con Supabase")
      }

      setIsConnected(true)
    } catch (err: any) {
      console.error("Error al verificar la conexión:", err)
      setIsConnected(false)
      setError(err.message || "Error desconocido al conectar con Supabase")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Estado de Conexión a Supabase</CardTitle>
        <CardDescription>Verifica la conexión a la base de datos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium">URL de Supabase:</p>
            <p className="text-sm text-muted-foreground break-all">{supabaseUrl}</p>
          </div>

          {isConnected === null ? (
            <div className="flex items-center justify-center py-4">
              <RefreshCw className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2">Verificando conexión...</span>
            </div>
          ) : isConnected ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800">Conexión exitosa</AlertTitle>
              <AlertDescription className="text-green-700">
                La conexión a Supabase se ha establecido correctamente.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="bg-red-50 border-red-200">
              <XCircle className="h-5 w-5 text-red-600" />
              <AlertTitle className="text-red-800">Error de conexión</AlertTitle>
              <AlertDescription className="text-red-700">
                {error || "No se pudo conectar a Supabase. Verifica las credenciales."}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={checkConnection} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            "Verificar conexión nuevamente"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
