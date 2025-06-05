"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, Calendar, DollarSign } from "lucide-react"
import { useAuth } from "@/lib/supabase/auth"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function ClienteCotizaciones() {
  const [cotizaciones, setCotizaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function cargarCotizaciones() {
      if (!user?.id) return

      try {
        // Simulamos datos de cotizaciones para la demostración
        const cotizacionesDemo = [
          {
            id: 1,
            fecha: "2024-05-15",
            vehiculo: "Toyota Corolla 2020",
            estado: "Aprobada",
            total: 1250.0,
            validez: "2024-05-30",
            servicios: ["Cambio de aceite", "Alineación y balanceo", "Revisión de frenos"],
          },
          {
            id: 2,
            fecha: "2024-05-10",
            vehiculo: "Toyota Corolla 2020",
            estado: "Pendiente",
            total: 3500.0,
            validez: "2024-05-25",
            servicios: ["Reparación de transmisión", "Cambio de amortiguadores"],
          },
        ]

        setCotizaciones(cotizacionesDemo)
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar cotizaciones:", error)
        setLoading(false)
      }
    }

    cargarCotizaciones()
  }, [user, supabase])

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "aprobada":
        return "bg-green-500"
      case "pendiente":
        return "bg-yellow-500"
      case "rechazada":
        return "bg-red-500"
      case "vencida":
        return "bg-gray-500"
      default:
        return "bg-blue-500"
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mis Cotizaciones</h1>
        <Button onClick={() => router.push("/cliente/cotizaciones/solicitar")}>Solicitar Cotización</Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : cotizaciones.length === 0 ? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center">No tienes cotizaciones</CardTitle>
            <CardDescription className="text-center">
              Solicita una cotización para los servicios que necesita tu vehículo
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/cliente/cotizaciones/solicitar")}>Solicitar Cotización</Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cotizaciones.map((cotizacion) => (
            <Card key={cotizacion.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>Cotización #{cotizacion.id}</CardTitle>
                  <Badge className={getStatusColor(cotizacion.estado)}>{cotizacion.estado}</Badge>
                </div>
                <CardDescription>Creada el {formatDate(cotizacion.fecha)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Car className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{cotizacion.vehiculo}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Válida hasta: {formatDate(cotizacion.validez)}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Total: {formatCurrency(cotizacion.total)}</span>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium">Servicios incluidos:</p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside">
                      {cotizacion.servicios.map((servicio, index) => (
                        <li key={index}>{servicio}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push(`/cliente/cotizaciones/${cotizacion.id}`)}>
                  Ver Detalles
                </Button>
                {cotizacion.estado.toLowerCase() === "pendiente" && (
                  <div className="space-x-2">
                    <Button variant="default" onClick={() => alert("Cotización aprobada")}>
                      Aprobar
                    </Button>
                    <Button variant="destructive" onClick={() => alert("Cotización rechazada")}>
                      Rechazar
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
