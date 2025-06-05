"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2, ArrowRight } from "lucide-react"

export default function DiagnosticoTalleresPage() {
  const [loading, setLoading] = useState(true)
  const [resultado, setResultado] = useState<any>(null)
  const [inicializando, setInicializando] = useState(false)

  useEffect(() => {
    verificarEstado()
  }, [])

  const verificarEstado = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/diagnostico-talleres")
      const data = await response.json()
      setResultado(data)
    } catch (error) {
      setResultado({
        success: false,
        error: "Error al conectar con el servidor",
        detalle: error instanceof Error ? error.message : "Error desconocido",
      })
    } finally {
      setLoading(false)
    }
  }

  const inicializarTablas = async () => {
    setInicializando(true)
    try {
      const response = await fetch("/api/initialize-materials")
      const data = await response.json()

      if (response.ok) {
        // Esperar un momento y volver a verificar
        setTimeout(() => {
          verificarEstado()
          setInicializando(false)
        }, 2000)
      } else {
        setResultado({
          success: false,
          error: "Error al inicializar tablas",
          detalle: data.error || "Error desconocido",
        })
        setInicializando(false)
      }
    } catch (error) {
      setResultado({
        success: false,
        error: "Error al conectar con el servidor",
        detalle: error instanceof Error ? error.message : "Error desconocido",
      })
      setInicializando(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Diagnóstico Rápido - Módulo de Talleres</CardTitle>
          <CardDescription>Verificación del estado del sistema para pruebas con el cliente</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Verificando estado del sistema...</span>
            </div>
          ) : resultado ? (
            <div className="space-y-4">
              <Alert variant={resultado.success ? "default" : "destructive"}>
                {resultado.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{resultado.success ? "Conexión Exitosa" : "Error de Conexión"}</AlertTitle>
                <AlertDescription>
                  {resultado.success
                    ? "La conexión a la base de datos está funcionando correctamente."
                    : resultado.error}
                </AlertDescription>
              </Alert>

              {resultado.success && (
                <>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Estado de las Tablas:</h3>
                    <div className="space-y-2">
                      {resultado.tablas &&
                        Object.entries(resultado.tablas).map(([tabla, existe]: [string, any]) => (
                          <div key={tabla} className="flex items-center">
                            {existe ? (
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                            )}
                            <span className={existe ? "text-green-700" : "text-red-700"}>
                              {tabla}: {existe ? "Existe" : "No existe"}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <Alert variant={resultado.todasExisten ? "default" : "warning"} className="mt-4">
                    <AlertTitle>{resultado.todasExisten ? "Listo para Pruebas" : "Acción Requerida"}</AlertTitle>
                    <AlertDescription>{resultado.mensaje}</AlertDescription>
                  </Alert>
                </>
              )}
            </div>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>No se pudo obtener el estado del sistema.</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={verificarEstado} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              "Verificar de Nuevo"
            )}
          </Button>

          {resultado && !resultado.todasExisten && (
            <Button onClick={inicializarTablas} disabled={inicializando || loading}>
              {inicializando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inicializando...
                </>
              ) : (
                <>Inicializar Tablas</>
              )}
            </Button>
          )}

          {resultado && resultado.todasExisten && (
            <Button asChild>
              <a href="/talleres/procesos">
                Ir a Gestión de Procesos <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
