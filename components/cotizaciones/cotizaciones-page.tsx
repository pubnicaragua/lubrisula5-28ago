"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { AlertTriangle, FileText, Plus, Search, Loader2 } from "lucide-react"
import { NuevaCotizacionForm } from "./nueva-cotizacion-form"
import { getQuotations, deleteQuotation } from "@/lib/actions/quotations"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Tipo para la cotización
interface Quotation {
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
  created_at: string
}

interface CotizacionesPageProps {
  initialCotizaciones: Quotation[]
  tablesExist: boolean
}

export function CotizacionesPage({ initialCotizaciones = [], tablesExist = false }: CotizacionesPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [cotizaciones, setCotizaciones] = useState<Quotation[]>(initialCotizaciones)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Cargar cotizaciones
  const loadCotizaciones = async () => {
    setLoading(true)
    const { success, data, error: quotationsError, isTableMissing } = await getQuotations()
    console.log(success)
    console.log(data)
      // console.log(isTableMissing)
      // if (isTableMissing) {
      // setError("La base de datos no está configurada correctamente. Las tablas necesarias no existen.")
      // } else if (!success) {
      // setError(quotationsError || "Error al cargar las cotizaciones")
      // } else if (success && data) {
      setCotizaciones(data)
      setLoading(false)
      // }
    //   try {
    // } catch (err) {
    //   setError("Error al conectar con la base de datos")
    //   console.error("Error loading quotations:", err.message)
    // } finally {
    // }
  }

  useEffect(() => {
    loadCotizaciones()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta cotización?")) {
      const { success, error } = await deleteQuotation(id)

      if (success) {
        toast({
          title: "Cotización eliminada",
          description: "La cotización ha sido eliminada correctamente",
        })
        loadCotizaciones()
      } else {
        toast({
          title: "Error",
          description: error || "No se pudo eliminar la cotización",
          // variant: "destructive",
        })
      }
    }
  }

  const handleSuccess = () => {
    setOpenDialog(false)
    loadCotizaciones()
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

  const filteredCotizaciones = cotizaciones.filter(
    (cotizacion) =>
      cotizacion.quotation_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cotizacion.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${cotizacion.vehicle.brand} ${cotizacion.vehicle.model}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const inicializarTablas = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/initialize-quotations", {
        method: "POST",
      })
      const data = await response.json()

      if (data.success) {
        // Recargar la página para obtener los datos actualizados
        window.location.reload()
      } else {
        console.error("Error al inicializar tablas:", data.error)
      }
    } catch (error) {
      console.error("Error al inicializar tablas:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pendiente":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            {status}
          </Badge>
        )
      case "Aprobada":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            {status}
          </Badge>
        )
      case "Rechazada":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            {status}
          </Badge>
        )
      case "Convertida a Orden":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            {status}
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
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
          {!tablesExist && (
            <Button variant="destructive" onClick={inicializarTablas} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Inicializar Tablas
            </Button>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
          <Link href="/admin/dashboard">
            <Button>Ir al Dashboard</Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Cotizaciones</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nueva Cotización
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl">
            <DialogHeader>
              <DialogTitle>Nueva Cotización</DialogTitle>
              <DialogDescription>Crea una nueva cotización para un cliente.</DialogDescription>
            </DialogHeader>
            <NuevaCotizacionForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between">
        <Input
          type="search"
          placeholder="Buscar cotización..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="todas" className="w-full">
        <TabsList>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
          <TabsTrigger value="aprobadas">Aprobadas</TabsTrigger>
          <TabsTrigger value="rechazadas">Rechazadas</TabsTrigger>
        </TabsList>
        <TabsContent value="todas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Todas las Cotizaciones</CardTitle>
              <CardDescription>Lista de todas las cotizaciones registradas en el sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Cotización</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cotizaciones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No hay cotizaciones registradas
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCotizaciones.map((cotizacion) => (
                      <TableRow key={cotizacion.id}>
                        <TableCell>{cotizacion.quotation_number}</TableCell>
                        <TableCell>{cotizacion.client?.name || "N/A"}</TableCell>
                        <TableCell>
                          {cotizacion.vehicle
                            ? `${cotizacion.vehicle.brand} ${cotizacion.vehicle.model} (${cotizacion.vehicle.year})`
                            : "N/A"}
                        </TableCell>
                        <TableCell>{new Date(cotizacion.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(cotizacion.status)} variant="outline">
                            {cotizacion.status}
                          </Badge>
                        </TableCell>
                        <TableCell>L {cotizacion.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Link href={`/cotizaciones/${cotizacion.id}`}>
                              <Button variant="outline" size="icon" title="Ver Detalle">
                                <Search className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/cotizaciones/${cotizacion.id}/pdf`}>
                              <Button variant="outline" size="icon" title="Generar PDF">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="icon"
                              title="Eliminar"
                              onClick={() => handleDelete(cotizacion.id)}
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pendientes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cotizaciones Pendientes</CardTitle>
              <CardDescription>Lista de cotizaciones en estado pendiente.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Cotización</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cotizaciones.filter((c) => c.status === "Pendiente").length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No hay cotizaciones pendientes
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCotizaciones
                      .filter((c) => c.status === "Pendiente")
                      .map((cotizacion) => (
                        <TableRow key={cotizacion.id}>
                          <TableCell>{cotizacion.quotation_number}</TableCell>
                          <TableCell>{cotizacion.client?.name || "N/A"}</TableCell>
                          <TableCell>
                            {cotizacion.vehicle
                              ? `${cotizacion.vehicle.brand} ${cotizacion.vehicle.model} (${cotizacion.vehicle.year})`
                              : "N/A"}
                          </TableCell>
                          <TableCell>{new Date(cotizacion.date).toLocaleDateString()}</TableCell>
                          <TableCell>L {cotizacion.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Link href={`/cotizaciones/${cotizacion.id}`}>
                                <Button variant="outline" size="icon" title="Ver Detalle">
                                  <Search className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/cotizaciones/${cotizacion.id}/pdf`}>
                                <Button variant="outline" size="icon" title="Generar PDF">
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aprobadas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cotizaciones Aprobadas</CardTitle>
              <CardDescription>Lista de cotizaciones aprobadas por los clientes.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Cotización</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cotizaciones.filter((c) => c.status === "Aprobada").length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No hay cotizaciones aprobadas
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCotizaciones
                      .filter((c) => c.status === "Aprobada")
                      .map((cotizacion) => (
                        <TableRow key={cotizacion.id}>
                          <TableCell>{cotizacion.quotation_number}</TableCell>
                          <TableCell>{cotizacion.client?.name || "N/A"}</TableCell>
                          <TableCell>
                            {cotizacion.vehicle
                              ? `${cotizacion.vehicle.brand} ${cotizacion.vehicle.model} (${cotizacion.vehicle.year})`
                              : "N/A"}
                          </TableCell>
                          <TableCell>{new Date(cotizacion.date).toLocaleDateString()}</TableCell>
                          <TableCell>L {cotizacion.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Link href={`/cotizaciones/${cotizacion.id}`}>
                                <Button variant="outline" size="icon" title="Ver Detalle">
                                  <Search className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/cotizaciones/${cotizacion.id}/pdf`}>
                                <Button variant="outline" size="icon" title="Generar PDF">
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rechazadas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cotizaciones Rechazadas</CardTitle>
              <CardDescription>Lista de cotizaciones rechazadas por los clientes.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Cotización</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cotizaciones.filter((c) => c.status === "Rechazada").length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No hay cotizaciones rechazadas
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCotizaciones
                      .filter((c) => c.status === "Rechazada")
                      .map((cotizacion) => (
                        <TableRow key={cotizacion.id}>
                          <TableCell>{cotizacion.quotation_number}</TableCell>
                          <TableCell>{cotizacion.client?.name || "N/A"}</TableCell>
                          <TableCell>
                            {cotizacion.vehicle
                              ? `${cotizacion.vehicle.brand} ${cotizacion.vehicle.model} (${cotizacion.vehicle.year})`
                              : "N/A"}
                          </TableCell>
                          <TableCell>{new Date(cotizacion.date).toLocaleDateString()}</TableCell>
                          <TableCell>L {cotizacion.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Link href={`/cotizaciones/${cotizacion.id}`}>
                                <Button variant="outline" size="icon" title="Ver Detalle">
                                  <Search className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/cotizaciones/${cotizacion.id}/pdf`}>
                                <Button variant="outline" size="icon" title="Generar PDF">
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
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
