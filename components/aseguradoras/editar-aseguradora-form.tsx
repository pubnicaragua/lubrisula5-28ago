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
import ASEGURADORA_SERVICE, { AseguradoraType } from "@/services/ASEGURADORA_SERVICES.service"
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
