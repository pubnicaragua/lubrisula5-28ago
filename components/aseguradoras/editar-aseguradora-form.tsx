"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { actualizarAseguradora } from "@/lib/actions/aseguradoras"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  corrreo: z.string().email("Correo electrónico inválido").optional().or(z.literal("")),
  telefono: z.string().min(8, "El teléfono debe tener al menos 8 caracteres").optional().or(z.literal("")),
  estado_tributario: z.string().optional(),
  nivel_tarifa: z.string().optional(),
})

interface Aseguradora {
  id: number
  nombre: string | null
  corrreo: string | null
  telefono: string | null
  estado_tributario: string | null
  nivel_tarifa: string | null
}

interface EditarAseguradoraFormProps {
  aseguradora: Aseguradora
  onSuccess: () => void
}

export function EditarAseguradoraForm({ aseguradora, onSuccess }: EditarAseguradoraFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: aseguradora.nombre || "",
      corrreo: aseguradora.corrreo || "",
      telefono: aseguradora.telefono || "",
      estado_tributario: aseguradora.estado_tributario || "",
      nivel_tarifa: aseguradora.nivel_tarifa || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      setError(null)

      await actualizarAseguradora(aseguradora.id, values)
      onSuccess()
    } catch (error) {
      console.error("Error al actualizar aseguradora:", error)
      setError("No se pudo actualizar la aseguradora. Intente nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre de la aseguradora" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="corrreo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input placeholder="correo@ejemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telefono"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input placeholder="Teléfono" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estado_tributario"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado Tributario</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un estado tributario" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Exento">Exento</SelectItem>
                  <SelectItem value="Contribuyente">Contribuyente</SelectItem>
                  <SelectItem value="Pequeño Contribuyente">Pequeño Contribuyente</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nivel_tarifa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nivel de Tarifa</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un nivel de tarifa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Básico">Básico</SelectItem>
                  <SelectItem value="Estándar">Estándar</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Actualizar Aseguradora
          </Button>
        </div>
      </form>
    </Form>
  )
}
