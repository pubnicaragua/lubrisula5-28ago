"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, PlusCircle, Trash2, Save, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// Datos de ejemplo para clientes
const clientes = [
  { id: "1", nombre: "Juan Pérez", telefono: "9999-8888", email: "juan.perez@example.com" },
  { id: "2", nombre: "María López", telefono: "8888-7777", email: "maria.lopez@example.com" },
  { id: "3", nombre: "Carlos Rodríguez", telefono: "7777-6666", email: "carlos.rodriguez@example.com" },
]

// Datos de ejemplo para vehículos
const vehiculos = [
  { id: "1", clienteId: "1", marca: "Toyota", modelo: "Corolla", año: 2018, placa: "ABC123" },
  { id: "2", clienteId: "2", marca: "Honda", modelo: "Civic", año: 2020, placa: "XYZ789" },
  { id: "3", clienteId: "3", marca: "Ford", modelo: "Explorer", año: 2019, placa: "DEF456" },
]

// Datos de ejemplo para técnicos
const tecnicos = [
  { id: "1", nombre: "Roberto Gómez", especialidad: "Mecánica General" },
  { id: "2", nombre: "Luis Hernández", especialidad: "Electricidad" },
  { id: "3", nombre: "María Jiménez", especialidad: "Diagnóstico" },
]

// Datos de ejemplo para servicios predefinidos
const serviciosPredefinidos = [
  { id: "1", descripcion: "Cambio de aceite y filtro", costo: 35.0 },
  { id: "2", descripcion: "Alineación y balanceo", costo: 45.0 },
  { id: "3", descripcion: "Revisión de frenos", costo: 25.0 },
  { id: "4", descripcion: "Cambio de pastillas de freno", costo: 80.0 },
  { id: "5", descripcion: "Diagnóstico computarizado", costo: 50.0 },
]

// Datos de ejemplo para repuestos
const repuestosPredefinidos = [
  { id: "1", descripcion: "Filtro de aceite", precio: 12.99 },
  { id: "2", descripcion: "Filtro de aire", precio: 18.5 },
  { id: "3", descripcion: "Aceite de motor 10W40 (1L)", precio: 8.75 },
  { id: "4", descripcion: "Pastillas de freno delanteras", precio: 45.99 },
  { id: "5", descripcion: "Bujías (juego de 4)", precio: 32.5 },
]

export function NuevaOrdenForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [fecha, setFecha] = useState<Date | undefined>(new Date())
  const [clienteId, setClienteId] = useState("")
  const [vehiculoId, setVehiculoId] = useState("")
  const [tecnicoId, setTecnicoId] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [diagnostico, setDiagnostico] = useState("")
  const [kilometraje, setKilometraje] = useState("")
  const [prioridad, setPrioridad] = useState("media")
  const [servicios, setServicios] = useState([{ id: 1, descripcion: "", costo: 0 }])
  const [repuestos, setRepuestos] = useState([{ id: 1, descripcion: "", cantidad: 1, precioUnitario: 0 }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("informacion")

  // Filtrar vehículos por cliente seleccionado
  const vehiculosFiltrados = vehiculos.filter((vehiculo) => vehiculo.clienteId === clienteId)

  const agregarServicio = () => {
    const nuevoId = servicios.length > 0 ? Math.max(...servicios.map((s) => s.id)) + 1 : 1
    setServicios([...servicios, { id: nuevoId, descripcion: "", costo: 0 }])
  }

  const eliminarServicio = (id: number) => {
    setServicios(servicios.filter((servicio) => servicio.id !== id))
  }

  const actualizarServicio = (id: number, campo: string, valor: string | number) => {
    setServicios(servicios.map((servicio) => (servicio.id === id ? { ...servicio, [campo]: valor } : servicio)))
  }

  const agregarRepuesto = () => {
    const nuevoId = repuestos.length > 0 ? Math.max(...repuestos.map((r) => r.id)) + 1 : 1
    setRepuestos([...repuestos, { id: nuevoId, descripcion: "", cantidad: 1, precioUnitario: 0 }])
  }

  const eliminarRepuesto = (id: number) => {
    setRepuestos(repuestos.filter((repuesto) => repuesto.id !== id))
  }

  const actualizarRepuesto = (id: number, campo: string, valor: string | number) => {
    setRepuestos(repuestos.map((repuesto) => (repuesto.id === id ? { ...repuesto, [campo]: valor } : repuesto)))
  }

  const calcularTotalServicios = () => {
    return servicios.reduce((total, servicio) => total + Number(servicio.costo), 0)
  }

  const calcularTotalRepuestos = () => {
    return repuestos.reduce((total, repuesto) => total + Number(repuesto.precioUnitario) * Number(repuesto.cantidad), 0)
  }

  const calcularTotal = () => {
    return calcularTotalServicios() + calcularTotalRepuestos()
  }

  const seleccionarServicioPredefinido = (servicioId: string) => {
    const servicio = serviciosPredefinidos.find((s) => s.id === servicioId)
    if (servicio) {
      const nuevoId = servicios.length > 0 ? Math.max(...servicios.map((s) => s.id)) + 1 : 1
      setServicios([...servicios, { id: nuevoId, descripcion: servicio.descripcion, costo: servicio.costo }])
    }
  }

  const seleccionarRepuestoPredefinido = (repuestoId: string) => {
    const repuesto = repuestosPredefinidos.find((r) => r.id === repuestoId)
    if (repuesto) {
      const nuevoId = repuestos.length > 0 ? Math.max(...repuestos.map((r) => r.id)) + 1 : 1
      setRepuestos([
        ...repuestos,
        { id: nuevoId, descripcion: repuesto.descripcion, cantidad: 1, precioUnitario: repuesto.precio },
      ])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones básicas
    if (!clienteId || !vehiculoId || !tecnicoId || !fecha) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        // variant: "destructive",
      })
      return
    }

    if (servicios.length === 0 && repuestos.length === 0) {
      toast({
        title: "Error",
        description: "Debes agregar al menos un servicio o repuesto",
        // variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Aquí iría la lógica para guardar la orden en la base de datos
      // Simulamos una petición
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Orden creada",
        description: "La orden de trabajo ha sido creada exitosamente",
      })

      // Redirigir a la lista de órdenes
      router.push("/taller/ordenes")
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al crear la orden",
        // variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = () => {
    if (activeTab === "informacion") {
      setActiveTab("servicios")
    } else if (activeTab === "servicios") {
      setActiveTab("repuestos")
    } else if (activeTab === "repuestos") {
      setActiveTab("resumen")
    }
  }

  const handlePrevious = () => {
    if (activeTab === "resumen") {
      setActiveTab("repuestos")
    } else if (activeTab === "repuestos") {
      setActiveTab("servicios")
    } else if (activeTab === "servicios") {
      setActiveTab("informacion")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Nueva Orden de Trabajo</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>Guardando...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Orden
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="informacion">Información</TabsTrigger>
            <TabsTrigger value="servicios">Servicios</TabsTrigger>
            <TabsTrigger value="repuestos">Repuestos</TabsTrigger>
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
          </TabsList>

          <TabsContent value="informacion" className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
                <CardDescription>Datos básicos de la orden de servicio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !fecha && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fecha ? format(fecha, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={fecha} onSelect={setFecha} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cliente">Cliente</Label>
                    <Select value={clienteId} onValueChange={setClienteId}>
                      <SelectTrigger id="cliente">
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientes.map((cliente) => (
                          <SelectItem key={cliente.id} value={cliente.id}>
                            {cliente.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehiculo">Vehículo</Label>
                    <Select
                      value={vehiculoId}
                      onValueChange={setVehiculoId}
                      disabled={!clienteId || vehiculosFiltrados.length === 0}
                    >
                      <SelectTrigger id="vehiculo">
                        <SelectValue
                          placeholder={
                            !clienteId
                              ? "Selecciona un cliente primero"
                              : vehiculosFiltrados.length === 0
                                ? "No hay vehículos para este cliente"
                                : "Seleccionar vehículo"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {vehiculosFiltrados.map((vehiculo) => (
                          <SelectItem key={vehiculo.id} value={vehiculo.id}>
                            {`${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.placa})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tecnico">Técnico Asignado</Label>
                    <Select value={tecnicoId} onValueChange={setTecnicoId}>
                      <SelectTrigger id="tecnico">
                        <SelectValue placeholder="Seleccionar técnico" />
                      </SelectTrigger>
                      <SelectContent>
                        {tecnicos.map((tecnico) => (
                          <SelectItem key={tecnico.id} value={tecnico.id}>
                            {tecnico.nombre} - {tecnico.especialidad}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kilometraje">Kilometraje</Label>
                    <Input
                      id="kilometraje"
                      type="number"
                      placeholder="Ej: 45000"
                      value={kilometraje}
                      onChange={(e) => setKilometraje(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prioridad">Prioridad</Label>
                    <Select value={prioridad} onValueChange={setPrioridad}>
                      <SelectTrigger id="prioridad">
                        <SelectValue placeholder="Seleccionar prioridad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baja">Baja</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción del problema</Label>
                  <Textarea
                    id="descripcion"
                    placeholder="Describa el problema reportado por el cliente"
                    rows={3}
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diagnostico">Diagnóstico preliminar</Label>
                  <Textarea
                    id="diagnostico"
                    placeholder="Diagnóstico inicial del vehículo"
                    rows={3}
                    value={diagnostico}
                    onChange={(e) => setDiagnostico(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="button" onClick={handleNext}>
                  Siguiente
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="servicios" className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Servicios</CardTitle>
                <CardDescription>Agrega los servicios a realizar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Label className="w-full mb-1">Servicios predefinidos</Label>
                    {serviciosPredefinidos.map((servicio) => (
                      <Button
                        key={servicio.id}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => seleccionarServicioPredefinido(servicio.id)}
                      >
                        {servicio.descripcion} (${servicio.costo.toFixed(2)})
                      </Button>
                    ))}
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Descripción</TableHead>
                          <TableHead className="w-[150px]">Costo (USD)</TableHead>
                          <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {servicios.map((servicio) => (
                          <TableRow key={servicio.id}>
                            <TableCell>
                              <Input
                                value={servicio.descripcion}
                                onChange={(e) => actualizarServicio(servicio.id, "descripcion", e.target.value)}
                                placeholder="Descripción del servicio"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={servicio.costo}
                                onChange={(e) =>
                                  actualizarServicio(servicio.id, "costo", Number.parseFloat(e.target.value) || 0)
                                }
                                min="0"
                                step="0.01"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                onClick={() => eliminarServicio(servicio.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <Button type="button" variant="outline" onClick={agregarServicio}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Agregar servicio
                  </Button>

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Subtotal servicios: ${calcularTotalServicios().toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  Anterior
                </Button>
                <Button type="button" onClick={handleNext}>
                  Siguiente
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="repuestos" className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Repuestos</CardTitle>
                <CardDescription>Agrega los repuestos necesarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Label className="w-full mb-1">Repuestos predefinidos</Label>
                    {repuestosPredefinidos.map((repuesto) => (
                      <Button
                        key={repuesto.id}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => seleccionarRepuestoPredefinido(repuesto.id)}
                      >
                        {repuesto.descripcion} (${repuesto.precio.toFixed(2)})
                      </Button>
                    ))}
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Descripción</TableHead>
                          <TableHead className="w-[100px]">Cantidad</TableHead>
                          <TableHead className="w-[150px]">Precio Unit. (USD)</TableHead>
                          <TableHead className="w-[150px]">Subtotal</TableHead>
                          <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {repuestos.map((repuesto) => (
                          <TableRow key={repuesto.id}>
                            <TableCell>
                              <Input
                                value={repuesto.descripcion}
                                onChange={(e) => actualizarRepuesto(repuesto.id, "descripcion", e.target.value)}
                                placeholder="Descripción del repuesto"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={repuesto.cantidad}
                                onChange={(e) =>
                                  actualizarRepuesto(repuesto.id, "cantidad", Number.parseInt(e.target.value) || 1)
                                }
                                min="1"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={repuesto.precioUnitario}
                                onChange={(e) =>
                                  actualizarRepuesto(
                                    repuesto.id,
                                    "precioUnitario",
                                    Number.parseFloat(e.target.value) || 0,
                                  )
                                }
                                min="0"
                                step="0.01"
                              />
                            </TableCell>
                            <TableCell>${(repuesto.precioUnitario * repuesto.cantidad).toFixed(2)}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                onClick={() => eliminarRepuesto(repuesto.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <Button type="button" variant="outline" onClick={agregarRepuesto}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Agregar repuesto
                  </Button>

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Subtotal repuestos: ${calcularTotalRepuestos().toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  Anterior
                </Button>
                <Button type="button" onClick={handleNext}>
                  Siguiente
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="resumen" className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de la Orden</CardTitle>
                <CardDescription>Revisa los detalles antes de crear la orden</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Información General</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium text-muted-foreground">Fecha:</div>
                        <div>{fecha ? format(fecha, "PPP", { locale: es }) : "No seleccionada"}</div>

                        <div className="text-sm font-medium text-muted-foreground">Cliente:</div>
                        <div>{clientes.find((c) => c.id === clienteId)?.nombre || "No seleccionado"}</div>

                        <div className="text-sm font-medium text-muted-foreground">Vehículo:</div>
                        <div>
                          {vehiculoId
                            ? (() => {
                                const v = vehiculos.find((v) => v.id === vehiculoId)
                                return v ? `${v.marca} ${v.modelo} (${v.placa})` : "No seleccionado"
                              })()
                            : "No seleccionado"}
                        </div>

                        <div className="text-sm font-medium text-muted-foreground">Técnico:</div>
                        <div>{tecnicos.find((t) => t.id === tecnicoId)?.nombre || "No seleccionado"}</div>

                        <div className="text-sm font-medium text-muted-foreground">Kilometraje:</div>
                        <div>{kilometraje || "No especificado"}</div>

                        <div className="text-sm font-medium text-muted-foreground">Prioridad:</div>
                        <div className="capitalize">{prioridad}</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Descripción y Diagnóstico</h3>
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">Descripción del problema:</div>
                        <div className="text-sm">{descripcion || "No especificado"}</div>

                        <div className="text-sm font-medium text-muted-foreground mt-2">Diagnóstico preliminar:</div>
                        <div className="text-sm">{diagnostico || "No especificado"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Servicios</h3>
                    {servicios.length > 0 ? (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Descripción</TableHead>
                              <TableHead className="text-right">Costo (USD)</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {servicios.map((servicio) => (
                              <TableRow key={servicio.id}>
                                <TableCell>{servicio.descripcion || "Sin descripción"}</TableCell>
                                <TableCell className="text-right">${servicio.costo.toFixed(2)}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell className="font-medium">Subtotal Servicios</TableCell>
                              <TableCell className="text-right font-medium">
                                ${calcularTotalServicios().toFixed(2)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No se han agregado servicios</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Repuestos</h3>
                    {repuestos.length > 0 ? (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Descripción</TableHead>
                              <TableHead className="text-center">Cantidad</TableHead>
                              <TableHead className="text-right">Precio Unit. (USD)</TableHead>
                              <TableHead className="text-right">Subtotal</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {repuestos.map((repuesto) => (
                              <TableRow key={repuesto.id}>
                                <TableCell>{repuesto.descripcion || "Sin descripción"}</TableCell>
                                <TableCell className="text-center">{repuesto.cantidad}</TableCell>
                                <TableCell className="text-right">${repuesto.precioUnitario.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                  ${(repuesto.precioUnitario * repuesto.cantidad).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell colSpan={3} className="font-medium">
                                Subtotal Repuestos
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                ${calcularTotalRepuestos().toFixed(2)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No se han agregado repuestos</p>
                    )}
                  </div>

                  <div className="rounded-md border p-4 bg-muted/50">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total de la Orden:</span>
                      <span>${calcularTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  Anterior
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Guardando...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Crear Orden
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}
