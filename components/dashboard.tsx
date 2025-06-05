"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Activity, Car, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function Dashboard() {
  const [serviciosActivos, setServiciosActivos] = useState(15)
  const [vehiculosRegistrados, setVehiculosRegistrados] = useState(42)
  const [citasPendientes, setCitasPendientes] = useState(8)
  const [ordenesCompletadas, setOrdenesCompletadas] = useState(324)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <MainNav />
        <div className="ml-auto flex items-center gap-4">
          <UserNav />
        </div>
      </header>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline">Descargar Reportes</Button>
            <Button>
              <Link href="/ordenes/nueva">Nueva Orden</Link>
            </Button>
          </div>
        </div>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="ordenes">Órdenes</TabsTrigger>
            <TabsTrigger value="vehiculos">Vehículos</TabsTrigger>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Servicios Activos</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{serviciosActivos}</div>
                  <p className="text-xs text-muted-foreground">+2 desde ayer</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Vehículos Registrados</CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{vehiculosRegistrados}</div>
                  <p className="text-xs text-muted-foreground">+5 desde la semana pasada</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Citas Pendientes</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{citasPendientes}</div>
                  <p className="text-xs text-muted-foreground">3 para hoy</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Órdenes Completadas</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{ordenesCompletadas}</div>
                  <p className="text-xs text-muted-foreground">+18 este mes</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Progreso de Órdenes Activas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                          <span>Toyota Corolla - Reparación Mayor</span>
                        </div>
                        <span className="font-medium">75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                          <span>Honda Civic - Pintura General</span>
                        </div>
                        <span className="font-medium">45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                          <span>Ford Explorer - Mantenimiento</span>
                        </div>
                        <span className="font-medium">90%</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                          <span>Nissan Sentra - Diagnóstico</span>
                        </div>
                        <span className="font-medium">20%</span>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Tablero Kanban</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col gap-2">
                      <div className="rounded-md bg-muted p-2 text-xs font-medium">Recepción</div>
                      <div className="rounded-md border p-2 text-xs">
                        <div className="font-medium">Toyota RAV4</div>
                        <div className="text-muted-foreground">Diagnóstico inicial</div>
                      </div>
                      <div className="rounded-md border p-2 text-xs">
                        <div className="font-medium">Kia Sportage</div>
                        <div className="text-muted-foreground">Revisión</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="rounded-md bg-muted p-2 text-xs font-medium">En Proceso</div>
                      <div className="rounded-md border p-2 text-xs">
                        <div className="font-medium">Honda Civic</div>
                        <div className="text-muted-foreground">Pintura</div>
                      </div>
                      <div className="rounded-md border p-2 text-xs">
                        <div className="font-medium">Ford Explorer</div>
                        <div className="text-muted-foreground">Mantenimiento</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="rounded-md bg-muted p-2 text-xs font-medium">Terminado</div>
                      <div className="rounded-md border p-2 text-xs">
                        <div className="font-medium">Mazda 3</div>
                        <div className="text-muted-foreground">Entrega hoy</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="ordenes" className="space-y-4">
            <h2 className="text-2xl font-bold">Órdenes Recientes</h2>
            <div className="border rounded-md">
              <div className="p-4">El contenido de órdenes se mostraría aquí con una tabla detallada</div>
            </div>
          </TabsContent>
          <TabsContent value="vehiculos" className="space-y-4">
            <h2 className="text-2xl font-bold">Vehículos Registrados</h2>
            <div className="border rounded-md">
              <div className="p-4">El contenido de vehículos se mostraría aquí con una tabla detallada</div>
            </div>
          </TabsContent>
          <TabsContent value="clientes" className="space-y-4">
            <h2 className="text-2xl font-bold">Clientes</h2>
            <div className="border rounded-md">
              <div className="p-4">El contenido de clientes se mostraría aquí con una tabla detallada</div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
