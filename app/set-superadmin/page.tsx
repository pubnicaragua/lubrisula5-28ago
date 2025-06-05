"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SetSuperAdminPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [userInfo, setUserInfo] = useState<any>(null)
  const supabase = createClientComponentClient()

  // Función para obtener información del usuario actual
  const getUserInfo = async () => {
    try {
      setLoading(true)

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) throw userError

      setUserInfo({
        email: user?.email,
        id: user?.id,
        role: user?.user_metadata?.role || "No definido",
      })
    } catch (err) {
      console.error("Error al obtener información del usuario:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  // Función para establecer el rol como superadmin
  const setSuperAdmin = async () => {
    try {
      setLoading(true)
      setMessage("")
      setError("")

      // Actualizar los metadatos del usuario actual
      const { error: updateError } = await supabase.auth.updateUser({
        data: { role: "superadmin" },
      })

      if (updateError) throw updateError

      // Actualizar la información mostrada
      await getUserInfo()

      setMessage(
        "¡Rol actualizado a superadmin correctamente! Por favor, cierra sesión y vuelve a iniciar sesión para que los cambios surtan efecto completamente.",
      )
    } catch (err) {
      console.error("Error:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  // Cargar información del usuario al montar el componente
  useState(() => {
    getUserInfo()
  })

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Establecer SuperAdmin</CardTitle>
          <CardDescription>Esta página te permite establecer tu usuario actual como superadmin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {userInfo && (
            <div className="p-4 bg-gray-100 rounded-md">
              <h3 className="font-medium">Información del usuario:</h3>
              <p>Email: {userInfo.email}</p>
              <p>ID: {userInfo.id}</p>
              <p>Rol actual: {userInfo.role}</p>
            </div>
          )}

          <Button onClick={setSuperAdmin} className="w-full" disabled={loading}>
            {loading ? "Procesando..." : "Establecer mi usuario como SuperAdmin"}
          </Button>

          <Button onClick={getUserInfo} variant="outline" className="w-full" disabled={loading}>
            Actualizar información
          </Button>

          {message && <div className="p-4 bg-green-100 text-green-800 rounded-md">{message}</div>}

          {error && <div className="p-4 bg-red-100 text-red-800 rounded-md">Error: {error}</div>}

          <div className="text-sm text-gray-500 mt-4">
            <p>
              Nota: Después de establecer tu rol como superadmin, debes cerrar sesión y volver a iniciar sesión para que
              los cambios surtan efecto completamente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
