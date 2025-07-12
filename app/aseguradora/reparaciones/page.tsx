"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2, History, CheckCircle, Clock } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import REPARACIONES_SERVICES, { type ReparacionType } from "@/services/REPARACIONES_SERVICES.service"
import TALLER_SERVICES, { TallerType } from "@/services/TALLER_SERVICES.SERVICE"
import SINIESTROS_SERVICES, { SiniestroType } from "@/services/SINIESTROS_SERVICES.service"

export default function ReparacionesPage() {
  const [reparaciones, setReparaciones] = useState<ReparacionType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReparacion, setSelectedReparacion] = useState<ReparacionType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [State_Talleres, SetState_Talleres] = useState<TallerType[]>([])
  const [State_Siniestros, SetState_Siniestros] = useState<SiniestroType[]>([])

  const [formData, setFormData] = useState<ReparacionType>({
    siniestro_id: "",
    taller_id: "",
    fecha_inicio: "",
    fecha_fin_estimada: "",
    fecha_fin_real: "",
    estado: "pendiente",
    costo_total: 0,
    descripcion_trabajo: ""
  })

  useEffect(() => {
    loadReparaciones()
  }, [])

  const FN_GET_TALLERES = async () => {
    const res = await TALLER_SERVICES.GET_ALL_TALLERES();
    SetState_Talleres(res)

  };
  const FN_GET_SINIESTROS = async () => {
    const res = await SINIESTROS_SERVICES.GET_SINIESTROS();
    SetState_Siniestros(res)
  };

  const loadReparaciones = async () => {
    try {
      setLoading(true)
      const data = await REPARACIONES_SERVICES.GET_REPARACIONES()
      setReparaciones(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las reparaciones",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing && selectedReparacion) {
        await REPARACIONES_SERVICES.UPDATE_REPARACION({ ...formData, id: selectedReparacion.id })
        toast({
          title: "Éxito",
          description: "Reparación actualizada correctamente"
        })
      } else {
        await REPARACIONES_SERVICES.INSERT_REPARACION(formData)
        toast({
          title: "Éxito",
          description: "Reparación creada correctamente"
        })
      }
      setIsDialogOpen(false)
      resetForm()
      loadReparaciones()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la reparación",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Está seguro de eliminar esta reparación?")) {
      try {
        await REPARACIONES_SERVICES.DELETE_REPARACION(id)
        toast({
          title: "Éxito",
          description: "Reparación eliminada correctamente"
        })
        loadReparaciones()
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar la reparación",
          variant: "destructive"
        })
      }
    }
  }

  const handleFinalizarReparacion = async (id: string) => {
    const costoFinal = prompt("Ingrese el costo final de la reparación:")
    if (costoFinal) {
      try {
        await REPARACIONES_SERVICES.FINALIZAR_REPARACION(
          id,
          new Date().toISOString(),
          parseFloat(costoFinal)
        )
        toast({
          title: "Éxito",
          description: "Reparación finalizada correctamente"
        })
        loadReparaciones()
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo finalizar la reparación",
          variant: "destructive"
        })
      }
    }
  }

  const resetForm = () => {
    FN_GET_TALLERES();
    FN_GET_SINIESTROS();
    setFormData({
      siniestro_id: "",
      taller_id: "",
      fecha_inicio: "",
      fecha_fin_estimada: "",
      fecha_fin_real: "",
      estado: "pendiente",
      costo_total: 0,
      descripcion_trabajo: ""
    })
    setSelectedReparacion(null)
    setIsEditing(false)
  }

  const openEditDialog = (reparacion: ReparacionType) => {
    setFormData(reparacion)
    setSelectedReparacion(reparacion)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pendiente: "outline",
      en_proceso: "secondary",
      completada: "default",
      cancelada: "destructive"
    }
    return <Badge variant={variants[estado] || "outline"}>{estado}</Badge>
  }

  const filteredReparaciones = reparaciones.filter(reparacion =>
    reparacion.descripcion_trabajo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reparacion.estado?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <History className="h-8 w-8" />
            Gestión de Reparaciones
          </h1>
          <p className="text-muted-foreground">
            Administre las reparaciones en proceso y su seguimiento
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Reparación
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Editar Reparación" : "Nueva Reparación"}
              </DialogTitle>
              <DialogDescription>
                {isEditing ? "Modifique los datos de la reparación" : "Complete la información de la nueva reparación"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
                  <Input
                    id="fecha_inicio"
                    type="datetime-local"
                    value={isEditing ? formData.fecha_inicio.slice(0, 16) :formData.fecha_inicio}
                    onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fecha_fin_estimada">Fecha Fin Estimada</Label>
                  <Input
                    id="fecha_fin_estimada"
                    type="datetime-local"
                    value={ isEditing ? formData.fecha_fin_estimada.slice(0, 16) : formData.fecha_fin_estimada}
                    onChange={(e) => setFormData({ ...formData, fecha_fin_estimada: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="fecha_fin_estimada">Fecha Fin Real</Label>
                  <Input
                    id="fecha_fin_estimada"
                    type="datetime-local"
                    value={isEditing ? formData.fecha_fin_real.slice(0, 16) : formData.fecha_fin_real}
                    onChange={(e) => setFormData({ ...formData, fecha_fin_real: e.target.value })}
                  />
                </div>
                <div className="space-y-2">

                  <Label htmlFor="talleres">Selecciona el taller</Label>
                  <Select value={formData.taller_id} onValueChange={(value) => setFormData({ ...formData, taller_id: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {
                        State_Talleres.map(taller => (
                          <SelectItem key={taller.id} value={taller.id}>{taller.nombre}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">

                  <Label htmlFor="siniestros">Selecciona Siniestro</Label>
                  <Select value={formData.siniestro_id.toString()} onValueChange={(value) => setFormData({ ...formData, siniestro_id: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {
                        State_Siniestros.map(sini => (
                          <SelectItem value={sini.id.toString()}>SINIESTRO - {sini.numero_siniestro}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>

              </div>


              <div className="space-y-2">
                <Label htmlFor="descripcion_trabajo">Descripción del Trabajo</Label>
                <Textarea
                  id="descripcion_trabajo"
                  value={formData.descripcion_trabajo}
                  onChange={(e) => setFormData({ ...formData, descripcion_trabajo: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="en_proceso">En Proceso</SelectItem>
                      <SelectItem value="completada">Completada</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costo_total">Costo Total</Label>
                  <Input
                    id="costo_total"
                    type="number"
                    step="0.01"
                    value={formData.costo_total}
                    onChange={(e) => setFormData({ ...formData, costo_total: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {isEditing ? "Actualizar" : "Crear"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4" />
        <Input
          placeholder="Buscar reparaciones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Reparaciones</CardTitle>
          <CardDescription>
            {filteredReparaciones.length} reparación(es) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead>Fecha Inicio</TableHead>
                <TableHead>Fecha Fin Est.</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Costo</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : filteredReparaciones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No se encontraron reparaciones
                  </TableCell>
                </TableRow>
              ) : (
                filteredReparaciones.map((reparacion) => (
                  <TableRow key={reparacion.id}>
                    <TableCell className="max-w-xs truncate">
                      {reparacion.descripcion_trabajo}
                    </TableCell>
                    <TableCell>
                      {reparacion.fecha_inicio ? new Date(reparacion.fecha_inicio).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      {reparacion.fecha_fin_estimada ? new Date(reparacion.fecha_fin_estimada).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      {getEstadoBadge(reparacion.estado || 'pendiente')}
                    </TableCell>
                    <TableCell>
                      ${reparacion.costo_total?.toLocaleString() || '0'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(reparacion)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {reparacion.estado === 'en_proceso' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFinalizarReparacion(reparacion.id!)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(reparacion.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}