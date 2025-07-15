"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Wrench, Plus, Edit, Trash2, Save } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import TALLER_CONFIG_SERVICES, { type TallerConfigType } from "@/services/TALLER_CONFIG_SERVICES.service"

type ServicioType = {
  id: string
  nombre: string
  descripcion: string
  precio: number
  duracion: string
  activo: boolean
}

export default function ServiciosConfig() {
  const [config, setConfig] = useState<TallerConfigType>({})
  const [servicios, setServicios] = useState<ServicioType[]>([])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedServicio, setSelectedServicio] = useState<ServicioType | null>(null)

  const [formData, setFormData] = useState<ServicioType>({
    id: "",
    nombre: "",
    descripcion: "",
    precio: 0,
    duracion: "",
    activo: true
  })

  useEffect(() => {
    loadConfiguracion()
  }, [])

  const loadConfiguracion = async () => {
    try {
      setLoading(true)
      const taller_id = "current-taller-id"
      const data = await TALLER_CONFIG_SERVICES.GET_CONFIGURACION_TALLER(taller_id)
      setConfig(data)

      if (data.servicios_disponibles) {
        setServicios(data.servicios_disponibles)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la configuración de servicios",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const configActualizada = {
        ...config,
        servicios_disponibles: servicios
      }

      if (config.id) {
        await TALLER_CONFIG_SERVICES.UPDATE_CONFIGURACION_TALLER(configActualizada)
      } else {
        await TALLER_CONFIG_SERVICES.INSERT_CONFIGURACION_TALLER(configActualizada)
      }

      toast({
        title: "Éxito",
        description: "Servicios guardados correctamente"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron guardar los servicios",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitServicio = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEditing && selectedServicio) {
      const serviciosActualizados = servicios.map(s =>
        s.id === selectedServicio.id ? formData : s
      )
      setServicios(serviciosActualizados)
    } else {
      const nuevoServicio = {
        ...formData,
        id: Date.now().toString()
      }
      setServicios([...servicios, nuevoServicio])
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      id: "",
      nombre: "",
      descripcion: "",
      precio: 0,
      duracion: "",
      activo: true
    })
    setSelectedServicio(null)
    setIsEditing(false)
  }

  const openEditDialog = (servicio: ServicioType) => {
    setFormData(servicio)
    setSelectedServicio(servicio)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const deleteServicio = (id: string) => {
    if (confirm("¿Está seguro de eliminar este servicio?")) {
      setServicios(servicios.filter(s => s.id !== id))
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Wrench className="h-8 w-8" />
            Configuración de Servicios
          </h1>
          <p className="text-muted-foreground">
            Administra los servicios que ofrece tu taller
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Servicio
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Editar Servicio" : "Nuevo Servicio"}
                </DialogTitle>
                <DialogDescription>
                  {isEditing ? "Modifica los datos del servicio" : "Agrega un nuevo servicio al taller"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitServicio} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del Servicio</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="precio">Precio</Label>
                    <Input
                      id="precio"
                      type="number"
                      step="0.01"
                      value={formData.precio}
                      onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duracion">Duración Estimada</Label>
                    <Input
                      id="duracion"
                      placeholder="Ej: 2 horas"
                      value={formData.duracion}
                      onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="activo"
                    checked={formData.activo}
                    onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
                  />
                  <Label htmlFor="activo">Servicio Activo</Label>
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
          <Button onClick={handleSave} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Servicios</CardTitle>
          <CardDescription>
            {servicios.length} servicio(s) configurado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Duración</TableHead>
              <TableHead>Estado</TableHead>
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
            ) : servicios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No hay servicios configurados
                </TableCell>
              </TableRow>
            ) : (
              servicios.map((servicio) => (
                <TableRow key={servicio.id}>
                  <TableCell className="font-medium">
                    {servicio.nombre}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {servicio.descripcion}
                  </TableCell>
                  <TableCell>
                    ${servicio.precio.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {servicio.duracion}
                  </TableCell>
                  <TableCell>
                    <Badge variant={servicio.activo ? "default" : "secondary"}>
                      {servicio.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(servicio)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteServicio(servicio.id)}
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
    </div >  
  )
}