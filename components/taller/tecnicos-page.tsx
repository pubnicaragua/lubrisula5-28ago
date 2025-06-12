"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Search, Filter, Plus, Calendar, Star, Clock, MoreHorizontal, Phone, Mail, Edit, Trash2 } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

// Mock data inicial para técnicos
const mockTecnicosIniciales = [
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
    foto: "/placeholder.svg?height=100&width=100&text=CR",
    habilidades: ["Diagnóstico", "Reparación de motores", "Sistemas eléctricos"],
    certificaciones: ["ASE Master Technician", "Toyota Certified"],
    horario: {
      lunes: "8:00-17:00",
      martes: "8:00-17:00",
      miercoles: "8:00-17:00",
      jueves: "8:00-17:00",
      viernes: "8:00-17:00",
      sabado: "8:00-12:00",
      domingo: "Descanso",
    },
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
    foto: "/placeholder.svg?height=100&width=100&text=AM",
    habilidades: ["Diagnóstico electrónico", "Programación de ECU", "Sistemas de infoentretenimiento"],
    certificaciones: ["ASE Electronics Systems", "Honda Certified"],
    horario: {
      lunes: "8:00-17:00",
      martes: "8:00-17:00",
      miercoles: "8:00-17:00",
      jueves: "8:00-17:00",
      viernes: "8:00-17:00",
      sabado: "Descanso",
      domingo: "Descanso",
    },
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
    foto: "/placeholder.svg?height=100&width=100&text=MS",
    habilidades: ["Reparación de carrocería", "Pintura automotriz", "Restauración"],
    certificaciones: ["PPG Certified", "I-CAR Platinum"],
    horario: {
      lunes: "8:00-17:00",
      martes: "8:00-17:00",
      miercoles: "8:00-17:00",
      jueves: "8:00-17:00",
      viernes: "8:00-17:00",
      sabado: "8:00-12:00",
      domingo: "Descanso",
    },
  },
]

export function TecnicosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [tecnicos, setTecnicos] = useState(() => {
    // Cargar desde localStorage o usar datos iniciales
    const saved = localStorage.getItem("mockTecnicos")
    if (saved) {
      return JSON.parse(saved)
    } else {
      localStorage.setItem("mockTecnicos", JSON.stringify(mockTecnicosIniciales))
      return mockTecnicosIniciales
    }
  })
  const [openDialog, setOpenDialog] = useState(false)
  const [openPerfilDialog, setOpenPerfilDialog] = useState(false)
  const [openHorarioDialog, setOpenHorarioDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [selectedTecnico, setSelectedTecnico] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nombre: "",
    especialidad: "",
    experiencia: "",
    telefono: "",
    email: "",
    direccion: "",
    habilidades: "",
    certificaciones: "",
    disponibilidad: "Disponible",
  })

  const saveTecnicos = (newTecnicos: any[]) => {
    setTecnicos(newTecnicos)
    localStorage.setItem("mockTecnicos", JSON.stringify(newTecnicos))
  }

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
    (tecnico: any) =>
      tecnico.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tecnico.especialidad.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const nuevoTecnico = {
      id: Date.now(),
      nombre: formData.nombre,
      especialidad: formData.especialidad,
      experiencia: formData.experiencia,
      telefono: formData.telefono,
      email: formData.email,
      direccion: formData.direccion,
      habilidades: formData.habilidades.split(",").map((h) => h.trim()),
      certificaciones: formData.certificaciones.split(",").map((c) => c.trim()),
      disponibilidad: formData.disponibilidad,
      calificacion: 4.0,
      ordenes_completadas: 0,
      foto: `/placeholder.svg?height=100&width=100&text=${formData.nombre
        .split(" ")
        .map((n) => n[0])
        .join("")}`,
      horario: {
        lunes: "8:00-17:00",
        martes: "8:00-17:00",
        miercoles: "8:00-17:00",
        jueves: "8:00-17:00",
        viernes: "8:00-17:00",
        sabado: "8:00-12:00",
        domingo: "Descanso",
      },
    }

    setTimeout(() => {
      const newTecnicos = [...tecnicos, nuevoTecnico]
      saveTecnicos(newTecnicos)

      setFormData({
        nombre: "",
        especialidad: "",
        experiencia: "",
        telefono: "",
        email: "",
        direccion: "",
        habilidades: "",
        certificaciones: "",
        disponibilidad: "Disponible",
      })

      setOpenDialog(false)
      setIsLoading(false)

      toast({
        title: "Técnico agregado",
        description: `${nuevoTecnico.nombre} ha sido agregado al equipo`,
      })
    }, 1000)
  }

  const handleEdit = (tecnico: any) => {
    setSelectedTecnico(tecnico)
    setFormData({
      nombre: tecnico.nombre,
      especialidad: tecnico.especialidad,
      experiencia: tecnico.experiencia,
      telefono: tecnico.telefono,
      email: tecnico.email,
      direccion: tecnico.direccion,
      habilidades: tecnico.habilidades.join(", "),
      certificaciones: tecnico.certificaciones.join(", "),
      disponibilidad: tecnico.disponibilidad,
    })
    setOpenEditDialog(true)
  }

  const handleUpdateTecnico = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedTecnicos = tecnicos.map((t: any) =>
      t.id === selectedTecnico.id
        ? {
            ...t,
            nombre: formData.nombre,
            especialidad: formData.especialidad,
            experiencia: formData.experiencia,
            telefono: formData.telefono,
            email: formData.email,
            direccion: formData.direccion,
            habilidades: formData.habilidades.split(",").map((h) => h.trim()),
            certificaciones: formData.certificaciones.split(",").map((c) => c.trim()),
            disponibilidad: formData.disponibilidad,
          }
        : t,
    )

    saveTecnicos(updatedTecnicos)
    setOpenEditDialog(false)
    setSelectedTecnico(null)

    toast({
      title: "Técnico actualizado",
      description: "La información del técnico ha sido actualizada",
    })
  }

  const handleDelete = (tecnico: any) => {
    if (confirm(`¿Estás seguro de que deseas eliminar a ${tecnico.nombre}?`)) {
      const updatedTecnicos = tecnicos.filter((t: any) => t.id !== tecnico.id)
      saveTecnicos(updatedTecnicos)

      toast({
        title: "Técnico eliminado",
        description: `${tecnico.nombre} ha sido eliminado del equipo`,
      })
    }
  }

  const handleVerPerfil = (tecnico: any) => {
    setSelectedTecnico(tecnico)
    setOpenPerfilDialog(true)
  }

  const handleVerHorario = (tecnico: any) => {
    setSelectedTecnico(tecnico)
    setOpenHorarioDialog(true)
  }

  const handleAsignarOrden = (tecnico: any) => {
    toast({
      title: "Asignar orden",
      description: `Funcionalidad para asignar orden a ${tecnico.nombre} en desarrollo`,
    })
  }

  const handleCambiarDisponibilidad = (tecnico: any, nuevaDisponibilidad: string) => {
    const updatedTecnicos = tecnicos.map((t: any) =>
      t.id === tecnico.id ? { ...t, disponibilidad: nuevaDisponibilidad } : t,
    )

    saveTecnicos(updatedTecnicos)

    toast({
      title: "Disponibilidad actualizada",
      description: `${tecnico.nombre} ahora está ${nuevaDisponibilidad.toLowerCase()}`,
    })
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Técnicos</h1>
          <p className="text-muted-foreground">
            Administra el equipo técnico del taller (Mock Data Local - {tecnicos.length} técnicos)
          </p>
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
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre Completo</Label>
                      <Input
                        id="nombre"
                        placeholder="Nombre y apellidos"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="especialidad">Especialidad</Label>
                      <Select
                        value={formData.especialidad}
                        onValueChange={(value) => setFormData({ ...formData, especialidad: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar especialidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mecánica General">Mecánica General</SelectItem>
                          <SelectItem value="Electrónica Automotriz">Electrónica Automotriz</SelectItem>
                          <SelectItem value="Carrocería y Pintura">Carrocería y Pintura</SelectItem>
                          <SelectItem value="Diagnóstico">Diagnóstico</SelectItem>
                          <SelectItem value="Transmisiones">Transmisiones</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experiencia">Experiencia</Label>
                      <Input
                        id="experiencia"
                        placeholder="Ej: 5 años"
                        value={formData.experiencia}
                        onChange={(e) => setFormData({ ...formData, experiencia: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        placeholder="Número de teléfono"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Correo electrónico"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="direccion">Dirección</Label>
                      <Input
                        id="direccion"
                        placeholder="Dirección"
                        value={formData.direccion}
                        onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="habilidades">Habilidades</Label>
                    <Textarea
                      id="habilidades"
                      placeholder="Habilidades separadas por comas"
                      value={formData.habilidades}
                      onChange={(e) => setFormData({ ...formData, habilidades: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certificaciones">Certificaciones</Label>
                    <Textarea
                      id="certificaciones"
                      placeholder="Certificaciones separadas por comas"
                      value={formData.certificaciones}
                      onChange={(e) => setFormData({ ...formData, certificaciones: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Guardando..." : "Guardar Técnico"}
                  </Button>
                </DialogFooter>
              </form>
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
            {filteredTecnicos.map((tecnico: any) => (
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
                          <DropdownMenuItem onClick={() => handleVerPerfil(tecnico)}>Ver perfil</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(tecnico)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar información
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleVerHorario(tecnico)}>Ver horario</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAsignarOrden(tecnico)}>Asignar orden</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleCambiarDisponibilidad(tecnico, "Disponible")}>
                            Marcar disponible
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCambiarDisponibilidad(tecnico, "Ocupado")}>
                            Marcar ocupado
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCambiarDisponibilidad(tecnico, "Permiso")}>
                            Marcar en permiso
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(tecnico)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
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
                        {tecnico.habilidades.map((habilidad: string, i: number) => (
                          <Badge key={i} variant="outline">
                            {habilidad}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleVerHorario(tecnico)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Ver Horario
                  </Button>
                  <Button size="sm" onClick={() => handleVerPerfil(tecnico)}>
                    Ver Perfil
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="disponibles">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTecnicos
              .filter((tecnico: any) => tecnico.disponibilidad.toLowerCase() === "disponible")
              .map((tecnico: any) => (
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
                      <Badge className={getAvailabilityColor(tecnico.disponibilidad)}>{tecnico.disponibilidad}</Badge>
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
                        </div>
                      </div>
                      <Button className="w-full" onClick={() => handleAsignarOrden(tecnico)}>
                        Asignar Orden
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="ocupados">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTecnicos
              .filter(
                (tecnico: any) =>
                  tecnico.disponibilidad.toLowerCase() === "ocupado" ||
                  tecnico.disponibilidad.toLowerCase() === "permiso",
              )
              .map((tecnico: any) => (
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
                      <Badge className={getAvailabilityColor(tecnico.disponibilidad)}>{tecnico.disponibilidad}</Badge>
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
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleCambiarDisponibilidad(tecnico, "Disponible")}
                      >
                        Marcar como Disponible
                      </Button>
                    </div>
                  </CardContent>
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
                {tecnicos.map((tecnico: any) => (
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
                        <div className="bg-green-100 rounded p-1">{tecnico.horario?.lunes || "8-17"}</div>
                        <div className="bg-green-100 rounded p-1">{tecnico.horario?.martes || "8-17"}</div>
                        <div className="bg-green-100 rounded p-1">{tecnico.horario?.miercoles || "8-17"}</div>
                        <div className="bg-green-100 rounded p-1">{tecnico.horario?.jueves || "8-17"}</div>
                        <div className="bg-green-100 rounded p-1">{tecnico.horario?.viernes || "8-17"}</div>
                        <div className="bg-yellow-100 rounded p-1">{tecnico.horario?.sabado || "8-12"}</div>
                        <div className="bg-red-100 rounded p-1">{tecnico.horario?.domingo || "OFF"}</div>
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
                      <Button variant="ghost" size="sm" onClick={() => handleVerHorario(tecnico)}>
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

      {/* Diálogo de perfil del técnico */}
      <Dialog open={openPerfilDialog} onOpenChange={setOpenPerfilDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Perfil del Técnico</DialogTitle>
          </DialogHeader>
          {selectedTecnico && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedTecnico.foto || "/placeholder.svg"} alt={selectedTecnico.nombre} />
                  <AvatarFallback>{selectedTecnico.nombre.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedTecnico.nombre}</h3>
                  <p className="text-muted-foreground">{selectedTecnico.especialidad}</p>
                  <Badge className={getAvailabilityColor(selectedTecnico.disponibilidad)}>
                    {selectedTecnico.disponibilidad}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Información de Contacto</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      {selectedTecnico.telefono}
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      {selectedTecnico.email}
                    </div>
                    <div className="flex items-start">
                      <span className="h-4 w-4 mr-2 text-muted-foreground">📍</span>
                      {selectedTecnico.direccion}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Estadísticas</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Experiencia:</span>
                      <span className="font-medium">{selectedTecnico.experiencia}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Calificación:</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="font-medium">{selectedTecnico.calificacion}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Órdenes completadas:</span>
                      <span className="font-medium">{selectedTecnico.ordenes_completadas}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Habilidades</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTecnico.habilidades.map((habilidad: string, i: number) => (
                    <Badge key={i} variant="secondary">
                      {habilidad}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Certificaciones</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTecnico.certificaciones.map((cert: string, i: number) => (
                    <Badge key={i} variant="outline">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de horario del técnico */}
      <Dialog open={openHorarioDialog} onOpenChange={setOpenHorarioDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Horario de {selectedTecnico?.nombre}</DialogTitle>
          </DialogHeader>
          {selectedTecnico && (
            <div className="space-y-4">
              <div className="grid gap-3">
                {Object.entries(selectedTecnico.horario || {}).map(([dia, horario]) => (
                  <div key={dia} className="flex justify-between items-center p-2 border rounded">
                    <span className="font-medium capitalize">{dia}</span>
                    <span className="text-muted-foreground">{horario}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    toast({
                      title: "Editar horario",
                      description: "Funcionalidad de edición de horario en desarrollo",
                    })
                  }}
                >
                  Editar Horario
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de edición del técnico */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Técnico</DialogTitle>
            <DialogDescription>Modifica la información del técnico.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateTecnico}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nombre">Nombre Completo</Label>
                  <Input
                    id="edit-nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-especialidad">Especialidad</Label>
                  <Select
                    value={formData.especialidad}
                    onValueChange={(value) => setFormData({ ...formData, especialidad: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mecánica General">Mecánica General</SelectItem>
                      <SelectItem value="Electrónica Automotriz">Electrónica Automotriz</SelectItem>
                      <SelectItem value="Carrocería y Pintura">Carrocería y Pintura</SelectItem>
                      <SelectItem value="Diagnóstico">Diagnóstico</SelectItem>
                      <SelectItem value="Transmisiones">Transmisiones</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-experiencia">Experiencia</Label>
                  <Input
                    id="edit-experiencia"
                    value={formData.experiencia}
                    onChange={(e) => setFormData({ ...formData, experiencia: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-telefono">Teléfono</Label>
                  <Input
                    id="edit-telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Correo Electrónico</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-disponibilidad">Disponibilidad</Label>
                  <Select
                    value={formData.disponibilidad}
                    onValueChange={(value) => setFormData({ ...formData, disponibilidad: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Disponible">Disponible</SelectItem>
                      <SelectItem value="Ocupado">Ocupado</SelectItem>
                      <SelectItem value="Permiso">En Permiso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-direccion">Dirección</Label>
                <Input
                  id="edit-direccion"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-habilidades">Habilidades</Label>
                <Textarea
                  id="edit-habilidades"
                  value={formData.habilidades}
                  onChange={(e) => setFormData({ ...formData, habilidades: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-certificaciones">Certificaciones</Label>
                <Textarea
                  id="edit-certificaciones"
                  value={formData.certificaciones}
                  onChange={(e) => setFormData({ ...formData, certificaciones: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenEditDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit">Actualizar Técnico</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
