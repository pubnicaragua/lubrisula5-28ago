"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { crearAseguradora } from "@/lib/actions/aseguradoras"
import { Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ASEGURADORA_SERVICE, { AseguradoraType } from "@/services/ASEGURADORA_SERVICES.service"

interface NuevaAseguradoraFormProps {
  onSuccess: (NewData: AseguradoraType) => void
}

export function NuevaAseguradoraForm({ onSuccess }: NuevaAseguradoraFormProps) {
  const [nombre, setNombre] = useState("")
  const [corrreo, setCorrreo] = useState("")
  const [telefono, setTelefono] = useState("")
  const [estadoTributario, setEstadoTributario] = useState("")
  const [nivelTarifa, setNivelTarifa] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones básicas
    if (nombre.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres")
      return
    }

    if (corrreo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(corrreo)) {
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

      // await crearAseguradora({
      //   nombre,
      //   corrreo,
      //   telefono,
      //   estado_tributario: estadoTributario,
      //   nivel_tarifa: nivelTarifa,
      // })
      const NewData = {
        nombre,
        correo: corrreo,
        telefono,
        estado_tributario: estadoTributario,
        nivel_tarifa: nivelTarifa,
      }
      await ASEGURADORA_SERVICE.INSERT_ASEGURADORA(NewData)
      onSuccess(NewData)
    } catch (err) {
      console.error("Error al crear aseguradora:", err)
      setError("No se pudo crear la aseguradora. Intente nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          value={corrreo}
          onChange={(e) => setCorrreo(e.target.value)}
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
        <Select value={estadoTributario} onValueChange={setEstadoTributario}>
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
        <Select value={nivelTarifa} onValueChange={setNivelTarifa}>
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Crear Aseguradora
        </Button>
      </div>
    </form>
  )
}
