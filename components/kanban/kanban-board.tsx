"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, MoreVertical, Calendar, User, Car } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Tipos
interface KanbanColumn {
  id: string
  title: string
  color: string
  percentage: number
  items: KanbanItem[]
}

interface KanbanItem {
  id: string
  title: string
  description: string
  client: string
  vehicle: string
  assignedTo?: string
  dueDate?: string
  priority: "low" | "medium" | "high"
  status: string
  percentage: number
}

// Datos de ejemplo
const initialData: KanbanColumn[] = [
  {
    id: "column-1",
    title: "Por iniciar",
    color: "#f97316",
    percentage: 0,
    items: [
      {
        id: "item-1",
        title: "Cambio de aceite",
        description: "Cambio de aceite y filtro",
        client: "Juan Pérez",
        vehicle: "Toyota Corolla 2020",
        assignedTo: "Miguel Ángel",
        dueDate: "2024-05-15",
        priority: "medium",
        status: "pending",
        percentage: 0,
      },
      {
        id: "item-2",
        title: "Revisión de frenos",
        description: "Revisión y cambio de pastillas de freno",
        client: "María Rodríguez",
        vehicle: "Honda Civic 2019",
        assignedTo: "Fernando",
        dueDate: "2024-05-16",
        priority: "high",
        status: "pending",
        percentage: 0,
      },
    ],
  },
  {
    id: "column-2",
    title: "En diagnóstico",
    color: "#eab308",
    percentage: 25,
    items: [
      {
        id: "item-3",
        title: "Problema eléctrico",
        description: "Diagnóstico de fallo en sistema eléctrico",
        client: "Carlos Gómez",
        vehicle: "Nissan Sentra 2018",
        assignedTo: "Fernando",
        dueDate: "2024-05-14",
        priority: "high",
        status: "in-progress",
        percentage: 25,
      },
    ],
  },
  {
    id: "column-3",
    title: "En reparación",
    color: "#3b82f6",
    percentage: 50,
    items: [
      {
        id: "item-4",
        title: "Cambio de suspensión",
        description: "Reemplazo de amortiguadores delanteros",
        client: "Ana Martínez",
        vehicle: "Volkswagen Golf 2021",
        assignedTo: "Ricardo",
        dueDate: "2024-05-13",
        priority: "medium",
        status: "in-progress",
        percentage: 50,
      },
    ],
  },
  {
    id: "column-4",
    title: "En pruebas",
    color: "#a855f7",
    percentage: 75,
    items: [
      {
        id: "item-5",
        title: "Alineación y balanceo",
        description: "Alineación de dirección y balanceo de ruedas",
        client: "Roberto Sánchez",
        vehicle: "Ford Focus 2020",
        assignedTo: "Miguel Ángel",
        dueDate: "2024-05-12",
        priority: "low",
        status: "testing",
        percentage: 75,
      },
    ],
  },
  {
    id: "column-5",
    title: "Completado",
    color: "#22c55e",
    percentage: 100,
    items: [
      {
        id: "item-6",
        title: "Cambio de batería",
        description: "Reemplazo de batería agotada",
        client: "Laura Torres",
        vehicle: "Chevrolet Spark 2022",
        assignedTo: "Alejandro",
        dueDate: "2024-05-10",
        priority: "medium",
        status: "completed",
        percentage: 100,
      },
    ],
  },
]

export function KanbanBoard() {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialData)
  const [isNewItemDialogOpen, setIsNewItemDialogOpen] = useState(false)
  const [isViewItemDialogOpen, setIsViewItemDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<KanbanItem | null>(null)
  const [newItem, setNewItem] = useState<Partial<KanbanItem>>({
    title: "",
    description: "",
    client: "",
    vehicle: "",
    priority: "medium",
  })

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result

    // Si no hay destino o el destino es el mismo que el origen, no hacer nada
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Crear una copia de las columnas
    const newColumns = [...columns]

    // Encontrar las columnas de origen y destino
    const sourceColumn = newColumns.find((col) => col.id === source.droppableId)
    const destColumn = newColumns.find((col) => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn) return

    // Encontrar el item que se está moviendo
    const item = sourceColumn.items.find((item) => item.id === draggableId)
    if (!item) return

    // Actualizar el porcentaje del item según la columna de destino
    const updatedItem = { ...item, percentage: destColumn.percentage }

    // Eliminar el item de la columna de origen
    sourceColumn.items = sourceColumn.items.filter((item) => item.id !== draggableId)

    // Añadir el item a la columna de destino
    destColumn.items = [
      ...destColumn.items.slice(0, destination.index),
      updatedItem,
      ...destColumn.items.slice(destination.index),
    ]

    // Actualizar el estado
    setColumns(newColumns)

    // Mostrar notificación
    toast({
      title: "Tarea movida",
      description: `"${item.title}" movida a "${destColumn.title}"`,
    })
  }

  const handleAddNewItem = () => {
    if (!newItem.title || !newItem.client || !newItem.vehicle) {
      toast({
        title: "Error",
        description: "Por favor completa los campos requeridos.",
        variant: "destructive",
      })
      return
    }

    const newItemComplete: KanbanItem = {
      id: `item-${Date.now()}`,
      title: newItem.title || "",
      description: newItem.description || "",
      client: newItem.client || "",
      vehicle: newItem.vehicle || "",
      assignedTo: newItem.assignedTo,
      dueDate: newItem.dueDate,
      priority: (newItem.priority as "low" | "medium" | "high") || "medium",
      status: "pending",
      percentage: 0,
    }

    // Añadir el nuevo item a la primera columna
    const newColumns = [...columns]
    newColumns[0].items = [...newColumns[0].items, newItemComplete]

    setColumns(newColumns)
    setIsNewItemDialogOpen(false)
    setNewItem({
      title: "",
      description: "",
      client: "",
      vehicle: "",
      priority: "medium",
    })

    toast({
      title: "Tarea creada",
      description: `"${newItemComplete.title}" ha sido añadida al tablero.`,
    })
  }

  const handleViewItem = (item: KanbanItem) => {
    setSelectedItem(item)
    setIsViewItemDialogOpen(true)
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Alta</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Media</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Baja</Badge>
      default:
        return <Badge>{priority}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Tablero Kanban</h1>
          <p className="text-muted-foreground">Gestiona visualmente el flujo de trabajo de tu taller</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/taller/kanban-personalizado">
            <Button variant="outline">Personalizar Tablero</Button>
          </Link>
          <Button onClick={() => setIsNewItemDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Tarea
          </Button>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-4 space-x-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          {columns.map((column) => (
            <div key={column.id} className="min-w-[300px]">
              <div className="rounded-t-md p-2 text-white font-medium" style={{ backgroundColor: column.color }}>
                <div className="flex justify-between items-center">
                  <span>{column.title}</span>
                  <Badge className="bg-white/20 hover:bg-white/20">{column.items.length}</Badge>
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[500px] bg-muted/30 p-2 rounded-b-md"
                  >
                    {column.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2"
                          >
                            <Card className="cursor-pointer hover:shadow-md transition-shadow">
                              <CardHeader className="p-3 pb-0">
                                <div className="flex justify-between items-start">
                                  <CardTitle className="text-base">{item.title}</CardTitle>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                        <span className="sr-only">Acciones</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                      <DropdownMenuItem onClick={() => handleViewItem(item)}>
                                        Ver detalles
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem>Editar</DropdownMenuItem>
                                      <DropdownMenuItem>Eliminar</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                                <CardDescription className="line-clamp-2 text-xs mt-1">
                                  {item.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="p-3 pt-2">
                                <div className="flex flex-col space-y-2 text-xs">
                                  <div className="flex items-center">
                                    <User className="h-3 w-3 mr-1 text-muted-foreground" />
                                    <span>{item.client}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Car className="h-3 w-3 mr-1 text-muted-foreground" />
                                    <span>{item.vehicle}</span>
                                  </div>
                                  {item.assignedTo && (
                                    <div className="flex items-center">
                                      <Avatar className="h-5 w-5 mr-1">
                                        <AvatarFallback className="text-[10px]">
                                          {item.assignedTo
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span>{item.assignedTo}</span>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                              <CardFooter className="p-3 pt-0 flex justify-between items-center">
                                {getPriorityBadge(item.priority)}
                                {item.dueDate && (
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>{new Date(item.dueDate).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </CardFooter>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {column.items.length === 0 && (
                      <div className="flex items-center justify-center h-20 border border-dashed rounded-md text-sm text-muted-foreground">
                        No hay tareas en esta columna
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      </div>

      {/* Diálogo para nueva tarea */}
      <Dialog open={isNewItemDialogOpen} onOpenChange={setIsNewItemDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva Tarea</DialogTitle>
            <DialogDescription>Crea una nueva tarea para el tablero Kanban</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                placeholder="Título de la tarea"
                value={newItem.title || ""}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Descripción detallada de la tarea"
                value={newItem.description || ""}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Cliente *</Label>
                <Input
                  id="client"
                  placeholder="Nombre del cliente"
                  value={newItem.client || ""}
                  onChange={(e) => setNewItem({ ...newItem, client: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle">Vehículo *</Label>
                <Input
                  id="vehicle"
                  placeholder="Marca y modelo"
                  value={newItem.vehicle || ""}
                  onChange={(e) => setNewItem({ ...newItem, vehicle: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Asignar a</Label>
                <Select onValueChange={(value) => setNewItem({ ...newItem, assignedTo: value })}>
                  <SelectTrigger id="assignedTo">
                    <SelectValue placeholder="Seleccionar técnico" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Miguel Ángel">Miguel Ángel</SelectItem>
                    <SelectItem value="Fernando">Fernando</SelectItem>
                    <SelectItem value="Alejandro">Alejandro</SelectItem>
                    <SelectItem value="Ricardo">Ricardo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Fecha límite</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newItem.dueDate || ""}
                  onChange={(e) => setNewItem({ ...newItem, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select
                defaultValue="medium"
                onValueChange={(value) => setNewItem({ ...newItem, priority: value as "low" | "medium" | "high" })}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Seleccionar prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewItemDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddNewItem}>
              <Plus className="mr-2 h-4 w-4" />
              Crear Tarea
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para ver tarea */}
      <Dialog open={isViewItemDialogOpen} onOpenChange={setIsViewItemDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedItem?.title}</DialogTitle>
            <DialogDescription>Detalles de la tarea</DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <Label>Descripción</Label>
                <p className="text-sm">{selectedItem.description || "Sin descripción"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Cliente</Label>
                  <p className="text-sm">{selectedItem.client}</p>
                </div>

                <div className="space-y-1">
                  <Label>Vehículo</Label>
                  <p className="text-sm">{selectedItem.vehicle}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Asignado a</Label>
                  <p className="text-sm">{selectedItem.assignedTo || "No asignado"}</p>
                </div>

                <div className="space-y-1">
                  <Label>Fecha límite</Label>
                  <p className="text-sm">
                    {selectedItem.dueDate ? new Date(selectedItem.dueDate).toLocaleDateString() : "Sin fecha límite"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Prioridad</Label>
                  <div>{getPriorityBadge(selectedItem.priority)}</div>
                </div>

                <div className="space-y-1">
                  <Label>Progreso</Label>
                  <p className="text-sm">{selectedItem.percentage}%</p>
                </div>
              </div>

              <div className="space-y-1">
                <Label>Estado</Label>
                <p className="text-sm capitalize">{selectedItem.status.replace("-", " ")}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewItemDialogOpen(false)}>
              Cerrar
            </Button>
            <Button>Editar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
