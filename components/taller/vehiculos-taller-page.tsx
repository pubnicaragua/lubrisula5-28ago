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
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Edit, MoreHorizontal, Plus, Search, Trash2, Eye } from "lucide-react"
import { ExportData } from "@/components/ui/export-data"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export function VehiculosTallerPage() {
  const [vehiculos, setVehiculos] = useState([])
  const [filteredVehiculos, setFilteredVehiculos] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [vehiculoToDelete, setVehiculoToDelete] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [currentVehiculo, setCurrentVehiculo] = useState(null)
  const [clientes, setClientes] = useState([])
  const supabase = createClientComponentClient()
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
    fetchVehiculos()
    fetchClientes()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = vehiculos.filter(
        (vehiculo: any) =>
          vehiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const fetchVehiculos = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("vehiculos")
        .select(`
          *,
          cliente:cliente_id(*)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      setVehiculos(data || [])
      setFilteredVehiculos(data || [])
    } catch (error) {
      console.error("Error fetching vehiculos:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los vehículos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchClientes = async () => {
    try {
      const { data, error } = await supabase.from("clientes").select("*").order("nombre", { ascending: true })

      if (error) throw error

      setClientes(data || [])
    } catch (error) {
      console.error("Error fetching clientes:", error)
    }
  }

  const handleDeleteVehiculo = async () => {
    if (!vehiculoToDelete) return

    try {
      const { error } = await supabase.from("vehiculos").delete().eq("id", vehiculoToDelete)

      if (error) throw error

      setVehiculos(vehiculos.filter((vehiculo: any) => vehiculo.id !== vehiculoToDelete))
      toast({
        title: "Vehículo eliminado",
        description: "El vehículo ha sido eliminado exitosamente",
      })
    } catch (error) {
      console.error("Error deleting vehiculo:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el vehículo",
        variant: "destructive",
      })
    } finally {
      setVehiculoToDelete(null)
      setShowDeleteDialog(false)
    }
  }

  const onSubmit = async (values: z.infer<typeof vehiculoSchema>) => {
    try {
      const { data, error } = await supabase
        .from("vehiculos")
        .insert([
          {
            marca: values.marca,
            modelo: values.modelo,
            anio: Number.parseInt(values.anio),
            placa: values.placa,
            color: values.color,
            cliente_id: values.cliente_id,
            tipo: values.tipo,
            vin: values.vin || null,
          },
        ])
        .select()

      if (error) throw error

      toast({
        title: "Vehículo agregado",
        description: "El vehículo ha sido agregado exitosamente",
      })

      fetchVehiculos()
      setShowAddDialog(false)
      form.reset()
    } catch (error) {
      console.error("Error adding vehiculo:", error)
      toast({
        title: "Error",
        description: "No se pudo agregar el vehículo",
        variant: "destructive",
      })
    }
  }

  const onEditSubmit = async (values: z.infer<typeof vehiculoSchema>) => {
    if (!currentVehiculo) return

    try {
      const { data, error } = await supabase
        .from("vehiculos")
        .update({
          marca: values.marca,
          modelo: values.modelo,
          anio: Number.parseInt(values.anio),
          placa: values.placa,
          color: values.color,
          cliente_id: values.cliente_id,
          tipo: values.tipo,
          vin: values.vin || null,
        })
        .eq("id", currentVehiculo.id)
        .select()

      if (error) throw error

      toast({
        title: "Vehículo actualizado",
        description: "El vehículo ha sido actualizado exitosamente",
      })

      fetchVehiculos()
      setShowEditDialog(false)
      setCurrentVehiculo(null)
    } catch (error) {
      console.error("Error updating vehiculo:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el vehículo",
        variant: "destructive",
      })
    }
  }

  const exportData = filteredVehiculos.map((vehiculo: any) => ({
    ID: vehiculo.id,
    Marca: vehiculo.marca,
    Modelo: vehiculo.modelo,
    Año: vehiculo.anio,
    Placa: vehiculo.placa,
    Color: vehiculo.color,
    Tipo: vehiculo.tipo,
    VIN: vehiculo.vin || "N/A",
    Cliente: `${vehiculo.cliente?.nombre || ""} ${vehiculo.cliente?.apellido || ""}`,
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Vehículos</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Vehículo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Vehículos</CardTitle>
          <CardDescription>Administra todos los vehículos registrados en el taller</CardDescription>
          <div className="flex justify-between items-center mt-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar vehículos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <ExportData data={exportData} fileName="vehiculos" title="Vehículos Registrados" />
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
