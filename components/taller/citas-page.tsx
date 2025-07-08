"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import { Separator } from "@/components/ui/separator"
import { Search, Filter, Plus, Clock, User, Car, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import CITAS_SERVICES, { CitasDetalleType } from "@/services/CITAS.SERVICE"
import Form_NuevaCita from "./Form_Nueva_CIta"
import Form_Update_Cita from "./Form-Update_Cita"

export function CitasPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [State_DialogEdit, SetState_DialogEdit] = useState(false)
  const [State_DialogDelete, SetState_DialogDelete] = useState(false)
  const [State_DialogConfirm, SetState_DialogConfirm] = useState(false)
  const [State_Citas, SetState_Citas] = useState<CitasDetalleType[]>([])
  const [State_CitaSelected, SetState_CitaSelected] = useState<CitasDetalleType>({})
  const [State_IsEditingCita, SetState_IsEditingCita] = useState<boolean>(false)
  const [State_IsTriggerDialog, SetState_IsTriggerDialog] = useState<boolean>(true)

  const FN_GET_ALL_CITAS = async () => {
    const res = await CITAS_SERVICES.GET_ALL_CITAS()
    SetState_Citas(res)
  }
  const FN_DELETE_CITA = async (cita_id: string) => {
    await CITAS_SERVICES.DELETE_CITA(cita_id)
    SetState_DialogDelete(false)
    FN_GET_ALL_CITAS()
  }
  const FN_CONFIRMAR_CITA = async (cita_id: string) => {
    await CITAS_SERVICES.CONFIRMAR_CITA(cita_id)
    SetState_DialogConfirm(false)
    FN_GET_ALL_CITAS()

  }

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

  const filteredCitas = State_Citas.filter(
    (cita) =>
      cita.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.clients.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.vehicles.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.vehicles.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.vehicles.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.hora_inicio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.tecnicos.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const citasPorFecha: { [key: string]: CitasDetalleType[] } = {}
  filteredCitas.forEach((cita) => {
    if (!citasPorFecha[cita.fecha]) {
      citasPorFecha[cita.fecha] = []
    }
    citasPorFecha[cita.fecha].push(cita)
  })

  useEffect(() => {
    FN_GET_ALL_CITAS()
  }, [])

  return (
    <main className="container mx-auto overflow-auto h-full">
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
          <Form_NuevaCita onSucces={FN_GET_ALL_CITAS} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Citas</CardTitle>
          <CardDescription>Visualiza todas las citas programadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {
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
                            {cita.fecha} - {cita.hora_inicio}
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
                            <DropdownMenuItem onClick={() => { SetState_DialogEdit(true); SetState_CitaSelected(cita) }}>Editar cita</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { SetState_DialogConfirm(true); SetState_CitaSelected(cita) }}>Confirmar cita</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => { SetState_DialogDelete(true); SetState_CitaSelected(cita) }} >Cancelar cita</DropdownMenuItem>
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
                        <p>{cita.clients.name}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Car className="mr-2 h-4 w-4" />
                          <span className="font-medium text-foreground">Vehículo:</span>
                        </div>
                        <p>
                          {cita.vehicles.marca} {cita.vehicles.modelo} {cita.vehicles.placa}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="mr-2 h-4 w-4" />
                          <span className="font-medium text-foreground">Técnico:</span>
                        </div>
                        <p>{cita.tecnicos.nombre}</p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium mb-1">Servicios:</p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline">
                            {cita.tipos_operacion.nombre}
                          </Badge>

                        </div>
                      </div>
                      <Button variant="outline">Ver Detalles</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            }
          </div>
        </CardContent>
      </Card>
      {/* <Form_NuevaCita
        IsUpdate={true}
        trigger={false}
        openDialog={openDialog}
        UpdateData={{
          client_id: State_CitaSelected?.client_id,
          created_at: State_CitaSelected?.created_at,
          estado: State_CitaSelected?.estado,
          fecha: State_CitaSelected?.fecha,
          hora_fin: State_CitaSelected?.hora_fin,
          hora_inicio: State_CitaSelected?.hora_inicio,
          id: State_CitaSelected?.id,
          nota: State_CitaSelected?.nota,
          tecnico_id: State_CitaSelected?.tecnico_id,
          tipo_servicio_id: State_CitaSelected?.tipo_servicio_id,
          updated_at: State_CitaSelected?.updated_at,
          vehiculo_id: State_CitaSelected?.vehiculo_id
        }}
        setOpenDialog={(open) => setOpenDialog(open)}
        onSucces={FN_GET_ALL_CITAS}
      /> */}

      <Form_Update_Cita open={State_DialogEdit} cita_id={State_CitaSelected.id} setOpen={SetState_DialogEdit} onSucces={FN_GET_ALL_CITAS} />


      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={State_DialogDelete} onOpenChange={SetState_DialogDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la cita de {State_CitaSelected?.clients?.name} para el dia
              <strong> {State_CitaSelected?.fecha}</strong> del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => FN_DELETE_CITA(State_CitaSelected?.id)}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={State_DialogConfirm} onOpenChange={SetState_DialogConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar Cita de {State_CitaSelected?.clients?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              se marcara esta cita como confirmada.
            </AlertDialogDescription>

          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => SetState_DialogConfirm(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => FN_CONFIRMAR_CITA(State_CitaSelected?.id)}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
    // <TallerLayout>
    // </TallerLayout>


  )
}

{/* 
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
        
          </TabsContent>
        </Tabs> */}