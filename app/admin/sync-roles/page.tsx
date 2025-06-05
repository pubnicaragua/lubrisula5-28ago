"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

export default function SyncRolesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    error?: string
  }>({})

  const handleSync = async () => {
    try {
      setIsLoading(true)
      setResult({})

      const response = await fetch("/api/sync-auth-roles")
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
          <CardTitle>Sincronización de Roles de Usuario</CardTitle>
          <CardDescription>
            Esta herramienta sincroniza los usuarios de Supabase Auth con la tabla roles_usuario para asegurar que todos
            los usuarios tengan los roles correctos asignados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-sm text-muted-foreground">
            Utiliza esta función cuando:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Hayas registrado nuevos usuarios y no puedan acceder a sus rutas</li>
              <li>Hayas cambiado manualmente los roles en Supabase Auth</li>
              <li>Detectes problemas de permisos en la aplicación</li>
            </ul>
          </p>

          {result.success === true && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Sincronización exitosa</AlertTitle>
              <AlertDescription className="text-green-700">{result.message}</AlertDescription>
            </Alert>
          )}

          {result.success === false && (
            <Alert className="mb-4 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Error en la sincronización</AlertTitle>
              <AlertDescription className="text-red-700">{result.message || result.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSync} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Sincronizando...
              </>
            ) : (
              "Sincronizar Roles de Usuario"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
