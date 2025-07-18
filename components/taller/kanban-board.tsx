"use client"  
  
import { useState, useEffect } from "react"  
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"  
import { supabaseClient } from "@/lib/supabase/client"  
import { useAuth } from "@/lib/auth/auth-context"  
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"  
import { Button } from "@/components/ui/button"  
import { Badge } from "@/components/ui/badge"  
import { PlusCircle, Car, User, Calendar } from "lucide-react"  
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"  
import { Input } from "@/components/ui/input"  
import { Label } from "@/components/ui/label"  
import { Textarea } from "@/components/ui/textarea"  
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"  
import { useToast } from "@/hooks/use-toast"  
import KANBAN_SERVICES from "@/services/KANBAN_SERVICES.service"
  
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
    column_id: "",  
  })  
  const [isDialogOpen, setIsDialogOpen] = useState(false)  
  
  useEffect(() => {  
    fetchData()  
  }, [])  
  
  const fetchData = async () => {  
    setIsLoading(true)  
    try {  
      // Cargar columnas desde backend  
      const columnsData = await KANBAN_SERVICES.GET_COLUMNS()  
      setColumns(columnsData)  
        
      // Si no hay columnas, crear columnas por defecto  
      if (columnsData.length === 0) {  
        await KANBAN_SERVICES.CREATE_DEFAULT_COLUMNS()  
        const newColumns = await KANBAN_SERVICES.GET_COLUMNS()  
        setColumns(newColumns)  
      }  
  
      // Cargar tarjetas desde backend  
      const cardsData = await KANBAN_SERVICES.GET_CARDS()  
      setCards(cardsData)  
  
      // Cargar vehículos desde backend  
      const vehiclesData = await KANBAN_SERVICES.GET_VEHICLES()  
      setVehicles(vehiclesData)  
  
    } catch (error) {  
      console.error("Error al cargar datos:", error)  
      toast({  
        title: "Error",  
        description: "No se pudieron cargar los datos del tablero",  
        // variant: "destructive",  
      })  
    } finally {  
      setIsLoading(false)  
    }  
  }  
  
  const handleCreateCard = async () => {  
    if (!newCard.title.trim()) {  
      toast({  
        title: "Error",  
        description: "El título de la tarea es requerido",  
        // variant: "destructive",  
      })  
      return  
    }  
  
    try {  
      const cardData = {  
        ...newCard,  
        created_by: user?.id  
      }  
  
      const createdCard = await KANBAN_SERVICES.CREATE_CARD(cardData)  
      setCards([...cards, createdCard])  
        
      setNewCard({  
        title: "",  
        description: "",  
        client_name: "",  
        vehicle_id: "",  
        priority: "normal",  
        column_id: columns[0]?.id || "",  
      })  
      setIsDialogOpen(false)  
        
      toast({  
        title: "Éxito",  
        description: "Tarea creada correctamente",  
      })  
    } catch (error) {  
      console.error("Error al crear tarjeta:", error)  
      toast({  
        title: "Error",  
        description: "No se pudo crear la tarea",  
        // variant: "destructive",  
      })  
    }  
  }  
  
  const onDragEnd = async (result: any) => {  
    const { destination, source, draggableId } = result  
  
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {  
      return  
    }  
  
    try {  
      await KANBAN_SERVICES.UPDATE_CARD_POSITION(draggableId, {  
        column_id: destination.droppableId,  
        position: destination.index  
      })  
  
      // Actualizar estado local  
      const newCards = [...cards]  
      const movedCard = newCards.find((card) => card.id === draggableId)  
      if (movedCard) {  
        movedCard.column_id = destination.droppableId  
        movedCard.position = destination.index  
        setCards(newCards)  
      }  
    } catch (error) {  
      console.error("Error al actualizar posición:", error)  
      toast({  
        title: "Error",  
        description: "No se pudo actualizar la posición de la tarjeta",  
        // variant: "destructive",  
      })  
    }  
  }  
  
  const getPriorityColor = (priority: string) => {  
    switch (priority) {  
      case "alta": return "destructive"  
      case "normal": return "default"  
      case "baja": return "secondary"  
      default: return "default"  
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
                <Label htmlFor="title" className="text-right">Título</Label>  
                <Input  
                  id="title"  
                  value={newCard.title}  
                  onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}  
                  className="col-span-3"  
                />  
              </div>  
              <div className="grid grid-cols-4 items-center gap-4">  
                <Label htmlFor="description" className="text-right">Descripción</Label>  
                <Textarea  
                  id="description"  
                  value={newCard.description}  
                  onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}  
                  className="col-span-3"  
                />  
              </div>  
              <div className="grid grid-cols-4 items-center gap-4">  
                <Label htmlFor="client_name" className="text-right">Cliente</Label>  
                <Input  
                  id="client_name"  
                  value={newCard.client_name}  
                  onChange={(e) => setNewCard({ ...newCard, client_name: e.target.value })}  
                  className="col-span-3"  
                />  
              </div>  
              <div className="grid grid-cols-4 items-center gap-4">  
                <Label htmlFor="vehicle_id" className="text-right">Vehículo</Label>  
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
                <Label htmlFor="priority" className="text-right">Prioridad</Label>  
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
                <Label htmlFor="column_id" className="text-right">Columna</Label>  
                <Select value={newCard.column_id} onValueChange={(value) => setNewCard({ ...newCard, column_id: value })}>  
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
            <div className="flex justify-end gap-2">  
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>  
                Cancelar  
              </Button>  
              <Button onClick={handleCreateCard}>  
                Crear Tarea  
              </Button>  
            </div>  
          </DialogContent>  
        </Dialog>  
      </div>  
  
      <DragDropContext onDragEnd={onDragEnd}>  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">  
          {columns.map((column) => (  
            <div key={column.id} className="bg-muted/50 rounded-lg p-4">  
              <div className="flex items-center justify-between mb-4">  
                <h3 className="font-semibold text-lg" style={{ color: column.color }}>  
                  {column.title}  
                </h3>  
                <Badge variant="secondary">  
                  {cards.filter(card => card.column_id === column.id).length}  
                </Badge>  
              </div>  
                
              <Droppable droppableId={column.id}>  
                {(provided, snapshot) => (  
                  <div  
                    {...provided.droppableProps}  
                    ref={provided.innerRef}  
                    className={`min-h-[200px] space-y-3 ${  
                      snapshot.isDraggingOver ? 'bg-muted' : ''  
                    }`}  
                  >  
                    {cards  
                      .filter(card => card.column_id === column.id)  
                      .sort((a, b) => a.position - b.position)  
                      .map((card, index) => (  
                        <Draggable key={card.id} draggableId={card.id} index={index}>  
                          {(provided, snapshot) => (  
                            <Card  
                              ref={provided.innerRef}  
                              {...provided.draggableProps}  
                              {...provided.dragHandleProps}  
                              className={`cursor-move ${  
                                snapshot.isDragging ? 'shadow-lg' : ''  
                              }`}  
                            >  
                              <CardHeader className="pb-2">  
                                <div className="flex items-start justify-between">  
                                  <CardTitle className="text-sm font-medium">  
                                    {card.title}  
                                  </CardTitle>  
                                  <Badge variant={getPriorityColor(card.priority)} className="text-xs">  
                                    {card.priority}  
                                  </Badge>  
                                </div>  
                              </CardHeader>  
                              <CardContent className="pt-0">  
                                {card.description && (  
                                  <p className="text-xs text-muted-foreground mb-2">  
                                    {card.description}  
                                  </p>  
                                )}  
                                  
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">  
                                  {card.client_name && (  
                                    <div className="flex items-center gap-1">  
                                      <User className="h-3 w-3" />  
                                      <span>{card.client_name}</span>  
                                    </div>  
                                  )}  
                                    
                                  {card.vehicle && (  
                                    <div className="flex items-center gap-1">  
                                      <Car className="h-3 w-3" />  
                                      <span>{card.vehicle.marca} {card.vehicle.modelo}</span>  
                                    </div>  
                                  )}  
                                    
                                  {card.due_date && (  
                                    <div className="flex items-center gap-1">  
                                      <Calendar className="h-3 w-3" />  
                                      <span>{new Date(card.due_date).toLocaleDateString()}</span>  
                                    </div>  
                                  )}  
                                </div>  
                              </CardContent>  
                            </Card>  
                          )}  
                        </Draggable>  
                      ))}  
                    {provided.placeholder}  
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