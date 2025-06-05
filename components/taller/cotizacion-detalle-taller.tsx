"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, AlertTriangle, Printer, FileText, ArrowRight, Car, User } from "lucide-react"

// Datos de ejemplo para una cotización
const COTIZACION_EJEMPLO = {
  id: "1",
  quotation_number: "COT-2023-001",
  client: {
    id: "1",
    name: "Juan Pérez",
    phone: "9999-8888",
    email: "juan.perez@example.com",
    client_type: "Particular",
  },
  vehicle: {
    id: "1",
    brand: "Toyota",
    model: "Corolla",
    year: 2019,
    plate: "ABC-1234",
    vin: "1HGCM82633A123456",
    color: "Blanco",
  },
  date: "2023-05-10",
  status: "Pendiente",
  total_labor: 5000.0,
  total_materials: 3500.0,
  total_parts: 4000.0,
  total: 12500.0,
  repair_hours: 8.5,
  estimated_days: 2.5,
  parts: [
    {
      id: "1",
      category: "Estructural",
      name: "POSICIONAMIENTO EN MAQUINA DE ENDEREZADO",
      quantity: 1,
      operation: "Cor",
      material_type: "HI",
      repair_type: "MM",
      repair_hours: 2.0,
      labor_cost: 1200.0,
      materials_cost: 0.0,
      parts_cost: 0.0,
      total: 1200.0,
    },
    {
      id: "2",
      category: "Carrocería",
      name: "CUBIERTA SUPERIOR DE BOMPER",
      quantity: 1,
      operation: "Rep",
      material_type: "PL",
      repair_type: "MM",
      repair_hours: 6.0,
      labor_cost: 2160.0,
      materials_cost: 1072.94,
      parts_cost: 0.0,
      total: 3232.94,
    },
    {
      id: "3",
      category: "Pintura",
      name: "PINTURA GENERAL",
      quantity: 1,
      operation: "Rep",
      material_type: "PL",
      repair_type: "GN",
      repair_hours: 4.0,
      labor_cost: 1640.0,
      materials_cost: 2427.06,
      parts_cost: 4000.0,
      total: 8067.06,
    },
  ],
}

interface CotizacionDetalleTallerProps {
  cotizacionId?: string
}

export function CotizacionDetalleTaller({ cotizacionId = "1" }: CotizacionDetalleTallerProps) {
  const [cotizacion] = useState(COTIZACION_EJEMPLO)
  const [actualizando, setActualizando] = useState(false)
  const { toast } = useToast()

  const handleStatusChange = async (newStatus: string) => {
    setActualizando(true)

    // Simulamos una actualización
    setTimeout(() => {
      setActualizando(false)
      toast({
        title: "Estado actualizado",
        description: `La cotización ha sido marcada como ${newStatus}`,
      })
    }, 1000)
  }

  const convertirAOrden = async () => {
    setActualizando(true)

    // Simulamos una conversión
    setTimeout(() => {
      setActualizando(false)
      toast({
        title: "Cotización convertida",
        description: "La cotización se ha convertido a orden de trabajo",
      })
    }, 1000)
  }

  // Función para obtener el color del badge según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "Aprobada":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "Rechazada":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "Convertida a Orden":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-md">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{cotizacion.quotation_number}</h1>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{new Date(cotizacion.date).toLocaleDateString()}</span>
              <Badge className={getStatusColor(cotizacion.status)}>{cotizacion.status}</Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button size="sm">Editar</Button>
        </div>
      </div>

      <Tabs defaultValue="resumen" className="space-y-4">
        <TabsList>
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="detalles">Detalles</TabsTrigger>
          <TabsTrigger value="acciones">Acciones</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Nombre:</span>
                    <p>{cotizacion.client?.name || "No disponible"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Teléfono:</span>
                    <p>{cotizacion.client?.phone || "No disponible"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Email:</span>
                    <p>{cotizacion.client?.email || "No disponible"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Tipo:</span>
                    <p>{cotizacion.client?.client_type || "No disponible"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Información del Vehículo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Marca y Modelo:</span>
                    <p>{`${cotizacion.vehicle?.brand || "N/A"} ${cotizacion.vehicle?.model || ""}`}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Año:</span>
                    <p>{cotizacion.vehicle?.year || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Placa:</span>
                    <p>{cotizacion.vehicle?.plate || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">VIN:</span>
                    <p>{cotizacion.vehicle?.vin || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumen de la Cotización</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Horas de Reparación:</span>
                    <p className="text-2xl font-bold">{cotizacion.repair_hours.toFixed(2)} horas</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Tiempo Estimado:</span>
                    <p className="text-lg">{cotizacion.estimated_days.toFixed(1)} días</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Mano de Obra:</span>
                    <p className="text-lg">L {cotizacion.total_labor.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Materiales:</span>
                    <p className="text-lg">L {cotizacion.total_materials.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Repuestos:</span>
                    <p className="text-lg">L {cotizacion.total_parts.toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">TOTAL:</span>
                    <p className="text-3xl font-bold text-primary">L {cotizacion.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detalles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detalles de Reparación</CardTitle>
              <CardDescription>Partes y servicios incluidos en la cotización</CardDescription>
            </CardHeader>
            <CardContent>
              {cotizacion.parts && cotizacion.parts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No.</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Parte/Servicio</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Operación</TableHead>
                      <TableHead>Horas</TableHead>
                      <TableHead>Mano de Obra</TableHead>
                      <TableHead>Materiales</TableHead>
                      <TableHead>Repuestos</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cotizacion.parts.map((part: any, index: number) => (
                      <TableRow key={part.id || index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{part.category}</TableCell>
                        <TableCell>{part.name}</TableCell>
                        <TableCell>{part.quantity}</TableCell>
                        <TableCell>{part.operation}</TableCell>
                        <TableCell>{part.repair_hours.toFixed(2)}</TableCell>
                        <TableCell>L {part.labor_cost.toFixed(2)}</TableCell>
                        <TableCell>L {part.materials_cost.toFixed(2)}</TableCell>
                        <TableCell>L {part.parts_cost.toFixed(2)}</TableCell>
                        <TableCell>L {part.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No hay partes o servicios en esta cotización</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Partes Estructurales</CardTitle>
              </CardHeader>
              <CardContent>
                {cotizacion.parts && cotizacion.parts.filter((p: any) => p.category === "Estructural").length > 0 ? (
                  <div className="space-y-2">
                    {cotizacion.parts
                      .filter((p: any) => p.category === "Estructural")
                      .map((part: any, index: number) => (
                        <div key={part.id || index} className="flex justify-between items-center">
                          <div className="text-sm">
                            <span className="font-medium">{part.name}</span>
                            <div className="text-xs text-muted-foreground">
                              {part.operation} - {part.repair_hours.toFixed(2)} horas
                            </div>
                          </div>
                          <div className="text-sm font-medium">L {part.total.toFixed(2)}</div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No hay partes estructurales</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Partes de Carrocería</CardTitle>
              </CardHeader>
              <CardContent>
                {cotizacion.parts && cotizacion.parts.filter((p: any) => p.category === "Carrocería").length > 0 ? (
                  <div className="space-y-2">
                    {cotizacion.parts
                      .filter((p: any) => p.category === "Carrocería")
                      .map((part: any, index: number) => (
                        <div key={part.id || index} className="flex justify-between items-center">
                          <div className="text-sm">
                            <span className="font-medium">{part.name}</span>
                            <div className="text-xs text-muted-foreground">
                              {part.operation} - {part.repair_hours.toFixed(2)} horas
                            </div>
                          </div>
                          <div className="text-sm font-medium">L {part.total.toFixed(2)}</div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No hay partes de carrocería</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Partes de Pintura</CardTitle>
              </CardHeader>
              <CardContent>
                {cotizacion.parts && cotizacion.parts.filter((p: any) => p.category === "Pintura").length > 0 ? (
                  <div className="space-y-2">
                    {cotizacion.parts
                      .filter((p: any) => p.category === "Pintura")
                      .map((part: any, index: number) => (
                        <div key={part.id || index} className="flex justify-between items-center">
                          <div className="text-sm">
                            <span className="font-medium">{part.name}</span>
                            <div className="text-xs text-muted-foreground">
                              {part.operation} - {part.repair_hours.toFixed(2)} horas
                            </div>
                          </div>
                          <div className="text-sm font-medium">L {part.total.toFixed(2)}</div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No hay partes de pintura</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="acciones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Cotización</CardTitle>
              <CardDescription>Cambiar estado y realizar acciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="text-sm font-medium">Estado actual:</div>
                <Badge className={`text-sm ${getStatusColor(cotizacion.status)}`}>{cotizacion.status}</Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="text-sm font-medium">Cambiar estado a:</div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={cotizacion.status === "Pendiente" || actualizando}
                    onClick={() => handleStatusChange("Pendiente")}
                  >
                    Pendiente
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={cotizacion.status === "Aprobada" || actualizando}
                    onClick={() => handleStatusChange("Aprobada")}
                    className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Aprobar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={cotizacion.status === "Rechazada" || actualizando}
                    onClick={() => handleStatusChange("Rechazada")}
                    className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Rechazar
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="text-sm font-medium">Acciones disponibles:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    className="w-full"
                    disabled={
                      actualizando || cotizacion.status === "Rechazada" || cotizacion.status === "Convertida a Orden"
                    }
                    onClick={convertirAOrden}
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Convertir a Orden de Trabajo
                  </Button>
                  <Button variant="outline" className="w-full">
                    Enviar por Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comentarios</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="min-h-[120px] w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Agregar comentarios o notas sobre esta cotización..."
              />
              <Button className="mt-4">Guardar Comentarios</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
