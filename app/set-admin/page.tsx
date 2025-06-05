"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, ShieldAlert } from "lucide-react"
import { useAuth } from "@/lib/auth"

export default function SetAdminPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSetAdmin = async () => {
    try {
      setIsLoading(true)
      setResult(null)

      const response = await fetch("/api/set-admin-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        setResult({
          success: true,
          message:
            "¡Rol de administrador establecido correctamente! Por favor, cierra sesión y vuelve a iniciar sesión para que los cambios surtan efecto.",
        })
      } else {
        setResult({
          success: false,
          message: `Error: ${data.error || data.message || "Error desconocido"}`,
        })
      }
    } catch (error) {
      console.error("Error al establecer rol de administrador:", error)
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : "Error desconocido"}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            Establecer Rol de Administrador
          </CardTitle>
          <CardDescription>
            Usa esta herramienta para establecer tu usuario actual como administrador del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="font-medium">Usuario actual:</p>
                <p>{user.email}</p>
                <p className="text-sm text-gray-500 mt-1">Rol actual: {user.role || "No definido"}</p>
              </div>

              {result && (
                <Alert variant={result.success ? "default" : "destructive"}>
                  {result.success ? <CheckCircle className="h-4 w-4 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                  <AlertTitle>{result.success ? "Éxito" : "Error"}</AlertTitle>
                  <AlertDescription>{result.message}</AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4 mr-2" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Debes iniciar sesión para usar esta función</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSetAdmin} disabled={isLoading || !user} className="w-full">
            {isLoading ? "Procesando..." : "Establecer como Administrador"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
