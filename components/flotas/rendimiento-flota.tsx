"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"
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

interface Flota {
  id: number
  nombre: string
  empresa: string
  contacto: string
  telefono: string
  email: string
  cantidadVehiculos: number
  estado: "Activa" | "Inactiva" | "En Negociación"
  fechaRegistro: string
  ultimaActualizacion: string
}

interface RendimientoFlotaProps {
  flota: Flota
}

export function RendimientoFlota({ flota }: RendimientoFlotaProps) {
  // Datos de ejemplo para gráficos
  const datosCostos = [
    { mes: "Ene", mantenimiento: 12000, reparaciones: 5000, combustible: 8000 },
    { mes: "Feb", mantenimiento: 10000, reparaciones: 7000, combustible: 8500 },
    { mes: "Mar", mantenimiento: 11000, reparaciones: 3000, combustible: 9000 },
    { mes: "Abr", mantenimiento: 9000, reparaciones: 8000, combustible: 8200 },
    { mes: "May", mantenimiento: 12500, reparaciones: 4000, combustible: 8800 },
    { mes: "Jun", mantenimiento: 10500, reparaciones: 6000, combustible: 9200 },
  ]

  const datosDisponibilidad = [
    { mes: "Ene", disponibilidad: 95 },
    { mes: "Feb", disponibilidad: 92 },
    { mes: "Mar", disponibilidad: 97 },
    { mes: "Abr", disponibilidad: 90 },
    { mes: "May", disponibilidad: 94 },
    { mes: "Jun", disponibilidad: 96 },
  ]

  const datosTiposServicio = [
    { nombre: "Mantenimiento Preventivo", valor: 45 },
    { nombre: "Reparaciones", valor: 25 },
    { nombre: "Cambio de Aceite", valor: 15 },
    { nombre: "Alineación y Balanceo", valor: 10 },
    { nombre: "Otros", valor: 5 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Rendimiento de {flota.nombre}</h2>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline">
            <Calendar className="mr-2 h-4 w-4" /> Cambiar Período
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" /> Exportar Datos
          </Button>
        </div>
      </div>

      <Tabs defaultValue="costos">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="costos">Costos</TabsTrigger>
          <TabsTrigger value="disponibilidad">Disponibilidad</TabsTrigger>
          <TabsTrigger value="servicios">Tipos de Servicio</TabsTrigger>
        </TabsList>

        <TabsContent value="costos" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Costos Mensuales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datosCostos} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`L ${value}`, ""]} />
                    <Legend />
                    <Bar dataKey="mantenimiento" name="Mantenimiento" fill="#4f46e5" />
                    <Bar dataKey="reparaciones" name="Reparaciones" fill="#f59e0b" />
                    <Bar dataKey="combustible" name="Combustible" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disponibilidad" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Disponibilidad de Vehículos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={datosDisponibilidad} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, "Disponibilidad"]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="disponibilidad"
                      name="Disponibilidad"
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

        <TabsContent value="servicios" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Tipo de Servicio</CardTitle>
            </CardHeader>
            <CardContent>
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
      </Tabs>
    </div>
  )
}
