"use client"  
  
import { useState, useEffect } from "react"  
import { Button } from "@/components/ui/button"  
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"  
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"  
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"  
import { Download, Filter, BarChart3, TrendingUp, Users, DollarSign } from "lucide-react"  
import {  
  BarChart,  
  Bar,  
  PieChart,  
  Pie,  
  Cell,  
  LineChart,  
  Line,  
  XAxis,  
  YAxis,  
  CartesianGrid,  
  Tooltip,  
  Legend,  
  ResponsiveContainer,  
} from "recharts"  
import type { DateRange } from "react-day-picker"  
import { toast } from "@/components/ui/use-toast"  
import REPORTES_SERVICES, { type ReporteType } from "@/services/REPORTES_SERVICES.service"  
import { DatePickerWithRange } from "@/components/date-picker-with-range"
  
export default function ReportesPage() {  
  const [date, setDate] = useState<DateRange | undefined>({  
    from: new Date(2023, 0, 1),  
    to: new Date(),  
  })  
    
  const [reportesSiniestros, setReportesSiniestros] = useState<any>(null)  
  const [reportesReparaciones, setReportesReparaciones] = useState<any>(null)  
  const [loading, setLoading] = useState(false)  
  const [tipoReporte, setTipoReporte] = useState<string>("siniestros")  
  
  useEffect(() => {  
    loadReportes()  
  }, [tipoReporte])  
  
  const loadReportes = async () => {  
    try {  
      setLoading(true)  
        
      if (tipoReporte === "siniestros") {  
        const data = await REPORTES_SERVICES.GENERAR_REPORTE_SINIESTROS({})  
        setReportesSiniestros(data)  
      } else if (tipoReporte === "reparaciones") {  
        const data = await REPORTES_SERVICES.GENERAR_REPORTE_REPARACIONES({})  
        setReportesReparaciones(data)  
      }  
    } catch (error) {  
      toast({  
        title: "Error",  
        description: "No se pudieron cargar los reportes",  
        variant: "destructive"  
      })  
    } finally {  
      setLoading(false)  
    }  
  }  
  
  const exportarReporte = async () => {  
    try {  
      const reporte: ReporteType = {  
        tipo_reporte: tipoReporte as any,  
        parametros: { fecha_inicio: date?.from, fecha_fin: date?.to },  
        resultado: tipoReporte === "siniestros" ? reportesSiniestros : reportesReparaciones,  
        generado_por: "current-user-id",  
        titulo: `Reporte de ${tipoReporte}`,  
        descripcion: `Reporte generado el ${new Date().toLocaleDateString()}`  
      }  
        
      await REPORTES_SERVICES.GENERAR_REPORTE(reporte)  
      toast({  
        title: "Éxito",  
        description: "Reporte exportado correctamente"  
      })  
    } catch (error) {  
      toast({  
        title: "Error",  
        description: "No se pudo exportar el reporte",  
        variant: "destructive"  
      })  
    }  
  }  
  
  // Datos para gráficos basados en reportes reales  
  const datosSiniestros = reportesSiniestros?.por_estado ?   
    Object.entries(reportesSiniestros.por_estado).map(([estado, cantidad]) => ({  
      estado,  
      cantidad  
    })) : []  
  
  const datosReparaciones = reportesReparaciones?.por_estado ?   
    Object.entries(reportesReparaciones.por_estado).map(([estado, cantidad]) => ({  
      estado,  
      cantidad  
    })) : []  
  
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]  
  
  return (  
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">  
      <div className="flex items-center justify-between">  
        <div>  
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">  
            <BarChart3 className="h-8 w-8" />  
            Reportes y Análisis  
          </h1>  
          <p className="text-muted-foreground">  
            Análisis detallado de siniestros, reparaciones y métricas operacionales  
          </p>  
        </div>  
        <div className="flex items-center gap-2">  
          <Select value={tipoReporte} onValueChange={setTipoReporte}>  
            <SelectTrigger className="w-48">  
              <SelectValue />  
            </SelectTrigger>  
            <SelectContent>  
              <SelectItem value="siniestros">Siniestros</SelectItem>  
              <SelectItem value="reparaciones">Reparaciones</SelectItem>  
              <SelectItem value="financiero">Financiero</SelectItem>  
              <SelectItem value="operacional">Operacional</SelectItem>  
            </SelectContent>  
          </Select>  
          <Button variant="outline" size="icon">  
            <Filter className="h-4 w-4" />  
          </Button>  
          <Button onClick={exportarReporte}>  
            <Download className="mr-2 h-4 w-4" />  
            Exportar  
          </Button>  
        </div>  
      </div>  
  
      {/* Métricas principales */}  
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">  
        <Card>  
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">  
            <CardTitle className="text-sm font-medium">Total Siniestros</CardTitle>  
            <Users className="h-4 w-4 text-muted-foreground" />  
          </CardHeader>  
          <CardContent>  
            <div className="text-2xl font-bold">  
              {reportesSiniestros?.total_siniestros || 0}  
            </div>  
            <p className="text-xs text-muted-foreground">  
              Siniestros registrados  
            </p>  
          </CardContent>  
        </Card>  
          
        <Card>  
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">  
            <CardTitle className="text-sm font-medium">Monto Total</CardTitle>  
            <DollarSign className="h-4 w-4 text-muted-foreground" />  
          </CardHeader>  
          <CardContent>  
            <div className="text-2xl font-bold">  
              ${reportesSiniestros?.monto_total?.toLocaleString() || '0'}  
            </div>  
            <p className="text-xs text-muted-foreground">  
              En siniestros estimados  
            </p>  
          </CardContent>  
        </Card>  
  
        <Card>  
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">  
            <CardTitle className="text-sm font-medium">Reparaciones</CardTitle>  
            <TrendingUp className="h-4 w-4 text-muted-foreground" />  
          </CardHeader>  
          <CardContent>  
            <div className="text-2xl font-bold">  
              {reportesReparaciones?.total_reparaciones || 0}  
            </div>  
            <p className="text-xs text-muted-foreground">  
              Reparaciones en proceso  
            </p>  
          </CardContent>  
        </Card>  
  
        <Card>  
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">  
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>  
            <BarChart3 className="h-4 w-4 text-muted-foreground" />  
          </CardHeader>  
          <CardContent>  
            <div className="text-2xl font-bold">  
              {reportesReparaciones?.tiempo_promedio?.toFixed(1) || '0'} días  
            </div>  
            <p className="text-xs text-muted-foreground">  
              Tiempo de reparación  
            </p>  
          </CardContent>  
        </Card>  
      </div>  
  
      <div className="flex items-center gap-2 mb-4">  
        <DatePickerWithRange date={date} setDate={setDate} />  
      </div>  
  
      <Tabs defaultValue="siniestros" className="space-y-4">  
        <TabsList>  
          <TabsTrigger value="siniestros">Siniestros</TabsTrigger>  
          <TabsTrigger value="reparaciones">Reparaciones</TabsTrigger>  
          <TabsTrigger value="tendencias">Tendencias</TabsTrigger>  
          <TabsTrigger value="comparativo">Comparativo</TabsTrigger>  
        </TabsList>  
  
        <TabsContent value="siniestros">  
          <Card>  
            <CardHeader>  
              <CardTitle>Distribución de Siniestros por Estado</CardTitle>  
              <CardDescription>  
                Análisis del estado actual de los siniestros reportados  
              </CardDescription>  
            </CardHeader>  
            <CardContent className="p-6">  
              {loading ? (  
                <div className="h-[350px] flex items-center justify-center">  
                  <p>Cargando datos...</p>  
                </div>  
              ) : (  
                <div className="h-[350px]">  
                  <ResponsiveContainer width="100%" height="100%">  
                    <PieChart>  
                      <Pie  
                        data={datosSiniestros}  
                        cx="50%"  
                        cy="50%"  
                        outerRadius={120}  
                        fill="#8884d8"  
                        dataKey="cantidad"  
                        nameKey="estado"  
                        label={({ estado, percent }) => `${estado}: ${(percent * 100).toFixed(0)}%`}  
                        labelLine={false}  
                      >  
                        {datosSiniestros.map((entry, index) => (  
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />  
                        ))}  
                      </Pie>  
                      <Tooltip />  
                      <Legend />  
                    </PieChart>  
                  </ResponsiveContainer>  
                </div>  
              )}  
            </CardContent>  
          </Card>  
        </TabsContent>  
  
        <TabsContent value="reparaciones">  
          <Card>  
            <CardHeader>  
              <CardTitle>Estado de Reparaciones</CardTitle>  
              <CardDescription>  
                Seguimiento del progreso de las reparaciones  
              </CardDescription>  
            </CardHeader>  
            <CardContent className="p-6">  
              {loading ? (  
                <div className="h-[350px] flex items-center justify-center">  
                  <p>Cargando datos...</p>  
                </div>  
              ) : (  
                <div className="h-[350px]">  
                  <ResponsiveContainer width="100%" height="100%">  
                    <BarChart data={datosReparaciones}>  
                      <CartesianGrid strokeDasharray="3 3" />  
                      <XAxis dataKey="estado" />  
                      <YAxis />  
                      <Tooltip />  
                      <Legend />  
                      <Bar dataKey="cantidad" name="Cantidad" fill="#4f46e5" />  
                    </BarChart>  
                  </ResponsiveContainer>  
                </div>  
              )}  
            </CardContent>  
          </Card>  
        </TabsContent>  
  
        <TabsContent value="tendencias">  
          <Card>  
            <CardHeader>  
              <CardTitle>Tendencias Temporales</CardTitle>  
              <CardDescription>  
                Evolución de siniestros y reparaciones en el tiempo  
              </CardDescription>  
            </CardHeader>  
            <CardContent>  
              <div className="p-4 text-center">  
                <p>Módulo de tendencias en desarrollo...</p>  
                <p className="text-sm text-muted-foreground">  
                  Próximamente: análisis temporal y predicciones  
                </p>  
              </div>  
            </CardContent>  
          </Card>  
        </TabsContent>  
  
        <TabsContent value="comparativo">  
          <Card>  
            <CardHeader>  
              <CardTitle>Análisis Comparativo</CardTitle>  
              <CardDescription>  
                Comparación entre períodos y métricas clave  
              </CardDescription>  
            </CardHeader>  
            <CardContent>  
              <div className="p-4 text-center">  
                <p>Módulo comparativo en desarrollo...</p>  
                <p className="text-sm text-muted-foreground">  
                  Próximamente: comparaciones período a período  
                </p>  
              </div>  
            </CardContent>  
          </Card>  
        </TabsContent>  
      </Tabs>  
    </div>  
  )  
}