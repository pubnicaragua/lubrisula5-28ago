"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Database, RefreshCw } from "lucide-react"

export default function InitializeDatabasePage() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleInitializeDatabase = async () => {
    setIsInitializing(true)
    setResult(null)

    try {
      const response = await fetch("/api/initialize-database-new")
      const data = await response.json()

      setResult(data)
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || "Error desconocido al inicializar la base de datos",
      })
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Inicialización de Base de Datos</h1>

      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Inicializar Base de Datos</CardTitle>
          <CardDescription>
            Este proceso creará las tablas necesarias y datos iniciales en la nueva instancia de Supabase
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result && (
            <Alert className={result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <AlertTitle className={result.success ? "text-green-800" : "text-red-800"}>
                {result.success ? "Inicialización exitosa" : "Error de inicialización"}
              </AlertTitle>
              <AlertDescription className={result.success ? "text-green-700" : "text-red-700"}>
                {result.message}
              </AlertDescription>
            </Alert>
          )}

          {!result && !isInitializing && (
            <div className="py-4 text-center">
              <Database className="h-12 w-12 mx-auto text-primary mb-4" />
              <p className="text-muted-foreground">
                Haz clic en el botón para inicializar la base de datos con las tablas necesarias y datos iniciales.
              </p>
            </div>
          )}

          {isInitializing && (
            <div className="flex items-center justify-center py-4">
              <RefreshCw className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2">Inicializando base de datos...</span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleInitializeDatabase} disabled={isInitializing} className="w-full">
            {isInitializing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Inicializando...
              </>
            ) : (
              "Inicializar Base de Datos"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
