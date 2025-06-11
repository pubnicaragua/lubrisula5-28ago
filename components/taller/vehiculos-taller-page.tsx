"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Edit, MoreHorizontal, Plus, Search, Trash2, Eye, FileText, FileInput } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as XLSX from "xlsx"
import { jsPDF } from "jspdf"
import "jspdf-autotable"

// Mock data para clientes
const mockClientes = [
  { id: "1", nombre: "Juan", apellido: "Pérez", telefono: "555-0001", email: "juan.perez@email.com" },
  { id: "2", nombre: "María", apellido: "García", telefono: "555-0002", email: "maria.garcia@email.com" },
  { id: "3", nombre: "Carlos", apellido: "López", telefono: "555-0003", email: "carlos.lopez@email.com" },
  { id: "4", nombre: "Ana", apellido: "Martínez", telefono: "555-0004", email: "ana.martinez@email.com" },
  { id: "5", nombre: "Roberto", apellido: "Sánchez", telefono: "555-0005", email: "roberto.sanchez@email.com" },
  { id: "6", nombre: "Laura", apellido: "Torres", telefono: "555-0006", email: "laura.torres@email.com" },
]

// Mock data para vehículos
const mockVehiculos = [
  {
    id: "1",
    marca: "Toyota",
    modelo: "Corolla",
    anio: 2020,
    placa: "ABC-123",
    color: "Blanco",
    tipo: "sedan",
    vin: "1HGBH41JXMN109186",
    cliente_id: "1",
    cliente: mockClientes[0],
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    marca: "Honda",
    modelo: "Civic",
    anio: 2019,
    placa: "DEF-456",
    color: "Azul",
    tipo: "sedan",
    vin: "2HGBH41JXMN109187",
    cliente_id: "2",
    cliente: mockClientes[1],
    created_at: "2024-01-20T14:15:00Z",
  },
  {
    id: "3",
    marca: "Chevrolet",
    modelo: "Spark",
    anio: 2022,
    placa: "GHI-789",
    color: "Rojo",
    tipo: "hatchback",
    vin: "3HGBH41JXMN109188",
    cliente_id: "3",
    cliente: mockClientes[2],
    created_at: "2024-02-01T09:45:00Z",
  },
  {
    id: "4",
    marca: "Ford",
    modelo: "Focus",
    anio: 2021,
    placa: "JKL-012",
    color: "Negro",
    tipo: "hatchback",
    vin: "4HGBH41JXMN109189",
    cliente_id: "4",
    cliente: mockClientes[3],
    created_at: "2024-02-10T16:20:00Z",
  },
  {
    id: "5",
    marca: "Nissan",
    modelo: "Sentra",
    anio: 2018,
    placa: "MNO-345",
    color: "Gris",
    tipo: "sedan",
    vin: "5HGBH41JXMN109190",
    cliente_id: "5",
    cliente: mockClientes[4],
    created_at: "2024-02-15T11:30:00Z",
  },
]

const vehiculoSchema = z.object({
  marca: z.string().min(1, { message: "La marca es requerida" }),
  modelo: z.string().min(1, { message: "El modelo es requerido" }),
  anio: z.string().min(4, { message: "El año debe tener 4 dígitos" }),
  placa: z.string().min(1, { message: "La placa es requerida" }),
  color: z.string().min(1, { message: "El color es requerido" }),
  cliente_id: z.string().min(1, { message: "El cliente es requerido" }),
  tipo: z.string().min(1, { message: "El tipo de vehículo es requerido" }),
  vin: z.string().optional(),
})

interface VehiculosTallerPageProps {
  onOpenHojaIngreso?: (vehiculoId: string) => void
}

export function VehiculosTallerPage({ onOpenHojaIngreso }: VehiculosTallerPageProps) {
  const [vehiculos, setVehiculos] = useState<any[]>([])
  const [filteredVehiculos, setFilteredVehiculos] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [vehiculoToDelete, setVehiculoToDelete] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [currentVehiculo, setCurrentVehiculo] = useState<any>(null)
  const [clientes, setClientes] = useState<any[]>([])
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof vehiculoSchema>>({
    resolver: zodResolver(vehiculoSchema),
    defaultValues: {
      marca: "",
      modelo: "",
      anio: "",
      placa: "",
      color: "",
      cliente_id: "",
      tipo: "",
      vin: "",
    },
  })

  const editForm = useForm<z.infer<typeof vehiculoSchema>>({
    resolver: zodResolver(vehiculoSchema),
    defaultValues: {
      marca: "",
      modelo: "",
      anio: "",
      placa: "",
      color: "",
      cliente_id: "",
      tipo: "",
      vin: "",
    },
  })

  useEffect(() => {
    loadMockData()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = vehiculos.filter(
        (vehiculo: any) =>
          vehiculo.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehiculo.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehiculo.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehiculo.cliente?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredVehiculos(filtered)
    } else {
      setFilteredVehiculos(vehiculos)
    }
  }, [searchTerm, vehiculos])

  useEffect(() => {
    if (currentVehiculo) {
      editForm.reset({
        marca: currentVehiculo.marca || "",
        modelo: currentVehiculo.modelo || "",
        anio: currentVehiculo.anio?.toString() || "",
        placa: currentVehiculo.placa || "",
        color: currentVehiculo.color || "",
        cliente_id: currentVehiculo.cliente_id || "",
        tipo: currentVehiculo.tipo || "",
        vin: currentVehiculo.vin || "",
      })
    }
  }, [currentVehiculo, editForm])

  const loadMockData = () => {
    setIsLoading(true)

    // Simular carga de datos
    setTimeout(() => {
      // Cargar datos desde localStorage o usar mock data
      const savedVehiculos = localStorage.getItem("mockVehiculos")
      const savedClientes = localStorage.getItem("mockClientes")

      if (savedVehiculos) {
        setVehiculos(JSON.parse(savedVehiculos))
      } else {
        setVehiculos(mockVehiculos)
        localStorage.setItem("mockVehiculos", JSON.stringify(mockVehiculos))
      }

      if (savedClientes) {
        setClientes(JSON.parse(savedClientes))
      } else {
        setClientes(mockClientes)
        localStorage.setItem("mockClientes", JSON.stringify(mockClientes))
      }

      setIsLoading(false)
    }, 500)
  }

  const handleDeleteVehiculo = () => {
    if (!vehiculoToDelete) return

    const updatedVehiculos = vehiculos.filter((vehiculo: any) => vehiculo.id !== vehiculoToDelete)
    setVehiculos(updatedVehiculos)
    localStorage.setItem("mockVehiculos", JSON.stringify(updatedVehiculos))

    toast({
      title: "Vehículo eliminado",
      description: "El vehículo ha sido eliminado exitosamente",
    })

    setVehiculoToDelete(null)
    setShowDeleteDialog(false)
  }

  const onSubmit = (values: z.infer<typeof vehiculoSchema>) => {
    const newVehiculo = {
      id: Date.now().toString(),
      marca: values.marca,
      modelo: values.modelo,
      anio: Number.parseInt(values.anio),
      placa: values.placa,
      color: values.color,
      cliente_id: values.cliente_id,
      tipo: values.tipo,
      vin: values.vin || "",
      cliente: clientes.find((c) => c.id === values.cliente_id),
      created_at: new Date().toISOString(),
    }

    const updatedVehiculos = [...vehiculos, newVehiculo]
    setVehiculos(updatedVehiculos)
    localStorage.setItem("mockVehiculos", JSON.stringify(updatedVehiculos))

    toast({
      title: "Vehículo agregado",
      description: "El vehículo ha sido agregado exitosamente",
    })

    setShowAddDialog(false)
    form.reset()
  }

  const onEditSubmit = (values: z.infer<typeof vehiculoSchema>) => {
    if (!currentVehiculo) return

    const updatedVehiculo = {
      ...currentVehiculo,
      marca: values.marca,
      modelo: values.modelo,
      anio: Number.parseInt(values.anio),
      placa: values.placa,
      color: values.color,
      cliente_id: values.cliente_id,
      tipo: values.tipo,
      vin: values.vin || "",
      cliente: clientes.find((c) => c.id === values.cliente_id),
    }

    const updatedVehiculos = vehiculos.map((v: any) => (v.id === currentVehiculo.id ? updatedVehiculo : v))

    setVehiculos(updatedVehiculos)
    localStorage.setItem("mockVehiculos", JSON.stringify(updatedVehiculos))

    toast({
      title: "Vehículo actualizado",
      description: "El vehículo ha sido actualizado exitosamente",
    })

    setShowEditDialog(false)
    setCurrentVehiculo(null)
  }

  const exportToExcel = () => {
    const dataToExport = filteredVehiculos.map((vehiculo: any) => ({
      Marca: vehiculo.marca,
      Modelo: vehiculo.modelo,
      Año: vehiculo.anio,
      Placa: vehiculo.placa,
      Color: vehiculo.color,
      Tipo: vehiculo.tipo,
      VIN: vehiculo.vin || "N/A",
      Cliente: vehiculo.cliente ? `${vehiculo.cliente.nombre} ${vehiculo.cliente.apellido || ""}` : "N/A",
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vehículos")
    XLSX.writeFile(workbook, "Vehiculos.xlsx")
  }

  const exportToPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.text("Listado de Vehículos", 14, 22)

    doc.setFontSize(11)
    doc.text(`Generado: ${new Date().toLocaleDateString()}`, 14, 30)

    const tableColumn = ["Marca", "Modelo", "Año", "Placa", "Color", "Cliente"]
    const tableRows = filteredVehiculos.map((vehiculo: any) => [
      vehiculo.marca,
      vehiculo.modelo,
      vehiculo.anio,
      vehiculo.placa,
      vehiculo.color,
      vehiculo.cliente ? `${vehiculo.cliente.nombre} ${vehiculo.cliente.apellido || ""}` : "N/A",
    ])

    // @ts-ignore
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [66, 66, 66] },
    })

    doc.save("Vehiculos.pdf")
  }

  const handleHojaIngresoClick = (vehiculoId: string) => {
    if (onOpenHojaIngreso) {
      onOpenHojaIngreso(vehiculoId)
    } else {
      router.push(`/taller/vehiculos/${vehiculoId}/ingreso`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Vehículos</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToExcel}>
            Excel
          </Button>
          <Button variant="outline" onClick={exportToPDF}>
            PDF
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Vehículo
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Vehículos</CardTitle>
          <CardDescription>
            Administra todos los vehículos registrados en el taller (Mock Data Local - {vehiculos.length} vehículos,{" "}
            {clientes.length} clientes)
          </CardDescription>
          <div className="relative w-full max-w-sm mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar vehículos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Marca</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Año</TableHead>
                    <TableHead>Placa</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehiculos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No se encontraron vehículos
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVehiculos.map((vehiculo: any) => (
                      <TableRow key={vehiculo.id}>
                        <TableCell className="font-medium">{vehiculo.marca}</TableCell>
                        <TableCell>{vehiculo.modelo}</TableCell>
                        <TableCell>{vehiculo.anio}</TableCell>
                        <TableCell>{vehiculo.placa}</TableCell>
                        <TableCell>{vehiculo.color}</TableCell>
                        <TableCell>{vehiculo.tipo}</TableCell>
                        <TableCell>
                          {vehiculo.cliente?.nombre} {vehiculo.cliente?.apellido}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleHojaIngresoClick(vehiculo.id)}
                              className="h-8"
                            >
                              <FileInput className="h-4 w-4 mr-1" />
                              Hoja de Ingreso
                            </Button>
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
                                <DropdownMenuItem onClick={() => router.push(`/taller/vehiculos/${vehiculo.id}`)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => router.push(`/taller/vehiculos/${vehiculo.id}/inspeccion`)}
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  Hoja de Inspección
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setCurrentVehiculo(vehiculo)
                                    setShowEditDialog(true)
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setVehiculoToDelete(vehiculo.id)
                                    setShowDeleteDialog(true)
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo para eliminar vehículo */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este vehículo? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteVehiculo}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para agregar vehículo */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Vehículo</DialogTitle>
            <DialogDescription>Completa el formulario para registrar un nuevo vehículo</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="marca"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marca</FormLabel>
                      <FormControl>
                        <Input placeholder="Toyota, Honda, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="modelo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo</FormLabel>
                      <FormControl>
                        <Input placeholder="Corolla, Civic, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="anio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Año</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="2023" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="placa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Placa</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC-123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder="Rojo, Azul, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sedan">Sedán</SelectItem>
                          <SelectItem value="suv">SUV</SelectItem>
                          <SelectItem value="pickup">Pickup</SelectItem>
                          <SelectItem value="hatchback">Hatchback</SelectItem>
                          <SelectItem value="deportivo">Deportivo</SelectItem>
                          <SelectItem value="camion">Camión</SelectItem>
                          <SelectItem value="motocicleta">Motocicleta</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cliente_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clientes.map((cliente: any) => (
                            <SelectItem key={cliente.id} value={cliente.id}>
                              {cliente.nombre} {cliente.apellido}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VIN (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Número de identificación del vehículo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Guardar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar vehículo */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Vehículo</DialogTitle>
            <DialogDescription>Modifica la información del vehículo</DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="marca"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marca</FormLabel>
                      <FormControl>
                        <Input placeholder="Toyota, Honda, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="modelo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo</FormLabel>
                      <FormControl>
                        <Input placeholder="Corolla, Civic, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="anio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Año</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="2023" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="placa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Placa</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC-123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder="Rojo, Azul, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sedan">Sedán</SelectItem>
                          <SelectItem value="suv">SUV</SelectItem>
                          <SelectItem value="pickup">Pickup</SelectItem>
                          <SelectItem value="hatchback">Hatchback</SelectItem>
                          <SelectItem value="deportivo">Deportivo</SelectItem>
                          <SelectItem value="camion">Camión</SelectItem>
                          <SelectItem value="motocicleta">Motocicleta</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="cliente_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clientes.map((cliente: any) => (
                            <SelectItem key={cliente.id} value={cliente.id}>
                              {cliente.nombre} {cliente.apellido}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="vin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VIN (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Número de identificación del vehículo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditDialog(false)
                    setCurrentVehiculo(null)
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">Actualizar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
