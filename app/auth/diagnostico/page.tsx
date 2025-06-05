"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function AuthDiagnosticPage() {
  const [testResults, setTestResults] = useState<{
    status: "idle" | "loading" | "success" | "error"
    message?: string
    details?: any
  }>({ status: "idle" })

  const runDiagnostic = async () => {
    setTestResults({ status: "loading" })

    try {
      // Verificar variables de entorno
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Variables de entorno de Supabase no configuradas")
      }

      // Crear cliente de Supabase
      const supabase = createClientComponentClient()

      // Probar una operación simple de autenticación (obtener la sesión actual)
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        throw error
      }

      // Prueba exitosa
      setTestResults({
        status: "success",
        message: "Conexión exitosa con el servicio de autenticación de Supabase",
        details: {
          session: data.session ? "Activa" : "No hay sesión activa",
          supabaseUrl,
        },
      })
    } catch (error: any) {
      console.error("Error en diagnóstico de autenticación:", error)
      setTestResults({
        status: "error",
        message: error.message || "Error desconocido",
        details: error,
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Diagnóstico de Autenticación</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Prueba de Conexión de Autenticación</CardTitle>
          <CardDescription>Verifica la conexión con el servicio de autenticación de Supabase</CardDescription>
        </CardHeader>
        <CardContent>
          {testResults.status === "idle" && (
            <Alert>
              <AlertTitle>No probado</AlertTitle>
              <AlertDescription>Haz clic en el botón para probar la conexión</AlertDescription>
            </Alert>
          )}

          {testResults.status === "loading" && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertTitle>Probando...</AlertTitle>
              <AlertDescription>Verificando la conexión con el servicio de autenticación</AlertDescription>
            </Alert>
          )}

          {testResults.status === "success" && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-700">Conexión exitosa</AlertTitle>
              <AlertDescription className="text-green-600">{testResults.message}</AlertDescription>
            </Alert>
          )}

          {testResults.status === "error" && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{testResults.message}</AlertDescription>
            </Alert>
          )}

          {(testResults.status === "success" || testResults.status === "error") && testResults.details && (
            <div className="mt-4">
              <details className="text-sm">
                <summary className="cursor-pointer font-medium">Ver detalles</summary>
                <pre className="mt-2 bg-gray-100 p-2 rounded overflow-x-auto text-xs">
                  {JSON.stringify(testResults.details, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={runDiagnostic} disabled={testResults.status === "loading"}>
            {testResults.status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Probando...
              </>
            ) : (
              "Ejecutar diagnóstico"
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Solución de problemas comunes</h2>

        <div className="space-y-2">
          <h3 className="font-medium">Error "fetch failed"</h3>
          <p className="text-sm text-gray-600">
            Este error generalmente ocurre cuando hay problemas de red o CORS. Asegúrate de que:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            <li>Las variables de entorno estén correctamente configuradas en Vercel</li>
            <li>El dominio de tu aplicación esté permitido en la configuración de CORS de Supabase</li>
            <li>No haya problemas de red que impidan la conexión</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Error "Invalid login credentials"</h3>
          <p className="text-sm text-gray-600">
            Este error ocurre cuando el correo o la contraseña son incorrectos. Asegúrate de que:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            <li>El correo y la contraseña sean correctos</li>
            <li>La cuenta exista en Supabase</li>
            <li>La cuenta no esté bloqueada o desactivada</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
