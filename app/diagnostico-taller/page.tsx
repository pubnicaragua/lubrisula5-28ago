"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function DiagnosticoTallerPage() {
  const [loading, setLoading] = useState(true)
  const [tablas, setTablas] = useState({})
  const [inicializando, setInicializando] = useState(false)
  const [resultado, setResultado] = useState(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    verificarTablas()
  }, [])

  const verificarTablas = async () => {
    setLoading(true)
    try {
      // Verificar tablas principales del taller
      const tablasParaVerificar = ["procesos_taller", "materiales", "paquetes_servicio", "ordenes_trabajo", "tecnicos"]

      const resultados = {}

      for (const tabla of tablasParaVerificar) {
        try {
          const { data, error } = await supabase.from(tabla).select("count(*)").limit(1).single()

          resultados[tabla] = !error
        } catch (error) {
          resultados[tabla] = false
        }
      }

      setTablas(resultados)
    } catch (error) {
      console.error("Error al verificar tablas:", error)
    } finally {
      setLoading(false)
    }
  }

  const inicializarTablas = async () => {
    setInicializando(true)
    try {
      const response = await fetch("/api/initialize-taller", {
        method: "POST",
      })
      const data = await response.json()
      setResultado(data)
      if (data.success) {
        await verificarTablas()
      }
    } catch (error) {
      setResultado({ success: false, error: error.message })
    } finally {
      setInicializando(false)
    }
  }

  const todasTablasExisten = () => {
    return Object.values(tablas).every(Boolean)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Diagnóstico del Módulo de Taller</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Estado de las Tablas</CardTitle>
          <CardDescription>Verificación de las tablas necesarias para el módulo de taller</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(tablas).map(([tabla, existe]) => (
                  <React.Fragment key={tabla}>
                    <div className="text-sm font-medium">{tabla}:</div>
                    <div className="flex items-center">
                      {existe ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                      )}
                      {existe ? "Existe" : "No existe"}
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {!todasTablasExisten() && (
                <Alert variant="warning" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Tablas faltantes</AlertTitle>
                  <AlertDescription>
                    Algunas tablas necesarias no existen. Haz clic en "Inicializar Tablas" para crearlas.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={verificarTablas} disabled={loading}>
            Verificar de nuevo
          </Button>
          <Button onClick={inicializarTablas} disabled={inicializando || todasTablasExisten()}>
            {inicializando ? (
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

      {resultado && (
        <Alert variant={resultado.success ? "default" : "destructive"} className="mb-6">
          {resultado.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <AlertTitle>{resultado.success ? "Inicialización exitosa" : "Error en la inicialización"}</AlertTitle>
          <AlertDescription>{resultado.success ? resultado.message : resultado.error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => (window.location.href = "/taller/dashboard")}>
          Ir al Dashboard
        </Button>
        <Button onClick={() => (window.location.href = "/inicializar-taller")}>Ir a Inicialización Completa</Button>
      </div>
    </div>
  )
}
