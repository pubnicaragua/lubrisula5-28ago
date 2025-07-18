"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Clock, Wrench, DollarSign, Edit } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import TALLER_CONFIG_SERVICES, { type TallerConfigType } from "@/services/TALLER_CONFIG_SERVICES.service"
import { TallerType } from "@/services/TALLER_SERVICES.SERVICE"
import SERVICIOS_SERVICES, { ServicioType } from "@/services/SERVICIOS.SERVICE"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { Badge } from "../ui/badge"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import paises from "./paises.json"
export function ConfiguracionTaller() {
  const [config, setConfig] = useState<TallerType>({})
  const [State_Servicios, SetState_Servicios] = useState<ServicioType[]>([])
  const [loading, setLoading] = useState(false)
  const [Cambios, SetCambios] = useState(false)

  const route = useRouter()



  const FN_GET_CONFIG = async () => {
    try {
      setLoading(true)
      // Obtener taller_id del usuario actual  
      const taller_id = localStorage.getItem('taller_id') // Reemplazar con lógica real  
      const data = await TALLER_CONFIG_SERVICES.GET_CONFIGURACION_TALLER(taller_id)
      console.log("Configuración cargada:", data)
      setConfig(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la configuración",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const FN_SAVE_CONFIG = async () => {
    try {
      setLoading(true)
      if (config.id) {
        await TALLER_CONFIG_SERVICES.UPDATE_CONFIGURACION_TALLER(config)
      }
      await FN_GET_CONFIG()
      toast({
        title: "Éxito",
        description: "Configuración guardada correctamente"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  const FN_GET_SERVICIOS = async () => {

    const res = await SERVICIOS_SERVICES.GET_ALL_SERVICIOS()
    SetState_Servicios(res)
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
  useEffect(() => {
    FN_GET_CONFIG()
    FN_GET_SERVICIOS()
  }, [])
  useEffect(() => {
    SetCambios(true)
  }, [config])
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Configuración del Taller
          </h1>
          <p className="text-muted-foreground">
            Personaliza la configuración de tu taller
          </p>
        </div>
        <Button onClick={FN_SAVE_CONFIG} disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Configuracion'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="horarios">Horarios</TabsTrigger>
          <TabsTrigger value="servicios">Servicios</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
              <CardDescription>
                Configura la información básica de tu taller
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre_taller">Nombre del Taller</Label>
                  <Input
                    id="nombre_taller"
                    value={config.nombre || ""}
                    onChange={(e) => setConfig({ ...config, nombre: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={config.telefono || ""}
                    onChange={(e) => setConfig({ ...config, telefono: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={config.direccion || ""}
                  onChange={(e) => setConfig({ ...config, direccion: e.target.value })}
                />
              </div>
              <aside className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={config.email || ""}
                    onChange={(e) => setConfig({ ...config, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pais">Pais</Label>
                  <Select value={config?.pais} onValueChange={(value) => setConfig({ ...config, pais: value })}>
                    <SelectTrigger id="pais">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent id="pais">
                      {
                        paises.paises_america.map((pais) => (
                          <SelectItem key={pais} value={pais}>{pais}</SelectItem>
                        )
                        )
                      }
                    </SelectContent>
                  </Select>

                </div>
              </aside>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="horarios">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horarios de Atención
              </CardTitle>
              <CardDescription>
                Configura los horarios de atención del taller
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="horario_apertura">Hora de Apertura</Label>
                  <Input
                    id="horario_apertura"
                    type="time"
                    value={config.hora_apertura || ""}
                    onChange={(e) => setConfig({ ...config, hora_apertura: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horario_cierre">Hora de Cierre</Label>
                  <Input
                    id="horario_cierre"
                    type="time"
                    value={config.hora_cierre || ""}
                    onChange={(e) => setConfig({ ...config, hora_cierre: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="servicios">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Servicios Disponibles
                <Button variant="outline" onClick={() => route.push('/taller/servicios')} disabled={loading}>
                  Administrar Servicios
                </Button>
              </CardTitle>
              <CardDescription>
                Configura los servicios que ofrece tu taller
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {
                  State_Servicios.map((servicio) => (
                    <Card key={servicio.id} className={`overflow-hidden ${!servicio.activo ? "opacity-60" : ""}`}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{servicio.nombre}</CardTitle>
                            <CardDescription>SERV - {servicio.id}</CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getCategoryColor(servicio.categorias_servicio.nombre)}>{servicio.categorias_servicio.nombre}</Badge>

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
                      {/* <CardFooter className="flex justify-between">
                              <Button variant="outline" size="sm" onClick={() => { SetState_ServiceSelected(servicio); SetState_OpenDIalogActualizarServ(true) }}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </Button>
                              <Button size="sm">Agregar a Orden</Button>
                            </CardFooter> */}
                    </Card>
                  ))
                }
              </div>

            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
