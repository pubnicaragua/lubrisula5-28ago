"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { TallerLayout } from "./taller-layout"
import { Search, Filter, Plus, Settings, Clock, DollarSign, MoreHorizontal, Wrench } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ServiciosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openDialog, setOpenDialog] = useState(false)

  const servicios = [
    {
      id: "SRV-001",
      nombre: "Cambio de Aceite y Filtro",
      categoria: "Mantenimiento",
      descripcion: "Cambio de aceite de motor y filtro de aceite",
      precio: 800,
      duracion: "30 minutos",
      materiales: ["Aceite de motor", "Filtro de aceite"],
      activo: true,
    },
    {
      id: "SRV-002",
      nombre: "Afinación Básica",
      categoria: "Mantenimiento",
      descripcion: "Incluye cambio de bujías, filtro de aire, revisión de cables y sistema de encendido",
      precio: 1500,
      duracion: "1 hora",
      materiales: ["Bujías", "Filtro de aire", "Limpiador de inyectores"],
      activo: true,
    },
    {
      id: "SRV-003",
      nombre: "Alineación y Balanceo",
      categoria: "Mantenimiento",
      descripcion: "Alineación de dirección y balanceo de ruedas",
      precio: 950,
      duracion: "45 minutos",
      materiales: ["Pesas para balanceo"],
      activo: true,
    },
    {
      id: "SRV-004",
      nombre: "Diagnóstico Computarizado",
      categoria: "Diagnóstico",
      descripcion: "Diagnóstico completo del sistema electrónico del vehículo",
      precio: 600,
      duracion: "30 minutos",
      materiales: [],
      activo: true,
    },
    {
      id: "SRV-005",
      nombre: "Reparación de Frenos",
      categoria: "Reparación",
      descripcion: "Cambio de pastillas o balatas, rectificación de discos o tambores",
      precio: 1200,
      duracion: "1.5 horas",
      materiales: ["Pastillas de freno", "Líquido de frenos"],
      activo: true,
    },
    {
      id: "SRV-006",
      nombre: "Cambio de Amortiguadores",
      categoria: "Reparación",
      descripcion: "Reemplazo de amortiguadores delanteros o traseros",
      precio: 2500,
      duracion: "2 horas",
      materiales: ["Amortiguadores"],
      activo: true,
    },
    {
      id: "SRV-007",
      nombre: "Reparación de Alternador",
      categoria: "Reparación",
      descripcion: "Diagnóstico y reparación del sistema de carga",
      precio: 1800,
      duracion: "2 horas",
      materiales: ["Kit de reparación de alternador"],
      activo: true,
    },
    {
      id: "SRV-008",
      nombre: "Pintura de Panel",
      categoria: "Carrocería",
      descripcion: "Pintura de un panel de carrocería",
      precio: 3500,
      duracion: "4 horas",
      materiales: ["Pintura", "Primer", "Barniz", "Lija"],
      activo: true,
    },
    {
      id: "SRV-009",
      nombre: "Reparación de Aire Acondicionado",
      categoria: "Reparación",
      descripcion: "Diagnóstico y recarga del sistema de aire acondicionado",
      precio: 1800,
      duracion: "1.5 horas",
      materiales: ["Gas refrigerante", "Aceite para compresor"],
      activo: true,
    },
    {
      id: "SRV-010",
      nombre: "Lavado de Motor",
      categoria: "Estética",
      descripcion: "Limpieza profunda del compartimiento del motor",
      precio: 500,
      duracion: "45 minutos",
      materiales: ["Desengrasante", "Protector de vinilo"],
      activo: false,
    },
  ]

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "mantenimiento":
        return "bg-blue-100 text-blue-800"
      case "diagnóstico":
        return "bg-purple-100 text-purple-800"
      case "reparación":
        return "bg-yellow-100 text-yellow-800"
      case "carrocería":
        return "bg-green-100 text-green-800"
      case "estética":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredServicios = servicios.filter(
    (servicio) =>
      servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servicio.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servicio.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <TallerLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Servicios</h1>
            <p className="text-muted-foreground">Administra los servicios ofrecidos por el taller</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar servicios..."
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
                  <Plus className="mr-2 h-4 w-4" /> Nuevo Servicio
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Servicio</DialogTitle>
                  <DialogDescription>Complete los datos para agregar un nuevo servicio al catálogo.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre del Servicio</Label>
                      <Input id="nombre" placeholder="Nombre del servicio" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoría</Label>
                      <Select>
                        <SelectTrigger id="categoria">
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                          <SelectItem value="diagnostico">Diagnóstico</SelectItem>
                          <SelectItem value="reparacion">Reparación</SelectItem>
                          <SelectItem value="carroceria">Carrocería</SelectItem>
                          <SelectItem value="estetica">Estética</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="precio">Precio (MXN)</Label>
                      <Input id="precio" type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duracion">Duración Estimada</Label>
                      <Input id="duracion" placeholder="Ej: 1 hora" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea id="descripcion" placeholder="Descripción detallada del servicio" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="materiales">Materiales Requeridos</Label>
                    <Textarea id="materiales" placeholder="Materiales separados por comas" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="activo" defaultChecked />
                    <Label htmlFor="activo">Servicio Activo</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setOpenDialog(false)}>Guardar Servicio</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="todos" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="mantenimiento">Mantenimiento</TabsTrigger>
            <TabsTrigger value="reparacion">Reparación</TabsTrigger>
            <TabsTrigger value="diagnostico">Diagnóstico</TabsTrigger>
            <TabsTrigger value="paquetes">Paquetes</TabsTrigger>
          </TabsList>

          <TabsContent value="todos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServicios.map((servicio) => (
                <Card key={servicio.id} className={`overflow-hidden ${!servicio.activo ? "opacity-60" : ""}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{servicio.nombre}</CardTitle>
                        <CardDescription>{servicio.id}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryColor(servicio.categoria)}>{servicio.categoria}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Editar servicio</DropdownMenuItem>
                            <DropdownMenuItem>Ver historial</DropdownMenuItem>
                            <DropdownMenuItem>Agregar a paquete</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {servicio.activo ? (
                              <DropdownMenuItem className="text-red-600">Desactivar</DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-green-600">Activar</DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{servicio.descripcion}</p>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm">
                          <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="font-medium">${servicio.precio.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="font-medium">{servicio.duracion}</span>
                        </div>
                      </div>

                      {servicio.materiales.length > 0 && (
                        <>
                          <Separator />
                          <div>
                            <h4 className="text-sm font-medium mb-2">Materiales:</h4>
                            <div className="flex flex-wrap gap-1">
                              {servicio.materiales.map((material, i) => (
                                <Badge key={i} variant="outline">
                                  {material}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurar
                    </Button>
                    <Button size="sm">Agregar a Orden</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mantenimiento">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServicios
                .filter((servicio) => servicio.categoria.toLowerCase() === "mantenimiento" && servicio.activo)
                .map((servicio) => (
                  <Card key={servicio.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{servicio.nombre}</CardTitle>
                          <CardDescription>{servicio.id}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(servicio.categoria)}>{servicio.categoria}</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Editar servicio</DropdownMenuItem>
                              <DropdownMenuItem>Ver historial</DropdownMenuItem>
                              <DropdownMenuItem>Agregar a paquete</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Desactivar</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">{servicio.descripcion}</p>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-sm">
                            <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="font-medium">${servicio.precio.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="font-medium">{servicio.duracion}</span>
                          </div>
                        </div>

                        {servicio.materiales.length > 0 && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="text-sm font-medium mb-2">Materiales:</h4>
                              <div className="flex flex-wrap gap-1">
                                {servicio.materiales.map((material, i) => (
                                  <Badge key={i} variant="outline">
                                    {material}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar
                      </Button>
                      <Button size="sm">Agregar a Orden</Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="reparacion">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServicios
                .filter((servicio) => servicio.categoria.toLowerCase() === "reparación" && servicio.activo)
                .map((servicio) => (
                  <Card key={servicio.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{servicio.nombre}</CardTitle>
                          <CardDescription>{servicio.id}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(servicio.categoria)}>{servicio.categoria}</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Editar servicio</DropdownMenuItem>
                              <DropdownMenuItem>Ver historial</DropdownMenuItem>
                              <DropdownMenuItem>Agregar a paquete</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Desactivar</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">{servicio.descripcion}</p>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-sm">
                            <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="font-medium">${servicio.precio.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="font-medium">{servicio.duracion}</span>
                          </div>
                        </div>

                        {servicio.materiales.length > 0 && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="text-sm font-medium mb-2">Materiales:</h4>
                              <div className="flex flex-wrap gap-1">
                                {servicio.materiales.map((material, i) => (
                                  <Badge key={i} variant="outline">
                                    {material}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar
                      </Button>
                      <Button size="sm">Agregar a Orden</Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="diagnostico">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServicios
                .filter((servicio) => servicio.categoria.toLowerCase() === "diagnóstico" && servicio.activo)
                .map((servicio) => (
                  <Card key={servicio.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{servicio.nombre}</CardTitle>
                          <CardDescription>{servicio.id}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(servicio.categoria)}>{servicio.categoria}</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Editar servicio</DropdownMenuItem>
                              <DropdownMenuItem>Ver historial</DropdownMenuItem>
                              <DropdownMenuItem>Agregar a paquete</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Desactivar</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">{servicio.descripcion}</p>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-sm">
                            <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="font-medium">${servicio.precio.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="font-medium">{servicio.duracion}</span>
                          </div>
                        </div>

                        {servicio.materiales.length > 0 && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="text-sm font-medium mb-2">Materiales:</h4>
                              <div className="flex flex-wrap gap-1">
                                {servicio.materiales.map((material, i) => (
                                  <Badge key={i} variant="outline">
                                    {material}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar
                      </Button>
                      <Button size="sm">Agregar a Orden</Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="paquetes">
            <Card>
              <CardHeader>
                <CardTitle>Paquetes de Servicio</CardTitle>
                <CardDescription>Paquetes predefinidos que combinan múltiples servicios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Paquete de Mantenimiento Básico</CardTitle>
                          <CardDescription>PKG-001</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-800">Mantenimiento</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Editar paquete</DropdownMenuItem>
                              <DropdownMenuItem>Ver historial</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Desactivar</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Paquete de mantenimiento básico que incluye cambio de aceite, revisión de niveles y
                          diagnóstico general.
                        </p>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-sm">
                            <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="font-medium">$1,200.00</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="font-medium">1 hora</span>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="text-sm font-medium mb-2">Servicios incluidos:</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Wrench className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Cambio de Aceite y Filtro</span>
                              </div>
                              <span className="text-sm text-muted-foreground">$800</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Wrench className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Diagnóstico Computarizado</span>
                              </div>
                              <span className="text-sm text-muted-foreground">$600</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Ahorro:</span> $200
                      </div>
                      <Button>Agregar a Orden</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Paquete de Mantenimiento Mayor</CardTitle>
                          <CardDescription>PKG-002</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-800">Mantenimiento</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Editar paquete</DropdownMenuItem>
                              <DropdownMenuItem>Ver historial</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Desactivar</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Paquete completo de mantenimiento que incluye afinación, cambio de aceite, alineación y
                          balanceo.
                        </p>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-sm">
                            <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="font-medium">$2,800.00</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="font-medium">2.5 horas</span>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="text-sm font-medium mb-2">Servicios incluidos:</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Wrench className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Afinación Básica</span>
                              </div>
                              <span className="text-sm text-muted-foreground">$1,500</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Wrench className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Cambio de Aceite y Filtro</span>
                              </div>
                              <span className="text-sm text-muted-foreground">$800</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Wrench className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Alineación y Balanceo</span>
                              </div>
                              <span className="text-sm text-muted-foreground">$950</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Ahorro:</span> $450
                      </div>
                      <Button>Agregar a Orden</Button>
                    </CardFooter>
                  </Card>

                  <div className="flex justify-center">
                    <Button className="rounded-full">
                      <Plus className="mr-2 h-4 w-4" /> Crear Nuevo Paquete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TallerLayout>
  )
}
