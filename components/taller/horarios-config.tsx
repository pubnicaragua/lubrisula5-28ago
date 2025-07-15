"use client"  
  
import { useState, useEffect } from "react"  
import { Button } from "@/components/ui/button"  
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"  
import { Input } from "@/components/ui/input"  
import { Label } from "@/components/ui/label"  
import { Switch } from "@/components/ui/switch"  
import { Clock, Save } from "lucide-react"  
import { toast } from "@/components/ui/use-toast"  
import TALLER_CONFIG_SERVICES, { type TallerConfigType } from "@/services/TALLER_CONFIG_SERVICES.service"  
  
export default function HorariosConfig() {  
  const [config, setConfig] = useState<TallerConfigType>({})  
  const [loading, setLoading] = useState(false)  
  const [diasLaborales, setDiasLaborales] = useState({  
    lunes: true,  
    martes: true,  
    miercoles: true,  
    jueves: true,  
    viernes: true,  
    sabado: false,  
    domingo: false  
  })  
  
  useEffect(() => {  
    loadConfiguracion()  
  }, [])  
  
  const loadConfiguracion = async () => {  
    try {  
      setLoading(true)  
      const taller_id = "current-taller-id"  
      const data = await TALLER_CONFIG_SERVICES.GET_CONFIGURACION_TALLER(taller_id)  
      setConfig(data)  
        
      if (data.dias_laborales) {  
        const diasConfig = data.dias_laborales.reduce((acc: any, dia: string) => {  
          acc[dia] = true  
          return acc  
        }, {})  
        setDiasLaborales({...diasLaborales, ...diasConfig})  
      }  
    } catch (error) {  
      toast({  
        title: "Error",  
        description: "No se pudo cargar la configuración de horarios",  
        variant: "destructive"  
      })  
    } finally {  
      setLoading(false)  
    }  
  }  
  
  const handleSave = async () => {  
    try {  
      setLoading(true)  
      const diasSeleccionados = Object.entries(diasLaborales)  
        .filter(([_, activo]) => activo)  
        .map(([dia, _]) => dia)  
        
      const configActualizada = {  
        ...config,  
        dias_laborales: diasSeleccionados  
      }  
        
      if (config.id) {  
        await TALLER_CONFIG_SERVICES.UPDATE_CONFIGURACION_TALLER(configActualizada)  
      } else {  
        await TALLER_CONFIG_SERVICES.INSERT_CONFIGURACION_TALLER(configActualizada)  
      }  
        
      toast({  
        title: "Éxito",  
        description: "Horarios guardados correctamente"  
      })  
    } catch (error) {  
      toast({  
        title: "Error",  
        description: "No se pudieron guardar los horarios",  
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
            <Clock className="h-8 w-8" />  
            Configuración de Horarios  
          </h1>  
          <p className="text-muted-foreground">  
            Configura los horarios de atención de tu taller  
          </p>  
        </div>  
        <Button onClick={handleSave} disabled={loading}>  
          <Save className="mr-2 h-4 w-4" />  
          Guardar Horarios  
        </Button>  
      </div>  
  
      <div className="grid gap-6 md:grid-cols-2">  
        <Card>  
          <CardHeader>  
            <CardTitle>Horarios de Atención</CardTitle>  
            <CardDescription>  
              Define las horas de apertura y cierre del taller  
            </CardDescription>  
          </CardHeader>  
          <CardContent className="space-y-4">  
            <div className="space-y-2">  
              <Label htmlFor="horario_apertura">Hora de Apertura</Label>  
              <Input  
                id="horario_apertura"  
                type="time"  
                value={config.horario_apertura || "08:00"}  
                onChange={(e) => setConfig({...config, horario_apertura: e.target.value})}  
              />  
            </div>  
            <div className="space-y-2">  
              <Label htmlFor="horario_cierre">Hora de Cierre</Label>  
              <Input  
                id="horario_cierre"  
                type="time"  
                value={config.horario_cierre || "18:00"}  
                onChange={(e) => setConfig({...config, horario_cierre: e.target.value})}  
              />  
            </div>  
          </CardContent>  
        </Card>  
  
        <Card>  
          <CardHeader>  
            <CardTitle>Días Laborales</CardTitle>  
            <CardDescription>  
              Selecciona los días que el taller está abierto  
            </CardDescription>  
          </CardHeader>  
          <CardContent className="space-y-4">  
            {Object.entries(diasLaborales).map(([dia, activo]) => (  
              <div key={dia} className="flex items-center justify-between">  
                <Label htmlFor={dia} className="capitalize">  
                  {dia}  
                </Label>  
                <Switch  
                  id={dia}  
                  checked={activo}  
                  onCheckedChange={(checked) =>   
                    setDiasLaborales({...diasLaborales, [dia]: checked})  
                  }  
                />  
              </div>  
            ))}  
          </CardContent>  
        </Card>  
      </div>  
    </div>  
  )  
}