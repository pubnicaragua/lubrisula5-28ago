"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertTriangle, CheckCircle, Database, Shield, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function DiagnosticoDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchDiagnostico = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/check-dashboard")
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Error al obtener diagnóstico")
      }

      setData(result)
    } catch (error) {
      console.error("Error:", error)
      setError(error instanceof Error ? error.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDiagnostico()
  }, [])

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Diagnóstico del Dashboard</h1>
          <p className="text-muted-foreground">Verifica y soluciona problemas con el dashboard</p>
        </div>
        <Button onClick={fetchDiagnostico} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualizar
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && !data ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Cargando diagnóstico...</span>
        </div>
      ) : data ? (
        <div className="grid gap-6">
          {/* Conexión */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Conexión a Supabase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                {data.connection?.status === "connected" ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>{data.connection.message}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                    <span>{data.connection?.message || "Error de conexión"}</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tablas */}
          <Card>
            <CardHeader>
              <CardTitle>Tablas Requeridas</CardTitle>
              <CardDescription>Estado de las tablas necesarias para el funcionamiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.tables &&
                  Object.entries(data.tables).map(([table, info]: [string, any]) => (
                    <div key={table} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        {info.exists ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                        )}
                        <span className="font-medium">{table}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={info.exists ? "outline" : "destructive"}>
                          {info.exists ? `${info.count} registros` : "No existe"}
                        </Badge>
                        {info.error && <span className="text-xs text-red-500">{info.error}</span>}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Políticas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Políticas de Seguridad
              </CardTitle>
              <CardDescription>Políticas RLS configuradas para roles_usuario</CardDescription>
            </CardHeader>
            <CardContent>
              {data.policiesError ? (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error al verificar políticas</AlertTitle>
                  <AlertDescription>{data.policiesError}</AlertDescription>
                </Alert>
              ) : data.policies && data.policies.length > 0 ? (
                <div className="space-y-2">
                  {data.policies.map((policy: any, index: number) => (
                    <div key={index} className="border rounded p-2">
                      <div className="font-medium">{policy.policyname}</div>
                      <div className="text-sm text-muted-foreground">
                        {policy.permissive ? "Permisiva" : "Restrictiva"} |{policy.operation}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-amber-600 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  No se encontraron políticas para roles_usuario
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recomendaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones</CardTitle>
              <CardDescription>Acciones sugeridas para solucionar problemas</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc pl-5">
                {data.recommendations?.map((rec: string, index: number) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button asChild>
                <Link href="/fix-users">Corregir Usuarios</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/sync-roles">Sincronizar Roles</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
