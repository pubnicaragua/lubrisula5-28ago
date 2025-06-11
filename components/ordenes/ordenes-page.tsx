"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Edit, MoreHorizontal, Plus, Search, Trash2, Eye } from "lucide-react"
import { ExportData } from "@/components/ui/export-data"
import Link from "next/link"

export function OrdenesPage() {
  const [ordenes, setOrdenes] = useState([])
  const [filteredOrdenes, setFilteredOrdenes] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [ordenToDelete, setOrdenToDelete] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchOrdenes()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = ordenes.filter(
        (orden: any) =>
          orden.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          orden.cliente?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          orden.vehiculo?.placa?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredOrdenes(filtered)
    } else {
      setFilteredOrdenes(ordenes)
    }
  }, [searchTerm, ordenes])

  const fetchOrdenes = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("ordenes_trabajo")
        .select(`
          *,
          cliente:cliente_id(*),
          vehiculo:vehiculo_id(*),
          tecnico:tecnico_asignado(*)
        `)
        .order("fecha_ingreso", { ascending: false })

      if (error) throw error

      setOrdenes(data || [])
      setFilteredOrdenes(data || [])
    } catch (error) {
      console.error("Error fetching ordenes:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las órdenes de trabajo",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteOrden = async () => {
    if (!ordenToDelete) return

    try {
      const { error } = await supabase.from("ordenes_trabajo").delete().eq("id", ordenToDelete)

      if (error) throw error

      setOrdenes(ordenes.filter((orden: any) => orden.id !== ordenToDelete))
      toast({
        title: "Orden eliminada",
        description: "La orden de trabajo ha sido eliminada exitosamente",
      })
    } catch (error) {
      console.error("Error deleting orden:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la orden de trabajo",
        variant: "destructive",
      })
    } finally {
      setOrdenToDelete(null)
      setShowDeleteDialog(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pendiente: { label: "Pendiente", variant: "outline" },
      en_proceso: { label: "En Proceso", variant: "secondary" },
      completado: { label: "Completado", variant: "default" },
      cancelado: { label: "Cancelado", variant: "destructive" },
    }

    const statusInfo = statusMap[status] || { label: status, variant: "outline" }

    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const priorityMap: Record<string, { label: string; className: string }> = {
      baja: { label: "Baja", className: "bg-green-100 text-green-800" },
      normal: { label: "Normal", className: "bg-blue-100 text-blue-800" },
      alta: { label: "Alta", className: "bg-amber-100 text-amber-800" },
      urgente: { label: "Urgente", className: "bg-red-100 text-red-800" },
    }

    const priorityInfo = priorityMap[priority] || { label: priority, className: "" }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.className}`}>
        {priorityInfo.label}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const exportData = filteredOrdenes.map((orden: any) => ({
    ID: orden.id,
    Cliente: `${orden.cliente?.nombre || ""} ${orden.cliente?.apellido || ""}`,
    Vehículo: `${orden.vehiculo?.marca || ""} ${orden.vehiculo?.modelo || ""} (${orden.vehiculo?.placa || ""})`,
    Descripción: orden.descripcion,
    "Tipo de Servicio": orden.tipo_servicio,
    "Fecha de Ingreso": formatDate(orden.fecha_ingreso),
    "Fecha Estimada de Entrega": formatDate(orden.fecha_estimada_entrega),
    "Técnico Asignado": `${orden.tecnico?.nombre || ""} ${orden.tecnico?.apellido || ""}`,
    Prioridad: orden.prioridad,
    Estado: orden.estado,
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Órdenes de Trabajo</h2>
        <Link href="/taller/ordenes/nueva">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nueva Orden
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Órdenes</CardTitle>
          <CardDescription>Administra todas las órdenes de trabajo del taller</CardDescription>
          <div className="flex justify-between items-center mt-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar órdenes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <ExportData data={exportData} fileName="ordenes-trabajo" title="Órdenes de Trabajo" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Ingreso</TableHead>
                    <TableHead>Entrega Est.</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrdenes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        No se encontraron órdenes de trabajo
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrdenes.map((orden: any) => (
                      <TableRow key={orden.id}>
                        <TableCell className="font-medium">{orden.id}</TableCell>
                        <TableCell>
                          {orden.cliente?.nombre} {orden.cliente?.apellido}
                        </TableCell>
                        <TableCell>
                          {orden.vehiculo?.marca} {orden.vehiculo?.modelo} ({orden.vehiculo?.placa})
                        </TableCell>
                        <TableCell>{orden.tipo_servicio}</TableCell>
                        <TableCell>{formatDate(orden.fecha_ingreso)}</TableCell>
                        <TableCell>{formatDate(orden.fecha_estimada_entrega)}</TableCell>
                        <TableCell>{getPriorityBadge(orden.prioridad)}</TableCell>
                        <TableCell>{getStatusBadge(orden.estado)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menú</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => router.push(`/taller/ordenes/${orden.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/taller/ordenes/${orden.id}/editar`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setOrdenToDelete(orden.id)
                                  setShowDeleteDialog(true)
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta orden de trabajo? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteOrden}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
