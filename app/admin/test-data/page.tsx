"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Database } from "lucide-react"
import { useState } from "react"

export default function TestDataPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInsertTestData = async () => {
    try {
      setLoading(true)
      setSuccess(false)
      setError(null)

      const response = await fetch("/api/insert-test-data")
      const data = await response.json()

      if (data.success) {
        setSuccess(true)
      } else {
        setError(data.error || "Error al insertar datos de prueba")
      }
    } catch (error) {
      console.error("Error:", error)
      setError("Error al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Insertar Datos de Prueba</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Datos de Prueba</CardTitle>
          <CardDescription>
            Esta herramienta insertará datos de prueba en la base de datos para facilitar el QA y las pruebas del
            sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Se insertarán datos de prueba en las siguientes tablas:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Clientes</li>
              <li>Vehículos</li>
              <li>Talleres</li>
              <li>Aseguradoras</li>
              <li>Cotizaciones</li>
              <li>Órdenes</li>
              <li>Materiales de inventario</li>
              <li>Tareas Kanban</li>
            </ul>

            <div className="flex justify-end">
              <Button onClick={handleInsertTestData} disabled={loading}>
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Insertando datos...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Insertar Datos de Prueba
                  </>
                )}
              </Button>
            </div>

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Éxito</AlertTitle>
                <AlertDescription className="text-green-700">
                  Los datos de prueba se han insertado correctamente.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notas Importantes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2">
            <li>Esta herramienta solo insertará datos si las tablas están vacías para evitar duplicados.</li>
            <li>Los datos insertados son ficticios y solo deben usarse para pruebas.</li>
            <li>Si desea eliminar estos datos, utilice la herramienta de administración de la base de datos.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
