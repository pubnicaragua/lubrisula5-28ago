"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, FileText, FileInput, Calendar, User, Phone, Mail } from "lucide-react"
import VEHICULO_SERVICES, { VehiculoType } from "@/services/VEHICULOS.SERVICE"

export default function VehiculoDetallePage() {
  const params = useParams()
  const router = useRouter()
  const [vehiculo, setVehiculo] = useState<VehiculoType>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadVehiculoDetails()
  }, [params.id])

  const loadVehiculoDetails = async () => {
    setIsLoading(true)
    console.log(params)
    const savedVehiculos = await VEHICULO_SERVICES.GET_VEHICULOS_BY_ID(params.id as string)
    setVehiculo(savedVehiculos)
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!vehiculo) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Vehículo no encontrado</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {vehiculo.marca} {vehiculo.modelo} ({vehiculo.ano})
            </h1>
            <p className="text-muted-foreground">Placa: {vehiculo.placa}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push(`/taller/vehiculos/${vehiculo.id}/ingreso`)}>
            <FileInput className="mr-2 h-4 w-4" />
            Hoja de Ingreso
          </Button>
          <Button variant="outline" onClick={() => router.push(`/taller/vehiculos/${vehiculo.id}/inspeccion`)}>
            <FileText className="mr-2 h-4 w-4" />
            Hoja de Inspección
          </Button>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información del Vehículo */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Vehículo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Marca</label>
                <p className="text-lg font-semibold">{vehiculo.marca}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Modelo</label>
                <p className="text-lg font-semibold">{vehiculo.modelo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Año</label>
                <p className="text-lg font-semibold">{vehiculo.ano}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Placa</label>
                <p className="text-lg font-semibold">{vehiculo.placa}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Color</label>
                <p className="text-lg font-semibold">{vehiculo.color}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                <Badge variant="secondary">{vehiculo.estado}</Badge>
              </div>
            </div>
            {vehiculo.vin && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">VIN</label>
                <p className="text-lg font-mono">{vehiculo.vin}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información del Cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {vehiculo.client_name ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-lg font-semibold">
                    {vehiculo.client_name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{vehiculo.client_phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{vehiculo.client_email}</span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No hay información del cliente disponible</p>
            )}
          </CardContent>
        </Card>

        {/* Historial de Servicios */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Historial de Servicios</CardTitle>
            <CardDescription>Últimos servicios realizados a este vehículo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Cambio de aceite y filtro</p>
                    <p className="text-sm text-muted-foreground">15 de Marzo, 2024</p>
                  </div>
                </div>
                <Badge variant="outline">Completado</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Revisión general</p>
                    <p className="text-sm text-muted-foreground">28 de Febrero, 2024</p>
                  </div>
                </div>
                <Badge variant="outline">Completado</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Reparación de frenos</p>
                    <p className="text-sm text-muted-foreground">10 de Enero, 2024</p>
                  </div>
                </div>
                <Badge variant="outline">Completado</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
