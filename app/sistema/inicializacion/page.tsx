"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, RefreshCw, Database, AlertTriangle, Server, Users, FileText } from "lucide-react"
import Link from "next/link"

export default function SistemaInicializacionPage() {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("estructura")
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<Record<string, any>>({})
  const [options, setOptions] = useState({
    crearTablas: true,
    crearRoles: true,
    asignarUsuarios: true,
    datosEjemplo: true,
    politicasRLS: true,
    funcionesDB: true,
  })

  const handleOptionChange = (option: string, checked: boolean) => {
    setOptions((prev) => ({
      ...prev,
      [option]: checked,
    }))
  }

  const inicializarEstructura = async () => {
    setLoading(true)
    setProgress(10)

    try {
      const response = await fetch("/api/sistema/inicializar-estructura", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      })

      setProgress(50)
      const data = await response.json()

      setProgress(100)
      setResults((prev) => ({
        ...prev,
        estructura: data,
      }))

      if (data.success) {
        setActiveTab("datos")
      }
    } catch (error: any) {
      setResults((prev) => ({
        ...prev,
        estructura: {
          success: false,
          error: "Error al inicializar estructura",
          details: error.message,
        },
      }))
    } finally {
      setLoading(false)
    }
  }

  const inicializarDatos = async () => {
    setLoading(true)
    setProgress(10)

    try {
      const response = await fetch("/api/sistema/inicializar-datos", {
        method: "POST",
      })

      setProgress(50)
      const data = await response.json()

      setProgress(100)
      setResults((prev) => ({
        ...prev,
        datos: data,
      }))

      if (data.success) {
        setActiveTab("usuarios")
      }
    } catch (error: any) {
      setResults((prev) => ({
        ...prev,
        datos: {
          success: false,
          error: "Error al inicializar datos",
          details: error.message,
        },
      }))
    } finally {
      setLoading(false)
    }
  }

  const inicializarUsuarios = async () => {
    setLoading(true)
    setProgress(10)

    try {
      const response = await fetch("/api/sistema/inicializar-usuarios", {
        method: "POST",
      })

      setProgress(50)
      const data = await response.json()

      setProgress(100)
      setResults((prev) => ({
        ...prev,
        usuarios: data,
      }))

      if (data.success) {
        setActiveTab("verificacion")
      }
    } catch (error: any) {
      setResults((prev) => ({
        ...prev,
        usuarios: {
          success: false,
          error: "Error al inicializar usuarios",
          details: error.message,
        },
      }))
    } finally {
      setLoading(false)
    }
  }

  const verificarSistema = async () => {
    setLoading(true)
    setProgress(10)

    try {
      const response = await fetch("/api/sistema/verificar", {
        method: "POST",
      })

      setProgress(50)
      const data = await response.json()

      setProgress(100)
      setResults((prev) => ({
        ...prev,
        verificacion: data,
      }))
    } catch (error: any) {
      setResults((prev) => ({
        ...prev,
        verificacion: {
          success: false,
          error: "Error al verificar sistema",
          details: error.message,
        },
      }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Sistema de Inicialización Completo</CardTitle>
          <CardDescription>
            Inicializa la base de datos, crea roles, asigna usuarios y configura datos de ejemplo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Procesando...</span>
                <span className="text-sm">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="estructura">
                <Database className="h-4 w-4 mr-2" />
                Estructura
              </TabsTrigger>
              <TabsTrigger value="datos">
                <FileText className="h-4 w-4 mr-2" />
                Datos
              </TabsTrigger>
              <TabsTrigger value="usuarios">
                <Users className="h-4 w-4 mr-2" />
                Usuarios
              </TabsTrigger>
              <TabsTrigger value="verificacion">
                <Server className="h-4 w-4 mr-2" />
                Verificación
              </TabsTrigger>
            </TabsList>

            <TabsContent value="estructura" className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Paso 1: Inicializar Estructura</AlertTitle>
                <AlertDescription>
                  Este paso creará todas las tablas necesarias, roles y políticas de seguridad.
                </AlertDescription>
              </Alert>

              <div className="space-y-4 border rounded-md p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="crearTablas"
                      checked={options.crearTablas}
                      onCheckedChange={(checked) => handleOptionChange("crearTablas", checked as boolean)}
                    />
                    <Label htmlFor="crearTablas">Crear tablas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="crearRoles"
                      checked={options.crearRoles}
                      onCheckedChange={(checked) => handleOptionChange("crearRoles", checked as boolean)}
                    />
                    <Label htmlFor="crearRoles">Crear roles</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="politicasRLS"
                      checked={options.politicasRLS}
                      onCheckedChange={(checked) => handleOptionChange("politicasRLS", checked as boolean)}
                    />
                    <Label htmlFor="politicasRLS">Configurar políticas RLS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="funcionesDB"
                      checked={options.funcionesDB}
                      onCheckedChange={(checked) => handleOptionChange("funcionesDB", checked as boolean)}
                    />
                    <Label htmlFor="funcionesDB">Crear funciones de BD</Label>
                  </div>
                </div>
              </div>

              {results.estructura && (
                <Alert variant={results.estructura.success ? "default" : "destructive"}>
                  {results.estructura.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <AlertTitle>{results.estructura.success ? "Éxito" : "Error"}</AlertTitle>
                  <AlertDescription>
                    {results.estructura.success
                      ? `Se han creado ${results.estructura.tablas || 0} tablas correctamente.`
                      : `Error: ${results.estructura.error}. ${results.estructura.details || ""}`}
                  </AlertDescription>
                </Alert>
              )}

              <Button onClick={inicializarEstructura} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Inicializando estructura...
                  </>
                ) : (
                  "Inicializar Estructura"
                )}
              </Button>
            </TabsContent>

            <TabsContent value="datos" className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Paso 2: Inicializar Datos</AlertTitle>
                <AlertDescription>
                  Este paso creará datos de ejemplo para clientes, vehículos, materiales y más.
                </AlertDescription>
              </Alert>

              <div className="space-y-4 border rounded-md p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="datosEjemplo"
                      checked={options.datosEjemplo}
                      onCheckedChange={(checked) => handleOptionChange("datosEjemplo", checked as boolean)}
                    />
                    <Label htmlFor="datosEjemplo">Crear datos de ejemplo</Label>
                  </div>
                </div>
              </div>

              {results.datos && (
                <Alert variant={results.datos.success ? "default" : "destructive"}>
                  {results.datos.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <AlertTitle>{results.datos.success ? "Éxito" : "Error"}</AlertTitle>
                  <AlertDescription>
                    {results.datos.success
                      ? `Se han creado datos de ejemplo correctamente.`
                      : `Error: ${results.datos.error}. ${results.datos.details || ""}`}
                  </AlertDescription>
                </Alert>
              )}

              <Button onClick={inicializarDatos} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Inicializando datos...
                  </>
                ) : (
                  "Inicializar Datos"
                )}
              </Button>
            </TabsContent>

            <TabsContent value="usuarios" className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Paso 3: Configurar Usuarios</AlertTitle>
                <AlertDescription>
                  Este paso asignará roles a los usuarios existentes y actualizará sus metadatos.
                </AlertDescription>
              </Alert>

              <div className="space-y-4 border rounded-md p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="asignarUsuarios"
                      checked={options.asignarUsuarios}
                      onCheckedChange={(checked) => handleOptionChange("asignarUsuarios", checked as boolean)}
                    />
                    <Label htmlFor="asignarUsuarios">Asignar usuarios a roles</Label>
                  </div>
                </div>
              </div>

              {results.usuarios && (
                <Alert variant={results.usuarios.success ? "default" : "destructive"}>
                  {results.usuarios.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <AlertTitle>{results.usuarios.success ? "Éxito" : "Error"}</AlertTitle>
                  <AlertDescription>
                    {results.usuarios.success
                      ? `Se han configurado ${results.usuarios.usuariosActualizados || 0} usuarios correctamente.`
                      : `Error: ${results.usuarios.error}. ${results.usuarios.details || ""}`}
                  </AlertDescription>
                </Alert>
              )}

              <Button onClick={inicializarUsuarios} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Configurando usuarios...
                  </>
                ) : (
                  "Configurar Usuarios"
                )}
              </Button>
            </TabsContent>

            <TabsContent value="verificacion" className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Paso 4: Verificar Sistema</AlertTitle>
                <AlertDescription>
                  Este paso verificará que todo esté correctamente configurado y funcionando.
                </AlertDescription>
              </Alert>

              {results.verificacion && (
                <Alert variant={results.verificacion.success ? "default" : "destructive"}>
                  {results.verificacion.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <AlertTitle>{results.verificacion.success ? "Éxito" : "Error"}</AlertTitle>
                  <AlertDescription>
                    {results.verificacion.success
                      ? `El sistema está correctamente configurado y listo para usar.`
                      : `Error: ${results.verificacion.error}. ${results.verificacion.details || ""}`}
                  </AlertDescription>
                </Alert>
              )}

              {results.verificacion?.success && (
                <div className="space-y-2 border rounded-md p-4">
                  <h3 className="font-medium">Resumen de verificación:</h3>
                  <ul className="space-y-1 list-disc pl-5">
                    <li>Tablas creadas: {results.verificacion.tablas || 0}</li>
                    <li>Roles configurados: {results.verificacion.roles || 0}</li>
                    <li>Usuarios asignados: {results.verificacion.usuarios || 0}</li>
                    <li>Políticas RLS: {results.verificacion.politicas || 0}</li>
                    <li>Funciones creadas: {results.verificacion.funciones || 0}</li>
                  </ul>
                </div>
              )}

              <Button onClick={verificarSistema} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Verificando sistema...
                  </>
                ) : (
                  "Verificar Sistema"
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/diagnostico-supabase">Diagnóstico</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Ir al Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
