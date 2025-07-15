"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useAuth } from "@/lib/supabase/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import TALLERES_SERVICES from "@/services/TALLERES_SERVICES.service"
import { TallerType } from "@/services/TALLER_SERVICES.SERVICE"

const formSchema = z
  .object({
    email: z.string().email({
      message: "Por favor ingresa un correo electrónico válido.",
    }),
    password: z.string().min(6, {
      message: "La contraseña debe tener al menos 6 caracteres.",
    }),
    confirmPassword: z.string().min(6, {
      message: "La contraseña debe tener al menos 6 caracteres.",
    }),
    role: z.enum(["cliente", "taller", "aseguradora", "admin"], {
      required_error: "Por favor selecciona un rol.",
    }),
    taller_id: z.string({
      message: "Por favor ingresa un correo electrónico válido.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export function RegisterForm({ onSuccess }: { onSuccess?: () => any }) {
  const { signUp } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [State_talleres, SetState_talleres] = useState<TallerType[]>([])
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "cliente",
    },
  })

  const FN_GET_TALLERES = async () => {
    const res = await TALLERES_SERVICES.GET_ALL_TALLERES();
    SetState_talleres(res)
    console.log(res)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await signUp(values.email, values.password, values.role, values?.taller_id)

      setSuccess("Registro exitoso. Por favor verifica tu correo electrónico para confirmar tu cuenta.")
      onSuccess && onSuccess()
      // setTimeout(() => {
      //   router.push("/auth/login")
      // }, 3000)
    } catch (error) {
      console.error("Error en el formulario de registro:", error)
      setError(error instanceof Error ? error.message : "Error al registrar usuario")
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    FN_GET_TALLERES()
  }, [])

  return (
    <div className="grid gap-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar contraseña</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rol</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="cliente">Cliente</SelectItem>
                    <SelectItem value="taller">Taller</SelectItem>
                    <SelectItem value="aseguradora">Aseguradora</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {
            form.getValues().role === 'taller' &&
            <FormField
              control={form.control}
              name="taller_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                        State_talleres.map((taller) => (
                          <SelectItem value={taller.id}>{taller.nombre}</SelectItem>

                        )
                        )
                      }
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          }
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrarse"}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/auth/login" className="text-blue-500 hover:underline">
          Iniciar sesión
        </Link>
      </div>
    </div>
  )
}

// También exportamos como default para mantener compatibilidad
export default RegisterForm
