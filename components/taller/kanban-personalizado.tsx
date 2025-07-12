"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { GripVertical, Plus, Save, Trash2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
// Eliminar las importaciones de las acciones de Supabase
//- import { saveKanbanConfiguration, getKanbanConfiguration } from "@/lib/actions/kanban"

const kanbanFormSchema = z.object({
  tipoTaller: z.string({
    required_error: "Por favor selecciona un tipo de taller.",
  }),
  columnas: z
    .array(
      z.object({
        id: z.string(),
        nombre: z.string().min(1, "El nombre es requerido"),
        color: z.string(),
        porcentaje: z.number().min(0).max(100),
      }),
    )
    .min(2, "Debe haber al menos 2 columnas"),
  mostrarPorcentajes: z.boolean().default(true),
  mostrarTiempoEstimado: z.boolean().default(true),
  mostrarAsignados: z.boolean().default(true),
})

type KanbanFormValues = z.infer<typeof kanbanFormSchema>

// Columnas predefinidas según el tipo de taller
const columnasPredefinidas = {
  mecanica: [
    { id: "col-1", nombre: "Por iniciar", color: "#f97316", porcentaje: 0 },
    { id: "col-2", nombre: "Diagnóstico", color: "#eab308", porcentaje: 25 },
    { id: "col-3", nombre: "En reparación", color: "#3b82f6", porcentaje: 50 },
    { id: "col-4", nombre: "Pruebas", color: "#a855f7", porcentaje: 75 },
    { id: "col-5", nombre: "Completado", color: "#22c55e", porcentaje: 100 },
  ],
  carroceria: [
    { id: "col-1", nombre: "Por iniciar", color: "#f97316", porcentaje: 0 },
    { id: "col-2", nombre: "Desmontaje", color: "#eab308", porcentaje: 15 },
    { id: "col-3", nombre: "Enderezado", color: "#3b82f6", porcentaje: 30 },
    { id: "col-4", nombre: "Preparación", color: "#a855f7", porcentaje: 50 },
    { id: "col-5", nombre: "Pintura", color: "#ec4899", porcentaje: 75 },
    { id: "col-6", nombre: "Montaje", color: "#06b6d4", porcentaje: 90 },
    { id: "col-7", nombre: "Completado", color: "#22c55e", porcentaje: 100 },
  ],
  neumaticos: [
    { id: "col-1", nombre: "Por iniciar", color: "#f97316", porcentaje: 0 },
    { id: "col-2", nombre: "Diagnóstico", color: "#eab308", porcentaje: 25 },
    { id: "col-3", nombre: "En proceso", color: "#3b82f6", porcentaje: 50 },
    { id: "col-4", nombre: "Completado", color: "#22c55e", porcentaje: 100 },
  ],
  personalizado: [
    { id: "col-1", nombre: "Por iniciar", color: "#f97316", porcentaje: 0 },
    { id: "col-2", nombre: "En proceso", color: "#3b82f6", porcentaje: 50 },
    { id: "col-3", nombre: "Completado", color: "#22c55e", porcentaje: 100 },
  ],
}

export function KanbanPersonalizado() {
  const [tipoSeleccionado, setTipoSeleccionado] = useState("mecanica")

  const form = useForm<KanbanFormValues>({
    resolver: zodResolver(kanbanFormSchema),
    defaultValues: {
      tipoTaller: "mecanica",
      columnas: columnasPredefinidas.mecanica,
      mostrarPorcentajes: true,
      mostrarTiempoEstimado: true,
      mostrarAsignados: true,
    },
  })

  // Cargar configuración al inicio
  // Modificar el useEffect para cargar la configuración desde localStorage
  useEffect(() => {
    const loadConfig = () => {
      if (typeof window !== "undefined") {
        const savedConfig = localStorage.getItem("kanbanConfig")
        if (savedConfig) {
          const config = JSON.parse(savedConfig)
          form.reset({
            tipoTaller: config.tipoTaller,
            columnas: config.columnas,
            mostrarPorcentajes: config.mostrarPorcentajes,
            mostrarTiempoEstimado: config.mostrarTiempoEstimado,
            mostrarAsignados: config.mostrarAsignados,
          })
          setTipoSeleccionado(config.tipoTaller)
        }
      }
    }
    loadConfig()
  }, [form])

  // Guardar la configuración en localStorage cada vez que cambie
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("kanbanConfig", JSON.stringify(value))
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  // Modificar la función onSubmit para guardar en localStorage
  async function onSubmit(data: KanbanFormValues) {
    if (typeof window !== "undefined") {
      localStorage.setItem("kanbanConfig", JSON.stringify(data))
      toast({
        title: "Configuración guardada",
        description: "La configuración del Kanban ha sido guardada localmente.",
      })
    } else {
      toast({
        title: "Error al guardar",
        description: "localStorage no está disponible en este entorno.",
        variant: "destructive",
      })
    }
  }

  const handleTipoChange = (tipo: string) => {
    setTipoSeleccionado(tipo)
    form.setValue("tipoTaller", tipo)
    form.setValue("columnas", columnasPredefinidas[tipo as keyof typeof columnasPredefinidas])
  }

  const handleAddColumn = () => {
    const columnas = form.getValues("columnas")
    const newId = `col-${Date.now()}` // Usar timestamp para ID único
    form.setValue("columnas", [...columnas, { id: newId, nombre: "Nueva columna", color: "#64748b", porcentaje: 0 }])
  }

  const handleRemoveColumn = (index: number) => {
    const columnas = form.getValues("columnas")
    if (columnas.length <= 2) {
      toast({
        title: "Error",
        description: "Debe haber al menos 2 columnas en el tablero.",
        variant: "destructive",
      })
      return
    }

    const newColumnas = [...columnas]
    newColumnas.splice(index, 1)
    form.setValue("columnas", newColumnas)
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const columnas = form.getValues("columnas")
    const [reorderedItem] = columnas.splice(result.source.index, 1)
    columnas.splice(result.destination.index, 0, reorderedItem)

    form.setValue("columnas", columnas)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Personalización del Kanban</h1>
        <p className="text-muted-foreground">Configura tu tablero Kanban según las necesidades de tu taller</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuración del Tablero</CardTitle>
          <CardDescription>Personaliza las columnas y opciones de visualización de tu tablero Kanban</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="tipoTaller"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Taller</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        handleTipoChange(value)
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo de taller" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mecanica">Taller Mecánico</SelectItem>
                        <SelectItem value="carroceria">Taller de Carrocería y Pintura</SelectItem>
                        <SelectItem value="neumaticos">Taller de Neumáticos</SelectItem>
                        <SelectItem value="personalizado">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Selecciona el tipo de taller para cargar una configuración predefinida o elige "Personalizado"
                      para crear tu propia configuración.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Columnas del Tablero</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddColumn}>
                    <Plus className="mr-2 h-4 w-4" />
                    Añadir Columna
                  </Button>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="columnas">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {form.watch("columnas").map((columna, index) => (
                          <Draggable key={columna.id} draggableId={columna.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="flex items-center gap-2 p-3 border rounded-md bg-background"
                              >
                                <div {...provided.dragHandleProps} className="cursor-move">
                                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                                </div>

                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div>
                                    <Input
                                      value={columna.nombre}
                                      onChange={(e) => {
                                        const newColumnas = [...form.getValues("columnas")]
                                        newColumnas[index].nombre = e.target.value
                                        form.setValue("columnas", newColumnas)
                                      }}
                                      placeholder="Nombre de la columna"
                                    />
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-6 h-6 rounded-md border"
                                      style={{ backgroundColor: columna.color }}
                                    />
                                    <Input
                                      value={columna.color}
                                      onChange={(e) => {
                                        const newColumnas = [...form.getValues("columnas")]
                                        newColumnas[index].color = e.target.value
                                        form.setValue("columnas", newColumnas)
                                      }}
                                      placeholder="#000000"
                                      className="w-28"
                                    />
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={columna.porcentaje}
                                      onChange={(e) => {
                                        const newColumnas = [...form.getValues("columnas")]
                                        newColumnas[index].porcentaje = Number.parseInt(e.target.value)
                                        form.setValue("columnas", newColumnas)
                                      }}
                                      className="w-20"
                                    />
                                    <span className="text-sm">% de avance</span>
                                  </div>
                                </div>

                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveColumn(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-muted-foreground" />
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
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Opciones de Visualización</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="mostrarPorcentajes"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Mostrar Porcentajes</FormLabel>
                          <FormDescription>Mostrar el porcentaje de avance en cada tarjeta</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mostrarTiempoEstimado"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Mostrar Tiempo Estimado</FormLabel>
                          <FormDescription>Mostrar el tiempo estimado de finalización</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mostrarAsignados"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Mostrar Técnicos Asignados</FormLabel>
                          <FormDescription>Mostrar los técnicos asignados a cada tarea</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Vista Previa</h3>

                <div className="border rounded-md p-4 overflow-x-auto">
                  <div className="flex gap-4 min-w-max">
                    {form.watch("columnas").map((columna, index) => (
                      <div key={index} className="w-64">
                        <div
                          className="p-2 rounded-t-md font-medium text-white"
                          style={{ backgroundColor: columna.color }}
                        >
                          {columna.nombre}
                          {form.watch("mostrarPorcentajes") && (
                            <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                              {columna.porcentaje}%
                            </span>
                          )}
                        </div>

                        <div className="border border-t-0 rounded-b-md p-2 bg-background min-h-[100px]">
                          {index === 0 && (
                            <div className="border rounded-md p-2 mb-2 bg-card">
                              <div className="text-sm font-medium">Toyota Corolla - Cambio de aceite</div>
                              {form.watch("mostrarTiempoEstimado") && (
                                <div className="text-xs text-muted-foreground mt-1">Tiempo estimado: 1 hora</div>
                              )}
                              {form.watch("mostrarAsignados") && (
                                <div className="flex items-center gap-1 mt-2">
                                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-white">
                                    JD
                                  </div>
                                  <span className="text-xs">Juan Díaz</span>
                                </div>
                              )}
                            </div>
                          )}

                          {index === 1 && (
                            <div className="border rounded-md p-2 bg-card">
                              <div className="text-sm font-medium">Honda Civic - Revisión de frenos</div>
                              {form.watch("mostrarTiempoEstimado") && (
                                <div className="text-xs text-muted-foreground mt-1">Tiempo estimado: 2 horas</div>
                              )}
                              {form.watch("mostrarAsignados") && (
                                <div className="flex items-center gap-1 mt-2">
                                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-white">
                                    MR
                                  </div>
                                  <span className="text-xs">María Rodríguez</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="w-full md:w-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Configuración
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
