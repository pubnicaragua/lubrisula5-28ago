"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface MiembroEquipo {
  nombre: string
  cargo: string
  especialidad: string
  telefono: string
  email: string
  fechaContratacion: string
  estado: "Activo" | "Inactivo" | "De Vacaciones" | "Permiso"
  horasTrabajadas: number
  ordenesCompletadas: number
}

interface NuevoMiembroFormProps {
  onSubmit: (miembro: MiembroEquipo) => void
}

export function NuevoMiembroForm({ onSubmit }: NuevoMiembroFormProps) {
  const today = new Date().toISOString().split("T")[0]

  const [formData, setFormData] = useState<MiembroEquipo>({
    nombre: "",
    cargo: "Técnico",
    especialidad: "Mecánica General",
    telefono: "",
    email: "",
    fechaContratacion: today,
    estado: "Activo",
    horasTrabajadas: 0,
    ordenesCompletadas: 0,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "horasTrabajadas" || name === "ordenesCompletadas" ? Number.parseInt(value) || 0 : value,
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
          <Label htmlFor="nombre">Nombre Completo</Label>
          <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cargo">Cargo</Label>
          <Select onValueChange={(value) => handleSelectChange("cargo", value)} defaultValue={formData.cargo}>
            <SelectTrigger id="cargo">
              <SelectValue placeholder="Seleccionar cargo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Técnico">Técnico</SelectItem>
              <SelectItem value="Técnico Senior">Técnico Senior</SelectItem>
              <SelectItem value="Administrativo">Administrativo</SelectItem>
              <SelectItem value="Supervisor">Supervisor</SelectItem>
              <SelectItem value="Gerente">Gerente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="especialidad">Especialidad</Label>
          <Select
            onValueChange={(value) => handleSelectChange("especialidad", value)}
            defaultValue={formData.especialidad}
          >
            <SelectTrigger id="especialidad">
              <SelectValue placeholder="Seleccionar especialidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mecánica General">Mecánica General</SelectItem>
              <SelectItem value="Pintura">Pintura</SelectItem>
              <SelectItem value="Carrocería">Carrocería</SelectItem>
              <SelectItem value="Electricidad">Electricidad</SelectItem>
              <SelectItem value="Alineación y Balanceo">Alineación y Balanceo</SelectItem>
              <SelectItem value="Atención al Cliente">Atención al Cliente</SelectItem>
              <SelectItem value="Administración">Administración</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="estado">Estado</Label>
          <Select onValueChange={(value) => handleSelectChange("estado", value)} defaultValue={formData.estado}>
            <SelectTrigger id="estado">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Inactivo">Inactivo</SelectItem>
              <SelectItem value="De Vacaciones">De Vacaciones</SelectItem>
              <SelectItem value="Permiso">Permiso</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleInputChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="fechaContratacion">Fecha de Contratación</Label>
          <Input
            id="fechaContratacion"
            name="fechaContratacion"
            type="date"
            value={formData.fechaContratacion}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="horasTrabajadas">Horas Trabajadas</Label>
          <Input
            id="horasTrabajadas"
            name="horasTrabajadas"
            type="number"
            min="0"
            value={formData.horasTrabajadas}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ordenesCompletadas">Órdenes Completadas</Label>
          <Input
            id="ordenesCompletadas"
            name="ordenesCompletadas"
            type="number"
            min="0"
            value={formData.ordenesCompletadas}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="observaciones">Observaciones</Label>
        <Textarea id="observaciones" name="observaciones" placeholder="Observaciones adicionales..." rows={3} />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit">Guardar Miembro</Button>
      </div>
    </form>
  )
}
