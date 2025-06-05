"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

export default function InitializeRolesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    details?: any
    error?: string
  }>({})

  const handleInitialize = async () => {
    try {
      setIsLoading(true)
      setResult({})

      const response = await fetch("/api/initialize-roles")
      const data = await response.json()

      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Inicialización de Roles</CardTitle>
          <CardDescription>
            Esta herramienta crea las tablas de roles y asigna roles a los usuarios existentes. Utilízala para
            configurar el sistema de roles por primera vez o para reparar problemas de permisos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-sm text-muted-foreground">
            Este proceso realizará las siguientes acciones:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Crear la tabla de roles si no existe</li>
              <li>Crear la tabla de roles_usuario si no existe</li>
              <li>Insertar los roles básicos del sistema</li>
              <li>Asignar roles a los usuarios existentes basados en sus metadatos</li>
            </ul>
          </p>

          {result.success === true && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Inicialización exitosa</AlertTitle>
              <AlertDescription className="text-green-700">
                {result.message}
                {result.details && (
                  <div className="mt-2 text-sm">
                    <div>Roles creados: {result.details.rolesCreated}</div>
                    <div>Usuarios procesados: {result.details.usersProcessed}</div>
                    <div>Roles asignados: {result.details.rolesAssigned}</div>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {result.success === false && (
            <Alert className="mb-4 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Error en la inicialización</AlertTitle>
              <AlertDescription className="text-red-700">{result.message || result.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleInitialize} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Inicializando...
              </>
            ) : (
              "Inicializar Sistema de Roles"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
