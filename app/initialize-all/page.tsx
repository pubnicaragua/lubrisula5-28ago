"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, RefreshCw, Database, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function InitializeAllPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const initializeAll = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/initialize-all", {
        method: "POST",
      })

      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      setResult({
        success: false,
        error: "Error al realizar la solicitud",
        details: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Inicialización Completa del Sistema</CardTitle>
          <CardDescription>
            Esta herramienta creará todas las tablas necesarias, asignará roles a usuarios y añadirá datos de ejemplo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Importante</AlertTitle>
            <AlertDescription>
              Este proceso creará todas las tablas necesarias en la base de datos. Si las tablas ya existen, se
              mantendrán los datos existentes. Asegúrate de tener una copia de seguridad si es necesario.
            </AlertDescription>
          </Alert>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? "Inicialización Exitosa" : "Error de Inicialización"}</AlertTitle>
              <AlertDescription>
                {result.success
                  ? `La base de datos se ha inicializado correctamente. Se han creado ${result.details?.tablas?.length} tablas.`
                  : `Error: ${result.error}. Detalles: ${result.details}`}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Tablas que se crearán:</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                "roles",
                "roles_usuario",
                "clients",
                "vehicles",
                "talleres",
                "aseguradoras",
                "quotations",
                "quotation_parts",
                "orders",
                "order_details",
                "materiales",
                "kanban_columns",
                "kanban_cards",
              ].map((table) => (
                <div key={table} className="flex items-center gap-2 p-2 border rounded">
                  <Database className="h-4 w-4 text-primary" />
                  <span>{table}</span>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-medium mt-4">Usuarios que se asignarán:</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2 p-2 border rounded">
                <span className="font-medium">dxgabalt@gmail.com:</span>
                <span>Rol admin</span>
              </div>
              <div className="flex items-center gap-2 p-2 border rounded">
                <span className="font-medium">dxgabalt2@gmail.com:</span>
                <span>Rol admin</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/diagnostico-supabase">Verificar Conexión</Link>
          </Button>
          <Button onClick={initializeAll} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Inicializando...
              </>
            ) : (
              "Inicializar Todo"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
