"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react"

export default function InicializarTallerPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const inicializarTablas = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/initialize-taller", {
        method: "POST",
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Inicializar Módulo de Taller</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Inicialización de Tablas de Taller</CardTitle>
          <CardDescription>
            Este proceso creará las tablas necesarias para el funcionamiento del módulo de taller.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">Se crearán las siguientes tablas si no existen:</p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>procesos_taller - Procesos técnicos del taller</li>
            <li>materiales - Materiales utilizados en cada proceso</li>
            <li>paquetes_servicio - Paquetes de servicios predefinidos</li>
            <li>ordenes_trabajo - Órdenes de trabajo</li>
            <li>tecnicos - Técnicos del taller</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button onClick={inicializarTablas} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inicializando...
              </>
            ) : (
              "Inicializar Tablas de Taller"
            )}
          </Button>
        </CardFooter>
      </Card>

      {result && (
        <Alert variant={result.success ? "default" : "destructive"}>
          {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <AlertTitle>{result.success ? "Inicialización exitosa" : "Error en la inicialización"}</AlertTitle>
          <AlertDescription>{result.success ? result.message : result.error}</AlertDescription>
        </Alert>
      )}

      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={() => (window.location.href = "/taller/dashboard")}>
          Ir al Dashboard de Taller
        </Button>
      </div>
    </div>
  )
}
