"use client"

import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Filter } from "lucide-react"
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
import { useState } from "react"
import { DatePickerWithRange } from "../date-picker-with-range"

export function ReportesPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(),
  })

  // Datos de ejemplo para los gráficos
  const datosOrdenes = [
    { mes: "Ene", completadas: 45, pendientes: 15 },
    { mes: "Feb", completadas: 52, pendientes: 13 },
    { mes: "Mar", completadas: 61, pendientes: 17 },
    { mes: "Abr", completadas: 48, pendientes: 12 },
    { mes: "May", completadas: 65, pendientes: 14 },
    { mes: "Jun", completadas: 59, pendientes: 16 },
  ]

  const datosIngresos = [
    { mes: "Ene", ingresos: 15000 },
    { mes: "Feb", ingresos: 18000 },
    { mes: "Mar", ingresos: 24000 },
    { mes: "Abr", ingresos: 21000 },
    { mes: "May", ingresos: 28000 },
    { mes: "Jun", ingresos: 25000 },
  ]

  const datosTiposServicio = [
    { nombre: "Carrocería", valor: 40 },
    { nombre: "Pintura", valor: 25 },
    { nombre: "Mecánica", valor: 20 },
    { nombre: "Eléctrico", valor: 10 },
    { nombre: "Otros", valor: 5 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <MainNav />
        <div className="ml-auto flex items-center gap-4">
          <ModeToggle />
          <UserNav />
        </div>
      </header>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Reportes y Evaluación</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filtrar reportes</span>
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" /> Exportar Datos
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$131,000</div>
              <p className="text-xs text-muted-foreground">+15% desde el período anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Órdenes Completadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">330</div>
              <p className="text-xs text-muted-foreground">+8% desde el período anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Satisfacción</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">+3% desde el período anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.5 días</div>
              <p className="text-xs text-muted-foreground">-0.5 días desde el período anterior</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>

        <Tabs defaultValue="ordenes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="ordenes">Órdenes</TabsTrigger>
            <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
            <TabsTrigger value="servicios">Tipos de Servicio</TabsTrigger>
            <TabsTrigger value="tecnicos">Rendimiento Técnicos</TabsTrigger>
          </TabsList>
          <TabsContent value="ordenes">
            <Card>
              <CardHeader>
                <CardTitle>Órdenes por Mes</CardTitle>
                <CardDescription>Comparativa de órdenes completadas vs pendientes</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={datosOrdenes} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completadas" name="Completadas" fill="#4f46e5" />
                      <Bar dataKey="pendientes" name="Pendientes" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ingresos">
            <Card>
              <CardHeader>
                <CardTitle>Ingresos por Mes</CardTitle>
                <CardDescription>Evolución de ingresos en el período seleccionado</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={datosIngresos} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, "Ingresos"]} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="ingresos"
                        name="Ingresos"
                        stroke="#4f46e5"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="servicios">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Tipo de Servicio</CardTitle>
                <CardDescription>Porcentaje de servicios realizados por categoría</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={datosTiposServicio}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="valor"
                        nameKey="nombre"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {datosTiposServicio.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tecnicos">
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento de Técnicos</CardTitle>
                <CardDescription>Órdenes completadas por técnico</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Aquí iría el contenido del reporte de rendimiento de técnicos */}
                <div className="p-4 text-center">Este módulo está en desarrollo...</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
