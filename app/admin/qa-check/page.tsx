"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, ClipboardCheck, RefreshCw } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

interface QAResult {
  component: string
  status: "success" | "warning" | "error"
  message: string
  details?: string
}

export default function QACheckPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<QAResult[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleRunQACheck = async () => {
    try {
      setLoading(true)
      setResults([])
      setError(null)

      const response = await fetch("/api/qa-check")
      const data = await response.json()

      if (data.success) {
        setResults(data.results)
      } else {
        setError(data.error || "Error al realizar la verificación de QA")
      }
    } catch (error) {
      console.error("Error:", error)
      setError("Error al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "warning":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "error":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const countByStatus = () => {
    const counts = { success: 0, warning: 0, error: 0 }
    results.forEach((result) => {
      counts[result.status]++
    })
    return counts
  }

  const counts = countByStatus()

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Verificación de Calidad (QA)</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Verificación del Sistema</CardTitle>
          <CardDescription>
            Esta herramienta realizará una verificación completa del sistema para asegurar que todo funciona
            correctamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Se verificarán los siguientes componentes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Tablas de la base de datos</li>
              <li>Relaciones entre tablas</li>
              <li>Datos existentes</li>
              <li>Funcionalidades principales</li>
            </ul>

            <div className="flex justify-end">
              <Button onClick={handleRunQACheck} disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Ejecutar Verificación
                  </>
                )}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados de la Verificación</CardTitle>
            <CardDescription>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-green-100 text-green-800">Éxito: {counts.success}</Badge>
                <Badge className="bg-yellow-100 text-yellow-800">Advertencia: {counts.warning}</Badge>
                <Badge className="bg-red-100 text-red-800">Error: {counts.error}</Badge>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{result.component}</h3>
                    <Badge className={getStatusColor(result.status)}>
                      {getStatusIcon(result.status)}
                      <span className="ml-1">
                        {result.status === "success" ? "Éxito" : result.status === "warning" ? "Advertencia" : "Error"}
                      </span>
                    </Badge>
                  </div>
                  <p>{result.message}</p>
                  {result.details && <p className="text-sm text-muted-foreground mt-2">Detalles: {result.details}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
