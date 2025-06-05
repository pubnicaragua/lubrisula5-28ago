"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugSessionPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function getSession() {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        setSession(data.session)
      } catch (err) {
        console.error("Error al obtener la sesión:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    getSession()
  }, [supabase])

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

      // Actualizar la sesión mostrada
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      setSession(data.session)

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

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="pt-6">
            <p>Cargando información de sesión...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Información de Sesión</CardTitle>
          <CardDescription>Detalles de tu sesión actual en Supabase</CardDescription>
        </CardHeader>
        <CardContent>
          {session ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Usuario</h3>
                <p>ID: {session.user.id}</p>
                <p>Email: {session.user.email}</p>
                <p>Rol: {session.user.user_metadata?.role || "No definido"}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium">Metadatos de Usuario</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60">
                  {JSON.stringify(session.user.user_metadata, null, 2)}
                </pre>
              </div>

              <div className="flex space-x-4">
                <Button onClick={setSuperAdmin} disabled={loading}>
                  Establecer como SuperAdmin
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    const { data, error } = await supabase.auth.getSession()
                    if (error) {
                      setError(error.message)
                    } else {
                      setSession(data.session)
                      setMessage("Sesión actualizada")
                    }
                  }}
                >
                  Actualizar Sesión
                </Button>
              </div>

              {message && <div className="p-4 bg-green-100 text-green-800 rounded-md">{message}</div>}
              {error && <div className="p-4 bg-red-100 text-red-800 rounded-md">Error: {error}</div>}
            </div>
          ) : (
            <div>
              <p>No hay sesión activa. Por favor, inicia sesión.</p>
              <Button className="mt-4" onClick={() => (window.location.href = "/auth/login")}>
                Ir a Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
