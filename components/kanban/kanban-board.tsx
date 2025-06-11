"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, AlertCircle, Car, User, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

// Mock data para demo
const mockVehicles = [
  { id: "1", marca: "Toyota", modelo: "Corolla", placa: "ABC-123" },
  { id: "2", marca: "Honda", modelo: "Civic", placa: "DEF-456" },
  { id: "3", marca: "Chevrolet", modelo: "Spark", placa: "GHI-789" },
]

// Columnas por defecto si no hay configuración guardada
const defaultColumns = [
  { id: "por_hacer", title: "Por Hacer", position: 0, color: "#f97316" },
  { id: "en_proceso", title: "En Proceso", position: 1, color: "#3b82f6" },
  { id: "en_revision", title: "En Revisión", position: 2, color: "#8b5cf6" },
  { id: "completado", title: "Completado", position: 3, color: "#10b981" },
]

// Mock data para tarjetas
const defaultCards = [
  {
    id: "card-1",
    title: "Cambio de aceite",
    description: "Cambio de aceite y filtro",
    client_name: "Juan Pérez",
    vehicle_id: "1",
    priority: "normal",
    column_id: "por_hacer",
    position: 0,
    due_date: "2024-06-15",
    vehicle: { marca: "Toyota", modelo: "Corolla 2020" },
  },
  {
    id: "card-2",
    title: "Problema eléctrico",
    description: "Diagnóstico de fallo en sistema eléctrico",
    client_name: "Carlos Gómez",
    vehicle_id: "2",
    priority: "alta",
    column_id: "en_proceso",
    position: 0,
    due_date: "2024-06-14",
    vehicle: { marca: "Nissan", modelo: "Sentra 2018" },
  },
  {
    id: "card-3",
    title: "Cambio de suspensión",
    description: "Reemplazo de amortiguadores delanteros",
    client_name: "Ana Martínez",
    vehicle_id: "3",
    priority: "normal",
    column_id: "en_proceso",
    position: 1,
    due_date: "2024-06-13",
    vehicle: { marca: "Volkswagen", modelo: "Golf 2021" },
  },
  {
    id: "card-4",
    title: "Alineación y balanceo",
    description: "Alineación de dirección y balanceo de ruedas",
    client_name: "Roberto Sánchez",
    vehicle_id: "1",
    priority: "baja",
    column_id: "en_revision",
    position: 0,
    due_date: "2024-06-12",
    vehicle: { marca: "Ford", modelo: "Focus 2020" },
  },
  {
    id: "card-5",
    title: "Cambio de batería",
    description: "Reemplazo de batería agotada",
    client_name: "Laura Torres",
    vehicle_id: "2",
    priority: "normal",
    column_id: "completado",
    position: 0,
    due_date: "2024-06-10",
    vehicle: { marca: "Chevrolet", modelo: "Spark 2022" },
  },
  {
    id: "card-6",
    title: "Revisión de frenos",
    description: "Revisión y cambio de pastillas de freno",
    client_name: "María Rodríguez",
    vehicle_id: "3",
    priority: "alta",
    column_id: "por_hacer",
    position: 1,
    due_date: "2024-06-16",
    vehicle: { marca: "Honda", modelo: "Civic 2019" },
  },
]

export function KanbanBoard() {
  const { toast } = useToast()
  const [columns, setColumns] = useState(defaultColumns)
  const [cards, setCards] = useState(defaultCards)
  const [isLoading, setIsLoading] = useState(true)
  const [vehicles, setVehicles] = useState(mockVehicles)
  const [kanbanConfig, setKanbanConfig] = useState<any>(null)
  const [newCard, setNewCard] = useState({
    title: "",
    description: "",
    client_name: "",
    vehicle_id: "",
    priority: "normal",
    column_id: "por_hacer",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const loadConfig = () => {
      if (typeof window !== "undefined") {
        const savedConfig = localStorage.getItem("kanbanConfig")
        if (savedConfig) {
          const config = JSON.parse(savedConfig)
          setKanbanConfig(config)

          // Usar las columnas personalizadas si existen
          if (config.columnas && config.columnas.length > 0) {
            const customColumns = config.columnas.map((col: any, index: number) => ({
              id: col.id || `col-${index}`,
              title: col.nombre,
              position: index,
              color: col.color || "#64748b",
            }))
            setColumns(customColumns)
          }
        }

        // Cargar tarjetas guardadas o usar las por defecto
        const savedCards = localStorage.getItem("kanbanCards")
        if (savedCards) {
          setCards(JSON.parse(savedCards))
        } else {
          localStorage.setItem("kanbanCards", JSON.stringify(defaultCards))
        }
      }
      setIsLoading(false)
    }

    loadConfig()
  }, [])

  // Guardar tarjetas en localStorage cuando cambien
  useEffect(() => {
    if (typeof window !== "undefined" && !isLoading) {
      localStorage.setItem("kanbanCards", JSON.stringify(cards))
    }
  }, [cards, isLoading])

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    const newCards = [...cards]
    const movedCard = newCards.find((card) => card.id === draggableId)

    if (!movedCard) return

    movedCard.column_id = destination.droppableId
    movedCard.position = destination.index

    setCards(newCards)

    toast({
      title: "Tarjeta movida",
      description: `Tarjeta movida a ${columns.find((col) => col.id === destination.droppableId)?.title}`,
    })
  }

  const handleCreateCard = () => {
    if (!newCard.title || !newCard.client_name) {
      toast({
        title: "Campos requeridos",
        description: "Por favor complete los campos requeridos",
        variant: "destructive",
      })
      return
    }

    const columnCards = cards.filter((card) => card.column_id === newCard.column_id)
    const position = columnCards.length

    const cardData = {
      ...newCard,
      id: `card-${Date.now()}`,
      position,
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      vehicle: vehicles.find((v) => v.id === newCard.vehicle_id) || null,
    }

    setCards([...cards, cardData])
    setNewCard({
      title: "",
      description: "",
      client_name: "",
      vehicle_id: "",
      priority: "normal",
      column_id: "por_hacer",
    })
    setIsDialogOpen(false)

    toast({
      title: "Tarjeta creada",
      description: "La tarjeta se ha creado correctamente",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tablero Kanban</h1>
          <p className="text-muted-foreground">
            {kanbanConfig ? `Configuración: ${kanbanConfig.tipoTaller}` : "Configuración por defecto"}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Tarea
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Tarea</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Título
                </Label>
                <Input
                  id="title"
                  value={newCard.title}
                  onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  value={newCard.description}
                  onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="client_name" className="text-right">
                  Cliente
                </Label>
                <Input
                  id="client_name"
                  value={newCard.client_name}
                  onChange={(e) => setNewCard({ ...newCard, client_name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vehicle_id" className="text-right">
                  Vehículo
                </Label>
                <Select
                  value={newCard.vehicle_id}
                  onValueChange={(value) => setNewCard({ ...newCard, vehicle_id: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar vehículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.marca} {vehicle.modelo} ({vehicle.placa})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Prioridad
                </Label>
                <Select value={newCard.priority} onValueChange={(value) => setNewCard({ ...newCard, priority: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baja">Baja</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="column_id" className="text-right">
                  Columna
                </Label>
                <Select
                  value={newCard.column_id}
                  onValueChange={(value) => setNewCard({ ...newCard, column_id: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar columna" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map((column) => (
                      <SelectItem key={column.id} value={column.id}>
                        {column.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleCreateCard}>Crear Tarea</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div
                className="p-2 rounded-t-md font-medium text-white"
                style={{ backgroundColor: column.color || "#3b82f6" }}
              >
                {column.title} ({cards.filter((card) => card.column_id === column.id).length})
                {kanbanConfig?.mostrarPorcentajes && (
                  <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {kanbanConfig.columnas?.find((c: any) => c.nombre === column.title)?.porcentaje || 0}%
                  </span>
                )}
              </div>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-muted/30 p-2 rounded-b-md flex-1 min-h-[500px]"
                  >
                    {cards
                      .filter((card) => card.column_id === column.id)
                      .map((card, index) => (
                        <Draggable key={card.id} draggableId={card.id} index={index}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-2 cursor-grab active:cursor-grabbing"
                            >
                              <CardHeader className="p-3 pb-0">
                                <div className="flex justify-between items-start">
                                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                                  <Badge
                                    variant={
                                      card.priority === "alta"
                                        ? "destructive"
                                        : card.priority === "baja"
                                          ? "outline"
                                          : "default"
                                    }
                                  >
                                    {card.priority}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="p-3 pt-2">
                                {card.description && <p className="text-xs mb-2">{card.description}</p>}
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <User className="h-3 w-3 mr-1" />
                                  <span className="mr-2">{card.client_name}</span>
                                  {card.vehicle && (
                                    <>
                                      <Car className="h-3 w-3 mr-1" />
                                      <span>
                                        {card.vehicle.marca} {card.vehicle.modelo}
                                      </span>
                                    </>
                                  )}
                                </div>
                                {card.due_date && kanbanConfig?.mostrarTiempoEstimado && (
                                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>{new Date(card.due_date).toLocaleDateString()}</span>
                                  </div>
                                )}
                                {kanbanConfig?.mostrarAsignados && (
                                  <div className="flex items-center gap-1 mt-2">
                                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-white">
                                      {card.client_name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .substring(0, 2)}
                                    </div>
                                    <span className="text-xs">Técnico Asignado</span>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                    {cards.filter((card) => card.column_id === column.id).length === 0 && (
                      <div className="flex flex-col items-center justify-center h-20 text-center text-muted-foreground">
                        <AlertCircle className="h-4 w-4 mb-1" />
                        <p className="text-xs">No hay tareas</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
