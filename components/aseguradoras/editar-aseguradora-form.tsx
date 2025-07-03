// "use client"

// import { useState } from "react"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import * as z from "zod"
// import { Button } from "@/components/ui/button"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { actualizarAseguradora } from "@/lib/actions/aseguradoras"
// import { Loader2 } from "lucide-react"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// const formSchema = z.object({
//   nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
//   correo: z.string().email("Correo electrónico inválido").optional().or(z.literal("")),
//   telefono: z.string().min(8, "El teléfono debe tener al menos 8 caracteres").optional().or(z.literal("")),
//   estado_tributario: z.string().optional(),
//   nivel_tarifa: z.string().optional(),
// })

// interface Aseguradora {
//   id: number
//   nombre: string | null
//   correo: string | null
//   telefono: string | null
//   estado_tributario: string | null
//   nivel_tarifa: string | null
// }

// interface EditarAseguradoraFormProps {
//   aseguradora: Aseguradora
//   onSuccess: () => void
// }

// export function EditarAseguradoraForm({ aseguradora, onSuccess }: EditarAseguradoraFormProps) {
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       nombre: aseguradora.nombre || "",
//       correo: aseguradora.correo || "",
//       telefono: aseguradora.telefono || "",
//       estado_tributario: aseguradora.estado_tributario || "",
//       nivel_tarifa: aseguradora.nivel_tarifa || "",
//     },
//   })

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     console.log(values)
//     try {
//       setIsSubmitting(true)
//       setError(null)

//       await actualizarAseguradora(aseguradora.id, values)
//       onSuccess()
//     } catch (error) {
//       console.error("Error al actualizar aseguradora:", error)
//       setError("No se pudo actualizar la aseguradora. Intente nuevamente.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//         <FormField
//           control={form.control}
//           name="nombre"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Nombre</FormLabel>
//               <FormControl>
//                 <Input placeholder="Nombre de la aseguradora" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="correo"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Correo Electrónico</FormLabel>
//               <FormControl>
//                 <Input placeholder="correo@ejemplo.com" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="telefono"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Teléfono</FormLabel>
//               <FormControl>
//                 <Input placeholder="Teléfono" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="estado_tributario"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Estado Tributario</FormLabel>
//               <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Seleccione un estado tributario" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   <SelectItem value="Exento">Exento</SelectItem>
//                   <SelectItem value="Contribuyente">Contribuyente</SelectItem>
//                   <SelectItem value="Pequeño Contribuyente">Pequeño Contribuyente</SelectItem>
//                 </SelectContent>
//               </Select>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="nivel_tarifa"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Nivel de Tarifa</FormLabel>
//               <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Seleccione un nivel de tarifa" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   <SelectItem value="Básico">Básico</SelectItem>
//                   <SelectItem value="Estándar">Estándar</SelectItem>
//                   <SelectItem value="Premium">Premium</SelectItem>
//                 </SelectContent>
//               </Select>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {error && <p className="text-sm text-red-500">{error}</p>}

//         <div className="flex justify-end">
//           <Button type="submit" disabled={isSubmitting}>
//             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//             Actualizar Aseguradora
//           </Button>
//         </div>
//       </form>
//     </Form>
//   )
// }
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { actualizarAseguradora } from "@/lib/actions/aseguradoras"
import { Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ASEGURADORA_SERVICE, { AseguradoraType } from "@/services/ASEGURADORA_SERVICES.SERVICE"
import { Toast } from "../ui/toast"
import ButtonAlert from "../ui/ButtonAlert"

interface Aseguradora {
  id: number
  nombre: string | null
  correo: string | null
  telefono: string | null
  estado_tributario: string | null
  nivel_tarifa: string | null
}

interface EditarAseguradoraFormProps {
  aseguradora: AseguradoraType
  onSuccess: (data: Aseguradora) => void
}

export function EditarAseguradoraForm({
  aseguradora,
  onSuccess,
}: EditarAseguradoraFormProps) {
  const [nombre, setNombre] = useState(aseguradora.nombre || "")
  const [correo, setcorreo] = useState(aseguradora.correo || "")
  const [telefono, setTelefono] = useState(aseguradora.telefono || "")
  const [estadoTributario, setEstadoTributario] = useState(aseguradora.estado_tributario || "")
  const [nivelTarifa, setNivelTarifa] = useState(aseguradora.nivel_tarifa || "")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const Fn_ActualizarAseguradora = async () => {

    if (nombre.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres")
      return
    }

    if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setError("Correo electrónico inválido")
      return
    }

    if (telefono && telefono.length < 8) {
      setError("El teléfono debe tener al menos 8 caracteres")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      const data = await ASEGURADORA_SERVICE.UPDATE_ASEGURADORA({
        id: aseguradora.id,
        nombre,
        correo,
        telefono,
        estado_tributario: estadoTributario,
        nivel_tarifa: nivelTarifa,
      })
      console.log("Aseguradora actualizada:", data)
      // await actualizarAseguradora(aseguradora.id, {
      //   nombre,
      //   correo,
      //   telefono,
      //   estado_tributario: estadoTributario,
      //   nivel_tarifa: nivelTarifa,
      // })

      onSuccess(data)
    } catch (err) {
      console.error("Error al actualizar aseguradora:", err)
      setError("No se pudo actualizar la aseguradora. Intente nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <Input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la aseguradora"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Correo Electrónico</label>
        <Input
          value={correo}
          onChange={(e) => setcorreo(e.target.value)}
          placeholder="correo@ejemplo.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Teléfono</label>
        <Input
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Teléfono"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Estado Tributario</label>
        <Select
          onValueChange={setEstadoTributario}
          value={estadoTributario || undefined}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un estado tributario" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Exento">Exento</SelectItem>
            <SelectItem value="Contribuyente">Contribuyente</SelectItem>
            <SelectItem value="Pequeño Contribuyente">Pequeño Contribuyente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium">Nivel de Tarifa</label>
        <Select
          onValueChange={setNivelTarifa}
          value={nivelTarifa || undefined}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un nivel de tarifa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Básico">Básico</SelectItem>
            <SelectItem value="Estándar">Estándar</SelectItem>
            <SelectItem value="Premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end">
        <ButtonAlert LabelButton="Actualizar Aseguradora" Onconfirm={Fn_ActualizarAseguradora} title="Actualizar aseguradora" description="¿Seguro que deseas actualizar la informacion de esta aseguradora?" variantButton="default" />
        {/* <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Actualizar Aseguradora
        </Button> */}
      </div>

    </form>
  )
}
