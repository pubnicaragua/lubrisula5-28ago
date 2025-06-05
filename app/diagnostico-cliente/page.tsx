"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function DiagnosticoClientePage() {
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
      // Verificar tabla client_vehicles
      const { data: clientVehicles, error: errorVehicles } = await supabase
        .from("client_vehicles")
        .select("count(*)")
        .limit(1)
        .single()

      // Verificar tabla client_appointments
      const { data: clientAppointments, error: errorAppointments } = await supabase
        .from("client_appointments")
        .select("count(*)")
        .limit(1)
        .single()

      // Verificar tabla service_history
      const { data: serviceHistory, error: errorHistory } = await supabase
        .from("service_history")
        .select("count(*)")
        .limit(1)
        .single()

      setTablas({
        client_vehicles: !errorVehicles,
        client_appointments: !errorAppointments,
        service_history: !errorHistory,
      })
    } catch (error) {
      console.error("Error al verificar tablas:", error)
    } finally {
      setLoading(false)
    }
  }

  const inicializarTablas = async () => {
    setInicializando(true)
    try {
      const response = await fetch("/api/initialize-cliente", {
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
      <h1 className="text-3xl font-bold mb-6">Diagnóstico del Módulo de Cliente</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Estado de las Tablas</CardTitle>
          <CardDescription>Verificación de las tablas necesarias para el módulo de cliente</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">client_vehicles:</div>
                <div className="flex items-center">
                  {tablas.client_vehicles ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                  )}
                  {tablas.client_vehicles ? "Existe" : "No existe"}
                </div>

                <div className="text-sm font-medium">client_appointments:</div>
                <div className="flex items-center">
                  {tablas.client_appointments ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                  )}
                  {tablas.client_appointments ? "Existe" : "No existe"}
                </div>

                <div className="text-sm font-medium">service_history:</div>
                <div className="flex items-center">
                  {tablas.service_history ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                  )}
                  {tablas.service_history ? "Existe" : "No existe"}
                </div>
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
        <Button variant="outline" onClick={() => (window.location.href = "/cliente/dashboard")}>
          Ir al Dashboard
        </Button>
        <Button onClick={() => (window.location.href = "/inicializar-cliente")}>Ir a Inicialización Completa</Button>
      </div>
    </div>
  )
}
