"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, PenToolIcon as Tool, FileText, Clock } from "lucide-react"
import { useAuth } from "@/lib/supabase/auth"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function ClienteHistorial() {
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function cargarHistorial() {
      if (!user?.id) return

      try {
        // Simulamos datos de historial para la demostración
        const serviciosDemo = [
          {
            id: 1,
            fecha: "2024-04-15",
            vehiculo: "Toyota Corolla 2020",
            tipo: "Mantenimiento",
            estado: "Completado",
            servicios: ["Cambio de aceite", "Cambio de filtros", "Revisión general"],
            costo: 1200.0,
            tecnico: "Juan Pérez",
            garantia: "3 meses",
          },
          {
            id: 2,
            fecha: "2024-03-10",
            vehiculo: "Toyota Corolla 2020",
            tipo: "Reparación",
            estado: "Completado",
            servicios: ["Cambio de pastillas de freno", "Rectificación de discos"],
            costo: 2500.0,
            tecnico: "Carlos Rodríguez",
            garantia: "6 meses",
          },
          {
            id: 3,
            fecha: "2024-02-05",
            vehiculo: "Toyota Corolla 2020",
            tipo: "Diagnóstico",
            estado: "Completado",
            servicios: ["Diagnóstico electrónico", "Revisión de sistema eléctrico"],
            costo: 800.0,
            tecnico: "Ana Martínez",
            garantia: "1 mes",
          },
        ]

        setServicios(serviciosDemo)
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar historial:", error)
        setLoading(false)
      }
    }

    cargarHistorial()
  }, [user, supabase])

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completado":
        return "bg-green-500"
      case "en proceso":
        return "bg-yellow-500"
      case "cancelado":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getServiceTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "mantenimiento":
        return <Tool className="h-5 w-5" />
      case "reparación":
        return <Clock className="h-5 w-5" />
      case "diagnóstico":
        return <FileText className="h-5 w-5" />
      default:
        return <Tool className="h-5 w-5" />
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
      <h1 className="text-3xl font-bold mb-6">Historial de Servicios</h1>

      <Tabs defaultValue="todos" className="mb-6">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="mantenimiento">Mantenimiento</TabsTrigger>
          <TabsTrigger value="reparacion">Reparación</TabsTrigger>
          <TabsTrigger value="diagnostico">Diagnóstico</TabsTrigger>
        </TabsList>

        <TabsContent value="todos">{renderServicios(servicios)}</TabsContent>

        <TabsContent value="mantenimiento">
          {renderServicios(servicios.filter((s) => s.tipo.toLowerCase() === "mantenimiento"))}
        </TabsContent>

        <TabsContent value="reparacion">
          {renderServicios(servicios.filter((s) => s.tipo.toLowerCase() === "reparación"))}
        </TabsContent>

        <TabsContent value="diagnostico">
          {renderServicios(servicios.filter((s) => s.tipo.toLowerCase() === "diagnóstico"))}
        </TabsContent>
      </Tabs>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  )

  function renderServicios(serviciosFiltrados) {
    if (!loading && serviciosFiltrados.length === 0) {
      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center">No hay servicios en esta categoría</CardTitle>
            <CardDescription className="text-center">
              No se encontraron registros de servicios para mostrar
            </CardDescription>
          </CardHeader>
        </Card>
      )
    }

    return (
      <div className="grid grid-cols-1 gap-6">
        {serviciosFiltrados.map((servicio) => (
          <Card key={servicio.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="mr-3 p-2 rounded-full bg-primary/10">{getServiceTypeIcon(servicio.tipo)}</div>
                  <div>
                    <CardTitle>{servicio.tipo}</CardTitle>
                    <CardDescription>{formatDate(servicio.fecha)}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(servicio.estado)}>{servicio.estado}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Car className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{servicio.vehiculo}</span>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Servicios realizados:</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    {servicio.servicios.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Técnico:</p>
                    <p className="text-sm text-muted-foreground">{servicio.tecnico}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Garantía:</p>
                    <p className="text-sm text-muted-foreground">{servicio.garantia}</p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-lg">{formatCurrency(servicio.costo)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push(`/cliente/historial/${servicio.id}`)}>
                Ver Detalles
              </Button>
              <Button variant="ghost" onClick={() => router.push(`/cliente/facturas/${servicio.id}`)}>
                Ver Factura
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }
}
