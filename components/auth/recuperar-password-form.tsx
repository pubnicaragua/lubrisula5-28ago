"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase/auth"

// Esquema de validación
const formSchema = z.object({
  email: z.string().email({ message: "Correo electrónico inválido" }),
})

export function RecuperarPasswordForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  // Inicializar formulario
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  // Manejar envío del formulario
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/auth/actualizar-password`,
      })

      if (error) throw error

      setEmailSent(true)
      toast({
        title: "Correo enviado",
        description: "Se ha enviado un correo con instrucciones para recuperar tu contraseña.",
      })
    } catch (error) {
      console.error("Error al enviar correo:", error)
      toast({
        title: "Error al enviar correo",
        description: error instanceof Error ? error.message : "Ha ocurrido un error",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Recuperar contraseña</CardTitle>
        <CardDescription>Ingresa tu correo electrónico para recibir instrucciones</CardDescription>
      </CardHeader>
      <CardContent>
        {emailSent ? (
          <div className="text-center py-4">
            <p className="mb-4">
              Hemos enviado un correo a <strong>{form.getValues().email}</strong> con instrucciones para recuperar tu
              contraseña.
            </p>
            <p className="text-sm text-muted-foreground">
              Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="correo@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar instrucciones"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Volver a{" "}
          <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/auth/login")}>
            Iniciar sesión
          </Button>
        </p>
      </CardFooter>
    </Card>
  )
}

export default RecuperarPasswordForm
