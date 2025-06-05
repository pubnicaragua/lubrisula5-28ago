"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function InitializeNewTablesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)

  const handleInitializeTables = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/initialize-new-tables")
      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: data.message })
      } else {
        setResult({ success: false, error: data.error })
      }
    } catch (error) {
      setResult({ success: false, error: (error as Error).message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Inicializar Nuevas Tablas</CardTitle>
          <CardDescription>
            Este proceso creará las nuevas tablas necesarias para las funcionalidades adicionales del sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">Se crearán las siguientes tablas:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Flotas y Conductores</li>
            <li>Equipo de Trabajo y Horarios</li>
            <li>Proveedores y Repuestos</li>
            <li>Procesos y Paquetes de Servicio</li>
            <li>Facturas e Items de Factura</li>
            <li>Citas</li>
          </ul>

          {result && (
            <Alert className="mt-6" variant={result.success ? "default" : "destructive"}>
              {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? "Éxito" : "Error"}</AlertTitle>
              <AlertDescription>{result.success ? result.message : result.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleInitializeTables} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inicializando...
              </>
            ) : (
              "Inicializar Tablas"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
