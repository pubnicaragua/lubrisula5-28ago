"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  cliente_id: z.string().min(1, { message: "Seleccione un cliente" }),
  vehiculo_id: z.string().min(1, { message: "Seleccione un vehículo" }),
  descripcion: z.string().min(5, { message: "La descripción debe tener al menos 5 caracteres" }),
  tipo_servicio: z.string().min(1, { message: "Seleccione un tipo de servicio" }),
  fecha_ingreso: z.string().min(1, { message: "Seleccione una fecha de ingreso" }),
  fecha_estimada_entrega: z.string().min(1, { message: "Seleccione una fecha estimada de entrega" }),
  tecnico_asignado: z.string().min(1, { message: "Seleccione un técnico" }),
  prioridad: z.string().min(1, { message: "Seleccione una prioridad" }),
})

export default function NuevaOrdenForm() {
  const [clientes, setClientes] = useState([])
  const [vehiculos, setVehiculos] = useState([])
  const [tecnicos, setTecnicos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cliente_id: "",
      vehiculo_id: "",
      descripcion: "",
      tipo_servicio: "",
      fecha_ingreso: new Date().toISOString().split("T")[0],
      fecha_estimada_entrega: "",
      tecnico_asignado: "",
      prioridad: "normal",
    },
  })

  // Cargar datos iniciales
  useState(() => {
    const fetchData = async () => {
      // Cargar clientes
      const { data: clientesData } = await supabase.from("clientes").select("*")
      if (clientesData) setClientes(clientesData)

      // Cargar vehículos
      const { data: vehiculosData } = await supabase.from("vehiculos").select("*")
      if (vehiculosData) setVehiculos(vehiculosData)

      // Cargar técnicos
      const { data: tecnicosData } = await supabase.from("usuarios").select("*").eq("rol", "tecnico")
      if (tecnicosData) setTecnicos(tecnicosData)
    }

    fetchData()
  }, [])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("ordenes_trabajo")
        .insert([
          {
            cliente_id: values.cliente_id,
            vehiculo_id: values.vehiculo_id,
            descripcion: values.descripcion,
            tipo_servicio: values.tipo_servicio,
            fecha_ingreso: values.fecha_ingreso,
            fecha_estimada_entrega: values.fecha_estimada_entrega,
            tecnico_asignado: values.tecnico_asignado,
            prioridad: values.prioridad,
            estado: "pendiente",
          },
        ])
        .select()

      if (error) throw error

      toast({
        title: "Orden creada",
        description: "La orden de trabajo ha sido creada exitosamente",
      })

      router.push("/taller/ordenes")
      router.refresh()
    } catch (error) {
      console.error("Error al crear la orden:", error)
      toast({
        title: "Error",
        description: "No se pudo crear la orden de trabajo",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Nueva Orden de Trabajo</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="cliente_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clientes.map((cliente: any) => (
                          <SelectItem key={cliente.id} value={cliente.id}>
                            {cliente.nombre} {cliente.apellido}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehiculo_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehículo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar vehículo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehiculos.map((vehiculo: any) => (
                          <SelectItem key={vehiculo.id} value={vehiculo.id}>
                            {vehiculo.marca} {vehiculo.modelo} - {vehiculo.placa}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo_servicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Servicio</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo de servicio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                        <SelectItem value="reparacion">Reparación</SelectItem>
                        <SelectItem value="diagnostico">Diagnóstico</SelectItem>
                        <SelectItem value="revision">Revisión</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tecnico_asignado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Técnico Asignado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar técnico" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tecnicos.map((tecnico: any) => (
                          <SelectItem key={tecnico.id} value={tecnico.id}>
                            {tecnico.nombre} {tecnico.apellido}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fecha_ingreso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Ingreso</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fecha_estimada_entrega"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha Estimada de Entrega</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prioridad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridad</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar prioridad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="baja">Baja</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción del Servicio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describa el servicio a realizar..." className="min-h-[120px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="px-0 pt-6">
              <Button type="submit" className="ml-auto" disabled={isLoading}>
                {isLoading ? "Creando..." : "Crear Orden de Trabajo"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
