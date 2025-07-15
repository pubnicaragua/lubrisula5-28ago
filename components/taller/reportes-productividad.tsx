    "use client"  
  
import { useState, useEffect } from "react"  
import { Button } from "@/components/ui/button"  
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"  
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"  
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"  
import { DatePickerWithRange } from "@/components/date-picker-with-range"  
import { Download, Filter, TrendingUp, DollarSign, Clock, Target } from "lucide-react"  
import { toast } from "@/components/ui/use-toast"  
import {  
  BarChart,  
  Bar,  
  LineChart,  
  Line,  
  AreaChart,  
  Area,  
  XAxis,  
  YAxis,  
  CartesianGrid,  
  Tooltip,  
  Legend,  
  ResponsiveContainer,  
} from "recharts"  
import type { DateRange } from "react-day-picker"  
  
export default function ReportesProductividad() {  
  const [dateRange, setDateRange] = useState<DateRange | undefined>({  
    from: new Date(2024, 0, 1),  
    to: new Date(),  
  })  
  const [selectedPeriodo, setSelectedPeriodo] = useState("mensual")  
  const [loading, setLoading] = useState(false)  
  
  // Datos de productividad e ingresos  
  const datosIngresosMensuales = [  
    { periodo: "Ene", ingresos: 45000, ordenes: 32, promedio: 1406 },  
    { periodo: "Feb", ingresos: 52000, ordenes: 38, promedio: 1368 },  
    { periodo: "Mar", ingresos: 61000, ordenes: 45, promedio: 1356 },  
    { periodo: "Abr", ingresos: 48000, ordenes: 35, promedio: 1371 },  
    { periodo: "May", ingresos: 65000, ordenes: 48, promedio: 1354 },  
    { periodo: "Jun", ingresos: 59000, ordenes: 42, promedio: 1405 },  
  ]  
  
  const datosProductividadTecnicos = [  
    { tecnico: "Juan Pérez", ordenes: 25, ingresos: 34000, eficiencia: 92 },  
    { tecnico: "María García", ordenes: 22, ingresos: 31000, eficiencia: 88 },  
    { tecnico: "Carlos López", ordenes: 18, ingresos: 26000, eficiencia: 85 },  
    { tecnico: "Ana Martínez", ordenes: 15, ingresos: 22000, eficiencia: 90 },  
  ]  
  
  const datosTiempoPromedio = [  
    { servicio: "Carrocería", tiempo: 4.2, meta: 4.0 },  
    { servicio: "Pintura", tiempo: 6.8, meta: 6.5 },  
    { servicio: "Mecánica", tiempo: 2.1, meta: 2.5 },  
    { servicio: "Eléctrico", tiempo: 1.8, meta: 2.0 },  
  ]  
  
  const exportarReporte = (tipo: string) => {  
    toast({  
      title: "Exportando reporte",  
      description: `Generando reporte de ${tipo}...`,  
    })  
  }  
  
  return (  
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">  
      <div className="flex items-center justify-between">  
        <div>  
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">  
            <TrendingUp className="h-8 w-8" />  
            Reportes de Productividad e Ingresos  
          </h1>  
          <p className="text-muted-foreground">  
            Análisis detallado de rendimiento financiero y operativo  
          </p>  
        </div>  
        <div className="flex items-center gap-2">  
          <Button variant="outline" size="icon">  
            <Filter className="h-4 w-4" />  
          </Button>  
          <Button onClick={() => exportarReporte("productividad")}>  
            <Download className="mr-2 h-4 w-4" />  
            Exportar  
          </Button>  
        </div>  
      </div>  
  
      {/* Filtros */}  
      <div className="flex items-center gap-4">  
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />  
        <Select value={selectedPeriodo} onValueChange={setSelectedPeriodo}>  
          <SelectTrigger className="w-[200px]">  
            <SelectValue placeholder="Seleccionar período" />  
          </SelectTrigger>  
          <SelectContent>  
            <SelectItem value="diario">Diario</SelectItem>  
            <SelectItem value="semanal">Semanal</SelectItem>  
            <SelectItem value="mensual">Mensual</SelectItem>  
            <SelectItem value="trimestral">Trimestral</SelectItem>  
          </SelectContent>  
        </Select>  
      </div>  
  
      {/* Métricas principales */}  
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">  
        <Card>  
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">  
            <CardTitle className="text-sm font-medium">Ingresos del Período</CardTitle>  
            <DollarSign className="h-4 w-4 text-muted-foreground" />  
          </CardHeader>  
          <CardContent>  
            <div className="text-2xl font-bold">$330,000</div>  
            <p className="text-xs text-muted-foreground">+12% vs período anterior</p>  
          </CardContent>  
        </Card>  
        <Card>  
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">  
            <CardTitle className="text-sm font-medium">Productividad</CardTitle>  
            <Target className="h-4 w-4 text-muted-foreground" />  
          </CardHeader>  
          <CardContent>  
            <div className="text-2xl font-bold">89%</div>  
            <p className="text-xs text-muted-foreground">+5% vs período anterior</p>  
          </CardContent>  
        </Card>  
        <Card>  
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">  
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>  
            <Clock className="h-4 w-4 text-muted-foreground" />  
          </CardHeader>  
          <CardContent>  
            <div className="text-2xl font-bold">3.2 días</div>  
            <p className="text-xs text-muted-foreground">-0.3 días vs período anterior</p>  
          </CardContent>  
        </Card>  
        <Card>  
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">  
            <CardTitle className="text-sm font-medium">Margen Promedio</CardTitle>  
            <TrendingUp className="h-4 w-4 text-muted-foreground" />  
          </CardHeader>  
          <CardContent>  
            <div className="text-2xl font-bold">34%</div>  
            <p className="text-xs text-muted-foreground">+2% vs período anterior</p>  
          </CardContent>  
        </Card>  
      </div>  
  
      <Tabs defaultValue="ingresos" className="space-y-4">  
        <TabsList>  
          <TabsTrigger value="ingresos">Análisis de Ingresos</TabsTrigger>  
          <TabsTrigger value="productividad">Productividad</TabsTrigger>  
          <TabsTrigger value="tiempos">Tiempos de Servicio</TabsTrigger>  
        </TabsList>  
  
        <TabsContent value="ingresos" className="space-y-4">  
          <div className="grid gap-4 md:grid-cols-2">  
            <Card>  
              <CardHeader>  
                <CardTitle>Evolución de Ingresos</CardTitle>  
                <CardDescription>Tendencia de ingresos por período</CardDescription>  
              </CardHeader>  
              <CardContent>  
                <ResponsiveContainer width="100%" height={300}>  
                  <AreaChart data={datosIngresosMensuales}>  
                    <CartesianGrid strokeDasharray="3 3" />  
                    <XAxis dataKey="periodo" />  
                    <YAxis />  
                    <Tooltip formatter={(value) => [`$${value}`, "Ingresos"]} />  
                    <Area type="monotone" dataKey="ingresos" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />  
                  </AreaChart>  
                </ResponsiveContainer>  
              </CardContent>  
            </Card>  
  
            <Card>  
              <CardHeader>  
                <CardTitle>Promedio por Orden</CardTitle>  
                <CardDescription>Valor promedio de órdenes de trabajo</CardDescription>  
              </CardHeader>  
              <CardContent>  
                <ResponsiveContainer width="100%" height={300}>  
                  <LineChart data={datosIngresosMensuales}>  
                    <CartesianGrid strokeDasharray="3 3" />  
                    <XAxis dataKey="periodo" />  
                    <YAxis />  
                    <Tooltip formatter={(value) => [`$${value}`, "Promedio"]} />  
                    <Line type="monotone" dataKey="promedio" stroke="#82ca9d" strokeWidth={2} />  
                  </LineChart>  
                </ResponsiveContainer>  
              </CardContent>  
            </Card>  
          </div>  
        </TabsContent>  
  
        <TabsContent value="productividad" className="space-y-4">  
          <Card>  
            <CardHeader>  
              <CardTitle>Productividad por Técnico</CardTitle>  
              <CardDescription>Rendimiento individual de técnicos</CardDescription>  
            </CardHeader>  
            <CardContent>  
              <div className="space-y-4">  
                {datosProductividadTecnicos.map((tecnico, index) => (  
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">  
                    <div className="flex-1">  
                      <p className="font-medium">{tecnico.tecnico}</p>  
                      <p className="text-sm text-muted-foreground">  
                        {tecnico.ordenes} órdenes • ${tecnico.ingresos.toLocaleString()} generados  
                      </p>  
                    </div>  
                    <div className="text-right">  
                      <p className="font-medium">{tecnico.eficiencia}%</p>  
                      <p className="text-sm text-muted-foreground">Eficiencia</p>  
                    </div>  
                  </div>  
                ))}  
              </div>  
            </CardContent>  
          </Card>  
        </TabsContent>  
  
        <TabsContent value="tiempos" className="space-y-4">  
          <Card>  
            <CardHeader>  
              <CardTitle>Tiempos de Servicio vs Metas</CardTitle>  
              <CardDescription>Comparación de tiempos reales vs objetivos</CardDescription>  
            </CardHeader>  
            <CardContent>  
              <ResponsiveContainer width="100%" height={300}>  
                <BarChart data={datosTiempoPromedio}>  
                  <CartesianGrid strokeDasharray="3 3" />  
                  <XAxis dataKey="servicio" />  
                  <YAxis />  
                  <Tooltip formatter={(value) => [`${value} días`, ""]} />  
                  <Legend />  
                  <Bar dataKey="tiempo" name="Tiempo Real" fill="#8884d8" />  
                  <Bar dataKey="meta" name="Meta" fill="#82ca9d" />  
                </BarChart>  
              </ResponsiveContainer>  
            </CardContent>  
          </Card>  
        </TabsContent>  
      </Tabs>  
    </div>  
  )  
}