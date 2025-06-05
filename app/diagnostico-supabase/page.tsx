"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react"

export default function DiagnosticoSupabasePage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [envVars, setEnvVars] = useState<any>({})

  const supabase = createClientComponentClient()

  const checkConnection = async () => {
    setLoading(true)
    const results: any = {}

    try {
      // Verificar variables de entorno
      const envCheck = {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Configurada" : "❌ No configurada",
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Configurada" : "❌ No configurada",
        urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 15) + "..." || "No disponible",
        keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
      }
      setEnvVars(envCheck)

      // Probar conexión básica
      const { data: connectionTest, error: connectionError } = await supabase.from("roles").select("count").single()

      results.connection = {
        success: !connectionError,
        error: connectionError?.message,
        details: connectionError?.details,
      }

      // Verificar tablas
      const tables = [
        "roles",
        "roles_usuario",
        "clients",
        "vehicles",
        "talleres",
        "aseguradoras",
        "quotations",
        "orders",
        "materiales",
        "kanban_columns",
      ]

      results.tables = {}

      for (const table of tables) {
        const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true })
        results.tables[table] = {
          exists: !error,
          count: count || 0,
          error: error?.message,
        }
      }

      // Verificar autenticación
      const { data: authData, error: authError } = await supabase.auth.getSession()
      results.auth = {
        success: !authError,
        session: authData?.session ? true : false,
        error: authError?.message,
      }
    } catch (error: any) {
      results.error = error.message
    } finally {
      setResults(results)
      setLoading(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Diagnóstico de Conexión a Supabase</CardTitle>
          <CardDescription>
            Esta herramienta verifica la conexión a Supabase y el estado de las tablas necesarias
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <h3 className="text-lg font-medium">Variables de Entorno</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2 border rounded">
                <span className="font-medium">SUPABASE_URL:</span>
                <span>{envVars.url}</span>
                <span className="text-xs text-muted-foreground ml-auto">{envVars.urlValue}</span>
              </div>
              <div className="flex items-center gap-2 p-2 border rounded">
                <span className="font-medium">SUPABASE_ANON_KEY:</span>
                <span>{envVars.anonKey}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {envVars.keyLength > 0 ? `Longitud: ${envVars.keyLength}` : "No disponible"}
                </span>
              </div>
            </div>
          </div>

          {results.connection && (
            <Alert variant={results.connection.success ? "default" : "destructive"}>
              {results.connection.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{results.connection.success ? "Conexión Exitosa" : "Error de Conexión"}</AlertTitle>
              <AlertDescription>
                {results.connection.success
                  ? "La conexión a Supabase está funcionando correctamente."
                  : `Error: ${results.connection.error}`}
              </AlertDescription>
            </Alert>
          )}

          {results.tables && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Estado de las Tablas</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(results.tables).map(([table, data]: [string, any]) => (
                  <div key={table} className="flex items-center gap-2 p-2 border rounded">
                    {data.exists ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium">{table}:</span>
                    {data.exists ? (
                      <span className="text-green-600">{data.count} registros</span>
                    ) : (
                      <span className="text-red-600">No existe</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.auth && (
            <Alert variant={results.auth.success ? "default" : "destructive"}>
              {results.auth.success ? (
                results.auth.session ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {results.auth.success
                  ? results.auth.session
                    ? "Sesión Activa"
                    : "Sin Sesión"
                  : "Error de Autenticación"}
              </AlertTitle>
              <AlertDescription>
                {results.auth.success
                  ? results.auth.session
                    ? "Hay una sesión de usuario activa."
                    : "No hay sesión de usuario activa. Inicia sesión para probar la autenticación."
                  : `Error: ${results.auth.error}`}
              </AlertDescription>
            </Alert>
          )}

          {results.error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error General</AlertTitle>
              <AlertDescription>{results.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={checkConnection} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              "Verificar Conexión"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
