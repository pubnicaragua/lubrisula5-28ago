"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Datos de ejemplo para cotizaciones
const COTIZACIONES_EJEMPLO = [
  {
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
    created_at: "2023-05-10T10:30:00Z",
    updated_at: "2023-05-10T10:30:00Z",
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
    quotation_number: "COT-2023-002",
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
    date: "2023-05-12",
    status: "Aprobada",
    total_labor: 3500.0,
    total_materials: 2250.5,
    total_parts: 3000.0,
    total: 8750.5,
    repair_hours: 6.0,
    estimated_days: 1.5,
    created_at: "2023-05-12T14:15:00Z",
    updated_at: "2023-05-13T09:20:00Z",
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
      {
        id: "4",
        category: "Carrocería",
        name: "REPARACIÓN PUERTA DELANTERA",
        quantity: 1,
        operation: "Rep",
        material_type: "HI",
        repair_type: "MM",
        repair_hours: 2.0,
        labor_cost: 1860.0,
        materials_cost: 140.0,
        parts_cost: 0.0,
        total: 2000.0,
      },
    ],
  },
  {
    id: "3",
    quotation_number: "COT-2023-003",
    client: {
      id: "3",
      name: "Carlos Rodríguez",
      phone: "7777-6666",
      email: "carlos.rodriguez@example.com",
      client_type: "Particular",
    },
    vehicle: {
      id: "3",
      brand: "Nissan",
      model: "Sentra",
      year: 2018,
      plate: "GHI-9012",
      vin: "3N1AB6AP7BL123456",
      color: "Rojo",
    },
    date: "2023-05-15",
    status: "Rechazada",
    total_labor: 6200.75,
    total_materials: 4000.0,
    total_parts: 5000.0,
    total: 15200.75,
    repair_hours: 10.0,
    estimated_days: 3.0,
    created_at: "2023-05-15T09:45:00Z",
    updated_at: "2023-05-16T11:30:00Z",
    assigned_to: "Ana Martínez",
    priority: "Media",
    notes: "Cliente rechazó por costo elevado",
    payment_method: "Tarjeta",
    insurance_coverage: false,
    parts: [
      {
        id: "5",
        category: "Estructural",
        name: "REPARACIÓN CHASIS",
        quantity: 1,
        operation: "Rep",
        material_type: "HI",
        repair_type: "MM",
        repair_hours: 5.0,
        labor_cost: 3200.75,
        materials_cost: 2000.0,
        parts_cost: 2500.0,
        total: 7700.75,
      },
      {
        id: "6",
        category: "Carrocería",
        name: "REEMPLAZO GUARDAFANGO",
        quantity: 1,
        operation: "Cam",
        material_type: "HI",
        repair_type: "MM",
        repair_hours: 3.0,
        labor_cost: 1800.0,
        materials_cost: 1200.0,
        parts_cost: 1500.0,
        total: 4500.0,
      },
      {
        id: "7",
        category: "Pintura",
        name: "PINTURA PARCIAL",
        quantity: 1,
        operation: "Rep",
        material_type: "PL",
        repair_type: "GN",
        repair_hours: 2.0,
        labor_cost: 1200.0,
        materials_cost: 800.0,
        parts_cost: 1000.0,
        total: 3000.0,
      },
    ],
  },
  {
    id: "4",
    quotation_number: "COT-2023-004",
    client: {
      id: "4",
      name: "Ana Martínez",
      phone: "6666-5555",
      email: "ana.martinez@example.com",
      client_type: "Aseguradora",
    },
    vehicle: {
      id: "4",
      brand: "Ford",
      model: "Focus",
      year: 2021,
      plate: "JKL-3456",
      vin: "1FADP3F23EL123456",
      color: "Negro",
    },
    date: "2023-05-18",
    status: "Convertida a Orden",
    total_labor: 4000.25,
    total_materials: 2800.0,
    total_parts: 3000.0,
    total: 9800.25,
    repair_hours: 7.5,
    estimated_days: 2.0,
    created_at: "2023-05-18T16:20:00Z",
    updated_at: "2023-05-19T10:15:00Z",
    assigned_to: "Luis Gómez",
    priority: "Alta",
    notes: "Cubierto por seguro, deducible de L1,000",
    payment_method: "Seguro",
    insurance_coverage: true,
    parts: [
      {
        id: "8",
        category: "Carrocería",
        name: "REPARACIÓN DEFENSA TRASERA",
        quantity: 1,
        operation: "Rep",
        material_type: "PL",
        repair_type: "MM",
        repair_hours: 4.5,
        labor_cost: 2700.25,
        materials_cost: 1800.0,
        parts_cost: 1500.0,
        total: 6000.25,
      },
      {
        id: "9",
        category: "Pintura",
        name: "PINTURA DEFENSA",
        quantity: 1,
        operation: "Rep",
        material_type: "PL",
        repair_type: "GN",
        repair_hours: 3.0,
        labor_cost: 1300.0,
        materials_cost: 1000.0,
        parts_cost: 1500.0,
        total: 3800.0,
      },
    ],
  },
  {
    id: "5",
    quotation_number: "COT-2023-005",
    client: {
      id: "5",
      name: "Roberto Sánchez",
      phone: "5555-4444",
      email: "roberto.sanchez@example.com",
      client_type: "Particular",
    },
    vehicle: {
      id: "5",
      brand: "Chevrolet",
      model: "Cruze",
      year: 2017,
      plate: "MNO-7890",
      vin: "1G1BC5SM7G7123456",
      color: "Plata",
    },
    date: "2023-05-20",
    status: "Pendiente",
    total_labor: 3000.0,
    total_materials: 2350.0,
    total_parts: 2000.0,
    total: 7350.0,
    repair_hours: 5.0,
    estimated_days: 1.5,
    created_at: "2023-05-20T11:10:00Z",
    updated_at: "2023-05-20T11:10:00Z",
    assigned_to: "María García",
    priority: "Baja",
    notes: "Cliente solicita presupuesto detallado",
    payment_method: "Efectivo",
    insurance_coverage: false,
    parts: [
      {
        id: "10",
        category: "Carrocería",
        name: "REPARACIÓN PUERTA TRASERA",
        quantity: 1,
        operation: "Rep",
        material_type: "HI",
        repair_type: "MM",
        repair_hours: 3.0,
        labor_cost: 1800.0,
        materials_cost: 1350.0,
        parts_cost: 1000.0,
        total: 4150.0,
      },
      {
        id: "11",
        category: "Pintura",
        name: "PINTURA PUERTA",
        quantity: 1,
        operation: "Rep",
        material_type: "PL",
        repair_type: "GN",
        repair_hours: 2.0,
        labor_cost: 1200.0,
        materials_cost: 1000.0,
        parts_cost: 1000.0,
        total: 3200.0,
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
  {
    id: "3",
    brand: "Nissan",
    model: "Sentra",
    year: 2018,
    plate: "GHI-9012",
    vin: "3N1AB6AP7BL123456",
    color: "Rojo",
    client_id: "3",
  },
  {
    id: "4",
    brand: "Ford",
    model: "Focus",
    year: 2021,
    plate: "JKL-3456",
    vin: "1FADP3F23EL123456",
    color: "Negro",
    client_id: "4",
  },
  {
    id: "5",
    brand: "Chevrolet",
    model: "Cruze",
    year: 2017,
    plate: "MNO-7890",
    vin: "1G1BC5SM7G7123456",
    color: "Plata",
    client_id: "5",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleNuevaParteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setNuevaParte({
      ...nuevaParte,
      [name]: type === "number" ? Number.parseFloat(value) : value,
    })
  }

  const handleNuevaParteSelectChange = (name: string, value: string) => {
    setNuevaParte({
      ...nuevaParte,
      [name]: value,
    })
  }

  const agregarParte = () => {
    const total = nuevaParte.labor_cost + nuevaParte.materials_cost + nuevaParte.parts_cost
    setPartes([...partes, { ...nuevaParte, total, id: `temp-${Date.now()}` }])

    // Resetear el formulario de nueva parte
    setNuevaParte({
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
  }

  const eliminarParte = (index: number) => {
    setPartes(partes.filter((_, i) => i !== index))
  }

  const calcularTotales = () => {
    const totalManoObra = partes.reduce((sum, parte) => sum + parte.labor_cost, 0)
    const totalMateriales = partes.reduce((sum, parte) => sum + parte.materials_cost, 0)
    const totalRepuestos = partes.reduce((sum, parte) => sum + parte.parts_cost, 0)
    const total = totalManoObra + totalMateriales + totalRepuestos
    const horasReparacion = partes.reduce((sum, parte) => sum + parte.repair_hours, 0)
    const diasEstimados = Math.ceil(horasReparacion / 8) // Asumiendo 8 horas por día

    return {
      total_labor: totalManoObra,
      total_materials: totalMateriales,
      total_parts: totalRepuestos,
      total,
      repair_hours: horasReparacion,
      estimated_days: diasEstimados,
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.client_id || !formData.vehicle_id) {
      toast({
        title: "Error",
        description: "Debes seleccionar un cliente y un vehículo",
        variant: "destructive",
      })
      return
    }

    if (partes.length === 0) {
      toast({
        title: "Error",
        description: "Debes agregar al menos una parte a la cotización",
        variant: "destructive",
      })
      return
    }

    const totales = calcularTotales()
    const cliente = CLIENTES_EJEMPLO.find((c) => c.id === formData.client_id)
    const vehiculo = VEHICULOS_EJEMPLO.find((v) => v.id === formData.vehicle_id)

    const nuevaCotizacion = {
      id: `${cotizaciones.length + 1}`,
      quotation_number: `COT-${new Date().getFullYear()}-${String(cotizaciones.length + 1).padStart(3, "0")}`,
      client: cliente,
      vehicle: vehiculo,
      date: formData.date,
      status: formData.status,
      total_labor: totales.total_labor,
      total_materials: totales.total_materials,
      total_parts: totales.total_parts,
      total: totales.total,
      repair_hours: totales.repair_hours,
      estimated_days: totales.estimated_days,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      assigned_to: formData.assigned_to,
      priority: formData.priority,
      notes: formData.notes,
      payment_method: formData.payment_method,
      insurance_coverage: formData.insurance_coverage,
      parts: partes,
    }

    setCotizaciones([nuevaCotizacion, ...cotizaciones])
    setOpenDialog(false)
    setPartes([])
    setFormData({
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

    toast({
      title: "Cotización creada",
      description: "La cotización ha sido creada correctamente",
    })
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

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
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

  // Filtrar por rango de fechas
  if (filterDate.from) {
    filteredCotizaciones = filteredCotizaciones.filter((c) => new Date(c.date) >= new Date(filterDate.from))
  }
  if (filterDate.to) {
    filteredCotizaciones = filteredCotizaciones.filter((c) => new Date(c.date) <= new Date(filterDate.to))
  }

  // Ordenar cotizaciones
  filteredCotizaciones = [...filteredCotizaciones].sort((a, b) => {
    let valueA, valueB

    switch (sortField) {
      case "date":
        valueA = new Date(a.date).getTime()
        valueB = new Date(b.date).getTime()
        break
      case "quotation_number":
        valueA = a.quotation_number
        valueB = b.quotation_number
        break
      case "client":
        valueA = a.client.name
        valueB = b.client.name
        break
      case "total":
        valueA = a.total
        valueB = b.total
        break
      default:
        valueA = new Date(a.date).getTime()
        valueB = new Date(b.date).getTime()
    }

    if (sortDirection === "asc") {
      return valueA > valueB ? 1 : -1
    } else {
      return valueA < valueB ? 1 : -1
    }
  })

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
              <form onSubmit={handleSubmit}>
                <Tabs defaultValue="cliente" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="cliente">Cliente y Vehículo</TabsTrigger>
                    <TabsTrigger value="partes">Partes y Servicios</TabsTrigger>
                    <TabsTrigger value="resumen">Resumen</TabsTrigger>
                  </TabsList>

                  <TabsContent value="cliente" className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="fecha">Fecha</Label>
                          <Input
                            id="date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="client_id">Cliente</Label>
                          <Select
                            value={formData.client_id}
                            onValueChange={(value) => handleSelectChange("client_id", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar cliente" />
                            </SelectTrigger>
                            <SelectContent>
                              {CLIENTES_EJEMPLO.map((client) => (
                                <SelectItem key={client.id} value={client.id}>
                                  {client.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="vehicle_id">Vehículo</Label>
                          <Select
                            value={formData.vehicle_id}
                            onValueChange={(value) => handleSelectChange("vehicle_id", value)}
                            disabled={!formData.client_id || vehiculosFiltrados.length === 0}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  !formData.client_id
                                    ? "Selecciona un cliente primero"
                                    : vehiculosFiltrados.length === 0
                                      ? "No hay vehículos para este cliente"
                                      : "Seleccionar vehículo"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {vehiculosFiltrados.map((vehicle) => (
                                <SelectItem key={vehicle.id} value={vehicle.id}>
                                  {`${vehicle.brand} ${vehicle.model} (${vehicle.year})`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="status">Estado</Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value) => handleSelectChange("status", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pendiente">Pendiente</SelectItem>
                              <SelectItem value="Aprobada">Aprobada</SelectItem>
                              <SelectItem value="Rechazada">Rechazada</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="assigned_to">Asignado a</Label>
                          <Select
                            value={formData.assigned_to}
                            onValueChange={(value) => handleSelectChange("assigned_to", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar técnico" />
                            </SelectTrigger>
                            <SelectContent>
                              {TECNICOS_EJEMPLO.map((tecnico) => (
                                <SelectItem key={tecnico.id} value={tecnico.name}>
                                  {tecnico.name} - {tecnico.specialty}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="priority">Prioridad</Label>
                          <Select
                            value={formData.priority}
                            onValueChange={(value) => handleSelectChange("priority", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar prioridad" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Alta">Alta</SelectItem>
                              <SelectItem value="Media">Media</SelectItem>
                              <SelectItem value="Baja">Baja</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="payment_method">Método de pago</Label>
                          <Select
                            value={formData.payment_method}
                            onValueChange={(value) => handleSelectChange("payment_method", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar método de pago" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Efectivo">Efectivo</SelectItem>
                              <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                              <SelectItem value="Transferencia">Transferencia</SelectItem>
                              <SelectItem value="Seguro">Seguro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="notes">Notas</Label>
                          <Textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            placeholder="Notas adicionales sobre la cotización"
                            className="min-h-[80px]"
                          />
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                          <input
                            type="checkbox"
                            id="insurance_coverage"
                            name="insurance_coverage"
                            checked={formData.insurance_coverage}
                            onChange={handleInputChange}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor="insurance_coverage">Cubierto por seguro</Label>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="partes" className="space-y-4 pt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Agregar Parte o Servicio</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="category">Categoría</Label>
                            <Select
                              onValueChange={(value) => handleNuevaParteSelectChange("category", value)}
                              defaultValue={nuevaParte.category}
                            >
                              <SelectTrigger id="category">
                                <SelectValue placeholder="Seleccionar categoría" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Estructural">Estructural</SelectItem>
                                <SelectItem value="Carrocería">Carrocería</SelectItem>
                                <SelectItem value="Pintura">Pintura</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="quantity">Cantidad</Label>
                            <Input
                              id="quantity"
                              name="quantity"
                              type="number"
                              min="1"
                              value={nuevaParte.quantity}
                              onChange={handleNuevaParteChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid gap-2 mt-4">
                          <Label htmlFor="name">Descripción de la Parte</Label>
                          <Input
                            id="name"
                            name="name"
                            value={nuevaParte.name}
                            onChange={handleNuevaParteChange}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div className="grid gap-2">
                            <Label htmlFor="operation">Operación</Label>
                            <Select
                              onValueChange={(value) => handleNuevaParteSelectChange("operation", value)}
                              defaultValue={nuevaParte.operation}
                            >
                              <SelectTrigger id="operation">
                                <SelectValue placeholder="Seleccionar operación" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Cor">Corregir</SelectItem>
                                <SelectItem value="Rep">Reparar</SelectItem>
                                <SelectItem value="Cam">Cambiar</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="material_type">Tipo Material</Label>
                            <Select
                              onValueChange={(value) => handleNuevaParteSelectChange("material_type", value)}
                              defaultValue={nuevaParte.material_type}
                            >
                              <SelectTrigger id="material_type">
                                <SelectValue placeholder="Seleccionar tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="HI">Hierro (HI)</SelectItem>
                                <SelectItem value="PL">Plástico (PL)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="repair_type">Tipo Reparación</Label>
                            <Select
                              onValueChange={(value) => handleNuevaParteSelectChange("repair_type", value)}
                              defaultValue={nuevaParte.repair_type}
                            >
                              <SelectTrigger id="repair_type">
                                <SelectValue placeholder="Seleccionar tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="MM">Mecánica (MM)</SelectItem>
                                <SelectItem value="OU">Otros (OU)</SelectItem>
                                <SelectItem value="GN">General (GN)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mt-4">
                          <div className="grid gap-2">
                            <Label htmlFor="repair_hours">Horas</Label>
                            <Input
                              id="repair_hours"
                              name="repair_hours"
                              type="number"
                              min="0"
                              step="0.01"
                              value={nuevaParte.repair_hours}
                              onChange={handleNuevaParteChange}
                              required
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="labor_cost">Mano de Obra (L)</Label>
                            <Input
                              id="labor_cost"
                              name="labor_cost"
                              type="number"
                              min="0"
                              step="0.01"
                              value={nuevaParte.labor_cost}
                              onChange={handleNuevaParteChange}
                              required
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="materials_cost">Materiales (L)</Label>
                            <Input
                              id="materials_cost"
                              name="materials_cost"
                              type="number"
                              min="0"
                              step="0.01"
                              value={nuevaParte.materials_cost}
                              onChange={handleNuevaParteChange}
                              required
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="parts_cost">Repuestos (L)</Label>
                            <Input
                              id="parts_cost"
                              name="parts_cost"
                              type="number"
                              min="0"
                              step="0.01"
                              value={nuevaParte.parts_cost}
                              onChange={handleNuevaParteChange}
                              required
                            />
                          </div>
                        </div>

                        <Button type="button" onClick={agregarParte} className="mt-4">
                          <Plus className="mr-2 h-4 w-4" /> Agregar Parte
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Partes y Servicios Agregados</CardTitle>
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
                              <TableHead>Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {partes.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={12} className="text-center">
                                  No hay partes agregadas
                                </TableCell>
                              </TableRow>
                            ) : (
                              partes.map((parte, index) => (
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
                                  <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => eliminarParte(index)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="resumen" className="space-y-4 pt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Resumen de Cotización</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-8">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Información del Cliente</h3>
                            <div className="space-y-2">
                              <div className="grid grid-cols-2">
                                <span className="font-medium">Cliente:</span>
                                <span>
                                  {CLIENTES_EJEMPLO.find((c) => c.id === formData.client_id)?.name || "No seleccionado"}
                                </span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="font-medium">Teléfono:</span>
                                <span>
                                  {CLIENTES_EJEMPLO.find((c) => c.id === formData.client_id)?.phone || "No disponible"}
                                </span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="font-medium">Email:</span>
                                <span>
                                  {CLIENTES_EJEMPLO.find((c) => c.id === formData.client_id)?.email || "No disponible"}
                                </span>
                              </div>
                            </div>

                            <h3 className="text-lg font-semibold mt-4 mb-2">Información del Vehículo</h3>
                            <div className="space-y-2">
                              <div className="grid grid-cols-2">
                                <span className="font-medium">Marca:</span>
                                <span>
                                  {VEHICULOS_EJEMPLO.find((v) => v.id === formData.vehicle_id)?.brand ||
                                    "No seleccionado"}
                                </span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="font-medium">Modelo:</span>
                                <span>
                                  {VEHICULOS_EJEMPLO.find((v) => v.id === formData.vehicle_id)?.model ||
                                    "No seleccionado"}
                                </span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="font-medium">Año:</span>
                                <span>
                                  {VEHICULOS_EJEMPLO.find((v) => v.id === formData.vehicle_id)?.year ||
                                    "No seleccionado"}
                                </span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="font-medium">Placa:</span>
                                <span>
                                  {VEHICULOS_EJEMPLO.find((v) => v.id === formData.vehicle_id)?.plate ||
                                    "No disponible"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-2">Resumen de Costos</h3>
                            <div className="space-y-2">
                              <div className="grid grid-cols-2">
                                <span className="font-medium">Mano de Obra:</span>
                                <span>L {calcularTotales().total_labor.toFixed(2)}</span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="font-medium">Materiales:</span>
                                <span>L {calcularTotales().total_materials.toFixed(2)}</span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="font-medium">Repuestos:</span>
                                <span>L {calcularTotales().total_parts.toFixed(2)}</span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="font-medium">Total:</span>
                                <span>L {calcularTotales().total.toFixed(2)}</span>
                              </div>
                            </div>

                            <h3 className="text-lg font-semibold mt-4 mb-2">Detalles Adicionales</h3>
                            <div className="space-y-2">
                              <div className="grid grid-cols-2">
                                <span className="font-medium">Horas Estimadas:</span>
                                <span>{calcularTotales().repair_hours.toFixed(2)} horas</span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="font-medium">Días Estimados:</span>
                                <span>{calcularTotales().estimated_days} días</span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="font-medium">Estado:</span>
                                <span>{formData.status}</span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="font-medium">Prioridad:</span>
                                <span>{formData.priority}</span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="font-medium">Método de Pago:</span>
                                <span>{formData.payment_method}</span>
                              </div>
                              <div className="grid grid-cols-1">
                                <span className="font-medium">Notas:</span>
                                <span>{formData.notes}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-end space-x-2">
                      <Button type="submit">Crear Cotización</Button>
                      <Button type="button" variant="secondary" onClick={() => setOpenDialog(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Estadísticas generales */}
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

      {/* Filtros y acciones */}
      <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        <Input
          type="text"
          placeholder="Buscar cotización..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
          </Button>
        </div>
      </div>

      {/* Filtros avanzados */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="filterStatus">Estado</Label>
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
            <Label htmlFor="filterPriority">Prioridad</Label>
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

          <div className="flex flex-col space-y-2">
            <Label>Rango de Fechas</Label>
            <div className="flex space-x-2">
              <Input
                type="date"
                placeholder="Desde"
                value={filterDate.from}
                onChange={(e) => setFilterDate({ ...filterDate, from: e.target.value })}
              />
              <Input
                type="date"
                placeholder="Hasta"
                value={filterDate.to}
                onChange={(e) => setFilterDate({ ...filterDate, to: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tabla de cotizaciones */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] cursor-pointer" onClick={() => handleSort("quotation_number")}>
                Nro. Cotización
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                Fecha
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("client")}>
                Cliente
              </TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead className="text-right cursor-pointer" onClick={() => handleSort("total")}>
                Total
              </TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCotizaciones.map((cotizacion) => (
              <TableRow key={cotizacion.id}>
                <TableCell className="font-medium">{cotizacion.quotation_number}</TableCell>
                <TableCell>{new Date(cotizacion.date).toLocaleDateString()}</TableCell>
                <TableCell>{cotizacion.client.name}</TableCell>
                <TableCell>{`${cotizacion.vehicle.brand} ${cotizacion.vehicle.model}`}</TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${getStatusColor(cotizacion.status)}`}
                  >
                    {cotizacion.status}
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${getPriorityColor(cotizacion.priority)}`}
                  >
                    {cotizacion.priority}
                  </div>
                </TableCell>
                <TableCell className="text-right">L {cotizacion.total.toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleViewDetails(cotizacion)}>
                      Ver
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleExport(cotizacion.id)}
                      disabled={isExporting}
                    >
                      {isExporting ? "Exportando..." : "Exportar"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePrint(cotizacion.id)}
                      disabled={isPrinting}
                    >
                      {isPrinting ? "Imprimiendo..." : "Imprimir"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSendEmail(cotizacion.id)}
                      disabled={isEmailSending}
                    >
                      {isEmailSending ? "Enviando..." : "Enviar Email"}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(cotizacion.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Select onValueChange={(value) => handleStatusChange(cotizacion.id, value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={cotizacion.status} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="Aprobada">Aprobada</SelectItem>
                        <SelectItem value="Rechazada">Rechazada</SelectItem>
                        <SelectItem value="Convertida a Orden">Convertida a Orden</SelectItem>
                      </SelectContent>
                    </Select>
                    {cotizacion.status === "Aprobada" && (
                      <Button variant="ghost" size="icon" onClick={() => handleConvertToOrder(cotizacion.id)}>
                        Convertir a Orden
                      </Button>
                    )}
                  </div>
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
                    <div>
                      <strong>Nro. Cotización:</strong> {selectedCotizacion.quotation_number}
                    </div>
                    <div>
                      <strong>Fecha:</strong> {new Date(selectedCotizacion.date).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Estado:</strong> {selectedCotizacion.status}
                    </div>
                    <div>
                      <strong>Prioridad:</strong> {selectedCotizacion.priority}
                    </div>
                    <div>
                      <strong>Asignado a:</strong> {selectedCotizacion.assigned_to}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Información del Cliente</h3>
                  <div className="space-y-2">
                    <div>
                      <strong>Cliente:</strong> {selectedCotizacion.client.name}
                    </div>
                    <div>
                      <strong>Teléfono:</strong> {selectedCotizacion.client.phone}
                    </div>
                    <div>
                      <strong>Email:</strong> {selectedCotizacion.client.email}
                    </div>
                    <div>
                      <strong>Tipo de Cliente:</strong> {selectedCotizacion.client.client_type}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Información del Vehículo</h3>
                  <div className="space-y-2">
                    <div>
                      <strong>Marca:</strong> {selectedCotizacion.vehicle.brand}
                    </div>
                    <div>
                      <strong>Modelo:</strong> {selectedCotizacion.vehicle.model}
                    </div>
                    <div>
                      <strong>Año:</strong> {selectedCotizacion.vehicle.year}
                    </div>
                    <div>
                      <strong>Placa:</strong> {selectedCotizacion.vehicle.plate}
                    </div>
                    <div>
                      <strong>VIN:</strong> {selectedCotizacion.vehicle.vin}
                    </div>
                    <div>
                      <strong>Color:</strong> {selectedCotizacion.vehicle.color}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Detalles de Costos</h3>
                  <div className="space-y-2">
                    <div>
                      <strong>Mano de Obra:</strong> L {selectedCotizacion.total_labor.toFixed(2)}
                    </div>
                    <div>
                      <strong>Materiales:</strong> L {selectedCotizacion.total_materials.toFixed(2)}
                    </div>
                    <div>
                      <strong>Repuestos:</strong> L {selectedCotizacion.total_parts.toFixed(2)}
                    </div>
                    <div>
                      <strong>Total:</strong> L {selectedCotizacion.total.toFixed(2)}
                    </div>
                    <div>
                      <strong>Horas de Reparación:</strong> {selectedCotizacion.repair_hours}
                    </div>
                    <div>
                      <strong>Días Estimados:</strong> {selectedCotizacion.estimated_days}
                    </div>
                    <div>
                      <strong>Método de Pago:</strong> {selectedCotizacion.payment_method}
                    </div>
                    <div>
                      <strong>Cubierto por Seguro:</strong> {selectedCotizacion.insurance_coverage ? "Sí" : "No"}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Partes y Servicios</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Operación</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Reparación</TableHead>
                      <TableHead>Horas</TableHead>
                      <TableHead>Mano de Obra</TableHead>
                      <TableHead>Materiales</TableHead>
                      <TableHead>Repuestos</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCotizacion.parts.map((part) => (
                      <TableRow key={part.id}>
                        <TableCell>{part.category}</TableCell>
                        <TableCell>{part.name}</TableCell>
                        <TableCell>{part.quantity}</TableCell>
                        <TableCell>{part.operation}</TableCell>
                        <TableCell>{part.material_type}</TableCell>
                        <TableCell>{part.repair_type}</TableCell>
                        <TableCell>{part.repair_hours}</TableCell>
                        <TableCell>L {part.labor_cost.toFixed(2)}</TableCell>
                        <TableCell>L {part.materials_cost.toFixed(2)}</TableCell>
                        <TableCell>L {part.parts_cost.toFixed(2)}</TableCell>
                        <TableCell>L {part.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Notas Adicionales</h3>
                <p>{selectedCotizacion.notes}</p>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setOpenDetailDialog(false)}>
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
