"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function InitializeMaterialsPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const initializeMaterials = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/initialize-materials")
      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: data.message })
      } else {
        setResult({ success: false, message: data.error || "Error al inicializar tablas de materiales" })
      }
    } catch (error) {
      setResult({ success: false, message: "Error al conectar con el servidor" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Inicializar Tablas de Materiales</CardTitle>
          <CardDescription>
            Este proceso creará las tablas necesarias para la gestión de materiales por proceso técnico.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Se crearán las siguientes tablas:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>procesos_taller - Para definir los procesos técnicos</li>
              <li>materiales - Para registrar los materiales utilizados en cada proceso</li>
              <li>material_orden - Para vincular materiales con órdenes de trabajo</li>
              <li>material_cotizacion - Para vincular materiales con cotizaciones</li>
            </ul>

            {result && (
              <Alert variant={result.success ? "default" : "destructive"}>
                {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{result.success ? "Éxito" : "Error"}</AlertTitle>
                <AlertDescription>{result.message}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={initializeMaterials} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inicializando...
              </>
            ) : (
              "Inicializar Tablas de Materiales"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
