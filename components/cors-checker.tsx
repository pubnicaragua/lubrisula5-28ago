"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function CorsChecker() {
  const [status, setStatus] = useState<"idle" | "checking" | "success" | "error">("idle")
  const [message, setMessage] = useState<string | null>(null)

  const checkCors = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setStatus("error")
      setMessage("URL de Supabase no configurada")
      return
    }

    setStatus("checking")
    setMessage(null)

    try {
      // Intentar una solicitud simple a Supabase para verificar CORS
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
        },
      })

      // Si la respuesta es 404, es normal porque la ruta no existe, pero significa que CORS está bien
      // Si es un error de CORS, la solicitud fallará antes de llegar aquí
      setStatus("success")
      setMessage("Configuración de CORS correcta. El dominio está permitido.")
    } catch (error) {
      console.error("Error al verificar CORS:", error)
      setStatus("error")
      setMessage(
        "Error de CORS detectado. Asegúrate de que el dominio de tu aplicación esté permitido en la configuración de CORS de Supabase.",
      )
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Verificación de CORS</h2>

      {status === "idle" && (
        <Alert>
          <AlertTitle>No verificado</AlertTitle>
          <AlertDescription>Haz clic en el botón para verificar la configuración de CORS</AlertDescription>
        </Alert>
      )}

      {status === "checking" && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertTitle>Verificando...</AlertTitle>
          <AlertDescription>Comprobando la configuración de CORS</AlertDescription>
        </Alert>
      )}

      {status === "success" && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">CORS configurado correctamente</AlertTitle>
          <AlertDescription className="text-green-600">{message}</AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error de CORS</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Button onClick={checkCors} disabled={status === "checking"}>
        {status === "checking" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verificando...
          </>
        ) : (
          "Verificar CORS"
        )}
      </Button>

      {status === "error" && (
        <div className="text-sm text-gray-600 mt-4">
          <h3 className="font-medium">Cómo solucionar problemas de CORS:</h3>
          <ol className="list-decimal pl-5 space-y-1 mt-2">
            <li>Inicia sesión en tu proyecto de Supabase</li>
            <li>Ve a "Authentication" &gt; "URL Configuration"</li>
            <li>Agrega el dominio de tu aplicación en Vercel a la lista de dominios permitidos</li>
            <li>
              El formato debe ser:{" "}
              <code className="bg-gray-100 px-1 py-0.5 rounded">https://tu-proyecto.vercel.app</code>
            </li>
            <li>Guarda los cambios y espera unos minutos para que se apliquen</li>
          </ol>
        </div>
      )}
    </div>
  )
}
