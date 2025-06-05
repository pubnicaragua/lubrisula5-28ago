"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Plus, Car } from "lucide-react"
import { useAuth } from "@/lib/supabase/auth"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function ClienteCitas() {
  const [citas, setCitas] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function cargarCitas() {
      if (!user?.id) return

      try {
        // Simulamos datos de citas para la demostración
        const citasDemo = [
          {
            id: 1,
            fecha: "2024-05-20",
            hora: "10:00",
            tipo_servicio: "Mantenimiento",
            estado: "Confirmada",
            vehiculo: "Toyota Corolla 2020",
            ubicacion: "Taller Central",
            notas: "Cambio de aceite y filtros",
          },
          {
            id: 2,
            fecha: "2024-05-25",
            hora: "15:30",
            tipo_servicio: "Reparación",
            estado: "Pendiente",
            vehiculo: "Toyota Corolla 2020",
            ubicacion: "Taller Norte",
            notas: "Revisión de frenos",
          },
        ]

        setCitas(citasDemo)
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar citas:", error)
        setLoading(false)
      }
    }

    cargarCitas()
  }, [user, supabase])

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmada":
        return "bg-green-500"
      case "pendiente":
        return "bg-yellow-500"
      case "cancelada":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mis Citas</h1>
        <Button onClick={() => router.push("/cliente/citas/nueva")}>
          <Plus className="mr-2 h-4 w-4" /> Agendar Cita
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : citas.length === 0 ? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center">No tienes citas programadas</CardTitle>
            <CardDescription className="text-center">
              Agenda tu primera cita para recibir servicio en tu vehículo
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/cliente/citas/nueva")}>
              <Plus className="mr-2 h-4 w-4" /> Agendar Cita
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {citas.map((cita) => (
            <Card key={cita.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{cita.tipo_servicio}</CardTitle>
                  <Badge className={getStatusColor(cita.estado)}>{cita.estado}</Badge>
                </div>
                <CardDescription>{formatDate(cita.fecha)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{cita.hora} hrs</span>
                  </div>
                  <div className="flex items-center">
                    <Car className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{cita.vehiculo}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{cita.ubicacion}</span>
                  </div>
                  {cita.notas && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>{cita.notas}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push(`/cliente/citas/${cita.id}`)}>
                  Ver Detalles
                </Button>
                <Button
                  variant={cita.estado.toLowerCase() === "confirmada" ? "destructive" : "ghost"}
                  onClick={() => alert("Funcionalidad en desarrollo")}
                >
                  {cita.estado.toLowerCase() === "confirmada" ? "Cancelar" : "Modificar"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
