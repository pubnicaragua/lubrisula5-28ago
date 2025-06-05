"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PrinterIcon as Print, FileText, ArrowRight } from "lucide-react"

interface Orden {
  id: number
  numeroOrden: string
  cliente: string
  vehiculo: string
  fechaIngreso: string
  fechaEntrega: string
  estado: "Recepción" | "Diagnóstico" | "Reparación" | "Control de Calidad" | "Entrega" | "Completada"
  tipoServicio: string
  costoMateriales: number
  costoManoObra: number
  total: number
}

interface DetalleOrdenProps {
  orden: Orden
}

export function DetalleOrden({ orden }: DetalleOrdenProps) {
  const getEstadoBadge = (estado: Orden["estado"]) => {
    switch (estado) {
      case "Recepción":
        return <Badge className="bg-blue-500 hover:bg-blue-600">{estado}</Badge>
      case "Diagnóstico":
        return <Badge className="bg-purple-500 hover:bg-purple-600">{estado}</Badge>
      case "Reparación":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">{estado}</Badge>
      case "Control de Calidad":
        return <Badge className="bg-orange-500 hover:bg-orange-600">{estado}</Badge>
      case "Entrega":
        return <Badge className="bg-green-500 hover:bg-green-600">{estado}</Badge>
      case "Completada":
        return <Badge className="bg-gray-500 hover:bg-gray-600">{estado}</Badge>
      default:
        return <Badge>{estado}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{orden.numeroOrden}</h2>
          <p className="text-muted-foreground">Estado: {getEstadoBadge(orden.estado)}</p>
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
          <TabsTrigger value="servicio">Detalles del Servicio</TabsTrigger>
          <TabsTrigger value="costos">Costos</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Información del Cliente y Vehículo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Cliente</h3>
                  <p className="font-medium">{orden.cliente}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Vehículo</h3>
                  <p className="font-medium">{orden.vehiculo}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Fecha de Ingreso</h3>
                  <p className="font-medium">{orden.fechaIngreso}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Fecha de Entrega Estimada</h3>
                  <p className="font-medium">{orden.fechaEntrega}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historial de Estados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute h-full w-0.5 bg-muted left-2.5 top-0"></div>
                <ul className="space-y-4 relative">
                  <li className="flex gap-4 items-center">
                    <div className="h-5 w-5 rounded-full bg-blue-500 z-10"></div>
                    <div>
                      <p className="font-medium">Recepción</p>
                      <p className="text-sm text-muted-foreground">{orden.fechaIngreso}</p>
                    </div>
                  </li>
                  {orden.estado !== "Recepción" && (
                    <li className="flex gap-4 items-center">
                      <div className="h-5 w-5 rounded-full bg-purple-500 z-10"></div>
                      <div>
                        <p className="font-medium">Diagnóstico</p>
                        <p className="text-sm text-muted-foreground">03/04/2023</p>
                      </div>
                    </li>
                  )}
                  {(orden.estado === "Reparación" ||
                    orden.estado === "Control de Calidad" ||
                    orden.estado === "Entrega" ||
                    orden.estado === "Completada") && (
                    <li className="flex gap-4 items-center">
                      <div className="h-5 w-5 rounded-full bg-yellow-500 z-10"></div>
                      <div>
                        <p className="font-medium">Reparación</p>
                        <p className="text-sm text-muted-foreground">05/04/2023</p>
                      </div>
                    </li>
                  )}
                  {(orden.estado === "Control de Calidad" ||
                    orden.estado === "Entrega" ||
                    orden.estado === "Completada") && (
                    <li className="flex gap-4 items-center">
                      <div className="h-5 w-5 rounded-full bg-orange-500 z-10"></div>
                      <div>
                        <p className="font-medium">Control de Calidad</p>
                        <p className="text-sm text-muted-foreground">08/04/2023</p>
                      </div>
                    </li>
                  )}
                  {(orden.estado === "Entrega" || orden.estado === "Completada") && (
                    <li className="flex gap-4 items-center">
                      <div className="h-5 w-5 rounded-full bg-green-500 z-10"></div>
                      <div>
                        <p className="font-medium">Entrega</p>
                        <p className="text-sm text-muted-foreground">{orden.fechaEntrega}</p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="servicio" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Servicio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Tipo de Servicio</h3>
                <p className="font-medium">{orden.tipoServicio}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Descripción</h3>
                <p>
                  Reparación de golpe lateral derecho, incluye enderezado de puerta y guardafango. Pintura bicapa en las
                  áreas afectadas con igualación de color.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Observaciones</h3>
                <p>
                  Cliente solicita revisión adicional de sistema de frenos. Se detectaron rayones menores en la puerta
                  trasera que no estaban incluidos en la cotización inicial.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Materiales Utilizados</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Base Catalizada</span>
                  <span>1200 gramos</span>
                </li>
                <li className="flex justify-between">
                  <span>Pintura Bicapa</span>
                  <span>800 gramos</span>
                </li>
                <li className="flex justify-between">
                  <span>Transparente IW204</span>
                  <span>600 gramos</span>
                </li>
                <li className="flex justify-between">
                  <span>Masilla Flex</span>
                  <span>250 gramos</span>
                </li>
                <li className="flex justify-between">
                  <span>Lijas (varios granos)</span>
                  <span>12 unidades</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costos" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Desglose de Costos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Costo de Materiales:</span>
                  <span>L {orden.costoMateriales.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Costo de Mano de Obra:</span>
                  <span>L {orden.costoManoObra.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>L {orden.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Detalle de Horas</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Horas de Reparación:</span>
                    <span>12 horas</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Horas de Pintura:</span>
                    <span>8 horas</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Horas de Acabado:</span>
                    <span>3 horas</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total Horas:</span>
                    <span>23 horas</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>
                Generar Factura <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
