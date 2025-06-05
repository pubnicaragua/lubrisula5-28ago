"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { DialogFooter } from "@/components/ui/dialog"
import { AlertCircle, Check } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const formSchema = z.object({
  cantidad: z.coerce.number().min(1, {
    message: "La cantidad debe ser al menos 1",
  }),
  proveedor: z.string().min(1, {
    message: "Selecciona un proveedor",
  }),
  urgencia: z.string().min(1, {
    message: "Selecciona el nivel de urgencia",
  }),
  notas: z.string().optional(),
})

interface SolicitudCompraFormProps {
  repuestoId: string
  repuestoNombre: string
  onSuccess?: () => void
}

export function SolicitudCompraForm({ repuestoId, repuestoNombre, onSuccess }: SolicitudCompraFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cantidad: 1,
      proveedor: "",
      urgencia: "normal",
      notas: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError(null)

    try {
      // Simulación de envío de datos
      // En producción, esto sería una llamada a la API o a Supabase
      console.log("Solicitud de compra:", {
        repuestoId,
        repuestoNombre,
        ...values,
        fechaSolicitud: new Date().toISOString(),
      })

      // Simulamos un retraso para mostrar el estado de carga
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess(true)
      toast({
        title: "Solicitud enviada",
        description: `Se ha creado la solicitud de compra para ${values.cantidad} unidades de ${repuestoNombre}`,
      })

      // Llamar al callback de éxito después de un breve retraso
      setTimeout(() => {
        if (onSuccess) onSuccess()
      }, 1500)
    } catch (err) {
      setError("Error al enviar la solicitud. Inténtalo de nuevo.")
      console.error("Error al enviar solicitud:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <Alert className="bg-green-50">
        <Check className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Solicitud enviada correctamente</AlertTitle>
        <AlertDescription className="text-green-700">
          Tu solicitud de compra ha sido registrada y será procesada por el departamento de compras.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cantidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="urgencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Urgencia</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la urgencia" />
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
          name="proveedor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proveedor</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un proveedor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="autopartes-express">AutoPartes Express</SelectItem>
                  <SelectItem value="repuestos-originales">Repuestos Originales S.A.</SelectItem>
                  <SelectItem value="importadora-tecnica">Importadora Técnica</SelectItem>
                  <SelectItem value="distribuidora-nacional">Distribuidora Nacional</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas adicionales</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Información adicional para el departamento de compras"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>Incluye cualquier detalle relevante para esta solicitud</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar solicitud"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
