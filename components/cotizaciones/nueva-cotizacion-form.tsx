"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { createQuotation, updateQuotation } from "@/lib/actions/quotations"
import { getClients } from "@/lib/actions/clients"
import { getVehiclesByClient } from "@/lib/actions/vehicles"
import Link from "next/link"

// Tipo para la parte de cotización
type QuotationPart = {
  id?: string
  category: "Estructural" | "Carrocería" | "Pintura"
  name: string
  quantity: number
  operation: "Cor" | "Rep" | "Cam"
  material_type: "HI" | "PL"
  repair_type: "MM" | "OU" | "GN"
  repair_hours: number
  labor_cost: number
  materials_cost: number
  parts_cost: number
  total: number
}

// Tipo para la cotización desde Supabase
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
}

// Tipo para cliente
type Client = {
  id: string
  name: string
  phone: string
  email: string | null
}

// Tipo para vehículo
type Vehicle = {
  id: string
  brand: string
  model: string
  year: number
  plate: string | null
  vin: string | null
  vehicle_type: string
  color: string | null
}

interface NuevaCotizacionFormProps {
  onSuccess: () => void
  cotizacionExistente?: Quotation
}

export function NuevaCotizacionForm({ onSuccess, cotizacionExistente }: NuevaCotizacionFormProps) {
  const today = new Date().toISOString().split("T")[0]
  const { toast } = useToast()

  // Estados para clientes y vehículos
  const [clients, setClients] = useState<Client[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estado del formulario
  const [formData, setFormData] = useState({
    quotation_number:
      cotizacionExistente?.quotation_number ||
      `COT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
    client_id: cotizacionExistente?.client.id || "",
    vehicle_id: cotizacionExistente?.vehicle.id || "",
    date: cotizacionExistente?.date ? new Date(cotizacionExistente.date).toISOString().split("T")[0] : today,
    status: cotizacionExistente?.status || ("Pendiente" as const),
  })

  // Estado para las partes
  const [partes, setPartes] = useState<QuotationPart[]>([])

  // Estado para nueva parte
  const [nuevaParte, setNuevaParte] = useState<Omit<QuotationPart, "total">>({
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

  // Cargar clientes al montar el componente
  useEffect(() => {
    async function loadClients() {
      try {
        const { success, data, error: clientsError } = await getClients()

        if (clientsError && clientsError.includes("relation") && clientsError.includes("does not exist")) {
          setError("La base de datos no está configurada correctamente. Las tablas necesarias no existen.")
        } else if (!success) {
          setError(clientsError || "Error al cargar los clientes")
        } else if (success && data) {
          setClients(data)
        }
      } catch (err) {
        setError("Error al conectar con la base de datos")
        console.error("Error loading clients:", err)
      } finally {
        setLoading(false)
      }
    }

    loadClients()
  }, [])

  // Cargar vehículos cuando cambia el cliente
  useEffect(() => {
    async function loadVehicles() {
      if (formData.client_id) {
        try {
          const { success, data } = await getVehiclesByClient(formData.client_id)
          if (success && data) {
            setVehicles(data)
          }
        } catch (err) {
          console.error("Error loading vehicles:", err)
        }
      } else {
        setVehicles([])
      }
    }

    if (!error) {
      loadVehicles()
    }
  }, [formData.client_id, error])

  // Cargar partes de la cotización existente
  useEffect(() => {
    async function loadQuotationParts() {
      if (cotizacionExistente?.id) {
        // Aquí deberíamos cargar las partes de la cotización existente
        // Por ahora, usaremos datos de ejemplo
        setPartes([
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
        ])
      }
    }

    if (!error) {
      loadQuotationParts()
    }
  }, [cotizacionExistente, error])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleNuevaParteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNuevaParte({
      ...nuevaParte,
      [name]:
        name === "quantity" ||
        name === "repair_hours" ||
        name === "labor_cost" ||
        name === "materials_cost" ||
        name === "parts_cost"
          ? Number(value)
          : value,
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

    setPartes([...partes, { ...nuevaParte, total }])

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
    const diasEstimados = horasReparacion / 8 // Asumiendo 8 horas por día

    return {
      total_labor: totalManoObra,
      total_materials: totalMateriales,
      total_parts: totalRepuestos,
      total,
      repair_hours: horasReparacion,
      estimated_days: diasEstimados,
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      let result

      if (cotizacionExistente?.id) {
        // Actualizar cotización existente
        result = await updateQuotation(cotizacionExistente.id, {
          ...formData,
          ...totales,
          parts: partes,
        })
      } else {
        // Crear nueva cotización
        result = await createQuotation({
          ...formData,
          ...totales,
          parts: partes,
        })
      }

      if (result.success) {
        toast({
          title: cotizacionExistente ? "Cotización actualizada" : "Cotización creada",
          description: cotizacionExistente
            ? "La cotización ha sido actualizada correctamente"
            : "La cotización ha sido creada correctamente",
        })
        onSuccess()
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo guardar la cotización",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la cotización",
        variant: "destructive",
      })
    }
  }

  const totales = calcularTotales()

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
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
                <Label htmlFor="numeroCotizacion">Número de Cotización</Label>
                <Input
                  id="quotation_number"
                  name="quotation_number"
                  value={formData.quotation_number}
                  onChange={handleInputChange}
                  disabled
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="client_id">Cliente</Label>
                <Select value={formData.client_id} onValueChange={(value) => handleSelectChange("client_id", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
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
                  disabled={!formData.client_id || vehicles.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !formData.client_id
                          ? "Selecciona un cliente primero"
                          : vehicles.length === 0
                            ? "No hay vehículos para este cliente"
                            : "Seleccionar vehículo"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {`${vehicle.brand} ${vehicle.model} (${vehicle.year})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Aprobada">Aprobada</SelectItem>
                    <SelectItem value="Rechazada">Rechazada</SelectItem>
                    <SelectItem value="Convertida a Orden">Convertida a Orden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {formData.vehicle_id && vehicles.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Información del Vehículo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {vehicles
                      .filter((vehicle) => vehicle.id === formData.vehicle_id)
                      .map((vehicle) => (
                        <div key={vehicle.id} className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-sm text-muted-foreground">Marca</Label>
                              <p className="font-medium">{vehicle.brand}</p>
                            </div>
                            <div>
                              <Label className="text-sm text-muted-foreground">Modelo</Label>
                              <p className="font-medium">{vehicle.model}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-sm text-muted-foreground">Año</Label>
                              <p className="font-medium">{vehicle.year}</p>
                            </div>
                            <div>
                              <Label className="text-sm text-muted-foreground">Tipo</Label>
                              <p className="font-medium">{vehicle.vehicle_type}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-sm text-muted-foreground">Placa</Label>
                              <p className="font-medium">{vehicle.plate || "N/A"}</p>
                            </div>
                            <div>
                              <Label className="text-sm text-muted-foreground">VIN</Label>
                              <p className="font-medium">{vehicle.vin || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )}

              {formData.client_id && clients.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Información del Cliente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {clients
                      .filter((client) => client.id === formData.client_id)
                      .map((client) => (
                        <div key={client.id} className="space-y-2">
                          <div>
                            <Label className="text-sm text-muted-foreground">Nombre</Label>
                            <p className="font-medium">{client.name}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Teléfono</Label>
                            <p className="font-medium">{client.phone}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Email</Label>
                            <p className="font-medium">{client.email || "N/A"}</p>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )}
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
                    onValueChange={(value) =>
                      handleNuevaParteSelectChange("category", value as "Estructural" | "Carrocería" | "Pintura")
                    }
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
                <Input id="name" name="name" value={nuevaParte.name} onChange={handleNuevaParteChange} required />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="grid gap-2">
                  <Label htmlFor="operation">Operación</Label>
                  <Select
                    onValueChange={(value) => handleNuevaParteSelectChange("operation", value as "Cor" | "Rep" | "Cam")}
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
                    onValueChange={(value) => handleNuevaParteSelectChange("material_type", value as "HI" | "PL")}
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
                    onValueChange={(value) => handleNuevaParteSelectChange("repair_type", value as "MM" | "OU" | "GN")}
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
                      <TableRow key={index}>
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
                      <span>{clients.find((c) => c.id === formData.client_id)?.name || "No seleccionado"}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Teléfono:</span>
                      <span>{clients.find((c) => c.id === formData.client_id)?.phone || "No disponible"}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Email:</span>
                      <span>{clients.find((c) => c.id === formData.client_id)?.email || "No disponible"}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mt-4 mb-2">Información del Vehículo</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Marca:</span>
                      <span>{vehicles.find((v) => v.id === formData.vehicle_id)?.brand || "No seleccionado"}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Modelo:</span>
                      <span>{vehicles.find((v) => v.id === formData.vehicle_id)?.model || "No seleccionado"}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Año:</span>
                      <span>{vehicles.find((v) => v.id === formData.vehicle_id)?.year || "No seleccionado"}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Placa:</span>
                      <span>{vehicles.find((v) => v.id === formData.vehicle_id)?.plate || "No disponible"}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Resumen de Costos</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Mano de Obra:</span>
                      <span>L {totales.total_labor.toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Materiales:</span>
                      <span>L {totales.total_materials.toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Repuestos:</span>
                      <span>L {totales.total_parts.toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-2">
                      <span className="font-medium text-lg">Total:</span>
                      <span className="font-bold text-lg">L {totales.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mt-4 mb-2">Tiempos Estimados</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Horas de Reparación:</span>
                      <span>{totales.repair_hours.toFixed(2)} horas</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-medium">Días Estimados:</span>
                      <span>{totales.estimated_days.toFixed(1)} días</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={partes.length === 0 || !formData.client_id || !formData.vehicle_id}>
          {cotizacionExistente ? "Actualizar Cotización" : "Guardar Cotización"}
        </Button>
      </div>
    </form>
  )
}
