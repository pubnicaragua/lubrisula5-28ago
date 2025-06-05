"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Clock, Package, AlertCircle, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface PaqueteServicio {
  id: string
  nombre: string
  descripcion: string
  precio_base: number
  tiempo_estimado: number
  created_at: string
  updated_at: string
  procesos: {
    id: string
    nombre: string
    tipo: string
  }[]
}

export function PaquetesServicio() {
  const { toast } = useToast()
  const [paquetes, setPaquetes] = useState<PaqueteServicio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchPaquetes = async () => {
      try {
        const response = await fetch("/api/paquetes-servicio")
        const data = await response.json()

        if (response.ok) {
          setPaquetes(data)
        } else {
          setError(data.error || "Error al cargar los paquetes de servicio")
        }
      } catch (error) {
        setError("Error al conectar con el servidor")
      } finally {
        setLoading(false)
      }
    }

    fetchPaquetes()
  }, [])

  const formatTiempo = (minutos: number) => {
    const horas = Math.floor(minutos / 60)
    const mins = minutos % 60

    if (horas > 0) {
      return `${horas}h ${mins}m`
    }

    return `${mins}m`
  }

  const formatPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-HN", {
      style: "currency",
      currency: "HNL",
    }).format(precio)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-red-600 flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" /> Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Paquetes de Servicio</CardTitle>
          <CardDescription>Combinaciones predefinidas de procesos técnicos</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nuevo Paquete
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Nuevo Paquete de Servicio</DialogTitle>
              <DialogDescription>Crea un nuevo paquete de servicio combinando procesos técnicos.</DialogDescription>
            </DialogHeader>
            {/* Aquí iría el formulario para crear un nuevo paquete */}
            <div className="py-4">
              <p>Formulario para crear un nuevo paquete de servicio</p>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {paquetes.length === 0 ? (
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No hay paquetes de servicio</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No se encontraron paquetes de servicio. Haz clic en "Nuevo Paquete" para crear uno.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Procesos</TableHead>
                <TableHead>Tiempo Total</TableHead>
                <TableHead>Precio Base</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paquetes.map((paquete) => (
                <TableRow key={paquete.id}>
                  <TableCell className="font-medium">{paquete.nombre}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {paquete.procesos.map((proceso) => (
                        <Badge key={proceso.id} variant="outline">
                          {proceso.nombre}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="flex items-center">
                    <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                    {formatTiempo(paquete.tiempo_estimado)}
                  </TableCell>
                  <TableCell>{formatPrecio(paquete.precio_base)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
