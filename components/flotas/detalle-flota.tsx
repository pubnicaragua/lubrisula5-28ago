"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Car, FileText, Calendar } from "lucide-react"

interface Flota {
  id: number
  nombre: string
  empresa: string
  contacto: string
  telefono: string
  email: string
  cantidadVehiculos: number
  estado: "Activa" | "Inactiva" | "En Negociación"
  fechaRegistro: string
  ultimaActualizacion: string
}

interface DetalleFlotaProps {
  flota: Flota
}

export function DetalleFlota({ flota }: DetalleFlotaProps) {
  // Datos de ejemplo para vehículos de la flota
  const vehiculos = [
    {
      id: 1,
      placa: "ABC-123",
      marca: "Toyota",
      modelo: "Hilux",
      año: 2021,
      tipo: "Pick-up",
      ultimoServicio: "2023-03-15",
      proximoServicio: "2023-06-15",
      estado: "Operativo",
    },
    {
      id: 2,
      placa: "DEF-456",
      marca: "Nissan",
      modelo: "Frontier",
      año: 2020,
      tipo: "Pick-up",
      ultimoServicio: "2023-02-20",
      proximoServicio: "2023-05-20",
      estado: "Operativo",
    },
    {
      id: 3,
      placa: "GHI-789",
      marca: "Mitsubishi",
      modelo: "L200",
      año: 2019,
      tipo: "Pick-up",
      ultimoServicio: "2023-04-05",
      proximoServicio: "2023-07-05",
      estado: "En Mantenimiento",
    },
  ]

  // Datos de ejemplo para historial de servicios
  const historialServicios = [
    {
      id: 1,
      vehiculo: "Toyota Hilux (ABC-123)",
      fecha: "2023-03-15",
      tipo: "Mantenimiento Preventivo",
      costo: 4500.0,
      estado: "Completado",
    },
    {
      id: 2,
      vehiculo: "Nissan Frontier (DEF-456)",
      fecha: "2023-02-20",
      tipo: "Cambio de Aceite",
      costo: 1200.0,
      estado: "Completado",
    },
    {
      id: 3,
      vehiculo: "Mitsubishi L200 (GHI-789)",
      fecha: "2023-04-05",
      tipo: "Reparación de Frenos",
      costo: 3800.0,
      estado: "En Proceso",
    },
  ]

  // Datos de ejemplo para contratos y acuerdos
  const contratos = [
    {
      id: 1,
      tipo: "Contrato de Servicio",
      fechaInicio: "2023-01-01",
      fechaFin: "2023-12-31",
      estado: "Activo",
      valorMensual: 15000.0,
    },
    {
      id: 2,
      tipo: "Acuerdo de Mantenimiento",
      fechaInicio: "2023-01-01",
      fechaFin: "2023-12-31",
      estado: "Activo",
      valorMensual: 8000.0,
    },
  ]

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Activa":
      case "Activo":
      case "Operativo":
      case "Completado":
        return <Badge className="bg-green-500 hover:bg-green-600">{estado}</Badge>
      case "Inactiva":
      case "Inactivo":
        return <Badge className="bg-gray-500 hover:bg-gray-600">{estado}</Badge>
      case "En Negociación":
      case "En Mantenimiento":
      case "En Proceso":
        return <Badge className="bg-blue-500 hover:bg-blue-600">{estado}</Badge>
      default:
        return <Badge>{estado}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre de la Flota</p>
              <p className="text-lg font-semibold">{flota.nombre}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Empresa</p>
              <p className="text-lg font-semibold">{flota.empresa}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Persona de Contacto</p>
              <p className="text-lg font-semibold">{flota.contacto}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
              <p className="text-lg font-semibold">{flota.telefono}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg font-semibold">{flota.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estado</p>
              <div className="mt-1">{getEstadoBadge(flota.estado)}</div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha de Registro</p>
              <p className="text-lg font-semibold">{flota.fechaRegistro}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Última Actualización</p>
              <p className="text-lg font-semibold">{flota.ultimaActualizacion}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="vehiculos">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vehiculos">Vehículos</TabsTrigger>
          <TabsTrigger value="historial">Historial de Servicios</TabsTrigger>
          <TabsTrigger value="contratos">Contratos y Acuerdos</TabsTrigger>
        </TabsList>

        <TabsContent value="vehiculos" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Vehículos de la Flota</CardTitle>
              <Button size="sm">
                <Car className="mr-2 h-4 w-4" /> Agregar Vehículo
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Placa</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Año</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Último Servicio</TableHead>
                    <TableHead>Próximo Servicio</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehiculos.map((vehiculo) => (
                    <TableRow key={vehiculo.id}>
                      <TableCell className="font-medium">{vehiculo.placa}</TableCell>
                      <TableCell>{vehiculo.marca}</TableCell>
                      <TableCell>{vehiculo.modelo}</TableCell>
                      <TableCell>{vehiculo.año}</TableCell>
                      <TableCell>{vehiculo.tipo}</TableCell>
                      <TableCell>{vehiculo.ultimoServicio}</TableCell>
                      <TableCell>{vehiculo.proximoServicio}</TableCell>
                      <TableCell>{getEstadoBadge(vehiculo.estado)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historial" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Historial de Servicios</CardTitle>
              <Button size="sm">
                <FileText className="mr-2 h-4 w-4" /> Exportar Historial
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo de Servicio</TableHead>
                    <TableHead>Costo (L)</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historialServicios.map((servicio) => (
                    <TableRow key={servicio.id}>
                      <TableCell className="font-medium">{servicio.vehiculo}</TableCell>
                      <TableCell>{servicio.fecha}</TableCell>
                      <TableCell>{servicio.tipo}</TableCell>
                      <TableCell>L {servicio.costo.toFixed(2)}</TableCell>
                      <TableCell>{getEstadoBadge(servicio.estado)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contratos" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Contratos y Acuerdos</CardTitle>
              <Button size="sm">
                <Calendar className="mr-2 h-4 w-4" /> Nuevo Contrato
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha Inicio</TableHead>
                    <TableHead>Fecha Fin</TableHead>
                    <TableHead>Valor Mensual (L)</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contratos.map((contrato) => (
                    <TableRow key={contrato.id}>
                      <TableCell className="font-medium">{contrato.tipo}</TableCell>
                      <TableCell>{contrato.fechaInicio}</TableCell>
                      <TableCell>{contrato.fechaFin}</TableCell>
                      <TableCell>L {contrato.valorMensual.toFixed(2)}</TableCell>
                      <TableCell>{getEstadoBadge(contrato.estado)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
