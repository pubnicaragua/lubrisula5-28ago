"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Database, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function InitializeDatabasePage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleInitializeDatabase = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/initialize-database", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al inicializar la base de datos")
      }

      setSuccess(true)
      toast({
        title: "Base de datos inicializada",
        description: "La base de datos se ha inicializado correctamente.",
      })

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push("/admin/dashboard")
        router.refresh()
      }, 2000)
    } catch (err) {
      console.error("Error:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Error desconocido",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              <CardTitle>Inicializar Base de Datos</CardTitle>
            </div>
            <CardDescription>
              Este proceso creará todas las tablas necesarias para el funcionamiento del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="warning" className="bg-amber-50 border-amber-300">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <AlertTitle className="text-amber-800 font-bold">¡Atención!</AlertTitle>
              <AlertDescription className="text-amber-800">
                Este proceso inicializará la base de datos creando todas las tablas necesarias. Si ya existen tablas con
                el mismo nombre, no se modificarán. Este proceso es seguro para ejecutar en una base de datos existente.
              </AlertDescription>
            </Alert>

            {success && (
              <Alert className="bg-green-50 border-green-300">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertTitle className="text-green-800 font-bold">¡Éxito!</AlertTitle>
                <AlertDescription className="text-green-800">
                  La base de datos se ha inicializado correctamente. Serás redirigido al dashboard en unos segundos.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="bg-gray-50 p-4 rounded-md border">
              <h3 className="font-medium mb-2">Este proceso creará las siguientes tablas:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Usuarios y roles</li>
                <li>Clientes</li>
                <li>Vehículos</li>
                <li>Cotizaciones</li>
                <li>Órdenes de trabajo</li>
                <li>Inventario</li>
                <li>Aseguradoras</li>
                <li>Y otras tablas necesarias para el sistema</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleInitializeDatabase} disabled={loading || success} className="w-full md:w-auto">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inicializando...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Inicializado
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Inicializar Base de Datos
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
