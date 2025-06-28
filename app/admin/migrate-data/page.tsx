"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle, Database, Upload } from "lucide-react"

export default function MigrateDataPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    details?: string
  } | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  const handleMigration = async () => {
    setIsLoading(true)
    setProgress(0)
    setResult(null)
    setLogs([])

    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 500)

      setLogs((prev) => [...prev, "🚀 Iniciando migración de datos mock..."])

      const response = await fetch("/api/migrate-mock-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      clearInterval(progressInterval)
      setProgress(100)

      if (data.success) {
        setResult({
          success: true,
          message: data.message,
        })
        setLogs((prev) => [...prev, "✅ Migración completada exitosamente!"])
      } else {
        setResult({
          success: false,
          message: data.error || "Error durante la migración",
          details: data.details,
        })
        setLogs((prev) => [...prev, `❌ Error: ${data.error}`])
      }
    } catch (error) {
      setProgress(100)
      setResult({
        success: false,
        message: "Error de conexión",
        details: error instanceof Error ? error.message : "Error desconocido",
      })
      setLogs((prev) => [...prev, `❌ Error de conexión: ${error}`])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Database className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Migración de Datos Mock</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Migrar Datos a Supabase
          </CardTitle>
          <CardDescription>
            Este proceso migrará todos los datos mock locales a tu base de datos Supabase. Incluye clientes, vehículos,
            talleres, materiales, y más.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Datos que se migrarán:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Roles del sistema (5 roles)</li>
              <li>• Categorías de materiales (6 categorías)</li>
              <li>• Clientes (6 clientes incluyendo flotas)</li>
              <li>• Talleres (4 talleres especializados)</li>
              <li>• Aseguradoras (5 aseguradoras)</li>
              <li>• Vehículos (8 vehículos variados)</li>
              <li>• Materiales de inventario (10 materiales)</li>
              <li>• Miembros del equipo (5 técnicos)</li>
              <li>• Columnas Kanban (4 columnas)</li>
              <li>• Datos de ejemplo (cotizaciones, órdenes, tareas)</li>
            </ul>
          </div>

          {isLoading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progreso de migración</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {logs.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
              <h4 className="font-semibold mb-2">Logs de migración:</h4>
              {logs.map((log, index) => (
                <div key={index} className="text-sm font-mono">
                  {log}
                </div>
              ))}
            </div>
          )}

          {result && (
            <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              {result.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
                <div className="font-semibold">{result.message}</div>
                {result.details && <div className="text-sm mt-1 opacity-80">{result.details}</div>}
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={handleMigration} disabled={isLoading} className="w-full" size="lg">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Migrando datos...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Iniciar Migración
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instrucciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">1</span>
            <div>
              <strong>Verificar conexión:</strong> Asegúrate de que tu conexión a Supabase esté funcionando
              correctamente.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">2</span>
            <div>
              <strong>Ejecutar migración:</strong> Haz clic en "Iniciar Migración" para comenzar el proceso.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">3</span>
            <div>
              <strong>Verificar resultados:</strong> Una vez completado, verifica que los datos se hayan insertado
              correctamente en Supabase.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">⚠️</span>
            <div>
              <strong>Nota:</strong> Los datos duplicados serán omitidos automáticamente para evitar conflictos.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
