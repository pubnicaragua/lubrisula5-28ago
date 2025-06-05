"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Truck, Package, History, Edit, ShoppingCart } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SolicitudCompraForm } from "./solicitud-compra-form"

interface DetalleRepuestoProps {
  repuestoId: string
}

export function DetalleRepuesto({ repuestoId }: DetalleRepuestoProps) {
  const [repuesto, setRepuesto] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSolicitudForm, setShowSolicitudForm] = useState(false)

  useEffect(() => {
    const fetchRepuesto = async () => {
      try {
        // Simulación de datos para el ejemplo
        // En producción, esto sería una llamada a la API o a Supabase
        setRepuesto({
          id: repuestoId,
          nombre: "Filtro de aceite premium",
          codigo: "FA-2023-001",
          descripcion: "Filtro de aceite de alta calidad para motores de 4 cilindros",
          categoria: "Filtros",
          marca: "FilterPro",
          modelo: "FP-2023",
          precio: 25.99,
          costo: 15.5,
          stock: 8,
          stockMinimo: 10,
          ubicacion: "Estante A-23",
          proveedor: "AutoPartes Express",
          fechaUltimaCompra: "2023-10-15",
          compatible: ["Toyota Corolla 2018-2022", "Honda Civic 2019-2023", "Nissan Sentra 2020-2023"],
          estado: "Bajo stock",
          imagenUrl: "/placeholder.svg?key=4u0h9",
        })
        setLoading(false)
      } catch (err) {
        setError("Error al cargar los datos del repuesto")
        setLoading(false)
      }
    }

    fetchRepuesto()
  }, [repuestoId])

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <p>Cargando información del repuesto...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{repuesto.nombre}</h2>
          <p className="text-muted-foreground">Código: {repuesto.codigo}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Dialog open={showSolicitudForm} onOpenChange={setShowSolicitudForm}>
            <DialogTrigger asChild>
              <Button size="sm">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Solicitar compra
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Solicitud de compra</DialogTitle>
                <DialogDescription>Crea una solicitud de compra para este repuesto</DialogDescription>
              </DialogHeader>
              <SolicitudCompraForm
                repuestoId={repuestoId}
                repuestoNombre={repuesto.nombre}
                onSuccess={() => setShowSolicitudForm(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Información general</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Marca:</span>
                <span className="font-medium">{repuesto.marca}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Modelo:</span>
                <span className="font-medium">{repuesto.modelo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Categoría:</span>
                <span className="font-medium">{repuesto.categoria}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Precio venta:</span>
                <span className="font-medium">${repuesto.precio.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Costo:</span>
                <span className="font-medium">${repuesto.costo.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Margen:</span>
                <span className="font-medium">
                  {(((repuesto.precio - repuesto.costo) / repuesto.precio) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Inventario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Stock actual:</span>
                <div className="flex items-center">
                  <span className="font-medium mr-2">{repuesto.stock} unidades</span>
                  {repuesto.stock < repuesto.stockMinimo && <Badge variant="destructive">Bajo</Badge>}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stock mínimo:</span>
                <span className="font-medium">{repuesto.stockMinimo} unidades</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ubicación:</span>
                <span className="font-medium">{repuesto.ubicacion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Proveedor:</span>
                <span className="font-medium">{repuesto.proveedor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Última compra:</span>
                <span className="font-medium">{repuesto.fechaUltimaCompra}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Compatibilidad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {repuesto.compatible.map((vehiculo: string, index: number) => (
                <Badge key={index} variant="outline" className="mr-2 mb-2">
                  {vehiculo}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Descripción</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{repuesto.descripcion}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="historial">
        <TabsList>
          <TabsTrigger value="historial">
            <History className="h-4 w-4 mr-2" />
            Historial de movimientos
          </TabsTrigger>
          <TabsTrigger value="proveedores">
            <Truck className="h-4 w-4 mr-2" />
            Proveedores
          </TabsTrigger>
          <TabsTrigger value="ordenes">
            <Package className="h-4 w-4 mr-2" />
            Órdenes relacionadas
          </TabsTrigger>
        </TabsList>
        <TabsContent value="historial" className="border rounded-md p-4 mt-2">
          <p className="text-muted-foreground text-center py-8">No hay movimientos registrados para este repuesto.</p>
        </TabsContent>
        <TabsContent value="proveedores" className="border rounded-md p-4 mt-2">
          <p className="text-muted-foreground text-center py-8">
            No hay proveedores adicionales registrados para este repuesto.
          </p>
        </TabsContent>
        <TabsContent value="ordenes" className="border rounded-md p-4 mt-2">
          <p className="text-muted-foreground text-center py-8">No hay órdenes relacionadas con este repuesto.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
