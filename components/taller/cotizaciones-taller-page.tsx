"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, Eye, FileDown, Printer, Mail } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

// Datos de ejemplo para cotizaciones
const COTIZACIONES_EJEMPLO = [
  {
    id: "1",
    quotation_number: "COT-2024-001",
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
    date: "2024-05-10",
    status: "Pendiente",
    total_labor: 5000.0,
    total_materials: 3500.0,
    total_parts: 4000.0,
    total: 12500.0,
    repair_hours: 8.5,
    estimated_days: 2.5,
    created_at: "2024-05-10T10:30:00Z",
    updated_at: "2024-05-10T10:30:00Z",
    assigned_to: "Carlos Méndez",
    priority: "Media",
    notes: "Cliente solicita revisión detallada antes de aprobar",
    payment_method: "Efectivo",
    insurance_coverage: false,
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
    ],
  },
  {
    id: "2",
    quotation_number: "COT-2024-002",
    client: {
      id: "2",
      name: "María López",
      phone: "8888-7777",
      email: "maria.lopez@example.com",
      client_type: "Corporativo",
    },
    vehicle: {
      id: "2",
      brand: "Honda",
      model: "Civic",
      year: 2020,
      plate: "DEF-5678",
      vin: "2HGES16523H123456",
      color: "Azul",
    },
    date: "2024-05-12",
    status: "Aprobada",
    total_labor: 3500.0,
    total_materials: 2250.5,
    total_parts: 3000.0,
    total: 8750.5,
    repair_hours: 6.0,
    estimated_days: 1.5,
    created_at: "2024-05-12T14:15:00Z",
    updated_at: "2024-05-13T09:20:00Z",
    assigned_to: "Roberto Jiménez",
    priority: "Alta",
    notes: "Cliente corporativo, requiere factura",
    payment_method: "Transferencia",
    insurance_coverage: true,
    parts: [
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
        materials_cost: 2110.5,
        parts_cost: 3000.0,
        total: 6750.5,
      },
    ],
  },
]

// Datos de ejemplo para clientes
const CLIENTES_EJEMPLO = [
  { id: "1", name: "Juan Pérez", phone: "9999-8888", email: "juan.perez@example.com", client_type: "Particular" },
  { id: "2", name: "María López", phone: "8888-7777", email: "maria.lopez@example.com", client_type: "Corporativo" },
  {
    id: "3",
    name: "Carlos Rodríguez",
    phone: "7777-6666",
    email: "carlos.rodriguez@example.com",
    client_type: "Particular",
  },
  { id: "4", name: "Ana Martínez", phone: "6666-5555", email: "ana.martinez@example.com", client_type: "Aseguradora" },
  {
    id: "5",
    name: "Roberto Sánchez",
    phone: "5555-4444",
    email: "roberto.sanchez@example.com",
    client_type: "Particular",
  },
]

// Datos de ejemplo para vehículos
const VEHICULOS_EJEMPLO = [
  {
    id: "1",
    brand: "Toyota",
    model: "Corolla",
    year: 2019,
    plate: "ABC-1234",
    vin: "1HGCM82633A123456",
    color: "Blanco",
    client_id: "1",
  },
  {
    id: "2",
    brand: "Honda",
    model: "Civic",
    year: 2020,
    plate: "DEF-5678",
    vin: "2HGES16523H123456",
    color: "Azul",
    client_id: "2",
  },
]

// Datos de ejemplo para técnicos
const TECNICOS_EJEMPLO = [
  { id: "1", name: "Carlos Méndez", specialty: "Mecánica General", experience: "5 años" },
  { id: "2", name: "Roberto Jiménez", specialty: "Carrocería", experience: "8 años" },
  { id: "3", name: "Ana Martínez", specialty: "Pintura", experience: "6 años" },
  { id: "4", name: "Luis Gómez", specialty: "Electrónica", experience: "4 años" },
  { id: "5", name: "María García", specialty: "Diagnóstico", experience: "7 años" },
]

export function CotizacionesTallerPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [cotizaciones, setCotizaciones] = useState(COTIZACIONES_EJEMPLO)
  const [openDialog, setOpenDialog] = useState(false)
  const [openDetailDialog, setOpenDetailDialog] = useState(false)
  const [selectedCotizacion, setSelectedCotizacion] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState("todas")
  const [sortField, setSortField] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [filterPriority, setFilterPriority] = useState("todas")
  const [filterDate, setFilterDate] = useState({ from: "", to: "" })
  const [showFilters, setShowFilters] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const [isEmailSending, setIsEmailSending] = useState(false)
  const { toast } = useToast()

  // Estado para el formulario de nueva cotización
  const [formData, setFormData] = useState({
    client_id: "",
    vehicle_id: "",
    date: new Date().toISOString().split("T")[0],
    status: "Pendiente",
    assigned_to: "",
    priority: "Media",
    notes: "",
    payment_method: "Efectivo",
    insurance_coverage: false,
  })

  // Estado para las partes de la cotización
  const [partes, setPartes] = useState<any[]>([])

  // Estado para nueva parte
  const [nuevaParte, setNuevaParte] = useState({
    category: "Estructural",
    name: "",
    quantity: 1,
    operation: "Cor",
    material_type: "HI",
    repair_type: "MM",
    repair_hours: 0,
    labor_cost: 0,
    materials_cost: 0,
    parts_cost: 0,
  })

  // Vehículos filtrados por cliente seleccionado
  const vehiculosFiltrados = VEHICULOS_EJEMPLO.filter((vehiculo) => vehiculo.client_id === formData.client_id)

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta cotización?")) {
      setCotizaciones(cotizaciones.filter((cotizacion) => cotizacion.id !== id))
      toast({
        title: "Cotización eliminada",
        description: "La cotización ha sido eliminada correctamente",
      })
    }
  }

  const handleViewDetails = (cotizacion: any) => {
    setSelectedCotizacion(cotizacion)
    setOpenDetailDialog(true)
  }

  const handleExport = (id: string) => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      toast({
        title: "Cotización exportada",
        description: "La cotización ha sido exportada a PDF correctamente",
      })
    }, 1500)
  }

  const handlePrint = (id: string) => {
    setIsPrinting(true)
    setTimeout(() => {
      setIsPrinting(false)
      toast({
        title: "Imprimiendo cotización",
        description: "La cotización se está enviando a la impresora",
      })
    }, 1500)
  }

  const handleSendEmail = (id: string) => {
    setIsEmailSending(true)
    setTimeout(() => {
      setIsEmailSending(false)
      toast({
        title: "Correo enviado",
        description: "La cotización ha sido enviada por correo electrónico",
      })
    }, 1500)
  }

  const handleConvertToOrder = (cotizacionId: string) => {
    setCotizaciones(
      cotizaciones.map((cotizacion) =>
        cotizacion.id === cotizacionId
          ? { ...cotizacion, status: "Convertida a Orden", updated_at: new Date().toISOString() }
          : cotizacion,
      ),
    )
    toast({
      title: "Cotización convertida",
      description: "La cotización ha sido convertida a orden de trabajo",
    })
  }

  const handleStatusChange = (cotizacionId: string, newStatus: string) => {
    setCotizaciones(
      cotizaciones.map((cotizacion) =>
        cotizacion.id === cotizacionId
          ? { ...cotizacion, status: newStatus, updated_at: new Date().toISOString() }
          : cotizacion,
      ),
    )
    toast({
      title: "Estado actualizado",
      description: `La cotización ha sido marcada como ${newStatus}`,
    })
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

  // Función para obtener el color del badge según la prioridad
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "Media":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "Baja":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  // Filtrar cotizaciones
  let filteredCotizaciones = cotizaciones

  // Filtrar por término de búsqueda
  if (searchTerm) {
    filteredCotizaciones = filteredCotizaciones.filter(
      (cotizacion) =>
        cotizacion.quotation_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cotizacion.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${cotizacion.vehicle.brand} ${cotizacion.vehicle.model}`.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  // Filtrar por estado
  if (filterStatus !== "todas") {
    filteredCotizaciones = filteredCotizaciones.filter((c) => c.status === filterStatus)
  }

  // Filtrar por prioridad
  if (filterPriority !== "todas") {
    filteredCotizaciones = filteredCotizaciones.filter((c) => c.priority === filterPriority)
  }

  // Calcular estadísticas
  const stats = {
    total: cotizaciones.length,
    pendientes: cotizaciones.filter((c) => c.status === "Pendiente").length,
    aprobadas: cotizaciones.filter((c) => c.status === "Aprobada").length,
    rechazadas: cotizaciones.filter((c) => c.status === "Rechazada").length,
    convertidas: cotizaciones.filter((c) => c.status === "Convertida a Orden").length,
    montoTotal: cotizaciones.reduce((sum, c) => sum + c.total, 0),
    montoPromedio:
      cotizaciones.length > 0 ? cotizaciones.reduce((sum, c) => sum + c.total, 0) / cotizaciones.length : 0,
    tiempoPromedio:
      cotizaciones.length > 0 ? cotizaciones.reduce((sum, c) => sum + c.repair_hours, 0) / cotizaciones.length : 0,
  }

  return (
    <div className="space-y-6">
      {/* Encabezado y estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cotizaciones</h2>
          <p className="text-muted-foreground">Gestiona las cotizaciones de servicios para tus clientes</p>
        </div>
        <div className="flex justify-end space-x-2">
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nueva Cotización
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nueva Cotización</DialogTitle>
                <DialogDescription>Crea una nueva cotización para un cliente.</DialogDescription>
              </DialogHeader>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Formulario de nueva cotización en desarrollo...</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Cotizaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendientes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Aprobadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.aprobadas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Rechazadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rechazadas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Convertidas a Orden</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.convertidas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 md:space-x-4">
        <Input
          type="text"
          placeholder="Buscar cotización..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          Filtrar
        </Button>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="status">Estado</Label>
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todos</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Aprobada">Aprobada</SelectItem>
                <SelectItem value="Rechazada">Rechazada</SelectItem>
                <SelectItem value="Convertida a Orden">Convertida a Orden</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="priority">Prioridad</Label>
            <Select value={filterPriority} onValueChange={(value) => setFilterPriority(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las prioridades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Media">Media</SelectItem>
                <SelectItem value="Baja">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Tabla de cotizaciones */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Nro. Cotización</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCotizaciones.map((cotizacion) => (
              <TableRow key={cotizacion.id}>
                <TableCell>{cotizacion.quotation_number}</TableCell>
                <TableCell>{new Date(cotizacion.date).toLocaleDateString()}</TableCell>
                <TableCell>{cotizacion.client.name}</TableCell>
                <TableCell>{`${cotizacion.vehicle.brand} ${cotizacion.vehicle.model}`}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(cotizacion.status)}>{cotizacion.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(cotizacion.priority)}>{cotizacion.priority}</Badge>
                </TableCell>
                <TableCell className="text-right">L {cotizacion.total.toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleViewDetails(cotizacion)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport(cotizacion.id)}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Exportar PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePrint(cotizacion.id)}>
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimir
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSendEmail(cotizacion.id)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Enviar por email
                      </DropdownMenuItem>
                      {cotizacion.status === "Pendiente" && (
                        <DropdownMenuItem onClick={() => handleConvertToOrder(cotizacion.id)}>
                          Convertir a Orden
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(cotizacion.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo de detalles de la cotización */}
      <Dialog open={openDetailDialog} onOpenChange={setOpenDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de la Cotización</DialogTitle>
            <DialogDescription>Información detallada de la cotización seleccionada.</DialogDescription>
          </DialogHeader>
          {selectedCotizacion && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Información General</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Nro. Cotización:</span>
                      <span>{selectedCotizacion.quotation_number}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Fecha:</span>
                      <span>{new Date(selectedCotizacion.date).toLocaleDateString()}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Estado:</span>
                      <Badge className={getStatusColor(selectedCotizacion.status)}>{selectedCotizacion.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Prioridad:</span>
                      <Badge className={getPriorityColor(selectedCotizacion.priority)}>
                        {selectedCotizacion.priority}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Asignado a:</span>
                      <span>{selectedCotizacion.assigned_to}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Información del Cliente</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Cliente:</span>
                      <span>{selectedCotizacion.client.name}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Teléfono:</span>
                      <span>{selectedCotizacion.client.phone}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Email:</span>
                      <span>{selectedCotizacion.client.email}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Tipo de Cliente:</span>
                      <span>{selectedCotizacion.client.client_type}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Resumen de Costos</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2">
                    <span className="font-medium">Mano de Obra:</span>
                    <span>L {selectedCotizacion.total_labor.toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-medium">Materiales:</span>
                    <span>L {selectedCotizacion.total_materials.toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-medium">Repuestos:</span>
                    <span>L {selectedCotizacion.total_parts.toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-2 text-lg font-bold">
                    <span>Total:</span>
                    <span>L {selectedCotizacion.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {selectedCotizacion.notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Notas</h3>
                  <p>{selectedCotizacion.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CotizacionesTallerPage
