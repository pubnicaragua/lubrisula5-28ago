"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertTriangle, ArrowLeft, Printer, FileText, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getQuotationById, updateQuotation } from "@/lib/actions/quotations"
import { NuevaCotizacionForm } from "@/components/cotizaciones/nueva-cotizacion-form"
import Link from "next/link"
import COTIZACIONES_SERVICES, { CotizacionesType, DetalleCotyzacionesType } from "@/services/COTIZACIONES.SERVICE"

interface CotizacionDetalleTallerProps {
  id: string
}

export function CotizacionDetalleTaller({ id }: CotizacionDetalleTallerProps) {
  const [cotizacion, setCotizacion] = useState<DetalleCotyzacionesType>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { toast } = useToast()

  const loadCotizacion = async () => {
    setLoading(true)
    // const { succe, data, error: quotationError, isTableMissing } = await getQuotationById(id)
    const data = await COTIZACIONES_SERVICES.GET_DETALLE_COTIZACIONES_BY_ID(id)
    setCotizacion(data)
    setLoading(false)
  }
  useEffect(() => {
    loadCotizacion()
  }, [id])

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    loadCotizacion()
    toast({
      title: "Cotización actualizada",
      description: "La cotización ha sido actualizada exitosamente",
    })
  }

  const handleStatusChange = async (newStatus: "Pendiente" | "Aprobada" | "Rechazada" | "Convertida a Orden") => {
    try {
      const { success, error: updateError } = await updateQuotation(id, {
        status: newStatus,
      })

      if (success) {
        toast({
          title: "Estado actualizado",
          description: `La cotización ha sido marcada como ${newStatus}`,
        })
        loadCotizacion()
      } else {
        toast({
          title: "Error",
          description: updateError || "No se pudo actualizar el estado de la cotización",
          // variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar el estado de la cotización",
        // variant: "destructive",
      })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Pendiente":
        return "outline"
      case "Aprobada":
        return "success"
      case "Rechazada":
        return "destructive"
      case "Convertida a Orden":
        return "default"
      default:
        return "secondary"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl text-red-600 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" /> Error de Configuración
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error}</p>
            <p className="mb-6">
              Para utilizar el sistema de cotizaciones, es necesario configurar correctamente la base de datos con las
              tablas requeridas.
            </p>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-6">
              <h3 className="font-semibold text-amber-800 mb-2">Pasos para solucionar este problema:</h3>
              <ol className="list-decimal list-inside text-amber-700 space-y-2">
                <li>Verifique que su base de datos Supabase esté correctamente configurada</li>
                <li>Asegúrese de que las tablas necesarias (clients, vehicles, quotations, quotation_parts) existan</li>
                <li>Ejecute el script de inicialización de la base de datos si está disponible</li>
                <li>Contacte al administrador del sistema si el problema persiste</li>
              </ol>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/taller/cotizaciones">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Cotizaciones
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!cotizacion) {
    return (
      <div className="container mx-auto py-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Cotización no encontrada</CardTitle>
          </CardHeader>
          <CardContent>
            <p>La cotización solicitada no existe o ha sido eliminada.</p>
          </CardContent>
          <CardFooter>
            <Link href="/taller/cotizaciones">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Cotizaciones
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/taller/cotizaciones">
            <Button variant="outline" size="icon" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Cotización {cotizacion.cotizacion?.quotation_number}</h1>
        </div>
        <div className="flex gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" /> Editar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Editar Cotización</DialogTitle>
                <DialogDescription>Modifica los detalles de esta cotización.</DialogDescription>
              </DialogHeader>
              {/* <NuevaCotizacionForm onSuccess={handleEditSuccess} cotizacionExistente={cotizacion} /> */}
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Imprimir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Nombre:</span> {cotizacion.client?.name || "No disponible"}
              </div>
              <div>
                <span className="font-medium">Teléfono:</span> {cotizacion.client?.phone || "No disponible"}
              </div>
              <div>
                <span className="font-medium">Email:</span> {cotizacion.client?.email || "No disponible"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información del Vehículo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Marca:</span> {cotizacion.vehiculo?.marca || "No disponible"}
              </div>
              <div>
                <span className="font-medium">Modelo:</span> {cotizacion.vehiculo?.modelo || "No disponible"}
              </div>
              <div>
                <span className="font-medium">Año:</span> {cotizacion.vehiculo?.ano || "No disponible"}
              </div>
              <div>
                <span className="font-medium">Placa:</span> {cotizacion.vehiculo?.placa || "No disponible"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Cotización</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Número:</span> {cotizacion.cotizacion?.quotation_number}
              </div>
              <div>
                <span className="font-medium">Fecha:</span> {formatDate(cotizacion.cotizacion?.date)}
              </div>
              <div>
                <span className="font-medium">Estado:</span>{" "}
                <Badge variant={getBadgeVariant(cotizacion.cotizacion?.status)}>{cotizacion.cotizacion?.status}</Badge>
              </div>
              <div>
                <span className="font-medium">Tiempo estimado:</span> {cotizacion.cotizacion?.estimated_days.toFixed(1)} días (
                {cotizacion.cotizacion?.repair_hours.toFixed(1)} horas)
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
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
              {cotizacion.partesCotizacion && cotizacion.partesCotizacion.length > 0 ? (
                cotizacion.partesCotizacion.map((parte: any, index: number) => (
                  <TableRow key={parte.id || index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{parte.quantity}</TableCell>
                    <TableCell>{parte.name}</TableCell>
                    <TableCell>{parte.operation}</TableCell>
                    <TableCell>{parte.material_type}</TableCell>
                    <TableCell>{parte.repair_type}</TableCell>
                    <TableCell>{parte.repair_hours.toFixed(2)}</TableCell>
                    <TableCell>L {parte.labor_cost.toFixed(2)}</TableCell>
                    <TableCell>L {parte.materials_cost.toFixed(2)}</TableCell>
                    <TableCell>L {parte.parts_cost.toFixed(2)}</TableCell>
                    <TableCell>L {parte.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} className="text-center">
                    No hay partes registradas para esta cotización
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumen de Costos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="space-y-2">
                <div className="grid grid-cols-2">
                  <span className="font-medium">Mano de Obra:</span>
                  <span>L {cotizacion.cotizacion?.total_labor.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="font-medium">Materiales:</span>
                  <span>L {cotizacion.cotizacion?.total_materials.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="font-medium">Repuestos:</span>
                  <span>L {cotizacion.cotizacion?.total_parts.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="grid grid-cols-2">
                  <span className="font-medium text-lg">Total:</span>
                  <span className="font-bold text-lg">L {cotizacion.cotizacion?.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Acciones</h3>
              {cotizacion.cotizacion?.status === "Pendiente" && (
                <div className="flex gap-2">
                  <Button onClick={() => handleStatusChange("Aprobada")} className="flex-1">
                    <CheckCircle className="mr-2 h-4 w-4" /> Aprobar
                  </Button>
                  <Button onClick={() => handleStatusChange("Rechazada")} variant="destructive" className="flex-1">
                    <XCircle className="mr-2 h-4 w-4" /> Rechazar
                  </Button>
                </div>
              )}
              {cotizacion.cotizacion?.status === "Aprobada" && (
                <div className="flex gap-2">
                  <Button onClick={() => handleStatusChange("Convertida a Orden")} className="flex-1">
                    <FileText className="mr-2 h-4 w-4" /> Convertir a Orden
                  </Button>
                  <Button onClick={() => handleStatusChange("Pendiente")} variant="outline" className="flex-1">
                    Marcar como Pendiente
                  </Button>
                </div>
              )}
              {cotizacion.cotizacion?.status === "Rechazada" && (
                <Button onClick={() => handleStatusChange("Pendiente")} variant="outline" className="w-full">
                  Marcar como Pendiente
                </Button>
              )}
              {cotizacion.cotizacion?.status === "Convertida a Orden" && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-green-800">
                    Esta cotización ha sido convertida a una orden de trabajo. Ya no se puede modificar su estado.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
