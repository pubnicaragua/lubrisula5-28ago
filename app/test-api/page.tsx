"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function TestApiPage() {
  const [results, setResults] = useState<{
    [key: string]: {
      status: "idle" | "loading" | "success" | "error"
      data?: any
      error?: string
    }
  }>({
    checkConnection: { status: "idle" },
    testDirect: { status: "idle" },
  })

  const testEndpoint = async (endpoint: string, key: string) => {
    setResults((prev) => ({
      ...prev,
      [key]: { status: "loading" },
    }))

    try {
      const response = await fetch(endpoint)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error en la solicitud")
      }

      setResults((prev) => ({
        ...prev,
        [key]: {
          status: "success",
          data,
        },
      }))
    } catch (error) {
      console.error(`Error al probar ${endpoint}:`, error)
      setResults((prev) => ({
        ...prev,
        [key]: {
          status: "error",
          error: error instanceof Error ? error.message : "Error desconocido",
        },
      }))
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Prueba de APIs</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Verificar Conexión</CardTitle>
            <CardDescription>Prueba la ruta de API para verificar la conexión a Supabase</CardDescription>
          </CardHeader>
          <CardContent>
            {results.checkConnection.status === "idle" && (
              <Alert>
                <AlertTitle>No probado</AlertTitle>
                <AlertDescription>Haz clic en el botón para probar la conexión</AlertDescription>
              </Alert>
            )}

            {results.checkConnection.status === "loading" && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertTitle>Probando...</AlertTitle>
                <AlertDescription>Verificando la conexión a Supabase</AlertDescription>
              </Alert>
            )}

            {results.checkConnection.status === "success" && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-700">Conexión exitosa</AlertTitle>
                <AlertDescription className="text-green-600">
                  La API de verificación de conexión funciona correctamente
                </AlertDescription>
              </Alert>
            )}

            {results.checkConnection.status === "error" && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{results.checkConnection.error || "Error al verificar la conexión"}</AlertDescription>
              </Alert>
            )}

            {(results.checkConnection.status === "success" || results.checkConnection.status === "error") && (
              <div className="mt-4">
                <details className="text-sm">
                  <summary className="cursor-pointer font-medium">Ver respuesta completa</summary>
                  <pre className="mt-2 bg-gray-100 p-2 rounded overflow-x-auto text-xs">
                    {JSON.stringify(results.checkConnection.data || results.checkConnection.error, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => testEndpoint("/api/check-supabase-connection", "checkConnection")}
              disabled={results.checkConnection.status === "loading"}
            >
              {results.checkConnection.status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Probando...
                </>
              ) : (
                "Probar conexión"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prueba Directa</CardTitle>
            <CardDescription>Prueba la conexión directa a Supabase desde el servidor</CardDescription>
          </CardHeader>
          <CardContent>
            {results.testDirect.status === "idle" && (
              <Alert>
                <AlertTitle>No probado</AlertTitle>
                <AlertDescription>Haz clic en el botón para probar la conexión directa</AlertDescription>
              </Alert>
            )}

            {results.testDirect.status === "loading" && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertTitle>Probando...</AlertTitle>
                <AlertDescription>Verificando la conexión directa a Supabase</AlertDescription>
              </Alert>
            )}

            {results.testDirect.status === "success" && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-700">Conexión exitosa</AlertTitle>
                <AlertDescription className="text-green-600">
                  La conexión directa a Supabase funciona correctamente
                </AlertDescription>
              </Alert>
            )}

            {results.testDirect.status === "error" && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {results.testDirect.error || "Error al verificar la conexión directa"}
                </AlertDescription>
              </Alert>
            )}

            {(results.testDirect.status === "success" || results.testDirect.status === "error") && (
              <div className="mt-4">
                <details className="text-sm">
                  <summary className="cursor-pointer font-medium">Ver respuesta completa</summary>
                  <pre className="mt-2 bg-gray-100 p-2 rounded overflow-x-auto text-xs">
                    {JSON.stringify(results.testDirect.data || results.testDirect.error, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => testEndpoint("/api/test-supabase-direct", "testDirect")}
              disabled={results.testDirect.status === "loading"}
            >
              {results.testDirect.status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Probando...
                </>
              ) : (
                "Probar conexión directa"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
