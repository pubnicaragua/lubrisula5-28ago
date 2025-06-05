"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"

// Crear cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function TestSupabasePage() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [envVars, setEnvVars] = useState<{ [key: string]: string | undefined }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [tables, setTables] = useState<string[]>([])

  useEffect(() => {
    const testConnection = async () => {
      try {
        setIsLoading(true)

        // Recopilar variables de entorno (solo nombres, no valores por seguridad)
        setEnvVars({
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Definido" : "✗ No definido",
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ Definido" : "✗ No definido",
        })

        // Probar la conexión con Supabase
        const { data, error } = await supabase.from("roles").select("*").limit(1)

        if (error) {
          throw error
        }

        // Obtener lista de tablas
        const { data: tableData, error: tableError } = await supabase
          .from("pg_tables")
          .select("tablename")
          .eq("schemaname", "public")

        if (tableError) {
          console.warn("No se pudieron obtener las tablas:", tableError)
        } else {
          setTables(tableData.map((t) => t.tablename))
        }

        setIsConnected(true)
        setError(null)
      } catch (err: any) {
        console.error("Error al conectar con Supabase:", err)
        setIsConnected(false)
        setError(err.message || "Error desconocido al conectar con Supabase")
      } finally {
        setIsLoading(false)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Prueba de Conexión a Supabase</CardTitle>
          <CardDescription>Verificando la conexión con la base de datos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Variables de Entorno:</h3>
                <ul className="space-y-1 text-sm">
                  {Object.entries(envVars).map(([key, value]) => (
                    <li key={key} className="flex items-center">
                      <span className="font-mono mr-2">{key}:</span>
                      <span className={value?.includes("✓") ? "text-green-500" : "text-red-500"}>{value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {tables.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Tablas disponibles:</h3>
                  <ul className="space-y-1 text-sm">
                    {tables.map((table) => (
                      <li key={table} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="font-mono">{table}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {isConnected === true && (
                <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle>Conexión Exitosa</AlertTitle>
                  <AlertDescription>La conexión con Supabase se ha establecido correctamente.</AlertDescription>
                </Alert>
              )}

              {isConnected === false && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Error de Conexión</AlertTitle>
                  <AlertDescription>
                    {error || "No se pudo conectar con Supabase. Verifica tu configuración."}
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()} className="w-full" disabled={isLoading}>
            Probar de Nuevo
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
