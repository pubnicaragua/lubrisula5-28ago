"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, FileText, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getQuotations } from "@/lib/actions/quotations"
import { NuevaCotizacionForm } from "@/components/cotizaciones/nueva-cotizacion-form"
import Link from "next/link"
import COTIZACIONES_SERVICES, { CotizacionesType } from "@/services/COTIZACIONES.SERVICE"

type Quotation = {
  id: string
  quotation_number: string
  client: {
    id: string
    name: string
    phone: string
    email: string | null
  }
  vehicle: {
    id: string
    brand: string
    model: string
    year: number
    plate: string | null
    vin: string | null
    vehicle_type: string
    color: string | null
  }
  date: string
  status: "Pendiente" | "Aprobada" | "Rechazada" | "Convertida a Orden"
  total_labor: number
  total_materials: number
  total_parts: number
  total: number
  repair_hours: number
  estimated_days: number
}

export function CotizacionesTallerPage() {
  const [cotizaciones, setCotizaciones] = useState<Quotation[]>([])
  const [State_Cotizaciones, SetState_Cotizaciones] = useState<CotizacionesType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const loadCotizaciones = async () => {
    try {
      setLoading(true)
      // const data = await getQuotations()
      const data = await COTIZACIONES_SERVICES.GET_ALL_COTIZACIONES()
      SetState_Cotizaciones(data)
      // if (isTableMissing) {
      //   setError("La tabla de cotizaciones no existe. Por favor, inicialice la base de datos.")
      // } else if (!success) {
      //   setError(quotationsError || "Error al cargar las cotizaciones")
      // } else if (success && data) {
      //   setCotizaciones(data)
      // }
    } catch (err) {
      setError("Error al conectar con la base de datos")
      console.error("Error loading quotations:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCotizaciones()
  }, [])

  const handleNuevaCotizacionSuccess = () => {
    setIsDialogOpen(false)
    loadCotizaciones()
    toast({
      title: "Cotización creada",
      description: "La cotización ha sido creada exitosamente",
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  if (error) {
    return (
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
      </Card>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cotizaciones</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nueva Cotización
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl h-[100vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Nueva Cotización</DialogTitle>
              <DialogDescription>Crea una nueva cotización para un cliente.</DialogDescription>
            </DialogHeader>
            <NuevaCotizacionForm onSuccess={handleNuevaCotizacionSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="todas" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
          <TabsTrigger value="aprobadas">Aprobadas</TabsTrigger>
          <TabsTrigger value="rechazadas">Rechazadas</TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Todas las Cotizaciones</CardTitle>
              <CardDescription>Lista completa de cotizaciones del taller.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Vehículo</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {State_Cotizaciones.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No hay cotizaciones registradas
                        </TableCell>
                      </TableRow>
                    ) : (
                      State_Cotizaciones.map((cotizacion) => (
                        <TableRow key={cotizacion.id}>
                          <TableCell>{cotizacion.quotation_number}</TableCell>
                          <TableCell>{cotizacion.client_name || "Cliente no disponible"}</TableCell>
                          <TableCell>
                            {cotizacion.vehiculo_marca
                              ? `${cotizacion.vehiculo_marca} ${cotizacion.vehiculo_modelo} (${cotizacion.vehiculo_year})`
                              : "Vehículo no disponible"}
                          </TableCell>
                          <TableCell>{formatDate(cotizacion.date)}</TableCell>
                          <TableCell>
                            <Badge variant={getBadgeVariant(cotizacion.status)}>{cotizacion.status}</Badge>
                          </TableCell>
                          <TableCell>L {cotizacion.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Link href={`/taller/cotizaciones/${cotizacion.id}`}>
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-1" /> Ver
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pendientes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cotizaciones Pendientes</CardTitle>
              <CardDescription>Cotizaciones que están esperando aprobación.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {State_Cotizaciones.filter((c) => c.status === "Pendiente").length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No hay cotizaciones pendientes
                      </TableCell>
                    </TableRow>
                  ) : (
                    State_Cotizaciones
                      .filter((c) => c.status === "Pendiente")
                      .map((cotizacion) => (
                        <TableRow key={cotizacion.id}>
                          <TableCell>{cotizacion.quotation_number}</TableCell>
                          <TableCell>{cotizacion.client_name || "Cliente no disponible"}</TableCell>
                          <TableCell>
                            {cotizacion.vehiculo_marca
                              ? `${cotizacion.vehiculo_marca} ${cotizacion.vehiculo_modelo} (${cotizacion.vehiculo_year})`
                              : "Vehículo no disponible"}
                          </TableCell>
                          <TableCell>{formatDate(cotizacion.date)}</TableCell>
                          <TableCell>L {cotizacion.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Link href={`/taller/cotizaciones/${cotizacion.id}`}>
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-1" /> Ver
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aprobadas" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cotizaciones Aprobadas</CardTitle>
              <CardDescription>Cotizaciones que han sido aprobadas por el cliente.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {State_Cotizaciones.filter((c) => c.status === "Aprobada").length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No hay cotizaciones aprobadas
                      </TableCell>
                    </TableRow>
                  ) : (
                    State_Cotizaciones
                      .filter((c) => c.status === "Aprobada")
                      .map((cotizacion) => (
                        <TableRow key={cotizacion.id}>
                          <TableCell>{cotizacion.quotation_number}</TableCell>
                          <TableCell>{cotizacion.client_name || "Cliente no disponible"}</TableCell>
                          <TableCell>
                            {cotizacion.vehiculo_marca
                              ? `${cotizacion.vehiculo_marca} ${cotizacion.vehiculo_modelo} (${cotizacion.vehiculo_year})`
                              : "Vehículo no disponible"}
                          </TableCell>
                          <TableCell>{formatDate(cotizacion.date)}</TableCell>
                          <TableCell>L {cotizacion.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Link href={`/taller/cotizaciones/${cotizacion.id}`}>
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-1" /> Ver
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rechazadas" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cotizaciones Rechazadas</CardTitle>
              <CardDescription>Cotizaciones que han sido rechazadas por el cliente.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {State_Cotizaciones.filter((c) => c.status === "Rechazada").length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No hay cotizaciones rechazadas
                      </TableCell>
                    </TableRow>
                  ) : (
                    State_Cotizaciones
                      .filter((c) => c.status === "Rechazada")
                      .map((cotizacion) => (
                        <TableRow key={cotizacion.id}>
                          <TableCell>{cotizacion.quotation_number}</TableCell>
                          <TableCell>{cotizacion.client_name || "Cliente no disponible"}</TableCell>
                          <TableCell>
                            {cotizacion.vehiculo_marca
                              ? `${cotizacion.vehiculo_marca} ${cotizacion.vehiculo_modelo} (${cotizacion.vehiculo_year})`
                              : "Vehículo no disponible"}
                          </TableCell>
                          <TableCell>{formatDate(cotizacion.date)}</TableCell>
                          <TableCell>L {cotizacion.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Link href={`/taller/cotizaciones/${cotizacion.id}`}>
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-1" /> Ver
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
