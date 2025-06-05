"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { TallerLayout } from "./taller-layout"
import { Search, Filter, Plus, Calendar, Star, Clock, MoreHorizontal, Phone, Mail } from "lucide-react"
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

export function TecnicosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openDialog, setOpenDialog] = useState(false)

  const tecnicos = [
    {
      id: 1,
      nombre: "Carlos Rodríguez",
      especialidad: "Mecánica General",
      experiencia: "8 años",
      calificacion: 4.8,
      ordenes_completadas: 245,
      disponibilidad: "Disponible",
      telefono: "+52 555 123 4567",
      email: "carlos.rodriguez@autoflowx.com",
      direccion: "Calle Principal #123, Ciudad de México",
      foto: "/diverse-avatars.png",
      habilidades: ["Diagnóstico", "Reparación de motores", "Sistemas eléctricos"],
      certificaciones: ["ASE Master Technician", "Toyota Certified"],
    },
    {
      id: 2,
      nombre: "Ana Martínez",
      especialidad: "Electrónica Automotriz",
      experiencia: "6 años",
      calificacion: 4.7,
      ordenes_completadas: 189,
      disponibilidad: "Ocupado",
      telefono: "+52 555 234 5678",
      email: "ana.martinez@autoflowx.com",
      direccion: "Av. Secundaria #456, Ciudad de México",
      foto: "/diverse-woman-portrait.png",
      habilidades: ["Diagnóstico electrónico", "Programación de ECU", "Sistemas de infoentretenimiento"],
      certificaciones: ["ASE Electronics Systems", "Honda Certified"],
    },
    {
      id: 3,
      nombre: "Miguel Sánchez",
      especialidad: "Carrocería y Pintura",
      experiencia: "10 años",
      calificacion: 4.9,
      ordenes_completadas: 312,
      disponibilidad: "Disponible",
      telefono: "+52 555 345 6789",
      email: "miguel.sanchez@autoflowx.com",
      direccion: "Blvd. Principal #789, Ciudad de México",
      foto: "/thoughtful-man.png",
      habilidades: ["Reparación de carrocería", "Pintura automotriz", "Restauración"],
      certificaciones: ["PPG Certified", "I-CAR Platinum"],
    },
    {
      id: 4,
      nombre: "Laura Gómez",
      especialidad: "Diagnóstico y Afinación",
      experiencia: "5 años",
      calificacion: 4.6,
      ordenes_completadas: 156,
      disponibilidad: "Permiso",
      telefono: "+52 555 456 7890",
      email: "laura.gomez@autoflowx.com",
      direccion: "Calle Terciaria #101, Ciudad de México",
      foto: "/diverse-woman-portrait.png",
      habilidades: ["Diagnóstico computarizado", "Afinación", "Sistemas de inyección"],
      certificaciones: ["ASE Engine Performance", "Ford Certified"],
    },
    {
      id: 5,
      nombre: "Roberto Díaz",
      especialidad: "Transmisiones",
      experiencia: "12 años",
      calificacion: 4.9,
      ordenes_completadas: 278,
      disponibilidad: "Disponible",
      telefono: "+52 555 567 8901",
      email: "roberto.diaz@autoflowx.com",
      direccion: "Av. Principal #202, Ciudad de México",
      foto: "/thoughtful-man.png",
      habilidades: ["Transmisiones automáticas", "Transmisiones manuales", "Diagnóstico"],
      certificaciones: ["ATRA Certified", "GM Transmission Specialist"],
    },
  ]

  const getAvailabilityColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "disponible":
        return "bg-green-100 text-green-800"
      case "ocupado":
        return "bg-yellow-100 text-yellow-800"
      case "permiso":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTecnicos = tecnicos.filter(
    (tecnico) =>
      tecnico.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tecnico.especialidad.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <TallerLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Técnicos</h1>
            <p className="text-muted-foreground">Administra el equipo técnico del taller</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar técnicos..."
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
                  <Plus className="mr-2 h-4 w-4" /> Nuevo Técnico
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Técnico</DialogTitle>
                  <DialogDescription>Complete los datos para agregar un nuevo técnico al equipo.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre Completo</Label>
                      <Input id="nombre" placeholder="Nombre y apellidos" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="especialidad">Especialidad</Label>
                      <Input id="especialidad" placeholder="Especialidad principal" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experiencia">Experiencia</Label>
                      <Input id="experiencia" placeholder="Años de experiencia" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input id="telefono" placeholder="Número de teléfono" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input id="email" type="email" placeholder="Correo electrónico" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="direccion">Dirección</Label>
                      <Input id="direccion" placeholder="Dirección" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="habilidades">Habilidades</Label>
                    <Textarea id="habilidades" placeholder="Habilidades separadas por comas" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certificaciones">Certificaciones</Label>
                    <Textarea id="certificaciones" placeholder="Certificaciones separadas por comas" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setOpenDialog(false)}>Guardar Técnico</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="todos" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="disponibles">Disponibles</TabsTrigger>
            <TabsTrigger value="ocupados">Ocupados</TabsTrigger>
            <TabsTrigger value="calendario">Calendario</TabsTrigger>
          </TabsList>

          <TabsContent value="todos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTecnicos.map((tecnico) => (
                <Card key={tecnico.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={tecnico.foto || "/placeholder.svg"} alt={tecnico.nombre} />
                          <AvatarFallback>{tecnico.nombre.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{tecnico.nombre}</CardTitle>
                          <CardDescription>{tecnico.especialidad}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getAvailabilityColor(tecnico.disponibilidad)}>{tecnico.disponibilidad}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                            <DropdownMenuItem>Editar información</DropdownMenuItem>
                            <DropdownMenuItem>Ver horario</DropdownMenuItem>
                            <DropdownMenuItem>Asignar orden</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Desactivar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-medium">{tecnico.calificacion}</span>
                          <span className="text-muted-foreground ml-1">/ 5.0</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{tecnico.ordenes_completadas}</span> órdenes
                          completadas
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-muted-foreground">Experiencia:</span>
                          <span className="ml-1 font-medium">{tecnico.experiencia}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-muted-foreground">Teléfono:</span>
                          <span className="ml-1 font-medium">{tecnico.telefono}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-muted-foreground">Email:</span>
                          <span className="ml-1 font-medium">{tecnico.email}</span>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="text-sm font-medium mb-2">Habilidades:</h4>
                        <div className="flex flex-wrap gap-1">
                          {tecnico.habilidades.map((habilidad, i) => (
                            <Badge key={i} variant="outline">
                              {habilidad}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Ver Horario
                    </Button>
                    <Button size="sm">Ver Perfil</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="disponibles">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTecnicos
                .filter((tecnico) => tecnico.disponibilidad.toLowerCase() === "disponible")
                .map((tecnico) => (
                  <Card key={tecnico.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={tecnico.foto || "/placeholder.svg"} alt={tecnico.nombre} />
                            <AvatarFallback>{tecnico.nombre.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{tecnico.nombre}</CardTitle>
                            <CardDescription>{tecnico.especialidad}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getAvailabilityColor(tecnico.disponibilidad)}>
                            {tecnico.disponibilidad}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                              <DropdownMenuItem>Editar información</DropdownMenuItem>
                              <DropdownMenuItem>Ver horario</DropdownMenuItem>
                              <DropdownMenuItem>Asignar orden</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Desactivar</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="font-medium">{tecnico.calificacion}</span>
                            <span className="text-muted-foreground ml-1">/ 5.0</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">{tecnico.ordenes_completadas}</span> órdenes
                            completadas
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Experiencia:</span>
                            <span className="ml-1 font-medium">{tecnico.experiencia}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Teléfono:</span>
                            <span className="ml-1 font-medium">{tecnico.telefono}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Email:</span>
                            <span className="ml-1 font-medium">{tecnico.email}</span>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="text-sm font-medium mb-2">Habilidades:</h4>
                          <div className="flex flex-wrap gap-1">
                            {tecnico.habilidades.map((habilidad, i) => (
                              <Badge key={i} variant="outline">
                                {habilidad}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Ver Horario
                      </Button>
                      <Button size="sm">Ver Perfil</Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="ocupados">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTecnicos
                .filter(
                  (tecnico) =>
                    tecnico.disponibilidad.toLowerCase() === "ocupado" ||
                    tecnico.disponibilidad.toLowerCase() === "permiso",
                )
                .map((tecnico) => (
                  <Card key={tecnico.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={tecnico.foto || "/placeholder.svg"} alt={tecnico.nombre} />
                            <AvatarFallback>{tecnico.nombre.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{tecnico.nombre}</CardTitle>
                            <CardDescription>{tecnico.especialidad}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getAvailabilityColor(tecnico.disponibilidad)}>
                            {tecnico.disponibilidad}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                              <DropdownMenuItem>Editar información</DropdownMenuItem>
                              <DropdownMenuItem>Ver horario</DropdownMenuItem>
                              <DropdownMenuItem>Ver orden actual</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Desactivar</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="font-medium">{tecnico.calificacion}</span>
                            <span className="text-muted-foreground ml-1">/ 5.0</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">{tecnico.ordenes_completadas}</span> órdenes
                            completadas
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Experiencia:</span>
                            <span className="ml-1 font-medium">{tecnico.experiencia}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Teléfono:</span>
                            <span className="ml-1 font-medium">{tecnico.telefono}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Email:</span>
                            <span className="ml-1 font-medium">{tecnico.email}</span>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="text-sm font-medium mb-2">Habilidades:</h4>
                          <div className="flex flex-wrap gap-1">
                            {tecnico.habilidades.map((habilidad, i) => (
                              <Badge key={i} variant="outline">
                                {habilidad}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Ver Horario
                      </Button>
                      <Button size="sm">Ver Perfil</Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="calendario">
            <Card>
              <CardHeader>
                <CardTitle>Calendario de Técnicos</CardTitle>
                <CardDescription>Visualiza la disponibilidad y asignaciones de los técnicos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {tecnicos.map((tecnico) => (
                    <div key={tecnico.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={tecnico.foto || "/placeholder.svg"} alt={tecnico.nombre} />
                            <AvatarFallback>{tecnico.nombre.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="text-sm font-medium">{tecnico.nombre}</h4>
                            <p className="text-xs text-muted-foreground">{tecnico.especialidad}</p>
                          </div>
                        </div>
                        <Badge className={getAvailabilityColor(tecnico.disponibilidad)}>{tecnico.disponibilidad}</Badge>
                      </div>
                      <div className="bg-muted p-2 rounded-md">
                        <div className="grid grid-cols-7 gap-1 text-xs text-center">
                          <div className="font-medium">Lun</div>
                          <div className="font-medium">Mar</div>
                          <div className="font-medium">Mié</div>
                          <div className="font-medium">Jue</div>
                          <div className="font-medium">Vie</div>
                          <div className="font-medium">Sáb</div>
                          <div className="font-medium">Dom</div>
                          <div className="bg-green-100 rounded p-1">8-5</div>
                          <div className="bg-green-100 rounded p-1">8-5</div>
                          <div className="bg-green-100 rounded p-1">8-5</div>
                          <div className="bg-green-100 rounded p-1">8-5</div>
                          <div className="bg-green-100 rounded p-1">8-5</div>
                          <div className="bg-yellow-100 rounded p-1">8-12</div>
                          <div className="bg-red-100 rounded p-1">OFF</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                            <span>Disponible</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                            <span>Parcial</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                            <span>No disponible</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Editar horario
                        </Button>
                      </div>
                      <Separator />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TallerLayout>
  )
}
