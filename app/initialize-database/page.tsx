"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Database, Loader2 } from "lucide-react"
import Link from "next/link"

export default function InitializeDatabasePage() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleInitializeDatabase = async () => {
    try {
      setIsInitializing(true)
      setResult(null)

      const response = await fetch("/api/initialize-database")
      const data = await response.json()

      if (data.success) {
        setResult({
          success: true,
          message: "Base de datos inicializada correctamente. Se han creado todas las tablas necesarias.",
        })
      } else {
        setResult({
          success: false,
          message: `Error: ${data.error || data.message || "Error desconocido"}`,
        })
      }
    } catch (error) {
      console.error("Error al inicializar la base de datos:", error)
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : "Error desconocido"}`,
      })
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Inicializar Base de Datos
          </CardTitle>
          <CardDescription>
            Este proceso creará todas las tablas necesarias para el funcionamiento del sistema Lubrisula
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="warning" className="mb-4">
            <AlertTitle>Advertencia</AlertTitle>
            <AlertDescription>
              <p>Este proceso es necesario para el primer uso del sistema. Se crearán 58 tablas en la base de datos.</p>
              <p className="mt-2">
                Si ya has inicializado la base de datos anteriormente, no es necesario volver a hacerlo.
              </p>
            </AlertDescription>
          </Alert>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"} className="mb-4">
              {result.success ? <CheckCircle className="h-4 w-4 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
              <AlertTitle>{result.success ? "Éxito" : "Error"}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleInitializeDatabase} disabled={isInitializing} className="w-full sm:w-auto">
            {isInitializing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inicializando...
              </>
            ) : (
              "Inicializar Base de Datos"
            )}
          </Button>

          {result?.success && (
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/test-connection">Verificar Conexión</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
