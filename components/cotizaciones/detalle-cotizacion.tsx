"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PrinterIcon as Print, FileText, ArrowRight, CheckCircle, XCircle, Settings } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Cotizacion {
  id: number
  numeroCotizacion: string
  cliente: string
  telefono: string
  email: string
  vehiculo: {
    marca: string
    modelo: string
    año: number
    placa: string
    vin: string
    tipo: string
    color: string
  }
  fecha: string
  estado: "Pendiente" | "Aprobada" | "Rechazada" | "Convertida a Orden"
  totalManoObra: number
  totalMateriales: number
  totalRepuestos: number
  total: number
  horasReparacion: number
  diasEstimados: number
}

interface DetalleCotizacionProps {
  cotizacion: Cotizacion
}

export function DetalleCotizacion({ cotizacion }: DetalleCotizacionProps) {
  // Datos de ejemplo para las partes de la cotización
  const partes = [
    {
      id: 1,
      categoria: "Estructural",
      nombre: "POSICIONAMIENTO EN MAQUINA DE ENDEREZADO",
      cantidad: 1,
      operacion: "Cor",
      tipoMaterial: "HI",
      tipoReparacion: "MM",
      horasReparacion: 2.0,
      manoObra: 1200.0,
      materiales: 0.0,
      repuestos: 0.0,
      total: 1200.0,
    },
    {
      id: 2,
      categoria: "Estructural",
      nombre: "COLUMNA CENTRAL DER",
      cantidad: 1,
      operacion: "Cor",
      tipoMaterial: "HI",
      tipoReparacion: "MM",
      horasReparacion: 6.0,
      manoObra: 3600.0,
      materiales: 0.0,
      repuestos: 0.0,
      total: 3600.0,
    },
    {
      id: 3,
      categoria: "Estructural",
      nombre: "COLUMNA TRASERA DERECHA",
      cantidad: 1,
      operacion: "Cor",
      tipoMaterial: "HI",
      tipoReparacion: "MM",
      horasReparacion: 6.0,
      manoObra: 3600.0,
      materiales: 0.0,
      repuestos: 0.0,
      total: 3600.0,
    },
    {
      id: 4,
      categoria: "Estructural",
      nombre: "PESCANTE TRASERO DER",
      cantidad: 1,
      operacion: "Rep",
      tipoMaterial: "HI",
      tipoReparacion: "MM",
      horasReparacion: 3.0,
      manoObra: 2040.0,
      materiales: 562.66,
      repuestos: 0.0,
      total: 2602.66,
    },
    {
      id: 5,
      categoria: "Carrocería",
      nombre: "CUBIERTA SUPERIOR DE BOMPER",
      cantidad: 1,
      operacion: "Rep",
      tipoMaterial: "PL",
      tipoReparacion: "MM",
      horasReparacion: 6.0,
      manoObra: 2160.0,
      materiales: 1072.94,
      repuestos: 0.0,
      total: 3232.94,
    },
    {
      id: 6,
      categoria: "Pintura",
      nombre: "GUARDAFANGO DER",
      cantidad: 1,
      operacion: "Rep",
      tipoMaterial: "PL",
      tipoReparacion: "MM",
      horasReparacion: 4.0,
      manoObra: 2334.0,
      materiales: 835.05,
      repuestos: 0.0,
      total: 3169.05,
    },
    {
      id: 7,
      categoria: "Pintura",
      nombre: "PUERTA DELANTERA DER",
      cantidad: 1,
      operacion: "Rep",
      tipoMaterial: "HI",
      tipoReparacion: "MM",
      horasReparacion: 12.0,
      manoObra: 6972.0,
      materiales: 3272.2,
      repuestos: 0.0,
      total: 10244.2,
    },
  ]

  const getEstadoBadge = (estado: Cotizacion["estado"]) => {
    switch (estado) {
      case "Pendiente":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">{estado}</Badge>
      case "Aprobada":
        return <Badge className="bg-green-500 hover:bg-green-600">{estado}</Badge>
      case "Rechazada":
        return <Badge className="bg-red-500 hover:bg-red-600">{estado}</Badge>
      case "Convertida a Orden":
        return <Badge className="bg-blue-500 hover:bg-blue-600">{estado}</Badge>
      default:
        return <Badge>{estado}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 relative">
            <div className="w-16 h-16 bg-primary rounded-md flex items-center justify-center">
              <Settings className="h-10 w-10 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{cotizacion.numeroCotizacion}</h2>
            <p className="text-muted-foreground">
              Fecha: {cotizacion.fecha} | Estado: {getEstadoBadge(cotizacion.estado)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Print className="mr-2 h-4 w-4" /> Imprimir
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" /> Exportar PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Información General</TabsTrigger>
          <TabsTrigger value="partes">Partes y Servicios</TabsTrigger>
          <TabsTrigger value="acciones">Acciones</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Información del Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Cliente</h3>
                    <p className="font-medium">{cotizacion.cliente}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Teléfono</h3>
                    <p className="font-medium">{cotizacion.telefono}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Email</h3>
                  <p className="font-medium">{cotizacion.email}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información del Vehículo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Marca</h3>
                    <p className="font-medium">{cotizacion.vehiculo.marca}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Modelo</h3>
                    <p className="font-medium">{cotizacion.vehiculo.modelo}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Año</h3>
                    <p className="font-medium">{cotizacion.vehiculo.año}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Tipo</h3>
                    <p className="font-medium">{cotizacion.vehiculo.tipo}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Placa</h3>
                    <p className="font-medium">{cotizacion.vehiculo.placa}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">VIN</h3>
                    <p className="font-medium">{cotizacion.vehiculo.vin}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resumen de Costos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Mano de Obra:</span>
                    <span>L {cotizacion.totalManoObra.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Materiales:</span>
                    <span>L {cotizacion.totalMateriales.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Repuestos:</span>
                    <span>L {cotizacion.totalRepuestos.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>L {cotizacion.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Horas de Reparación:</span>
                    <span>{cotizacion.horasReparacion.toFixed(2)} horas</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Días Estimados:</span>
                    <span>{cotizacion.diasEstimados.toFixed(1)} días</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partes" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Partes y Servicios</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead>Cant</TableHead>
                    <TableHead>Parte</TableHead>
                    <TableHead>OP</TableHead>
                    <TableHead>T.Mat</TableHead>
                    <TableHead>T.Rep</TableHead>
                    <TableHead>Horas</TableHead>
                    <TableHead>Mano de Obra</TableHead>
                    <TableHead>Materiales</TableHead>
                    <TableHead>Repuesto</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partes.map((parte, index) => (
                    <TableRow key={parte.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{parte.cantidad}</TableCell>
                      <TableCell>{parte.nombre}</TableCell>
                      <TableCell>{parte.operacion}</TableCell>
                      <TableCell>{parte.tipoMaterial}</TableCell>
                      <TableCell>{parte.tipoReparacion}</TableCell>
                      <TableCell>{parte.horasReparacion.toFixed(2)}</TableCell>
                      <TableCell>L {parte.manoObra.toFixed(2)}</TableCell>
                      <TableCell>L {parte.materiales.toFixed(2)}</TableCell>
                      <TableCell>L {parte.repuestos.toFixed(2)}</TableCell>
                      <TableCell>L {parte.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Estructural</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {partes
                    .filter((parte) => parte.categoria === "Estructural")
                    .map((parte) => (
                      <div key={parte.id} className="flex justify-between">
                        <span>{parte.nombre}</span>
                        <span>L {parte.total.toFixed(2)}</span>
                      </div>
                    ))}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total Estructural:</span>
                    <span>
                      L{" "}
                      {partes
                        .filter((parte) => parte.categoria === "Estructural")
                        .reduce((sum, parte) => sum + parte.total, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Carrocería</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {partes
                    .filter((parte) => parte.categoria === "Carrocería")
                    .map((parte) => (
                      <div key={parte.id} className="flex justify-between">
                        <span>{parte.nombre}</span>
                        <span>L {parte.total.toFixed(2)}</span>
                      </div>
                    ))}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total Carrocería:</span>
                    <span>
                      L{" "}
                      {partes
                        .filter((parte) => parte.categoria === "Carrocería")
                        .reduce((sum, parte) => sum + parte.total, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pintura</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {partes
                    .filter((parte) => parte.categoria === "Pintura")
                    .map((parte) => (
                      <div key={parte.id} className="flex justify-between">
                        <span>{parte.nombre}</span>
                        <span>L {parte.total.toFixed(2)}</span>
                      </div>
                    ))}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total Pintura:</span>
                    <span>
                      L{" "}
                      {partes
                        .filter((parte) => parte.categoria === "Pintura")
                        .reduce((sum, parte) => sum + parte.total, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="acciones" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Acciones Disponibles</CardTitle>
              <CardDescription>Gestiona el estado de esta cotización</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button className="w-full" variant="outline">
                  <CheckCircle className="mr-2 h-4 w-4" /> Aprobar Cotización
                </Button>
                <Button className="w-full" variant="outline">
                  <XCircle className="mr-2 h-4 w-4" /> Rechazar Cotización
                </Button>
              </div>

              <Button className="w-full">
                <ArrowRight className="mr-2 h-4 w-4" /> Convertir a Orden de Servicio
              </Button>

              <Separator className="my-4" />

              <div className="space-y-2">
                <h3 className="font-medium">Enviar Cotización</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full">
                    Enviar por Email
                  </Button>
                  <Button variant="outline" className="w-full">
                    Enviar por WhatsApp
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historial de Cambios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Cotización creada</p>
                    <p className="text-sm text-muted-foreground">Por: Usuario Taller</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{cotizacion.fecha} 10:35 AM</p>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Cotización enviada al cliente</p>
                    <p className="text-sm text-muted-foreground">Por: Usuario Taller</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{cotizacion.fecha} 11:20 AM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
