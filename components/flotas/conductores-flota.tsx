"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserPlus, FileText, Phone } from "lucide-react"

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

interface ConductoresFlotaProps {
  flota: Flota
}

export function ConductoresFlota({ flota }: ConductoresFlotaProps) {
  // Datos de ejemplo para conductores
  const conductores = [
    {
      id: 1,
      nombre: "Roberto Méndez",
      licencia: "12345678",
      tipoLicencia: "Profesional",
      telefono: "9876-5432",
      vehiculoAsignado: "Toyota Hilux (ABC-123)",
      fechaContratacion: "2020-05-15",
      estado: "Activo",
    },
    {
      id: 2,
      nombre: "Luis Hernández",
      licencia: "87654321",
      tipoLicencia: "Profesional",
      telefono: "8765-4321",
      vehiculoAsignado: "Nissan Frontier (DEF-456)",
      fechaContratacion: "2021-02-10",
      estado: "Activo",
    },
    {
      id: 3,
      nombre: "María Castillo",
      licencia: "23456789",
      tipoLicencia: "Profesional",
      telefono: "7654-3210",
      vehiculoAsignado: "Mitsubishi L200 (GHI-789)",
      fechaContratacion: "2019-11-20",
      estado: "De Vacaciones",
    },
    {
      id: 4,
      nombre: "Carlos Fuentes",
      licencia: "34567890",
      tipoLicencia: "Profesional",
      telefono: "6543-2109",
      vehiculoAsignado: "Sin asignar",
      fechaContratacion: "2022-01-15",
      estado: "Inactivo",
    },
  ]

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Activo":
        return <Badge className="bg-green-500 hover:bg-green-600">{estado}</Badge>
      case "Inactivo":
        return <Badge className="bg-gray-500 hover:bg-gray-600">{estado}</Badge>
      case "De Vacaciones":
        return <Badge className="bg-blue-500 hover:bg-blue-600">{estado}</Badge>
      default:
        return <Badge>{estado}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Conductores de {flota.nombre}</CardTitle>
          <div className="flex space-x-2">
            <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" /> Agregar Conductor
            </Button>
            <Button size="sm" variant="outline">
              <FileText className="mr-2 h-4 w-4" /> Exportar Lista
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Licencia</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Vehículo Asignado</TableHead>
                <TableHead>Fecha Contratación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conductores.map((conductor) => (
                <TableRow key={conductor.id}>
                  <TableCell className="font-medium">{conductor.nombre}</TableCell>
                  <TableCell>{conductor.licencia}</TableCell>
                  <TableCell>{conductor.tipoLicencia}</TableCell>
                  <TableCell>{conductor.telefono}</TableCell>
                  <TableCell>{conductor.vehiculoAsignado}</TableCell>
                  <TableCell>{conductor.fechaContratacion}</TableCell>
                  <TableCell>{getEstadoBadge(conductor.estado)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" title="Llamar">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Ver detalles">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
