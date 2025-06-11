"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface Flota {
  nombre: string
  empresa: string
  contacto: string
  telefono: string
  email: string
  cantidadVehiculos: number
  estado: "Activa" | "Inactiva" | "En Negociación"
  fechaRegistro: string
  ultimaActualizacion: string
}

interface NuevaFlotaFormProps {
  onSubmit: (flota: Flota) => void
}

export function NuevaFlotaForm({ onSubmit }: NuevaFlotaFormProps) {
  const today = new Date().toISOString().split("T")[0]

  const [formData, setFormData] = useState<Flota>({
    nombre: "",
    empresa: "",
    contacto: "",
    telefono: "",
    email: "",
    cantidadVehiculos: 0,
    estado: "En Negociación",
    fechaRegistro: today,
    ultimaActualizacion: today,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "cantidadVehiculos" ? Number.parseInt(value) || 0 : value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="nombre">Nombre de la Flota</Label>
          <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="empresa">Empresa</Label>
          <Input id="empresa" name="empresa" value={formData.empresa} onChange={handleInputChange} required />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="contacto">Persona de Contacto</Label>
          <Input id="contacto" name="contacto" value={formData.contacto} onChange={handleInputChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleInputChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="cantidadVehiculos">Cantidad de Vehículos</Label>
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
          <Label htmlFor="estado">Estado</Label>
          <Select onValueChange={(value) => handleSelectChange("estado", value)} defaultValue={formData.estado}>
            <SelectTrigger id="estado">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Activa">Activa</SelectItem>
              <SelectItem value="Inactiva">Inactiva</SelectItem>
              <SelectItem value="En Negociación">En Negociación</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="observaciones">Observaciones</Label>
        <Textarea id="observaciones" name="observaciones" placeholder="Observaciones adicionales..." rows={3} />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit">Guardar Flota</Button>
      </div>
    </form>
  )
}
