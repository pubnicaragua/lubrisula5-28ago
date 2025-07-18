"use client"  
  
import { useState, useEffect } from "react"  
import { Button } from "@/components/ui/button"  
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"  
import { Input } from "@/components/ui/input"  
import { Label } from "@/components/ui/label"  
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"  
import { Badge } from "@/components/ui/badge"  
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"  
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"  
import { Settings, Save, Plus, Edit, Trash2, Palette } from "lucide-react"  
import { useToast } from "@/hooks/use-toast"  
import KANBAN_SERVICES from "@/services/KANBAN_SERVICES.service"  
  
export function KanbanPersonalizado() {  
  const [tipoSeleccionado, setTipoSeleccionado] = useState("mecanica")  
  const [columnasActuales, setColumnasActuales] = useState<any[]>([])  
  const [templates, setTemplates] = useState<any[]>([])  
  const [loading, setLoading] = useState(false)  
  const [isDialogOpen, setIsDialogOpen] = useState(false)  
  const [editingColumn, setEditingColumn] = useState<any>(null)  
  const [newColumn, setNewColumn] = useState({  
    title: "",  
    description: "",  
    color: "#3b82f6"  
  })  
  const { toast } = useToast()  
  
  useEffect(() => {  
    loadData()  
  }, [])  
  
  const loadData = async () => {  
    try {  
      setLoading(true)  
        
      // Cargar columnas actuales desde backend  
      const columns = await KANBAN_SERVICES.GET_COLUMNS()  
      setColumnasActuales(columns)  
  
      // Cargar plantillas disponibles desde backend  
      const templatesData = await KANBAN_SERVICES.GET_TEMPLATES()  
      setTemplates(templatesData)  
        
    } catch (error) {  
      console.error("Error al cargar datos:", error)  
      toast({  
        title: "Error",  
        description: "No se pudieron cargar los datos",  
        // variant: "destructive",  
      })  
    } finally {  
      setLoading(false)  
    }  
  }  
  
  const aplicarPlantilla = async () => {  
    try {  
      setLoading(true)  
      await KANBAN_SERVICES.APPLY_TEMPLATE(tipoSeleccionado)  
      await loadData()  
        
      toast({  
        title: "Éxito",  
        description: "Plantilla aplicada correctamente. Los cambios se reflejarán en el tablero Kanban.",  
      })  
    } catch (error) {  
      console.error("Error al aplicar plantilla:", error)  
      toast({  
        title: "Error",  
        description: "No se pudo aplicar la plantilla",  
        // variant: "destructive",  
      })  
    } finally {  
      setLoading(false)  
    }  
  }  
  
  const crearColumna = async () => {  
    if (!newColumn.title.trim()) {  
      toast({  
        title: "Error",  
        description: "El título de la columna es requerido",  
        // variant: "destructive",  
      })  
      return  
    }  
  
    try {  
      setLoading(true)  
      await KANBAN_SERVICES.CREATE_COLUMN(newColumn)  
      await loadData()  
        
      setNewColumn({ title: "", description: "", color: "#3b82f6" })  
      setIsDialogOpen(false)  
        
      toast({  
        title: "Éxito",  
        description: "Columna creada correctamente",  
      })  
    } catch (error) {  
      console.error("Error al crear columna:", error)  
      toast({  
        title: "Error",  
        description: "No se pudo crear la columna",  
        // variant: "destructive",  
      })  
    } finally {  
      setLoading(false)  
    }  
  }  
  
  const editarColumna = async () => {  
    if (!editingColumn?.title?.trim()) {  
      toast({  
        title: "Error",  
        description: "El título de la columna es requerido",  
        // variant: "destructive",  
      })  
      return  
    }  
  
    try {  
      setLoading(true)  
      await KANBAN_SERVICES.UPDATE_COLUMN(editingColumn.id, {  
        title: editingColumn.title,  
        description: editingColumn.description,  
        color: editingColumn.color  
      })  
      await loadData()  
        
      setEditingColumn(null)  
      setIsDialogOpen(false)  
        
      toast({  
        title: "Éxito",  
        description: "Columna actualizada correctamente",  
      })  
    } catch (error) {  
      console.error("Error al actualizar columna:", error)  
      toast({  
        title: "Error",  
        description: "No se pudo actualizar la columna",  
        // variant: "destructive",  
      })  
    } finally {  
      setLoading(false)  
    }  
  }  
  
  const eliminarColumna = async (columnId: string) => {  
    if (columnasActuales.length <= 2) {  
      toast({  
        title: "Error",  
        description: "Debe haber al menos 2 columnas en el tablero",  
        // variant: "destructive",  
      })  
      return  
    }  
  
    if (!confirm("¿Estás seguro de eliminar esta columna? Esta acción no se puede deshacer.")) {  
      return  
    }  
  
    try {  
      setLoading(true)  
      await KANBAN_SERVICES.DELETE_COLUMN(columnId)  
      await loadData()  
        
      toast({  
        title: "Éxito",  
        description: "Columna eliminada correctamente",  
      })  
    } catch (error) {  
      console.error("Error al eliminar columna:", error)  
      toast({  
        title: "Error",  
        description: "No se pudo eliminar la columna",  
        // variant: "destructive",  
      })  
    } finally {  
      setLoading(false)  
    }  
  }  
  
  const openEditDialog = (column: any) => {  
    setEditingColumn({ ...column })  
    setIsDialogOpen(true)  
  }  
  
  const openCreateDialog = () => {  
    setEditingColumn(null)  
    setNewColumn({ title: "", description: "", color: "#3b82f6" })  
    setIsDialogOpen(true)  
  }  
  
  return (  
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">  
      <div className="flex items-center justify-between">  
        <div>  
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">  
            <Settings className="h-8 w-8" />  
            Personalización del Kanban  
          </h1>  
          <p className="text-muted-foreground">  
            Configura tu tablero Kanban según las necesidades de tu taller  
          </p>  
        </div>  
      </div>  
  
      <Tabs defaultValue="plantillas" className="space-y-4">  
        <TabsList>  
          <TabsTrigger value="plantillas">Plantillas</TabsTrigger>  
          <TabsTrigger value="personalizado">Personalizado</TabsTrigger>  
        </TabsList>  
  
        <TabsContent value="plantillas">  
          <Card>  
            <CardHeader>  
              <CardTitle>Plantillas Predefinidas</CardTitle>  
              <CardDescription>  
                Selecciona una plantilla según el tipo de taller  
              </CardDescription>  
            </CardHeader>  
            <CardContent className="space-y-4">  
              <div className="space-y-2">  
                <Label htmlFor="tipo-taller">Tipo de Taller</Label>  
                <Select value={tipoSeleccionado} onValueChange={setTipoSeleccionado}>  
                  <SelectTrigger>  
                    <SelectValue placeholder="Seleccionar tipo de taller" />  
                  </SelectTrigger>  
                  <SelectContent>  
                    {templates.map((template) => (  
                      <SelectItem key={template.type} value={template.type}>  
                        {template.name}  
                      </SelectItem>  
                    ))}  
                  </SelectContent>  
                </Select>  
              </div>  
  
              <div className="space-y-2">  
                <Label>Vista Previa de Columnas</Label>  
                <div className="flex gap-2 flex-wrap">  
                  {templates  
                    .find(t => t.type === tipoSeleccionado)  
                    ?.columns?.map((col: any, index: number) => (  
                      <Badge key={index} style={{ backgroundColor: col.color, color: 'white' }}>  
                        {col.title}  
                      </Badge>  
                    )) || []}  
                </div>  
              </div>  
  
              <Button onClick={aplicarPlantilla} disabled={loading}>  
                <Save className="mr-2 h-4 w-4" />  
                {loading ? "Aplicando..." : "Aplicar Plantilla"}  
              </Button>  
            </CardContent>  
          </Card>  
        </TabsContent>  
  
        <TabsContent value="personalizado">  
          <Card>  
            <CardHeader>  
              <div className="flex items-center justify-between">  
                <div>  
                  <CardTitle>Columnas Actuales</CardTitle>  
                  <CardDescription>  
                    {columnasActuales.length} columna(s) configurada(s)  
                  </CardDescription>  
                </div>  
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>  
                  <DialogTrigger asChild>  
                    <Button onClick={openCreateDialog}>  
                      <Plus className="mr-2 h-4 w-4" />  
                      Nueva Columna  
                    </Button>  
                  </DialogTrigger>  
                  <DialogContent>  
                    <DialogHeader>  
                      <DialogTitle>  
                        {editingColumn ? "Editar Columna" : "Nueva Columna"}  
                      </DialogTitle>  
                      <DialogDescription>  
                        {editingColumn ? "Modifica los datos de la columna" : "Crea una nueva columna para el tablero"}  
                      </DialogDescription>  
                    </DialogHeader>  
                    <div className="space-y-4">  
                      <div className="space-y-2">  
                        <Label htmlFor="title">Título</Label>  
                        <Input  
                          id="title"  
                          value={editingColumn ? editingColumn.title : newColumn.title}  
                          onChange={(e) => {  
                            if (editingColumn) {  
                              setEditingColumn({...editingColumn, title: e.target.value})  
                            } else {  
                              setNewColumn({...newColumn, title: e.target.value})  
                            }  
                          }}  
                          placeholder="Nombre de la columna"  
                        />  
                      </div>  
                      <div className="space-y-2">  
                        <Label htmlFor="description">Descripción</Label>  
                        <Input  
                          id="description"  
                          value={editingColumn ? editingColumn.description : newColumn.description}  
                          onChange={(e) => {  
                            if (editingColumn) {  
                              setEditingColumn({...editingColumn, description: e.target.value})  
                            } else {  
                              setNewColumn({...newColumn, description: e.target.value})  
                            }  
                          }}  
                          placeholder="Descripción opcional"  
                        />  
                      </div>  
                      <div className="space-y-2">  
                        <Label htmlFor="color">Color</Label>  
                        <div className="flex items-center gap-2">  
                          <div  
                            className="w-8 h-8 rounded border"  
                            style={{ backgroundColor: editingColumn ? editingColumn.color : newColumn.color }}  
                          />  
                          <Input  
                            id="color"  
                            type="color"  
                            value={editingColumn ? editingColumn.color : newColumn.color}  
                            onChange={(e) => {  
                              if (editingColumn) {  
                                setEditingColumn({...editingColumn, color: e.target.value})  
                              } else {  
                                setNewColumn({...newColumn, color: e.target.value})  
                              }  
                            }}  
                            className="w-20"  
                          />  
                        </div>  
                      </div>  
                    </div>  
                    <DialogFooter>  
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>  
                        Cancelar  
                      </Button>  
                      <Button onClick={editingColumn ? editarColumna : crearColumna} disabled={loading}>  
                        {loading ? "Guardando..." : (editingColumn ? "Actualizar" : "Crear")}  
                      </Button>  
                    </DialogFooter>  
                  </DialogContent>  
                </Dialog>  
              </div>  
            </CardHeader>  
            <CardContent>  
              <div className="space-y-2">  
                {columnasActuales.map((col) => (  
                  <div key={col.id} className="flex items-center justify-between p-3 border rounded-lg">  
                    <div className="flex items-center gap-3">  
                      <div   
                        className="w-4 h-4 rounded"   
                        style={{ backgroundColor: col.color }}  
                      />  
                      <div>  
                        <span className="font-medium">{col.title}</span>  
                        {col.description && (  
                          <p className="text-sm text-muted-foreground">{col.description}</p>  
                        )}  
                      </div>  
                    </div>  
                    <div className="flex items-center gap-2">  
                      <Badge variant="outline">Posición {col.position}</Badge>  
                      <Button  
                        variant="ghost"  
                        size="icon"  
                        onClick={() => openEditDialog(col)}  
                      >  
                        <Edit className="h-4 w-4" />  
                      </Button>  
                      <Button  
                        variant="ghost"  
                        size="icon"  
                        onClick={() => eliminarColumna(col.id)}  
                      >  
                        <Trash2 className="h-4 w-4" />  
                      </Button>  
                    </div>  
                  </div>  
                ))}  
                {columnasActuales.length === 0 && (  
                  <div className="text-center py-8 text-muted-foreground">  
                    No hay columnas configuradas. Crea una nueva columna o aplica una plantilla.  
                  </div>  
                )}  
              </div>  
            </CardContent>
            </Card>  
        </TabsContent>  
      </Tabs>  
    </div>  
  )  
}