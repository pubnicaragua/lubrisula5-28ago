"use client"  
  
import { useState, useEffect } from "react"  
import { Button } from "@/components/ui/button"  
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"  
import { Input } from "@/components/ui/input"  
import { Label } from "@/components/ui/label"  
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"  
import { Settings, Clock, Wrench } from "lucide-react"  
import { toast } from "@/components/ui/use-toast"  
import TALLER_CONFIG_SERVICES, { type TallerConfigType } from "@/services/TALLER_CONFIG_SERVICES.service"  
  
export function ConfiguracionTaller() {  
  const [config, setConfig] = useState<TallerConfigType>({})  
  const [loading, setLoading] = useState(false)  
  
  useEffect(() => {  
    loadConfiguracion()  
  }, [])  
  
  const loadConfiguracion = async () => {  
    try {  
      setLoading(true)  
      // Obtener taller_id del usuario actual  
      const taller_id = "current-taller-id" // Reemplazar con lógica real  
      const data = await TALLER_CONFIG_SERVICES.GET_CONFIGURACION_TALLER(taller_id)  
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
  
  const handleSave = async () => {  
    try {  
      setLoading(true)  
      if (config.id) {  
        await TALLER_CONFIG_SERVICES.UPDATE_CONFIGURACION_TALLER(config)  
      } else {  
        await TALLER_CONFIG_SERVICES.INSERT_CONFIGURACION_TALLER(config)  
      }  
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
        <Button onClick={handleSave} disabled={loading}>  
          Guardar Configuración  
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
                    value={config.nombre_taller || ""}  
                    onChange={(e) => setConfig({...config, nombre_taller: e.target.value})}  
                  />  
                </div>  
                <div className="space-y-2">  
                  <Label htmlFor="telefono">Teléfono</Label>  
                  <Input  
                    id="telefono"  
                    value={config.telefono || ""}  
                    onChange={(e) => setConfig({...config, telefono: e.target.value})}  
                  />  
                </div>  
              </div>  
              <div className="space-y-2">  
                <Label htmlFor="direccion">Dirección</Label>  
                <Input  
                  id="direccion"  
                  value={config.direccion || ""}  
                  onChange={(e) => setConfig({...config, direccion: e.target.value})}  
                />  
              </div>  
              <div className="space-y-2">  
                <Label htmlFor="email">Email</Label>  
                <Input  
                  id="email"  
                  type="email"  
                  value={config.email || ""}  
                  onChange={(e) => setConfig({...config, email: e.target.value})}  
                />  
              </div>  
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
                    value={config.horario_apertura || ""}  
                    onChange={(e) => setConfig({...config, horario_apertura: e.target.value})}  
                  />  
                </div>  
                <div className="space-y-2">  
                  <Label htmlFor="horario_cierre">Hora de Cierre</Label>  
                  <Input  
                    id="horario_cierre"  
                    type="time"  
                    value={config.horario_cierre || ""}  
                    onChange={(e) => setConfig({...config, horario_cierre: e.target.value})}  
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
              </CardTitle>  
              <CardDescription>  
                Configura los servicios que ofrece tu taller  
              </CardDescription>  
            </CardHeader>  
            <CardContent>  
              <p className="text-sm text-muted-foreground">  
                Configuración de servicios en desarrollo...  
              </p>              </CardContent>  
          </Card>  
        </TabsContent>  
      </Tabs>  
    </div>  
  )  
}
