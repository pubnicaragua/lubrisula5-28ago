"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Database, AlertTriangle } from "lucide-react"
import Link from "next/link"

export function SupabaseConnectionTest() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [projectInfo, setProjectInfo] = useState<{ url?: string } | null>(null)
  const [needsInitialization, setNeedsInitialization] = useState<boolean>(false)

  const testConnection = async () => {
    try {
      setIsConnected(null)
      setError(null)
      setNeedsInitialization(false)

      const supabase = getSupabaseClient()

      // Primero probamos una conexión básica
      const { data: testData, error: testError } = await supabase.from("clientes").select("count").limit(1).single()

      if (testError) {
        // Verificamos si el error es porque la tabla no existe
        if (testError.message.includes("does not exist")) {
          setNeedsInitialization(true)
          // La conexión funciona, pero la tabla no existe
          setIsConnected(true)
          setError("La base de datos necesita ser inicializada. Las tablas no existen.")
        } else {
          throw testError
        }
      } else {
        // Si no hay error, la conexión funciona y las tablas existen
        setIsConnected(true)
      }

      setProjectInfo({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      })
    } catch (err: any) {
      console.error("Error al probar la conexión:", err)
      setIsConnected(false)
      setError(err.message || "Error al conectar con Supabase")
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Prueba de Conexión a Supabase</CardTitle>
        <CardDescription>Verifica si la aplicación puede conectarse a tu proyecto de Supabase</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected === null ? (
          <div className="flex items-center justify-center p-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span className="ml-2">Verificando conexión...</span>
          </div>
        ) : isConnected && !needsInitialization ? (
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4 mr-2" />
            <AlertDescription>
              Conexión exitosa a Supabase
              {projectInfo?.url && <div className="text-xs mt-1">URL: {projectInfo.url}</div>}
            </AlertDescription>
          </Alert>
        ) : isConnected && needsInitialization ? (
          <Alert variant="warning" className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertTitle className="text-amber-800">Base de datos no inicializada</AlertTitle>
            <AlertDescription className="text-amber-700">
              <p>La conexión a Supabase es correcta, pero la base de datos no ha sido inicializada.</p>
              <p className="mt-2">
                Es necesario crear las tablas en la base de datos para que la aplicación funcione correctamente.
              </p>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4 mr-2" />
            <AlertDescription>
              Error al conectar con Supabase: {error}
              <div className="text-xs mt-1">Verifica tus credenciales en el archivo .env.local</div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
        <Button onClick={testConnection} variant="outline" className="w-full sm:w-auto">
          Probar Conexión Nuevamente
        </Button>

        {isConnected && needsInitialization && (
          <Button asChild className="w-full sm:w-auto">
            <Link href="/initialize-database">
              <Database className="h-4 w-4 mr-2" />
              Inicializar Base de Datos
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
