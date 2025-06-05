"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Package, AlertCircle, Plus, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NuevoMaterialForm } from "./nuevo-material-form"

interface Proceso {
  id: string
  nombre: string
  tipo: string
}

interface Material {
  id: string
  nombre: string
  unidad: string
  precio_unitario: number
  cantidad: number
  precio_total: number
  rendimiento_vehiculo: number
  rendimiento_hora_reparar: number
  rendimiento_hora_pintura: number
  inventario_inicial: number
  inventario_final: number
  categoria: string
  proceso_id: string
  procesos_taller: {
    id: string
    nombre: string
    tipo: string
  }
  suppliers: {
    id: string
    name: string
  } | null
}

export function MaterialesProceso() {
  const { toast } = useToast()
  const [procesos, setProcesos] = useState<Proceso[]>([])
  const [materiales, setMateriales] = useState<Material[]>([])
  const [selectedProcesoId, setSelectedProcesoId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchProcesos = async () => {
      try {
        const response = await fetch("/api/procesos")
        const data = await response.json()

        if (response.ok) {
          setProcesos(data)
          if (data.length > 0 && !selectedProcesoId) {
            setSelectedProcesoId(data[0].id)
          }
        } else {
          setError(data.error || "Error al cargar los procesos")
        }
      } catch (error) {
        setError("Error al conectar con el servidor")
      } finally {
        setLoading(false)
      }
    }

    fetchProcesos()
  }, [selectedProcesoId])

  useEffect(() => {
    const fetchMateriales = async () => {
      if (!selectedProcesoId) return

      setLoading(true)

      try {
        const response = await fetch(`/api/materiales?proceso_id=${selectedProcesoId}`)
        const data = await response.json()

        if (response.ok) {
          setMateriales(data)
        } else {
          setError(data.error || "Error al cargar los materiales")
        }
      } catch (error) {
        setError("Error al conectar con el servidor")
      } finally {
        setLoading(false)
      }
    }

    fetchMateriales()
  }, [selectedProcesoId])

  const handleProcesoChange = (id: string) => {
    setSelectedProcesoId(id)
  }

  const formatPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-HN", {
      style: "currency",
      currency: "HNL",
    }).format(precio)
  }

  const getCategoriaColor = (categoria: string) => {
    const colors: Record<string, string> = {
      pintura: "bg-pink-100 text-pink-800",
      reparacion: "bg-yellow-100 text-yellow-800",
      mecanica: "bg-blue-100 text-blue-800",
      consumible: "bg-green-100 text-green-800",
    }

    return colors[categoria] || "bg-gray-100 text-gray-800"
  }

  if (loading && procesos.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error && procesos.length === 0) {
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
          <CardTitle>Materiales por Proceso</CardTitle>
          <CardDescription>Gestión de materiales utilizados en cada proceso técnico</CardDescription>
        </div>
        {selectedProcesoId && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nuevo Material
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Nuevo Material</DialogTitle>
                <DialogDescription>Agrega un nuevo material para el proceso seleccionado.</DialogDescription>
              </DialogHeader>
              <NuevoMaterialForm
                procesoId={selectedProcesoId}
                onSubmit={() => {
                  setOpen(false)
                  // Recargar materiales
                  const fetchMateriales = async () => {
                    try {
                      const response = await fetch(`/api/materiales?proceso_id=${selectedProcesoId}`)
                      const data = await response.json()

                      if (response.ok) {
                        setMateriales(data)
                      }
                    } catch (error) {
                      console.error("Error al recargar materiales:", error)
                    }
                  }

                  fetchMateriales()
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Seleccionar Proceso:</span>
            <Select value={selectedProcesoId || ""} onValueChange={handleProcesoChange}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Seleccionar proceso" />
              </SelectTrigger>
              <SelectContent>
                {procesos.map((proceso) => (
                  <SelectItem key={proceso.id} value={proceso.id}>
                    {proceso.nombre} ({proceso.tipo})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading && selectedProcesoId ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : materiales.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No hay materiales</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No se encontraron materiales para este proceso. Haz clic en "Nuevo Material" para agregar uno.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Precio Unitario</TableHead>
                  <TableHead>Rendimiento</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materiales.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">{material.nombre}</TableCell>
                    <TableCell>{material.unidad}</TableCell>
                    <TableCell>
                      {material.categoria && (
                        <Badge variant="outline" className={getCategoriaColor(material.categoria)}>
                          {material.categoria.charAt(0).toUpperCase() + material.categoria.slice(1)}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{material.suppliers?.name || "N/A"}</TableCell>
                    <TableCell className="flex items-center">
                      <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
                      {formatPrecio(material.precio_unitario)}
                    </TableCell>
                    <TableCell>
                      {material.rendimiento_vehiculo > 0 && (
                        <div className="text-xs">{material.rendimiento_vehiculo} por vehículo</div>
                      )}
                      {material.rendimiento_hora_reparar > 0 && (
                        <div className="text-xs">{material.rendimiento_hora_reparar} por hora (rep)</div>
                      )}
                      {material.rendimiento_hora_pintura > 0 && (
                        <div className="text-xs">{material.rendimiento_hora_pintura} por hora (pin)</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">Actual: {material.inventario_final}</div>
                      <div className="text-xs">Mínimo: {material.stock_minimo}</div>
                    </TableCell>
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
        </div>
      </CardContent>
    </Card>
  )
}
