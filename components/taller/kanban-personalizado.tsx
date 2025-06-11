"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"

interface KanbanColumn {
  id: string
  title: string
  color: string
}

interface KanbanConfiguration {
  tipoTaller: string
  columnas: KanbanColumn[]
  mostrarPorcentajes: boolean
  mostrarTiempoEstimado: boolean
  mostrarAsignados: boolean
}

const defaultColumns: KanbanColumn[] = [
  { id: "col-1", title: "Pendiente", color: "#ef4444" }, // red-500
  { id: "col-2", title: "En Proceso", color: "#f97316" }, // orange-500
  { id: "col-3", title: "En Espera", color: "#eab308" }, // yellow-500
  { id: "col-4", title: "Control de Calidad", color: "#22c55e" }, // green-500
  { id: "col-5", title: "Finalizado", color: "#3b82f6" }, // blue-500
]

export function KanbanPersonalizado() {
  const { toast } = useToast()
  const [config, setConfig] = useState<KanbanConfiguration>({
    tipoTaller: "mecanica",
    columnas: defaultColumns,
    mostrarPorcentajes: true,
    mostrarTiempoEstimado: true,
    mostrarAsignados: true,
  })

  useEffect(() => {
    // Cargar configuración desde localStorage
    const savedConfig = localStorage.getItem("kanbanConfig")
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig))
    }
  }, [])

  const handleAddColumn = () => {
    const newColumn: KanbanColumn = {
      id: `col-${Date.now()}`,
      title: "Nueva Columna",
      color: "#6b7280", // gray-500
    }
    setConfig((prev) => ({
      ...prev,
      columnas: [...prev.columnas, newColumn],
    }))
  }

  const handleRemoveColumn = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      columnas: prev.columnas.filter((col) => col.id !== id),
    }))
  }

  const handleColumnChange = (id: string, field: keyof KanbanColumn, value: string) => {
    setConfig((prev) => ({
      ...prev,
      columnas: prev.columnas.map((col) => (col.id === id ? { ...col, [field]: value } : col)),
    }))
  }

  const handleConfigChange = (field: keyof KanbanConfiguration, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const reorderedColumns = Array.from(config.columnas)
    const [movedColumn] = reorderedColumns.splice(result.source.index, 1)
    reorderedColumns.splice(result.destination.index, 0, movedColumn)

    setConfig((prev) => ({
      ...prev,
      columnas: reorderedColumns,
    }))
  }

  const handleSaveConfiguration = () => {
    localStorage.setItem("kanbanConfig", JSON.stringify(config))
    toast({
      title: "Configuración guardada",
      description: "La configuración del tablero Kanban ha sido actualizada.",
    })
    console.log("Configuración guardada:", config) // Para depuración
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
          <h1 className="text-3xl font-bold tracking-tight">Personalizar Tablero Kanban</h1>
          <Button onClick={handleSaveConfiguration}>Guardar Configuración</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuración General</CardTitle>
            <CardDescription>Ajusta las opciones principales de tu tablero Kanban.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="mostrarPorcentajes">Mostrar Porcentajes de Avance</Label>
                <Switch
                  id="mostrarPorcentajes"
                  checked={config.mostrarPorcentajes}
                  onCheckedChange={(checked) => handleConfigChange("mostrarPorcentajes", checked)}
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="mostrarTiempoEstimado">Mostrar Tiempo Estimado</Label>
                <Switch
                  id="mostrarTiempoEstimado"
                  checked={config.mostrarTiempoEstimado}
                  onCheckedChange={(checked) => handleConfigChange("mostrarTiempoEstimado", checked)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="mostrarAsignados">Mostrar Técnicos Asignados</Label>
                <Switch
                  id="mostrarAsignados"
                  checked={config.mostrarAsignados}
                  onCheckedChange={(checked) => handleConfigChange("mostrarAsignados", checked)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tipoTaller">Tipo de Taller</Label>
                <Select onValueChange={(value) => handleConfigChange("tipoTaller", value)} value={config.tipoTaller}>
                  <SelectTrigger id="tipoTaller">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mecanica">Mecánica General</SelectItem>
                    <SelectItem value="pintura">Pintura y Carrocería</SelectItem>
                    <SelectItem value="electrica">Eléctrica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Columnas del Tablero</CardTitle>
            <CardDescription>Define las columnas de tu tablero Kanban. Arrastra para reordenar.</CardDescription>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="columns">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {config.columnas.map((column, index) => (
                      <Draggable key={column.id} draggableId={column.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center gap-4 rounded-md border p-4"
                          >
                            <div {...provided.dragHandleProps} className="cursor-grab">
                              <GripVertical className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="grid flex-1 gap-2 sm:grid-cols-2">
                              <div className="grid gap-1">
                                <Label htmlFor={`title-${column.id}`}>Título</Label>
                                <Input
                                  id={`title-${column.id}`}
                                  value={column.title}
                                  onChange={(e) => handleColumnChange(column.id, "title", e.target.value)}
                                />
                              </div>
                              <div className="grid gap-1">
                                <Label htmlFor={`color-${column.id}`}>Color</Label>
                                <Input
                                  id={`color-${column.id}`}
                                  type="color"
                                  value={column.color}
                                  onChange={(e) => handleColumnChange(column.id, "color", e.target.value)}
                                />
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveColumn(column.id)}
                              title="Eliminar columna"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <Button variant="outline" className="mt-4 w-full" onClick={handleAddColumn}>
              <Plus className="mr-2 h-4 w-4" /> Añadir Columna
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
