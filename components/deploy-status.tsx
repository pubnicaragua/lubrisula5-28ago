"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Clock } from "lucide-react"

interface HealthStatus {
  status: string
  timestamp: string
  environment: string
  version: string
}

export function DeployStatus() {
  const [status, setStatus] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch("/api/health")
        if (!response.ok) {
          throw new Error("Error al verificar el estado del deploy")
        }
        const data = await response.json()
        setStatus(data)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
        setLoading(false)
      }
    }

    checkHealth()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado del Deploy</CardTitle>
        <CardDescription>Información sobre el estado actual del deploy</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            <span>Verificando estado...</span>
          </div>
        ) : error ? (
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-500">{error}</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {status?.status === "ok" ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <span>
                Estado: <Badge variant={status?.status === "ok" ? "default" : "destructive"}>{status?.status}</Badge>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Entorno:</div>
              <div className="font-medium">{status?.environment}</div>
              <div>Versión:</div>
              <div className="font-medium">{status?.version}</div>
              <div>Última actualización:</div>
              <div className="font-medium">
                {status?.timestamp ? new Date(status.timestamp).toLocaleString() : "N/A"}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
