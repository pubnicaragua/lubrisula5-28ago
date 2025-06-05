"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileText, Award, PenToolIcon as Tool } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface MiembroEquipo {
  id: number
  nombre: string
  cargo: string
  especialidad: string
  telefono: string
  email: string
  fechaContratacion: string
  estado: "Activo" | "Inactivo" | "De Vacaciones" | "Permiso"
  horasTrabajadas: number
  ordenesCompletadas: number
}

interface DetalleMiembroProps {
  miembro: MiembroEquipo
}

export function DetalleMiembro({ miembro }: DetalleMiembroProps) {
  // Datos de ejemplo para historial de órdenes
  const historialOrdenes = [
    {
      id: 1,
      numeroOrden: "ORD-2023-001",
      cliente: "Juan Pérez",
      vehiculo: "Toyota Corolla (ABC-123)",
      fecha: "2023-04-01",
      tipoServicio: "Reparación y Pintura",
      estado: "Completada",
    },
    {
      id: 2,
      numeroOrden: "ORD-2023-002",
      cliente: "Ana López",
      vehiculo: "Honda Civic (DEF-456)",
      fecha: "2023-04-03",
      tipoServicio: "Pintura Completa",
      estado: "Completada",
    },
    {
      id: 3,
      numeroOrden: "ORD-2023-003",
      cliente: "Grupo Logístico XYZ",
      vehiculo: "Ford Explorer (GHI-789)",
      fecha: "2023-04-05",
      tipoServicio: "Mantenimiento General",
      estado: "En Proceso",
    },
  ]

  // Datos de ejemplo para habilidades
  const habilidades = [
    { nombre: "Pintura Bicapa", nivel: 90 },
    { nombre: "Reparación de Carrocería", nivel: 85 },
    { nombre: "Soldadura", nivel: 75 },
    { nombre: "Diagnóstico Electrónico", nivel: 60 },
  ]

  // Datos de ejemplo para certificaciones
  const certificaciones = [
    {
      id: 1,
      nombre: "Técnico Certificado en Pintura Automotriz",
      institucion: "Instituto Técnico Automotriz",
      fecha: "2020-05-15",
      vigencia: "2025-05-15",
    },
    {
      id: 2,
      nombre: "Especialista en Reparación de Carrocería",
      institucion: "Centro de Capacitación Automotriz",
      fecha: "2021-03-10",
      vigencia: "2026-03-10",
    },
  ]

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Activo":
      case "Completada":
        return <Badge className="bg-green-500 hover:bg-green-600">{estado}</Badge>
      case "Inactivo":
        return <Badge className="bg-gray-500 hover:bg-gray-600">{estado}</Badge>
      case "De Vacaciones":
      case "En Proceso":
        return <Badge className="bg-blue-500 hover:bg-blue-600">{estado}</Badge>
      case "Permiso":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">{estado}</Badge>
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
              <p className="text-sm font-medium text-muted-foreground">Nombre</p>
              <p className="text-lg font-semibold">{miembro.nombre}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cargo</p>
              <p className="text-lg font-semibold">{miembro.cargo}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Especialidad</p>
              <p className="text-lg font-semibold">{miembro.especialidad}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
              <p className="text-lg font-semibold">{miembro.telefono}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg font-semibold">{miembro.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estado</p>
              <div className="mt-1">{getEstadoBadge(miembro.estado)}</div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha de Contratación</p>
              <p className="text-lg font-semibold">{miembro.fechaContratacion}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Órdenes Completadas</p>
              <p className="text-lg font-semibold">{miembro.ordenesCompletadas}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="ordenes">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ordenes">Órdenes Recientes</TabsTrigger>
          <TabsTrigger value="habilidades">Habilidades</TabsTrigger>
          <TabsTrigger value="certificaciones">Certificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="ordenes" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Órdenes Recientes</CardTitle>
              <Button size="sm">
                <FileText className="mr-2 h-4 w-4" /> Ver Todas
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Orden</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo de Servicio</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historialOrdenes.map((orden) => (
                    <TableRow key={orden.id}>
                      <TableCell className="font-medium">{orden.numeroOrden}</TableCell>
                      <TableCell>{orden.cliente}</TableCell>
                      <TableCell>{orden.vehiculo}</TableCell>
                      <TableCell>{orden.fecha}</TableCell>
                      <TableCell>{orden.tipoServicio}</TableCell>
                      <TableCell>{getEstadoBadge(orden.estado)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="habilidades" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Habilidades Técnicas</CardTitle>
              <Button size="sm">
                <Tool className="mr-2 h-4 w-4" /> Editar Habilidades
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {habilidades.map((habilidad, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{habilidad.nombre}</span>
                      <span className="text-sm text-muted-foreground">{habilidad.nivel}%</span>
                    </div>
                    <Progress value={habilidad.nivel} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificaciones" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Certificaciones</CardTitle>
              <Button size="sm">
                <Award className="mr-2 h-4 w-4" /> Agregar Certificación
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certificación</TableHead>
                    <TableHead>Institución</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Vigencia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificaciones.map((certificacion) => (
                    <TableRow key={certificacion.id}>
                      <TableCell className="font-medium">{certificacion.nombre}</TableCell>
                      <TableCell>{certificacion.institucion}</TableCell>
                      <TableCell>{certificacion.fecha}</TableCell>
                      <TableCell>{certificacion.vigencia}</TableCell>
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
