"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"

interface FlotaForm {
  nombre: string
  empresa: string
  contacto: string
  telefono: string
  email: string
  cantidadVehiculos: number
  estado: "Activa" | "Inactiva" | "En Negociación"
  descripcion?: string
}

interface NuevaFlotaFormProps {
  onSubmit: (flota: FlotaForm) => void
  flotaExistente?: any
}

export function NuevaFlotaForm({ onSubmit, flotaExistente }: NuevaFlotaFormProps) {
  const [formData, setFormData] = useState<FlotaForm>({
    nombre: "",
    empresa: "",
    contacto: "",
    telefono: "",
    email: "",
    cantidadVehiculos: 0,
    estado: "Activa",
    descripcion: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Cargar datos de la flota existente si se está editando
  useEffect(() => {
    if (flotaExistente) {
      setFormData({
        nombre: flotaExistente.nombre || "",
        empresa: flotaExistente.empresa || "",
        contacto: flotaExistente.contacto || "",
        telefono: flotaExistente.telefono || "",
        email: flotaExistente.email || "",
        cantidadVehiculos: flotaExistente.cantidadVehiculos || 0,
        estado: flotaExistente.estado || "Activa",
        descripcion: flotaExistente.descripcion || "",
      })
    }
  }, [flotaExistente])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "cantidadVehiculos" ? Number.parseInt(value) || 0 : value,
    })
  }

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, estado: value as FlotaForm["estado"] })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular delay de procesamiento
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSubmit(formData)

    // Limpiar formulario si no es edición
    if (!flotaExistente) {
      setFormData({
        nombre: "",
        empresa: "",
        contacto: "",
        telefono: "",
        email: "",
        cantidadVehiculos: 0,
        estado: "Activa",
        descripcion: "",
      })
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="nombre">Nombre de la Flota *</Label>
        <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="empresa">Empresa *</Label>
        <Input id="empresa" name="empresa" value={formData.empresa} onChange={handleInputChange} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="contacto">Persona de Contacto *</Label>
          <Input id="contacto" name="contacto" value={formData.contacto} onChange={handleInputChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="telefono">Teléfono *</Label>
          <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleInputChange} required />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="cantidadVehiculos">Cantidad de Vehículos *</Label>
          <Input
            id="cantidadVehiculos"
            name="cantidadVehiculos"
            type="number"
            min="0"
            value={formData.cantidadVehiculos}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="estado">Estado *</Label>
          <Select onValueChange={handleSelectChange} value={formData.estado}>
            <SelectTrigger id="estado">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Activa">Activa</SelectItem>
              <SelectItem value="En Negociación">En Negociación</SelectItem>
              <SelectItem value="Inactiva">Inactiva</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleInputChange}
          placeholder="Descripción adicional de la flota..."
          rows={3}
        />
      </div>

      <div className="flex justify-end mt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : flotaExistente ? "Actualizar Flota" : "Guardar Flota"}
        </Button>
      </div>
    </form>
  )
}
