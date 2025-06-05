"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Shield, Loader2, CheckCircle, AlertTriangle } from "lucide-react"

export default function SetSuperAdminPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Error",
        description: "Por favor, ingresa un correo electrónico",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      const response = await fetch("/api/set-superadmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al establecer el rol de superadmin")
      }

      setSuccess(true)
      toast({
        title: "Éxito",
        description: `El usuario ${email} ahora tiene el rol de superadmin`,
      })

      setEmail("")
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            <CardTitle>Establecer SuperAdmin</CardTitle>
          </div>
          <CardDescription>Asigna el rol de superadmin a un usuario por su correo electrónico</CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <Alert className="mb-4 bg-green-50 border-green-300">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800">¡Éxito!</AlertTitle>
              <AlertDescription className="text-green-800">
                El rol de SuperAdmin ha sido asignado correctamente.
              </AlertDescription>
            </Alert>
          )}

          <Alert variant="warning" className="mb-4 bg-amber-50 border-amber-300">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-800">¡Importante!</AlertTitle>
            <AlertDescription className="text-amber-800">
              El rol de SuperAdmin tiene acceso completo a todas las funciones del sistema. Asigna este rol con
              precaución.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Establecer como SuperAdmin
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
