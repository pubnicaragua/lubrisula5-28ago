"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react"

export default function SupabaseConnectionStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "error">("checking")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const checkConnection = async () => {
    setStatus("checking")
    setErrorMessage(null)
    setErrorDetails(null)

    try {
      // Llamar a la ruta de API en el servidor para verificar la conexión
      const response = await fetch("/api/check-supabase-connection")
      const data = response

      if (!response.ok || data.status !== 200) {
        throw new Error(data.statusText || "Error al conectar con Supabase")
      }

      setStatus("connected")
    } catch (error) {
      console.error("Error de conexión:", error)
      setStatus("error")

      if (error instanceof Error) {
        setErrorMessage(error.message)
        setErrorDetails(error.stack || "No hay detalles adicionales disponibles")
      } else {
        setErrorMessage("Error desconocido al conectar con Supabase")
        setErrorDetails(JSON.stringify(error))
      }
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <div className="mb-6">
      {status === "checking" && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertTitle>Verificando conexión</AlertTitle>
          <AlertDescription>Comprobando la conexión con Supabase...</AlertDescription>
        </Alert>
      )}

      {status === "connected" && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Conexión establecida</AlertTitle>
          <AlertDescription className="text-green-600">
            La conexión con Supabase está funcionando correctamente.
          </AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error de conexión</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>
              {errorMessage || "No se pudo conectar con Supabase. Verifica tu conexión a internet y las credenciales."}
            </p>

            {errorDetails && (
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-1 mb-2"
                >
                  {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {showDetails ? "Ocultar detalles" : "Mostrar detalles"}
                </Button>

                {showDetails && (
                  <pre className="bg-gray-800 text-white p-2 rounded text-xs overflow-x-auto">{errorDetails}</pre>
                )}
              </div>
            )}

            <Button variant="outline" size="sm" onClick={checkConnection} className="mt-2 w-fit">
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
