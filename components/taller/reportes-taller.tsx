"use client"  
  
import { useState, useEffect } from "react"  
import { Button } from "@/components/ui/button"  
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"  
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"  
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"  
import { DatePickerWithRange } from "@/components/date-picker-with-range"  
import { Download, Filter, BarChart3, TrendingUp, DollarSign, Users } from "lucide-react"  
import { toast } from "@/components/ui/use-toast"  
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
  
export function ReportesTaller() {  
  const [dateRange, setDateRange] = useState<DateRange | undefined>({  
    from: new Date(2024, 0, 1),  
    to: new Date(),  
  })  
  const [selectedTaller, setSelectedTaller] = useState("todos")  
  const [loading, setLoading] = useState(false)  
  
  // Datos de ejemplo para los reportes  
  const datosIngresos = [  
    { mes: "Ene", ingresos: 45000, ordenes: 32 },  
    { mes: "Feb", ingresos: 52000, ordenes: 38 },  
    { mes: "Mar", ingresos: 61000, ordenes: 45 },  
    { mes: "Abr", ingresos: 48000, ordenes: 35 },  
    { mes: "May", ingresos: 65000, ordenes: 48 },  
    { mes: "Jun", ingresos: 59000, ordenes: 42 },  
  ]  
  
  const datosServicios = [  
    { nombre: "Carrocería", cantidad: 45, ingresos: 180000 },  
    { nombre: "Pintura", cantidad: 32, ingresos: 128000 },  
    { nombre: "Mecánica", cantidad: 28, ingresos: 84000 },  
    { nombre: "Eléctrico", cantidad: 15, ingresos: 45000 },  
  ]  
  
  const datosTecnicos = [  
    { nombre: "Juan Pérez", ordenes: 25, calificacion: 4.8 },  
    { nombre: "María García", ordenes: 22, calificacion: 4.9 },  
    { nombre: "Carlos López", ordenes: 18, calificacion: 4.6 },  
    { nombre: "Ana Martínez", ordenes: 15, calificacion: 4.7 },  
  ]  
  
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]  
  
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
            <BarChart3 className="h-8 w-8" />  
            Reportes del Taller  
          </h1>  
          <p className="text-muted-foreground">  
            Análisis de rendimiento y estadísticas del taller  
          </p>  
        </div>  
        <div className="flex items-center gap-2">  
          <Button variant="outline" size="icon">  
            <Filter className="h-4 w-4" />  
          </Button>  
          <Button onClick={() => exportarReporte("general")}>  
            <Download className="mr-2 h-4 w-4" />  
            Exportar  
          </Button>  
        </div>  
      </div>  
  
      {/* Filtros */}  
      <div className="flex items-center gap-4">  
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />  
        <Select value={selectedTaller} onValueChange={setSelectedTaller}>  
          <SelectTrigger className="w-[200px]">  
            <SelectValue placeholder="Seleccionar taller" />  
          </SelectTrigger>  
          <SelectContent>  
            <SelectItem value="todos">Todos los talleres</SelectItem>  
            <SelectItem value="principal">Taller Principal</SelectItem>  
            <SelectItem value="sucursal1">Sucursal 1</SelectItem>  
          </SelectContent>  
        </Select>  
      </div>  
  
      {/* Métricas principales */}  
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">  
        <Card>  
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">  
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>  
            <DollarSign className="h-4 w-4 text-muted-foreground" />  
          </CardHeader>  
          <CardContent>  
            <div className="text-2xl font-bold">$330,000</div>  
            <p className="text-xs text-muted-foreground">+12% desde el mes anterior</p>  
          </CardContent>  
        </Card>  
        <Card>  
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">  
            <CardTitle className="text-sm font-medium">Órdenes Completadas</CardTitle>  
            <TrendingUp className="h-4 w-4 text-muted-foreground" />  
          </CardHeader>  
          <CardContent>  
            <div className="text-2xl font-bold">240</div>  
            <p className="text-xs text-muted-foreground">+8% desde el mes anterior</p>  
          </CardContent>  
        </Card>  
        <Card>  
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">  
            <CardTitle className="text-sm font-medium">Promedio por Orden</CardTitle>  
            <DollarSign className="h-4 w-4 text-muted-foreground" />  
          </CardHeader>  
          <CardContent>  
            <div className="text-2xl font-bold">$1,375</div>  
            <p className="text-xs text-muted-foreground">+3% desde el mes anterior</p>  
          </CardContent>  
        </Card>  
        <Card>  
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">  
            <CardTitle className="text-sm font-medium">Técnicos Activos</CardTitle>  
            <Users className="h-4 w-4 text-muted-foreground" />  
          </CardHeader>  
          <CardContent>  
            <div className="text-2xl font-bold">12</div>  
            <p className="text-xs text-muted-foreground">2 nuevos este mes</p>  
          </CardContent>  
        </Card>  
      </div>  
  
      <Tabs defaultValue="ingresos" className="space-y-4">  
        <TabsList>  
          <TabsTrigger value="ingresos">Ingresos</TabsTrigger>  
          <TabsTrigger value="servicios">Servicios</TabsTrigger>  
          <TabsTrigger value="tecnicos">Técnicos</TabsTrigger>  
          <TabsTrigger value="clientes">Clientes</TabsTrigger>  
        </TabsList>  
  
        <TabsContent value="ingresos" className="space-y-4">  
          <div className="grid gap-4 md:grid-cols-2">  
            <Card>  
              <CardHeader>  
                <CardTitle>Ingresos Mensuales</CardTitle>  
                <CardDescription>Evolución de ingresos por mes</CardDescription>  
              </CardHeader>  
              <CardContent>  
                <ResponsiveContainer width="100%" height={300}>  
                  <BarChart data={datosIngresos}>  
                    <CartesianGrid strokeDasharray="3 3" />  
                    <XAxis dataKey="mes" />  
                    <YAxis />  
                    <Tooltip formatter={(value) => [`$${value}`, "Ingresos"]} />  
                    <Bar dataKey="ingresos" fill="#8884d8" />  
                  </BarChart>  
                </ResponsiveContainer>  
              </CardContent>  
            </Card>  
  
            <Card>  
              <CardHeader>  
                <CardTitle>Órdenes por Mes</CardTitle>  
                <CardDescription>Cantidad de órdenes completadas</CardDescription>  
              </CardHeader>  
              <CardContent>  
                <ResponsiveContainer width="100%" height={300}>  
                  <LineChart data={datosIngresos}>  
                    <CartesianGrid strokeDasharray="3 3" />  
                    <XAxis dataKey="mes" />  
                    <YAxis />  
                    <Tooltip />  
                    <Line type="monotone" dataKey="ordenes" stroke="#82ca9d" strokeWidth={2} />  
                  </LineChart>  
                </ResponsiveContainer>  
              </CardContent>  
            </Card>  
          </div>  
        </TabsContent>  
  
        <TabsContent value="servicios" className="space-y-4">  
          <div className="grid gap-4 md:grid-cols-2">  
            <Card>  
              <CardHeader>  
                <CardTitle>Servicios por Tipo</CardTitle>  
                <CardDescription>Distribución de servicios realizados</CardDescription>  
              </CardHeader>  
              <CardContent>  
                <ResponsiveContainer width="100%" height={300}>  
                  <PieChart>  
                    <Pie  
                      data={datosServicios}  
                      cx="50%"  
                      cy="50%"  
                      labelLine={false}  
                      label={({ nombre, cantidad }) => `${nombre}: ${cantidad}`}  
                      outerRadius={80}  
                      fill="#8884d8"  
                      dataKey="cantidad"  
                    >  
                      {datosServicios.map((entry, index) => (  
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />  
                      ))}  
                    </Pie>  
                    <Tooltip />  
                  </PieChart>  
                </ResponsiveContainer>  
              </CardContent>  
            </Card>  
  
            <Card>  
              <CardHeader>  
                <CardTitle>Ingresos por Servicio</CardTitle>  
                <CardDescription>Ingresos generados por tipo de servicio</CardDescription>  
              </CardHeader>  
              <CardContent>  
                <ResponsiveContainer width="100%" height={300}>  
                  <BarChart data={datosServicios} layout="horizontal">  
                    <CartesianGrid strokeDasharray="3 3" />  
                    <XAxis type="number" />  
                    <YAxis dataKey="nombre" type="category" />  
                    <Tooltip formatter={(value) => [`$${value}`, "Ingresos"]} />  
                    <Bar dataKey="ingresos" fill="#82ca9d" />  
                  </BarChart>  
                </ResponsiveContainer>  
              </CardContent>  
            </Card>  
          </div>  
        </TabsContent>  
  
        <TabsContent value="tecnicos" className="space-y-4">  
          <Card>  
            <CardHeader>  
              <CardTitle>Rendimiento de Técnicos</CardTitle>  
              <CardDescription>Órdenes completadas y calificaciones</CardDescription>  
            </CardHeader>  
            <CardContent>  
              <div className="space-y-4">  
                {datosTecnicos.map((tecnico, index) => (  
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">  
                    <div>  
                      <p className="font-medium">{tecnico.nombre}</p>  
                      <p className="text-sm text-muted-foreground">  
                        {tecnico.ordenes} órdenes completadas  
                      </p>  
                    </div>  
                    <div className="text-right">  
                      <p className="font-medium">⭐ {tecnico.calificacion}</p>  
                      <p className="text-sm text-muted-foreground">Calificación</p>  
                    </div>  
                  </div>  
                ))}  
              </div>  
            </CardContent>  
          </Card>  
        </TabsContent>  
  
        <TabsContent value="clientes" className="space-y-4">  
          <Card>  
            <CardHeader>  
              <CardTitle>Análisis de Clientes</CardTitle>  
              <CardDescription>Estadísticas de clientes y retención</CardDescription>  
            </CardHeader>  
            <CardContent>  
              <div className="grid gap-4 md:grid-cols-3">  
                <div className="text-center">  
                  <div className="text-2xl font-bold">156</div>  
                  <p className="text-sm text-muted-foreground">Clientes Activos</p>  
                </div>  
                <div className="text-center">  
                  <div className="text-2xl font-bold">89%</div>  
                  <p className="text-sm text-muted-foreground">Tasa de Retención</p>  
                </div>  
                <div className="text-center">  
                  <div className="text-2xl font-bold">$2,115</div>  
                  <p className="text-sm text-muted-foreground">Valor Promedio</p>  
                </div>  
              </div>  
            </CardContent>  
          </Card>  
        </TabsContent>  
      </Tabs>  
    </div>  
  )  
}