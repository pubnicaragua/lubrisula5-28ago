"use client"

import { useEffect, useState } from "react"
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

import SERVICIOS_SERVICES, { ServicioType, PaqueteServicioType } from "@/services/SERVICIOS.SERVICE"
import FormNuevoServicio from "./Form_Nuevo_Servicio"
import FormActualizarServicio from "./Form_Actualizar_Servicio"
import FormNuevoPaqueteServicio from "./Form_NuevoPaqueteServicio"

export function ServiciosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [State_OpenDIalogActualizarServ, SetState_OpenDIalogActualizarServ] = useState(false)
  const [State_Services, SetState_Services] = useState<ServicioType[]>([])
  const [State_PaqueteServices, SetState_PaqueteServices] = useState<PaqueteServicioType[]>([])
  const [State_ServiceSelected, SetState_ServiceSelected] = useState<ServicioType>({})

  const FN_GET_SERVICIOS = async () => {
    const servicios = await SERVICIOS_SERVICES.GET_ALL_SERVICIOS()
    const paquetes = await SERVICIOS_SERVICES.GET_ALL_PAQUETES_SERVICIOS()
    SetState_PaqueteServices(paquetes)
    console.log(servicios)
    SetState_Services(servicios)
  }

  const FN_SUCCESS_NUEVO_SERVICIO = (nuevoServ: ServicioType) => {
    FN_GET_SERVICIOS()
  }
  const FN_SUCCESS_ACTUALIZAR_SERVICIO = (nuevoServ: ServicioType) => {
    FN_GET_SERVICIOS()
  }
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

  const filteredServicios = State_Services.filter(
    (servicio) =>
      servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servicio.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servicio.categorias_servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const ListItemsComponent = ({ serv }: { serv: ServicioType[] }) => (

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {serv.map((servicio) => (
        <Card key={servicio.id} className={`overflow-hidden ${!servicio.estado ? "opacity-60" : ""}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{servicio.nombre}</CardTitle>
                <CardDescription>SERV - {servicio.id}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getCategoryColor(servicio.categorias_servicio.nombre)}>{servicio.categorias_servicio.nombre}</Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => { SetState_ServiceSelected(servicio); SetState_OpenDIalogActualizarServ(true) }}>Editar servicio</DropdownMenuItem>
                    <DropdownMenuItem>Ver historial</DropdownMenuItem>
                    <DropdownMenuItem>Agregar a paquete</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {servicio.estado ? (
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
                  <span className="font-medium">{servicio.tiempo_estimado} {servicio.tipo_tiempo_estimado}</span>
                </div>
              </div>

              {servicio.materiales.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium mb-2">Materiales:</h4>
                    <div className="flex flex-wrap gap-1">
                      {servicio.materiales.split(",").map((material, i) => (
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
  )

  const ComponentPaquetes = ({ paquetes }: { paquetes: PaqueteServicioType[] }) => {
    return (
      <article>
        {
          paquetes.map((paq) => (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{paq?.nombre}</CardTitle>
                    <CardDescription>PKG-{paq?.id}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">{paq?.categorias_servicio?.nombre}</Badge>
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
                      <span className="font-medium">${paq?.precio}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="font-medium">{paq?.timpo_estimado} {paq?.tipo_tiempo_estimado}</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium mb-2">Servicios incluidos:</h4>
                    <div className="space-y-2">
                      {
                        paq?.servicios?.map((serv) => (
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Wrench className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>SERV - {serv.id} - {serv.nombre}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">${serv.precio}</span>
                          </div>
                        ))
                      }

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
          ))
        }

      </article>

    )
  }

  useEffect(() => {
    FN_GET_SERVICIOS()
  }, [])

  return (
    <main className="container mx-auto p-2 overflow-auto">
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
          <FormNuevoServicio onSuccess={FN_SUCCESS_NUEVO_SERVICIO} />
         <FormNuevoPaqueteServicio />

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
          <ListItemsComponent serv={filteredServicios} />
        </TabsContent>

        <TabsContent value="mantenimiento">
          <ListItemsComponent serv={filteredServicios.filter((servicio) => servicio.categorias_servicio.nombre.toLowerCase() === "mantenimiento" && servicio.estado)} />
        </TabsContent>

        <TabsContent value="reparacion">
          <ListItemsComponent serv={filteredServicios.filter((servicio) => servicio.categorias_servicio.nombre.toLowerCase() === "reparacion" && servicio.estado)} />
        </TabsContent>

        <TabsContent value="diagnostico">
          <ListItemsComponent serv={filteredServicios.filter((servicio) => servicio.categorias_servicio.nombre.toLowerCase() === "diagnostico" && servicio.estado)} />
        </TabsContent>

        <TabsContent value="paquetes">
          <Card>
            <CardHeader>
              <CardTitle>Paquetes de Servicio</CardTitle>
              <CardDescription>Paquetes predefinidos que combinan múltiples servicios</CardDescription>

            </CardHeader>
            <CardContent>
              <div className="space-y-6">

                {
                  State_PaqueteServices.length > 0 ?
                    <ComponentPaquetes paquetes={State_PaqueteServices} />
                    : <div>No hay paquetes</div>
                }


              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <FormActualizarServicio onSuccess={FN_SUCCESS_ACTUALIZAR_SERVICIO} openDialog={State_OpenDIalogActualizarServ} setOpenDialog={SetState_OpenDIalogActualizarServ} servicio_id={State_ServiceSelected.id} />
    </main>
    // <TallerLayout>

    // </TallerLayout>
  )
}
