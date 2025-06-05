"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { supabaseClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth/auth-context"
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

export function KanbanBoard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [columns, setColumns] = useState<any[]>([])
  const [cards, setCards] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [vehicles, setVehicles] = useState<any[]>([])
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
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Obtener columnas
        const { data: columnsData, error: columnsError } = await supabaseClient
          .from("kanban_columns")
          .select("*")
          .order("position", { ascending: true })

        if (columnsError) {
          console.error("Error al obtener columnas:", columnsError)
          toast({
            title: "Error",
            description: "No se pudieron cargar las columnas del tablero Kanban",
            variant: "destructive",
          })
        } else {
          // Si no hay columnas, crear las columnas por defecto
          if (!columnsData || columnsData.length === 0) {
            await createDefaultColumns()
            const { data: newColumnsData } = await supabaseClient
              .from("kanban_columns")
              .select("*")
              .order("position", { ascending: true })
            setColumns(newColumnsData || [])
          } else {
            setColumns(columnsData || [])
          }
        }

        // Obtener tarjetas
        const { data: cardsData, error: cardsError } = await supabaseClient
          .from("kanban_cards")
          .select("*, vehicle:vehicle_id(*)")
          .order("position", { ascending: true })

        if (cardsError) {
          console.error("Error al obtener tarjetas:", cardsError)
          toast({
            title: "Error",
            description: "No se pudieron cargar las tarjetas del tablero Kanban",
            variant: "destructive",
          })
        } else {
          setCards(cardsData || [])
        }

        // Obtener vehículos
        const { data: vehiclesData, error: vehiclesError } = await supabaseClient
          .from("vehiculos")
          .select("*")
          .order("created_at", { ascending: false })

        if (vehiclesError) {
          console.error("Error al obtener vehículos:", vehiclesError)
        } else {
          setVehicles(vehiclesData || [])
        }
      } catch (error) {
        console.error("Error al cargar datos del tablero Kanban:", error)
        toast({
          title: "Error",
          description: "Ocurrió un error al cargar el tablero Kanban",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const createDefaultColumns = async () => {
    const defaultColumns = [
      { id: "por_hacer", title: "Por Hacer", position: 0, color: "#3b82f6" },
      { id: "en_proceso", title: "En Proceso", position: 1, color: "#f59e0b" },
      { id: "en_revision", title: "En Revisión", position: 2, color: "#8b5cf6" },
      { id: "completado", title: "Completado", position: 3, color: "#10b981" },
    ]

    try {
      const { error } = await supabaseClient.from("kanban_columns").insert(defaultColumns)
      if (error) {
        console.error("Error al crear columnas por defecto:", error)
        toast({
          title: "Error",
          description: "No se pudieron crear las columnas por defecto",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al crear columnas por defecto:", error)
    }
  }

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result

    // Si no hay destino o el destino es el mismo que el origen, no hacer nada
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Crear una copia de las tarjetas
    const newCards = [...cards]

    // Encontrar la tarjeta que se está moviendo
    const movedCard = newCards.find((card) => card.id === draggableId)

    if (!movedCard) return

    // Actualizar la posición y columna de la tarjeta
    movedCard.column_id = destination.droppableId
    movedCard.position = destination.index

    // Actualizar el estado local
    setCards(newCards)

    // Actualizar en la base de datos
    try {
      const { error } = await supabaseClient
        .from("kanban_cards")
        .update({
          column_id: destination.droppableId,
          position: destination.index,
        })
        .eq("id", draggableId)

      if (error) {
        console.error("Error al actualizar la tarjeta:", error)
        toast({
          title: "Error",
          description: "No se pudo actualizar la posición de la tarjeta",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al actualizar la tarjeta:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar la tarjeta",
        variant: "destructive",
      })
    }
  }

  const handleCreateCard = async () => {
    if (!newCard.title || !newCard.client_name) {
      toast({
        title: "Campos requeridos",
        description: "Por favor complete los campos requeridos",
        variant: "destructive",
      })
      return
    }

    try {
      // Obtener la posición más alta en la columna destino
      const columnCards = cards.filter((card) => card.column_id === newCard.column_id)
      const position = columnCards.length

      const cardData = {
        ...newCard,
        position,
        created_by: user?.id,
        created_at: new Date().toISOString(),
      }

      const { data, error } = await supabaseClient.from("kanban_cards").insert(cardData).select()

      if (error) {
        console.error("Error al crear la tarjeta:", error)
        toast({
          title: "Error",
          description: "No se pudo crear la tarjeta",
          variant: "destructive",
        })
      } else {
        // Actualizar el estado local
        setCards([...cards, data[0]])
        // Limpiar el formulario
        setNewCard({
          title: "",
          description: "",
          client_name: "",
          vehicle_id: "",
          priority: "normal",
          column_id: "por_hacer",
        })
        // Cerrar el diálogo
        setIsDialogOpen(false)
        toast({
          title: "Tarjeta creada",
          description: "La tarjeta se ha creado correctamente",
        })
      }
    } catch (error) {
      console.error("Error al crear la tarjeta:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al crear la tarjeta",
        variant: "destructive",
      })
    }
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
        <h1 className="text-2xl font-bold">Tablero Kanban</h1>
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
                    {vehicles.length > 0 ? (
                      vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.marca} {vehicle.modelo} ({vehicle.placa})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-vehicles" disabled>
                        No hay vehículos disponibles
                      </SelectItem>
                    )}
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
                                {card.due_date && (
                                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>{new Date(card.due_date).toLocaleDateString()}</span>
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
