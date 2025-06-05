"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, Plus, Settings, PenToolIcon as Tool, AlertTriangle } from "lucide-react"
import { useAuth } from "@/lib/supabase/auth"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function ClienteVehiculos() {
  const [vehiculos, setVehiculos] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function cargarVehiculos() {
      if (!user?.id) return

      try {
        const { data, error } = await supabase.from("vehicles").select("*").eq("client_id", user.id)

        if (error) {
          console.error("Error al cargar vehículos:", error)
          return
        }

        setVehiculos(data || [])
      } catch (error) {
        console.error("Error al cargar vehículos:", error)
      } finally {
        setLoading(false)
      }
    }

    cargarVehiculos()
  }, [user, supabase])

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "activo":
        return "bg-green-500"
      case "en reparación":
        return "bg-yellow-500"
      case "inactivo":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mis Vehículos</h1>
        <Button onClick={() => router.push("/cliente/vehiculos/nuevo")}>
          <Plus className="mr-2 h-4 w-4" /> Registrar Vehículo
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : vehiculos.length === 0 ? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center">No tienes vehículos registrados</CardTitle>
            <CardDescription className="text-center">
              Registra tu primer vehículo para comenzar a utilizar nuestros servicios
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/cliente/vehiculos/nuevo")}>
              <Plus className="mr-2 h-4 w-4" /> Registrar Vehículo
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehiculos.map((vehiculo) => (
            <Card key={vehiculo.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>
                    {vehiculo.make} {vehiculo.model}
                  </CardTitle>
                  <Badge className={getStatusColor(vehiculo.status)}>{vehiculo.status || "Sin estado"}</Badge>
                </div>
                <CardDescription>
                  {vehiculo.year} • {vehiculo.license_plate}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Car className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {vehiculo.color} • {vehiculo.vin || "VIN no registrado"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Tool className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Último servicio: {vehiculo.last_service_date || "No registrado"}</span>
                  </div>
                  {vehiculo.alerts && (
                    <div className="flex items-center text-amber-500">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <span>{vehiculo.alerts}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push(`/cliente/vehiculos/${vehiculo.id}`)}>
                  Ver Detalles
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
