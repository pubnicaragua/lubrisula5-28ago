"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter, FileText, Eye, AlertCircle, Truck } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { NuevoRepuestoForm } from "./nuevo-repuesto-form"
import { Badge } from "@/components/ui/badge"
import { DetalleRepuesto } from "./detalle-repuesto"
import { SolicitudCompraForm } from "./solicitud-compra-form"

interface Repuesto {
  id: number
  codigo: string
  nombre: string
  marca: string
  modelo: string
  categoria: string
  proveedor: string
  precio: number
  stock: number
  stockMinimo: number
  ubicacion: string
  estado: "Disponible" | "Bajo Stock" | "Agotado" | "Descontinuado" | "En Pedido"
}

export function RepuestosPage() {
  const [repuestos, setRepuestos] = useState<Repuesto[]>([
    {
      id: 1,
      codigo: "REP-001",
      nombre: "Filtro de Aceite",
      marca: "Fram",
      modelo: "PH7317",
      categoria: "Filtros",
      proveedor: "AutoPartes Express",
      precio: 250.0,
      stock: 15,
      stockMinimo: 5,
      ubicacion: "A-12",
      estado: "Disponible",
    },
    {
      id: 2,
      codigo: "REP-002",
      nombre: "Pastillas de Freno Delanteras",
      marca: "Brembo",
      modelo: "P83067N",
      categoria: "Frenos",
      proveedor: "Repuestos Industriales",
      precio: 1200.0,
      stock: 4,
      stockMinimo: 4,
      ubicacion: "B-05",
      estado: "Bajo Stock",
    },
    {
      id: 3,
      codigo: "REP-003",
      nombre: "Amortiguador Trasero",
      marca: "KYB",
      modelo: "344459",
      categoria: "Suspensión",
      proveedor: "AutoPartes Express",
      precio: 1800.0,
      stock: 0,
      stockMinimo: 2,
      ubicacion: "C-08",
      estado: "Agotado",
    },
    {
      id: 4,
      codigo: "REP-004",
      nombre: "Bomba de Agua",
      marca: "Gates",
      modelo: "43531",
      categoria: "Refrigeración",
      proveedor: "Repuestos Industriales",
      precio: 950.0,
      stock: 3,
      stockMinimo: 2,
      ubicacion: "D-15",
      estado: "Disponible",
    },
    {
      id: 5,
      codigo: "REP-005",
      nombre: "Alternador",
      marca: "Bosch",
      modelo: "AL0841X",
      categoria: "Eléctrico",
      proveedor: "Eléctricos Automotrices",
      precio: 3500.0,
      stock: 2,
      stockMinimo: 1,
      ubicacion: "E-03",
      estado: "Disponible",
    },
  ])

  const [open, setOpen] = useState(false)
  const [repuestoSeleccionado, setRepuestoSeleccionado] = useState<Repuesto | null>(null)
  const [mostrarDetalle, setMostrarDetalle] = useState(false)
  const [mostrarSolicitudCompra, setMostrarSolicitudCompra] = useState(false)

  const handleAddRepuesto = (nuevoRepuesto: Omit<Repuesto, "id">) => {
    const id = repuestos.length > 0 ? Math.max(...repuestos.map((o) => o.id)) + 1 : 1
    setRepuestos([...repuestos, { ...nuevoRepuesto, id }])
    setOpen(false)
  }

  const verDetalle = (repuesto: Repuesto) => {
    setRepuestoSeleccionado(repuesto)
    setMostrarDetalle(true)
  }

  const solicitarCompra = (repuesto: Repuesto) => {
    setRepuestoSeleccionado(repuesto)
    setMostrarSolicitudCompra(true)
  }

  const getEstadoBadge = (estado: Repuesto["estado"]) => {
    switch (estado) {
      case "Disponible":
        return <Badge className="bg-green-500 hover:bg-green-600">{estado}</Badge>
      case "Bajo Stock":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">{estado}</Badge>
      case "Agotado":
        return <Badge className="bg-red-500 hover:bg-red-600">{estado}</Badge>
      case "Descontinuado":
        return <Badge className="bg-gray-500 hover:bg-gray-600">{estado}</Badge>
      case "En Pedido":
        return <Badge className="bg-blue-500 hover:bg-blue-600">{estado}</Badge>
      default:
        return <Badge>{estado}</Badge>
    }
  }

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
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Repuestos</h1>
          <div className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Nuevo Repuesto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Nuevo Repuesto</DialogTitle>
                  <DialogDescription>
                    Ingresa la información del nuevo repuesto. Haz clic en guardar cuando hayas terminado.
                  </DialogDescription>
                </DialogHeader>
                <NuevoRepuestoForm onSubmit={handleAddRepuesto} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar repuestos por código, nombre o marca..." className="pl-8" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filtrar repuestos</span>
          </Button>
          <Button variant="outline" size="icon">
            <FileText className="h-4 w-4" />
            <span className="sr-only">Exportar inventario</span>
          </Button>
        </div>

        <Tabs defaultValue="todos" className="space-y-4">
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="disponibles">Disponibles</TabsTrigger>
            <TabsTrigger value="bajoStock">Bajo Stock</TabsTrigger>
            <TabsTrigger value="agotados">Agotados</TabsTrigger>
          </TabsList>
          <TabsContent value="todos">
            <Card>
              <CardHeader>
                <CardTitle>Todos los Repuestos</CardTitle>
                <CardDescription>Mostrando {repuestos.length} repuestos registrados en el sistema.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Precio (L)</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {repuestos.map((repuesto) => (
                      <TableRow key={repuesto.id}>
                        <TableCell className="font-medium">{repuesto.codigo}</TableCell>
                        <TableCell>{repuesto.nombre}</TableCell>
                        <TableCell>{repuesto.marca}</TableCell>
                        <TableCell>{repuesto.categoria}</TableCell>
                        <TableCell>
                          {repuesto.stock} / {repuesto.stockMinimo}
                        </TableCell>
                        <TableCell>L {repuesto.precio.toFixed(2)}</TableCell>
                        <TableCell>{getEstadoBadge(repuesto.estado)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => verDetalle(repuesto)}
                              title="Ver detalles"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => solicitarCompra(repuesto)}
                              title="Solicitar compra"
                            >
                              <Truck className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="disponibles">
            <Card>
              <CardHeader>
                <CardTitle>Repuestos Disponibles</CardTitle>
                <CardDescription>Repuestos con stock suficiente.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Precio (L)</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {repuestos
                      .filter((repuesto) => repuesto.estado === "Disponible")
                      .map((repuesto) => (
                        <TableRow key={repuesto.id}>
                          <TableCell className="font-medium">{repuesto.codigo}</TableCell>
                          <TableCell>{repuesto.nombre}</TableCell>
                          <TableCell>{repuesto.marca}</TableCell>
                          <TableCell>{repuesto.categoria}</TableCell>
                          <TableCell>
                            {repuesto.stock} / {repuesto.stockMinimo}
                          </TableCell>
                          <TableCell>L {repuesto.precio.toFixed(2)}</TableCell>
                          <TableCell>{getEstadoBadge(repuesto.estado)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => verDetalle(repuesto)}
                                title="Ver detalles"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => solicitarCompra(repuesto)}
                                title="Solicitar compra"
                              >
                                <Truck className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="bajoStock">
            <Card>
              <CardHeader>
                <CardTitle>Repuestos con Bajo Stock</CardTitle>
                <CardDescription>Repuestos que necesitan reabastecimiento pronto.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Precio (L)</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {repuestos
                      .filter((repuesto) => repuesto.estado === "Bajo Stock")
                      .map((repuesto) => (
                        <TableRow key={repuesto.id}>
                          <TableCell className="font-medium">{repuesto.codigo}</TableCell>
                          <TableCell>{repuesto.nombre}</TableCell>
                          <TableCell>{repuesto.marca}</TableCell>
                          <TableCell>{repuesto.categoria}</TableCell>
                          <TableCell>
                            {repuesto.stock} / {repuesto.stockMinimo}
                          </TableCell>
                          <TableCell>L {repuesto.precio.toFixed(2)}</TableCell>
                          <TableCell>{getEstadoBadge(repuesto.estado)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => verDetalle(repuesto)}
                                title="Ver detalles"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => solicitarCompra(repuesto)}
                                title="Solicitar compra"
                              >
                                <Truck className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="agotados">
            <Card>
              <CardHeader>
                <CardTitle>Repuestos Agotados</CardTitle>
                <CardDescription>Repuestos sin stock disponible.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Precio (L)</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {repuestos
                      .filter((repuesto) => repuesto.estado === "Agotado")
                      .map((repuesto) => (
                        <TableRow key={repuesto.id}>
                          <TableCell className="font-medium">{repuesto.codigo}</TableCell>
                          <TableCell>{repuesto.nombre}</TableCell>
                          <TableCell>{repuesto.marca}</TableCell>
                          <TableCell>{repuesto.categoria}</TableCell>
                          <TableCell>
                            {repuesto.stock} / {repuesto.stockMinimo}
                          </TableCell>
                          <TableCell>L {repuesto.precio.toFixed(2)}</TableCell>
                          <TableCell>{getEstadoBadge(repuesto.estado)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => verDetalle(repuesto)}
                                title="Ver detalles"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => solicitarCompra(repuesto)}
                                title="Solicitar compra"
                              >
                                <Truck className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Alertas de Inventario</CardTitle>
            <CardDescription>Repuestos que requieren atención inmediata</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
                <div>
                  <p className="font-medium">Amortiguador Trasero (REP-003) - Agotado</p>
                  <p className="text-sm text-muted-foreground">Stock actual: 0. Stock mínimo: 2</p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto" onClick={() => solicitarCompra(repuestos[2])}>
                  Solicitar
                </Button>
              </div>
              <div className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3" />
                <div>
                  <p className="font-medium">Pastillas de Freno Delanteras (REP-002) - Bajo Stock</p>
                  <p className="text-sm text-muted-foreground">Stock actual: 4. Stock mínimo: 4</p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto" onClick={() => solicitarCompra(repuestos[1])}>
                  Solicitar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diálogo para mostrar detalles del repuesto */}
      <Dialog open={mostrarDetalle} onOpenChange={setMostrarDetalle}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Detalle del Repuesto</DialogTitle>
            <DialogDescription>Información completa del repuesto seleccionado</DialogDescription>
          </DialogHeader>
          {repuestoSeleccionado && <DetalleRepuesto repuesto={repuestoSeleccionado} />}
        </DialogContent>
      </Dialog>

      {/* Diálogo para solicitud de compra */}
      <Dialog open={mostrarSolicitudCompra} onOpenChange={setMostrarSolicitudCompra}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Solicitud de Compra</DialogTitle>
            <DialogDescription>Completa la información para solicitar la compra del repuesto</DialogDescription>
          </DialogHeader>
          {repuestoSeleccionado && (
            <SolicitudCompraForm repuesto={repuestoSeleccionado} onClose={() => setMostrarSolicitudCompra(false)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
