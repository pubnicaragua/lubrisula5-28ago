"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { TallerLayout } from "./taller-layout"
import { CalendarIcon, Search, Filter, Plus, Clock, User, Car, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function CitasPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [date, setDate] = useState<Date>()
  const [openDialog, setOpenDialog] = useState(false)

  const citas = [
    {
      id: "CITA-1001",
      cliente: "Juan Pérez",
      vehiculo: "Toyota Corolla",
      placa: "ABC-123",
      fecha: "2024-05-20",
      hora: "10:00",
      estado: "Pendiente",
      tecnico: "Técnico 1",
      servicios: ["Mantenimiento", "Cambio de aceite"],
      notas: "Cliente recurrente, prefiere ser atendido por el mismo técnico",
    },
    {
      id: "CITA-1002",
      cliente: "María Rodríguez",
      vehiculo: "Honda Civic",
      placa: "XYZ-789",
      fecha: "2024-05-20",
      hora: "14:30",
      estado: "Confirmada",
      tecnico: "Técnico 2",
      servicios: ["Diagnóstico", "Revisión de frenos"],
      notas: "Llamar para confirmar un día antes",
    },
    {
      id: "CITA-1003",
      cliente: "Carlos Gómez",
      vehiculo: "Nissan Sentra",
      placa: "DEF-456",
      fecha: "2024-05-21",
      hora: "09:15",
      estado: "Pendiente",
      tecnico: "Técnico 3",
      servicios: ["Reparación", "Cambio de suspensión"],
      notas: "",
    },
    {
      id: "CITA-1004",
      cliente: "Ana López",
      vehiculo: "Kia Sportage",
      placa: "GHI-789",
      fecha: "2024-05-21",
      hora: "16:00",
      estado: "Cancelada",
      tecnico: "Técnico 4",
      servicios: ["Pintura", "Reparación de carrocería"],
      notas: "Cancelada por el cliente, reprogramar para la próxima semana",
    },
    {
      id: "CITA-1005",
      cliente: "Pedro Martínez",
      vehiculo: "Ford Explorer",
      placa: "JKL-012",
      fecha: "2024-05-22",
      hora: "11:30",
      estado: "Completada",
      tecnico: "Técnico 1",
      servicios: ["Mantenimiento", "Alineación y balanceo"],
      notas: "Cliente satisfecho con el servicio",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "confirmada":
        return "bg-blue-100 text-blue-800"
      case "completada":
        return "bg-green-100 text-green-800"
      case "cancelada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredCitas = citas.filter(
    (cita) =>
      cita.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.vehiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.placa.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const citasPorFecha: { [key: string]: typeof citas } = {}
  filteredCitas.forEach((cita) => {
    if (!citasPorFecha[cita.fecha]) {
      citasPorFecha[cita.fecha] = []
    }
    citasPorFecha[cita.fecha].push(cita)
  })

  return (
    <TallerLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Citas</h1>
            <p className="text-muted-foreground">Programa y administra las citas del taller</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar citas..."
                className="w-[200px] pl-8 md:w-[300px] rounded-full bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="rounded-full">
              <Filter className="h-4 w-4" />
            </Button>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button className="rounded-full">
                  <Plus className="mr-2 h-4 w-4" /> Nueva Cita
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Programar Nueva Cita</DialogTitle>
                  <DialogDescription>Complete los datos para programar una nueva cita en el taller.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cliente">Cliente</Label>
                      <Select>
                        <SelectTrigger id="cliente">
                          <SelectValue placeholder="Seleccionar cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="juan">Juan Pérez</SelectItem>
                          <SelectItem value="maria">María Rodríguez</SelectItem>
                          <SelectItem value="carlos">Carlos Gómez</SelectItem>
                          <SelectItem value="ana">Ana López</SelectItem>
                          <SelectItem value="pedro">Pedro Martínez</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehiculo">Vehículo</Label>
                      <Select>
                        <SelectTrigger id="vehiculo">
                          <SelectValue placeholder="Seleccionar vehículo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="toyota">Toyota Corolla (ABC-123)</SelectItem>
                          <SelectItem value="honda">Honda Civic (XYZ-789)</SelectItem>
                          <SelectItem value="nissan">Nissan Sentra (DEF-456)</SelectItem>
                          <SelectItem value="kia">Kia Sportage (GHI-789)</SelectItem>
                          <SelectItem value="ford">Ford Explorer (JKL-012)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fecha">Fecha</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hora">Hora</Label>
                      <Select>
                        <SelectTrigger id="hora">
                          <SelectValue placeholder="Seleccionar hora" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="09:00">09:00</SelectItem>
                          <SelectItem value="09:30">09:30</SelectItem>
                          <SelectItem value="10:00">10:00</SelectItem>
                          <SelectItem value="10:30">10:30</SelectItem>
                          <SelectItem value="11:00">11:00</SelectItem>
                          <SelectItem value="11:30">11:30</SelectItem>
                          <SelectItem value="12:00">12:00</SelectItem>
                          <SelectItem value="12:30">12:30</SelectItem>
                          <SelectItem value="14:00">14:00</SelectItem>
                          <SelectItem value="14:30">14:30</SelectItem>
                          <SelectItem value="15:00">15:00</SelectItem>
                          <SelectItem value="15:30">15:30</SelectItem>
                          <SelectItem value="16:00">16:00</SelectItem>
                          <SelectItem value="16:30">16:30</SelectItem>
                          <SelectItem value="17:00">17:00</SelectItem>
                          <SelectItem value="17:30">17:30</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tecnico">Técnico</Label>
                      <Select>
                        <SelectTrigger id="tecnico">
                          <SelectValue placeholder="Asignar técnico" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tecnico1">Técnico 1</SelectItem>
                          <SelectItem value="tecnico2">Técnico 2</SelectItem>
                          <SelectItem value="tecnico3">Técnico 3</SelectItem>
                          <SelectItem value="tecnico4">Técnico 4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="servicio">Servicio</Label>
                      <Select>
                        <SelectTrigger id="servicio">
                          <SelectValue placeholder="Seleccionar servicio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                          <SelectItem value="reparacion">Reparación</SelectItem>
                          <SelectItem value="diagnostico">Diagnóstico</SelectItem>
                          <SelectItem value="pintura">Pintura</SelectItem>
                          <SelectItem value="alineacion">Alineación y balanceo</SelectItem>
                          <SelectItem value="frenos">Revisión de frenos</SelectItem>
                          <SelectItem value="suspension">Cambio de suspensión</SelectItem>
                          <SelectItem value="aceite">Cambio de aceite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notas">Notas</Label>
                    <Textarea id="notas" placeholder="Añadir notas o comentarios sobre la cita" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setOpenDialog(false)}>Programar Cita</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="calendario" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendario">Vista de Calendario</TabsTrigger>
            <TabsTrigger value="lista">Vista de Lista</TabsTrigger>
          </TabsList>

          <TabsContent value="calendario">
            <Card>
              <CardHeader>
                <CardTitle>Calendario de Citas</CardTitle>
                <CardDescription>Visualiza las citas programadas por fecha</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  <div className="md:col-span-2">
                    <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                  </div>
                  <div className="md:col-span-5">
                    <h3 className="text-lg font-medium mb-4">
                      {date ? format(date, "PPPP", { locale: es }) : "Seleccione una fecha"}
                    </h3>
                    <div className="space-y-4">
                      {date ? (
                        citasPorFecha[format(date, "yyyy-MM-dd")] ? (
                          citasPorFecha[format(date, "yyyy-MM-dd")].map((cita, index) => (
                            <Card key={index} className="overflow-hidden">
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                      <Clock className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                      <CardTitle className="text-lg">{cita.hora}</CardTitle>
                                      <CardDescription>{cita.id}</CardDescription>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge className={getStatusColor(cita.estado)}>{cita.estado}</Badge>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                                        <DropdownMenuItem>Editar cita</DropdownMenuItem>
                                        <DropdownMenuItem>Confirmar cita</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600">Cancelar cita</DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="space-y-1">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <User className="mr-2 h-4 w-4" />
                                      <span className="font-medium text-foreground">Cliente:</span>
                                    </div>
                                    <p>{cita.cliente}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Car className="mr-2 h-4 w-4" />
                                      <span className="font-medium text-foreground">Vehículo:</span>
                                    </div>
                                    <p>
                                      {cita.vehiculo} ({cita.placa})
                                    </p>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <User className="mr-2 h-4 w-4" />
                                      <span className="font-medium text-foreground">Técnico:</span>
                                    </div>
                                    <p>{cita.tecnico}</p>
                                  </div>
                                </div>
                                {cita.notas && (
                                  <>
                                    <Separator className="my-4" />
                                    <div>
                                      <p className="text-sm font-medium mb-1">Notas:</p>
                                      <p className="text-sm text-muted-foreground">{cita.notas}</p>
                                    </div>
                                  </>
                                )}
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">No hay citas programadas para esta fecha</p>
                            <Button className="mt-4" onClick={() => setOpenDialog(true)}>
                              <Plus className="mr-2 h-4 w-4" /> Programar Cita
                            </Button>
                          </div>
                        )
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">Seleccione una fecha para ver las citas programadas</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lista">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Citas</CardTitle>
                <CardDescription>Visualiza todas las citas programadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCitas.length > 0 ? (
                    filteredCitas.map((cita, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Clock className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{cita.id}</CardTitle>
                                <CardDescription>
                                  {cita.fecha} - {cita.hora}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(cita.estado)}>{cita.estado}</Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                                  <DropdownMenuItem>Editar cita</DropdownMenuItem>
                                  <DropdownMenuItem>Confirmar cita</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">Cancelar cita</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <User className="mr-2 h-4 w-4" />
                                <span className="font-medium text-foreground">Cliente:</span>
                              </div>
                              <p>{cita.cliente}</p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Car className="mr-2 h-4 w-4" />
                                <span className="font-medium text-foreground">Vehículo:</span>
                              </div>
                              <p>
                                {cita.vehiculo} ({cita.placa})
                              </p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <User className="mr-2 h-4 w-4" />
                                <span className="font-medium text-foreground">Técnico:</span>
                              </div>
                              <p>{cita.tecnico}</p>
                            </div>
                          </div>
                          <Separator className="my-4" />
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium mb-1">Servicios:</p>
                              <div className="flex flex-wrap gap-1">
                                {cita.servicios.map((servicio, i) => (
                                  <Badge key={i} variant="outline">
                                    {servicio}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Button variant="outline">Ver Detalles</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No se encontraron citas</p>
                      <Button className="mt-4" onClick={() => setOpenDialog(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Programar Cita
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TallerLayout>
  )
}
