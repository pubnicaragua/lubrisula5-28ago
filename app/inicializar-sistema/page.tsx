"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, CheckCircle, AlertCircle, Database, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function InicializarSistemaPage() {
  const [loading, setLoading] = useState<Record<string, boolean>>({
    verificando: false,
    tablas: false,
    clientes: false,
    vehiculos: false,
    cotizaciones: false,
    usuarios: false,
    kanban: false,
  })
  const [resultados, setResultados] = useState<Record<string, any>>({})

  // Verificar estado de la base de datos
  const verificarEstado = async () => {
    setLoading((prev) => ({ ...prev, verificando: true }))
    try {
      const response = await fetch("/api/check-tables")
      const data = await response.json()
      setResultados((prev) => ({ ...prev, estado: data }))
    } catch (error) {
      setResultados((prev) => ({
        ...prev,
        estado: { success: false, error: "Error al conectar con el servidor" },
      }))
    } finally {
      setLoading((prev) => ({ ...prev, verificando: false }))
    }
  }

  // Inicializar tablas básicas
  const inicializarTablas = async () => {
    setLoading((prev) => ({ ...prev, tablas: true }))
    try {
      const response = await fetch("/api/initialize-database-new")
      const data = await response.json()
      setResultados((prev) => ({ ...prev, tablas: data }))
      // Esperar un momento y verificar estado
      setTimeout(verificarEstado, 2000)
    } catch (error) {
      setResultados((prev) => ({
        ...prev,
        tablas: { success: false, error: "Error al inicializar tablas" },
      }))
    } finally {
      setLoading((prev) => ({ ...prev, tablas: false }))
    }
  }

  // Inicializar tablas de clientes
  const inicializarClientes = async () => {
    setLoading((prev) => ({ ...prev, clientes: true }))
    try {
      const response = await fetch("/api/initialize-clients", {
        method: "POST",
      })
      const data = await response.json()
      setResultados((prev) => ({ ...prev, clientes: data }))
    } catch (error) {
      setResultados((prev) => ({
        ...prev,
        clientes: { success: false, error: "Error al inicializar clientes" },
      }))
    } finally {
      setLoading((prev) => ({ ...prev, clientes: false }))
    }
  }

  // Inicializar tablas de vehículos
  const inicializarVehiculos = async () => {
    setLoading((prev) => ({ ...prev, vehiculos: true }))
    try {
      const response = await fetch("/api/initialize-vehicles", {
        method: "POST",
      })
      const data = await response.json()
      setResultados((prev) => ({ ...prev, vehiculos: data }))
    } catch (error) {
      setResultados((prev) => ({
        ...prev,
        vehiculos: { success: false, error: "Error al inicializar vehículos" },
      }))
    } finally {
      setLoading((prev) => ({ ...prev, vehiculos: false }))
    }
  }

  // Inicializar tablas de cotizaciones
  const inicializarCotizaciones = async () => {
    setLoading((prev) => ({ ...prev, cotizaciones: true }))
    try {
      const response = await fetch("/api/initialize-quotations", {
        method: "POST",
      })
      const data = await response.json()
      setResultados((prev) => ({ ...prev, cotizaciones: data }))
    } catch (error) {
      setResultados((prev) => ({
        ...prev,
        cotizaciones: { success: false, error: "Error al inicializar cotizaciones" },
      }))
    } finally {
      setLoading((prev) => ({ ...prev, cotizaciones: false }))
    }
  }

  // Inicializar tablas de kanban
  const inicializarKanban = async () => {
    setLoading((prev) => ({ ...prev, kanban: true }))
    try {
      const response = await fetch("/api/initialize-kanban", {
        method: "POST",
      })
      const data = await response.json()
      setResultados((prev) => ({ ...prev, kanban: data }))
    } catch (error) {
      setResultados((prev) => ({
        ...prev,
        kanban: { success: false, error: "Error al inicializar kanban" },
      }))
    } finally {
      setLoading((prev) => ({ ...prev, kanban: false }))
    }
  }

  // Inicializar todo
  const inicializarTodo = async () => {
    await inicializarTablas()
    await inicializarClientes()
    await inicializarVehiculos()
    await inicializarCotizaciones()
    await inicializarKanban()
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Inicialización del Sistema</CardTitle>
          <CardDescription>
            Esta página permite inicializar todas las tablas necesarias para el funcionamiento del sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="estado">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="estado">Estado del Sistema</TabsTrigger>
              <TabsTrigger value="inicializar">Inicializar Tablas</TabsTrigger>
            </TabsList>

            <TabsContent value="estado" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Estado de la Base de Datos</h3>
                <Button onClick={verificarEstado} disabled={loading.verificando}>
                  {loading.verificando ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>Verificar Estado</>
                  )}
                </Button>
              </div>

              {resultados.estado ? (
                <div className="space-y-4">
                  <Alert variant={resultados.estado.success ? "default" : "destructive"}>
                    {resultados.estado.success ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertTitle>{resultados.estado.success ? "Conexión Exitosa" : "Error de Conexión"}</AlertTitle>
                    <AlertDescription>
                      {resultados.estado.success
                        ? "La conexión a la base de datos está funcionando correctamente."
                        : resultados.estado.error}
                    </AlertDescription>
                  </Alert>

                  {resultados.estado.tablas && (
                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">Estado de las Tablas:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(resultados.estado.tablas).map(([tabla, existe]: [string, any]) => (
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
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Haga clic en "Verificar Estado" para comprobar la conexión y las tablas.
                </div>
              )}
            </TabsContent>

            <TabsContent value="inicializar" className="space-y-4">
              <Alert>
                <Database className="h-4 w-4" />
                <AlertTitle>Inicialización de Tablas</AlertTitle>
                <AlertDescription>
                  Este proceso creará todas las tablas necesarias para el funcionamiento del sistema. Si las tablas ya
                  existen, se mantendrán los datos existentes.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4">
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-lg">Tablas Básicas del Sistema</CardTitle>
                    <CardDescription>
                      Inicializa las tablas fundamentales: roles, usuarios, perfiles, etc.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between py-4">
                    <div>
                      {resultados.tablas && (
                        <span className={`text-sm ${resultados.tablas.success ? "text-green-600" : "text-red-600"}`}>
                          {resultados.tablas.success ? "Tablas inicializadas correctamente" : resultados.tablas.error}
                        </span>
                      )}
                    </div>
                    <Button onClick={inicializarTablas} disabled={loading.tablas}>
                      {loading.tablas ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Inicializando...
                        </>
                      ) : (
                        <>Inicializar Tablas Básicas</>
                      )}
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-lg">Clientes</CardTitle>
                    <CardDescription>Inicializa las tablas de clientes y datos de ejemplo.</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between py-4">
                    <div>
                      {resultados.clientes && (
                        <span className={`text-sm ${resultados.clientes.success ? "text-green-600" : "text-red-600"}`}>
                          {resultados.clientes.success
                            ? "Clientes inicializados correctamente"
                            : resultados.clientes.error}
                        </span>
                      )}
                    </div>
                    <Button onClick={inicializarClientes} disabled={loading.clientes}>
                      {loading.clientes ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Inicializando...
                        </>
                      ) : (
                        <>Inicializar Clientes</>
                      )}
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-lg">Vehículos</CardTitle>
                    <CardDescription>Inicializa las tablas de vehículos y datos de ejemplo.</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between py-4">
                    <div>
                      {resultados.vehiculos && (
                        <span className={`text-sm ${resultados.vehiculos.success ? "text-green-600" : "text-red-600"}`}>
                          {resultados.vehiculos.success
                            ? "Vehículos inicializados correctamente"
                            : resultados.vehiculos.error}
                        </span>
                      )}
                    </div>
                    <Button onClick={inicializarVehiculos} disabled={loading.vehiculos}>
                      {loading.vehiculos ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Inicializando...
                        </>
                      ) : (
                        <>Inicializar Vehículos</>
                      )}
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-lg">Cotizaciones</CardTitle>
                    <CardDescription>Inicializa las tablas de cotizaciones y datos de ejemplo.</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between py-4">
                    <div>
                      {resultados.cotizaciones && (
                        <span
                          className={`text-sm ${resultados.cotizaciones.success ? "text-green-600" : "text-red-600"}`}
                        >
                          {resultados.cotizaciones.success
                            ? "Cotizaciones inicializadas correctamente"
                            : resultados.cotizaciones.error}
                        </span>
                      )}
                    </div>
                    <Button onClick={inicializarCotizaciones} disabled={loading.cotizaciones}>
                      {loading.cotizaciones ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Inicializando...
                        </>
                      ) : (
                        <>Inicializar Cotizaciones</>
                      )}
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-lg">Kanban</CardTitle>
                    <CardDescription>Inicializa las tablas del tablero Kanban y datos de ejemplo.</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between py-4">
                    <div>
                      {resultados.kanban && (
                        <span className={`text-sm ${resultados.kanban.success ? "text-green-600" : "text-red-600"}`}>
                          {resultados.kanban.success ? "Kanban inicializado correctamente" : resultados.kanban.error}
                        </span>
                      )}
                    </div>
                    <Button onClick={inicializarKanban} disabled={loading.kanban}>
                      {loading.kanban ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Inicializando...
                        </>
                      ) : (
                        <>Inicializar Kanban</>
                      )}
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-lg">Inicialización Completa</CardTitle>
                    <CardDescription>Inicializa todas las tablas y datos de ejemplo en un solo paso.</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button onClick={inicializarTodo} className="w-full" variant="default">
                      Inicializar Todo el Sistema
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/dashboard">Volver al Dashboard</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/database">
              Ir a Gestión de Base de Datos <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
