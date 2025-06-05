"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export default function EnvChecker() {
  const [envStatus, setEnvStatus] = useState<{ [key: string]: boolean | null }>({
    NEXT_PUBLIC_SUPABASE_URL: null,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: null,
  })

  useEffect(() => {
    // Verificar si las variables de entorno están definidas
    setEnvStatus({
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
  }, [])

  const allDefined = Object.values(envStatus).every((status) => status === true)
  const anyUndefined = Object.values(envStatus).some((status) => status === false)

  return (
    <div className="space-y-4">
      <Alert
        className={
          allDefined
            ? "bg-green-50 border-green-200"
            : anyUndefined
              ? "bg-red-50 border-red-200"
              : "bg-yellow-50 border-yellow-200"
        }
      >
        {allDefined && <CheckCircle className="h-4 w-4 text-green-500" />}
        {anyUndefined && <XCircle className="h-4 w-4 text-red-500" />}
        {!allDefined && !anyUndefined && <AlertTriangle className="h-4 w-4 text-yellow-500" />}

        <AlertTitle className={allDefined ? "text-green-700" : anyUndefined ? "text-red-700" : "text-yellow-700"}>
          {allDefined
            ? "Variables de entorno configuradas correctamente"
            : anyUndefined
              ? "Faltan variables de entorno"
              : "Verificando variables de entorno"}
        </AlertTitle>

        <AlertDescription>
          <div className="mt-2 space-y-2">
            {Object.entries(envStatus).map(([key, status]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="font-mono text-sm">{key}:</span>
                {status === true && (
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    Configurada
                  </Badge>
                )}
                {status === false && (
                  <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                    No configurada
                  </Badge>
                )}
                {status === null && (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    Verificando...
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </AlertDescription>
      </Alert>

      <div className="text-sm text-gray-500">
        <p>Nota: Las variables de entorno con prefijo NEXT_PUBLIC_ son accesibles en el cliente.</p>
        <p>Si alguna variable no está configurada, asegúrate de agregarla en la configuración de Vercel.</p>
      </div>
    </div>
  )
}
