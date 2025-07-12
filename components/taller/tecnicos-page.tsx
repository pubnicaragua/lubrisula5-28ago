"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import TECNICO_SERVICES, { TecnicoCertificacionType, TecnicoConDetallesType, TecnicoHabilidadType, TecnicoHorarioType } from "@/services/TECNICO_SERVICES.SERVICE"

export function TecnicosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [tecnicos, setTecnicos] = useState<any[]>([])
  const [State_Tecnicos, SetState_Tecnicos] = useState<TecnicoConDetallesType[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [openPerfilDialog, setOpenPerfilDialog] = useState(false)
  const [openHorarioDialog, setOpenHorarioDialog] = useState(false)
  const [OpenEditHorarioDialog, SetOpenEditHorarioDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [selectedTecnico, setSelectedTecnico] = useState<TecnicoConDetallesType>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [State_EditHorario, SetState_EditHorario] = useState<TecnicoHorarioType[]>([])
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    especialidad: "",
    cargo: "",
    experiencia: "",
    telefono: "",
    email: "",
    direccion: "",
    habilidades: "",
    certificaciones: "",
    disponibilidad: "Disponible"
  })

  const FN_GET_TECNICOS = async () => {
    const data = await TECNICO_SERVICES.GET_ALL_DETALLE_TECNICOS();
    SetState_Tecnicos(data)
  }


  const saveTecnicos = (newTecnicos: any[]) => {
    setTecnicos(newTecnicos)
    try {
      localStorage.setItem("mockTecnicos", JSON.stringify(newTecnicos))
    } catch (error) {
      console.error("Error guardando en localStorage:", error)
    }
  }

  const getAvailabilityColor = (status: boolean) => {
    switch (status) {
      case true:
        return "bg-green-100 text-green-800"
      case false:
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTecnicos: TecnicoConDetallesType[] = State_Tecnicos.filter(
    (tecnico) =>
      tecnico.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tecnico.area.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const horario = {
      lunes: "8:00-17:00",
      martes: "8:00-17:00",
      miercoles: "8:00-17:00",
      jueves: "8:00-17:00",
      viernes: "8:00-17:00",
      sabado: "8:00-12:00",
      domingo: "Descanso",
    }
    const habilidades: string[] = formData.habilidades.split(",").map((h) => h.trim());
    const certificaciones: string[] = formData.certificaciones.split(",").map((c) => c.trim());
    // const nuevoTecnico = {
    //   id: Date.now(),
    //   nombre: formData.nombre,
    //   especialidad: formData.especialidad,
    //   experiencia: formData.experiencia,
    //   telefono: formData.telefono,
    //   email: formData.email,
    //   direccion: formData.direccion,
    //   habilidades: formData.habilidades.split(",").map((h) => h.trim()),
    //   certificaciones: formData.certificaciones.split(",").map((c) => c.trim()),
    //   disponibilidad: formData.disponibilidad,
    //   calificacion: 4.0,
    //   ordenes_completadas: 0,
    //   foto: `/placeholder.svg?height=100&width=100&text=${formData.nombre
    //     .split(" ")
    //     .map((n) => n[0])
    //     .join("")}`,
    //   horario: {
    //     lunes: "8:00-17:00",
    //     martes: "8:00-17:00",
    //     miercoles: "8:00-17:00",
    //     jueves: "8:00-17:00",
    //     viernes: "8:00-17:00",
    //     sabado: "8:00-12:00",
    //     domingo: "Descanso",
    //   },
    // }
    const horarioArray = Object.entries(horario).map(([dia, horario]) => ({
      // tecnico_id,
      dia: dia.charAt(0).toUpperCase() + dia.slice(1), // Capitaliza el día
      horario,
    }));
    await TECNICO_SERVICES.INSERT_TECNICO({
      info: {
        nombre: formData.nombre,
        apellido: formData.apellido,
        area: formData.especialidad,
        cant_ordenes_completadas: 0,
        cargo: formData.cargo,
        direccion: formData.direccion,
        disponible: true,
        email: formData.email,
        telefono: formData.telefono,
        tiempo_experciencia: formData.experiencia,
        calificacion: 5.5
      },
      habilidades: habilidades,
      horarios: horarioArray,
      certificaciones
    })
    await FN_GET_TECNICOS()
    setFormData({
      nombre: "",
      apellido: "",
      especialidad: "",
      cargo: "",
      experiencia: "",
      telefono: "",
      email: "",
      direccion: "",
      habilidades: "",
      certificaciones: "",
      disponibilidad: "Disponible"

    })

    setOpenDialog(false)
    setIsLoading(false)
  }

  const handleEdit = (tecnicoData: TecnicoConDetallesType) => {
    setSelectedTecnico(tecnicoData)
    setFormData({
      nombre: tecnicoData.nombre,
      apellido: tecnicoData.apellido,
      cargo: tecnicoData.cargo,
      especialidad: tecnicoData.area,
      experiencia: tecnicoData.tiempo_experciencia,
      telefono: tecnicoData.telefono,
      email: tecnicoData.email,
      direccion: tecnicoData.direccion,
      habilidades: tecnicoData.tecnicos_habilidades.map(hab => hab.habilidad).toString(),
      certificaciones: tecnicoData.tecnicos_certificaciones.map(cert => cert.certificacion).toString(),
      disponibilidad: tecnicoData.estado
    })
    setOpenEditDialog(true)
  }

  const handleUpdateTecnico = async (e: React.FormEvent) => {
    e.preventDefault()
    const horario = {
      lunes: "8:00-17:00",
      martes: "8:00-17:00",
      miercoles: "8:00-17:00",
      jueves: "8:00-17:00",
      viernes: "8:00-17:00",
      sabado: "8:00-12:00",
      domingo: "Descanso",
    }
    setIsLoading(true)
    const horarioArray = Object.entries(horario).map(([dia, horario]) => ({
      // tecnico_id,
      dia: dia.charAt(0).toUpperCase() + dia.slice(1), // Capitaliza el día
      horario,
    }));
    const habilidades: string[] = formData.habilidades.split(",").map((h) => h.trim());
    const certificaciones: string[] = formData.certificaciones.split(",").map((c) => c.trim());
    const NewHabilidades: TecnicoHabilidadType[] = habilidades.map(hab => ({ tecnico_id: selectedTecnico.id, habilidad: hab }))
    const NewCertificaciones: TecnicoCertificacionType[] = certificaciones.map(cert => ({ tecnico_id: selectedTecnico.id, certificacion: cert }))
    await TECNICO_SERVICES.UPDATE_TECNICO({
      info: {
        id: selectedTecnico.id,
        nombre: formData.nombre,
        apellido: formData.apellido,
        area: formData.especialidad,
        cant_ordenes_completadas: 0,
        cargo: formData.cargo,
        direccion: formData.direccion,
        disponible: true,
        email: formData.email,
        telefono: formData.telefono,
        tiempo_experciencia: formData.experiencia,
        calificacion: 5.5
      },
      habilidades: NewHabilidades,
      horarios: horarioArray,
      certificaciones: NewCertificaciones
    })
    await FN_GET_TECNICOS()
    setOpenEditDialog(false)
    setIsLoading(false)
    toast({
      title: "Técnico actualizado",
      description: "La información del técnico ha sido actualizada",
    })
  }
  const FN_CONFIRM_DELETE_TECNICO = async () => {
    setIsLoading(true)
    await TECNICO_SERVICES.DELETE_TECNICO(selectedTecnico.id)
    await FN_GET_TECNICOS()
    setIsLoading(false)
    setIsDeleteDialogOpen(false)
  }
  const FN_UPDATE_HORARIO_TECNICO = async (horarios: TecnicoHorarioType[]) => {
    setIsLoading(true)
    await TECNICO_SERVICES.UPDATE_HORARIO_TECNICO(horarios);
    await FN_GET_TECNICOS()
    setIsLoading(false)
    SetOpenEditHorarioDialog(false)
    setOpenHorarioDialog(false)
  }
  const handleDelete = (tecnico: TecnicoConDetallesType) => {
    setIsLoading(false)
    setSelectedTecnico(tecnico)
    setIsDeleteDialogOpen(true)
  }

  const handleVerPerfil = (tecnico: TecnicoConDetallesType) => {
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
  const FN_RESET_FORM = () => {
    setFormData({
      nombre: "",
      apellido: "",
      especialidad: "",
      cargo: "",
      experiencia: "",
      telefono: "",
      email: "",
      direccion: "",
      habilidades: "",
      certificaciones: "",
      disponibilidad: "Disponible",
    })
  }

  useEffect(() => {
    FN_GET_TECNICOS()
  }, [])
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
              <Button className="rounded-full" onClick={FN_RESET_FORM}>
                <Plus className="mr-2 h-4 w-4" /> Nuevo Técnico
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[600px] h-[100vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Técnico</DialogTitle>
                <DialogDescription>Complete los datos para agregar un nuevo técnico al equipo.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        placeholder="Nombre y apellidos"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellido">Apeliidos</Label>
                      <Input
                        id="apellido"
                        placeholder="Nombre y apellidos"
                        value={formData.apellido}
                        onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                        required
                      />
                    </div>


                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="especialidad">Especialidad</Label>
                      <Select
                        value={formData.cargo}
                        onValueChange={(value) => setFormData({ ...formData, cargo: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar especialidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Técnico Senior">Técnico Senior</SelectItem>
                          <SelectItem value="Técnico">Técnico</SelectItem>
                        </SelectContent>
                      </Select>
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
            {filteredTecnicos.map((tecnico) => (
              <Card key={tecnico.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={"/placeholder.svg"} alt={tecnico.nombre} />
                        <AvatarFallback>{tecnico.nombre.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{tecnico.nombre}</CardTitle>
                        <CardDescription>{tecnico.area}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getAvailabilityColor(tecnico.disponible)}>{tecnico.disponible ? 'Diponible' : 'Ocupado'}</Badge>
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
                        <span className="font-medium text-foreground">{tecnico.cant_ordenes_completadas}</span> órdenes
                        completadas
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">Experiencia:</span>
                        <span className="ml-1 font-medium">{tecnico.tiempo_experciencia}</span>
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
                        {tecnico?.tecnicos_habilidades?.map((habilidad, index) => (
                          <Badge key={habilidad.id} variant="outline">
                            {habilidad.habilidad}
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
              .filter((tecnico) => tecnico.disponible === true)
              .map((tecnico) => (
                <Card key={tecnico.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={"/placeholder.svg"} alt={tecnico.nombre} />
                          <AvatarFallback>{tecnico.nombre.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{tecnico.nombre}</CardTitle>
                          <CardDescription>{tecnico.area}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getAvailabilityColor(tecnico.disponible)}>{tecnico.disponible ? 'Disponible' : 'Ocupado'}</Badge>
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
                          <span className="font-medium text-foreground">{tecnico.cant_ordenes_completadas}</span> órdenes
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
                (tecnico) => tecnico.disponible === false)
              .map((tecnico) => (
                <Card key={tecnico.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={"/placeholder.svg"} alt={tecnico.nombre} />
                          <AvatarFallback>{tecnico.nombre.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{tecnico.nombre}</CardTitle>
                          <CardDescription>{tecnico.area}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getAvailabilityColor(tecnico.disponible)}>Ocupado</Badge>
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
                          <span className="font-medium text-foreground">{tecnico.cant_ordenes_completadas}</span> órdenes
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
                {State_Tecnicos.map((tecnico) => (
                  <div key={tecnico.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={"/placeholder.svg"} alt={tecnico.nombre} />
                          <AvatarFallback>{tecnico.nombre.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-sm font-medium">{tecnico.nombre}</h4>
                          <p className="text-xs text-muted-foreground">{tecnico.area}</p>
                        </div>
                      </div>
                      <Badge className={getAvailabilityColor(tecnico.disponible)}>{tecnico.disponible ? 'Disponible' : 'ocupado'}</Badge>
                    </div>
                    <div className="bg-muted p-2 rounded-md">
                      <div className="grid grid-cols-7 gap-1 text-xs text-center">
                        {
                          tecnico.tecnicos_horarios.map(horario => (
                            <aside key={horario.id}>

                              <div className="font-medium">{horario.dia}</div>
                              <div className={`${horario.horario === 'Descanso' ? 'bg-red-100' : 'bg-green-100'} rounded p-1 text-black`}>{horario.horario}</div>
                            </aside>

                          ))
                        }
                        {/* <div className="font-medium">Mar</div>
                        <div className="font-medium">Mié</div>
                        <div className="font-medium">Jue</div>
                        <div className="font-medium">Vie</div>
                        <div className="font-medium">Sáb</div>
                        <div className="font-medium">Dom</div>
                        <div className="bg-green-100 rounded p-1">{tecnico.horario?.martes || "8-17"}</div>
                        <div className="bg-green-100 rounded p-1">{tecnico.horario?.miercoles || "8-17"}</div>
                        <div className="bg-green-100 rounded p-1">{tecnico.horario?.jueves || "8-17"}</div>
                        <div className="bg-green-100 rounded p-1">{tecnico.horario?.viernes || "8-17"}</div>
                        <div className="bg-yellow-100 rounded p-1">{tecnico.horario?.sabado || "8-12"}</div>
                        <div className="bg-red-100 rounded p-1">{tecnico.horario?.domingo || "OFF"}</div> */}
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
        <DialogContent className="max-w-2xl max-h-3xl">
          <DialogHeader>
            <DialogTitle>Perfil del Técnico</DialogTitle>
          </DialogHeader>
          {selectedTecnico && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={"/placeholder.svg"} alt={selectedTecnico.nombre} />
                  <AvatarFallback>{selectedTecnico.nombre.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedTecnico.nombre}</h3>
                  <p className="text-muted-foreground">{selectedTecnico.area}</p>
                  <Badge className={getAvailabilityColor(selectedTecnico.disponible)}>
                    {selectedTecnico.disponible ? 'Disponible' : 'Ocupado'}
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
                      <span className="font-medium">{selectedTecnico.tiempo_experciencia}</span>
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
                      <span className="font-medium">{selectedTecnico.cant_ordenes_completadas}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Habilidades</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTecnico.tecnicos_habilidades.map((habilidad) => (
                    <Badge key={habilidad.id} variant="secondary">
                      {habilidad.habilidad}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Certificaciones</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTecnico?.tecnicos_certificaciones?.map((cert) => (
                    <Badge key={cert.id} variant="outline">
                      {cert.certificacion}
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
                {selectedTecnico.tecnicos_horarios.map(horario => (
                  <div key={horario.dia} className="flex justify-between items-center p-2 border rounded">
                    <span className="font-medium capitalize">{horario.dia}</span>
                    <span className="text-muted-foreground">{horario.horario}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => { SetOpenEditHorarioDialog(true); SetState_EditHorario(selectedTecnico.tecnicos_horarios) }}
                >
                  Editar Horario
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Diálogo de editar horario del técnico */}
      <Dialog open={OpenEditHorarioDialog} onOpenChange={SetOpenEditHorarioDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Horario de {selectedTecnico?.nombre}</DialogTitle>
          </DialogHeader>
          {selectedTecnico && (
            <div className="space-y-4">
              <div className="grid gap-3">
                {State_EditHorario.map(horario => (
                  <div className="space-y-2" key={horario.dia}>
                    <Label htmlFor={horario.dia}>{horario.dia}</Label>
                    <Input
                      id={horario.dia}
                      placeholder={horario.dia}
                      value={horario.horario}
                      onChange={(e) => SetState_EditHorario((prev) => prev.map(h => h.dia === horario.dia ? { ...h, horario: e.target.value } : h))}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button
                  disabled={isLoading}
                  onClick={() => FN_UPDATE_HORARIO_TECNICO(State_EditHorario)}
                >
                  {isLoading ? 'Procesando' : 'Actualizar horario'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de edición del técnico */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="max-w-[600px] h-[100vh] overflow-auto">
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
              <Button type="submit" disabled={isLoading}>{isLoading ? 'Procesando' : 'Actualizar Técnico'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar al tecnico {selectedTecnico?.nombre} {selectedTecnico?.apellido}? Esta acción aliminara habilidades, certificaciones, ordenes de trabajo y facturas relacionadas a este tecnico❌.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button disabled={isLoading} variant="destructive" onClick={() => FN_CONFIRM_DELETE_TECNICO()}>
              {isLoading ? 'Procesando' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
