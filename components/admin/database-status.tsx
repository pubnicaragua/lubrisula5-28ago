"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Database, XCircle } from "lucide-react"
import { supabaseClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export function DatabaseStatus() {
  const [loading, setLoading] = useState(true)
  const [initializing, setInitializing] = useState(false)
  const [tables, setTables] = useState<{ name: string; exists: boolean }[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const requiredTables = [
    "roles",
    "clients",
    "vehicles",
    "quotations",
    "quotation_parts",
    "orders",
    "order_parts",
    "inventory_categories",
    "inventory",
    "kanban_columns",
    "kanban_cards",
    "invoices",
    "payments",
  ]

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  const checkDatabaseStatus = async () => {
    setLoading(true)
    setError(null)
    try {
      // Verificar cada tabla
      const tableStatus = await Promise.all(
        requiredTables.map(async (tableName) => {
          try {
            // Intentar hacer una consulta simple a la tabla
            const { count, error } = await supabaseClient.from(tableName).select("*", { count: "exact", head: true })
            return {
              name: tableName,
              exists: !error,
            }
          } catch (error) {
            return {
              name: tableName,
              exists: false,
            }
          }
        }),
      )
      setTables(tableStatus)
    } catch (error) {
      console.error("Error al verificar el estado de la base de datos:", error)
      setError("Error al conectar con la base de datos")
    } finally {
      setLoading(false)
    }
  }

  const initializeDatabase = async () => {
    setInitializing(true)
    try {
      const response = await fetch("/api/initialize-database")
      const data = await response.json()

      if (data.success) {
        toast({
          title: "Base de datos inicializada",
          description: "Las tablas han sido creadas correctamente",
          duration: 5000,
        })
        // Verificar el estado nuevamente
        await checkDatabaseStatus()

        // Añadir una pequeña pausa para permitir que el toast se muestre
        setTimeout(() => {
          // Redirigir al dashboard para recargar los datos
          router.push("/admin/dashboard")
        }, 1500)
      } else {
        toast({
          title: "Error",
          description: data.error || "Error al inicializar la base de datos",
          variant: "destructive",
          duration: 5000,
        })
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Error al inicializar la base de datos",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setInitializing(false)
    }
  }

  const getMissingTables = () => {
    return tables.filter((table) => !table.exists).map((table) => table.name)
  }

  const allTablesExist = tables.every((table) => table.exists)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <CardTitle>Estado de la Base de Datos</CardTitle>
        </div>
        <CardDescription>Verificación de las tablas necesarias para el funcionamiento del sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <span className="ml-2">Verificando tablas...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : allTablesExist ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Todas las tablas necesarias existen en la base de datos
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <Alert variant="destructive" className="bg-red-50 border-red-300">
              <AlertDescription className="text-red-800 font-semibold">
                ¡ATENCIÓN! Faltan tablas esenciales en la base de datos. Esto causa los errores de "relation does not
                exist". Por favor, haz clic en el botón "Inicializar Base de Datos" a continuación para resolver este
                problema.
              </AlertDescription>
            </Alert>
            <div className="grid grid-cols-2 gap-2">
              {tables.map((table) => (
                <div key={table.name} className="flex items-center gap-2 p-2 rounded border">
                  {table.exists ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className={table.exists ? "text-green-800" : "text-red-800"}>{table.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={checkDatabaseStatus} disabled={loading}>
          Verificar de nuevo
        </Button>
        {!allTablesExist && (
          <Button onClick={initializeDatabase} disabled={initializing}>
            {initializing ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Inicializando...
              </>
            ) : (
              "Inicializar Base de Datos"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
