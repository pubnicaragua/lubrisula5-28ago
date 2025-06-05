import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Settings, Clipboard, PenToolIcon as Tool, Package, BarChart, Calendar, Users, Truck } from "lucide-react"

export default function TalleresHomePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Gestión de Talleres</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-primary" />
              Procesos Técnicos
            </CardTitle>
            <CardDescription>Gestión de procesos y materiales</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Configure los procesos técnicos del taller, materiales utilizados y paquetes de servicio.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/talleres/procesos">Ir a Procesos</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Clipboard className="mr-2 h-5 w-5 text-primary" />
              Órdenes de Trabajo
            </CardTitle>
            <CardDescription>Gestión de órdenes y seguimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Cree y gestione órdenes de trabajo, asigne técnicos y realice seguimiento.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/ordenes">Ir a Órdenes</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Tool className="mr-2 h-5 w-5 text-primary" />
              Tablero Kanban
            </CardTitle>
            <CardDescription>Seguimiento visual de trabajos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Visualice y gestione el flujo de trabajo mediante un tablero Kanban interactivo.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/kanban">Ir a Kanban</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5 text-primary" />
              Inventario
            </CardTitle>
            <CardDescription>Gestión de materiales y repuestos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Controle el inventario de materiales, repuestos y suministros del taller.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/inventario">Ir a Inventario</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5 text-primary" />
              Reportes
            </CardTitle>
            <CardDescription>Análisis y estadísticas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Genere reportes de productividad, costos, tiempos y más.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/reportes">Ir a Reportes</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Calendario
            </CardTitle>
            <CardDescription>Programación y citas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Gestione citas, programación de trabajos y disponibilidad de técnicos.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/calendario">Ir a Calendario</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              Equipo
            </CardTitle>
            <CardDescription>Gestión de técnicos y personal</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Administre el equipo de trabajo, asigne roles y controle horarios.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/equipo">Ir a Equipo</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Truck className="mr-2 h-5 w-5 text-primary" />
              Diagnóstico
            </CardTitle>
            <CardDescription>Verificación del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Verifique el estado del sistema y la configuración de las tablas.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/diagnostico-talleres">Ir a Diagnóstico</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
