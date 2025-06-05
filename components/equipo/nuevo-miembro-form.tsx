"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"

interface MiembroForm {
  nombre: string
  apellido: string
  cargo: string
  especialidad: string
  telefono: string
  email: string
  estado: "Activo" | "Inactivo" | "De Vacaciones" | "Permiso"
  salario?: number
}

interface NuevoMiembroFormProps {
  onSubmit: (miembro: MiembroForm) => void
  miembroExistente?: any
}

export function NuevoMiembroForm({ onSubmit, miembroExistente }: NuevoMiembroFormProps) {
  const [formData, setFormData] = useState<MiembroForm>({
    nombre: "",
    apellido: "",
    cargo: "",
    especialidad: "",
    telefono: "",
    email: "",
    estado: "Activo",
    salario: 0,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Cargar datos del miembro existente si se está editando
  useEffect(() => {
    if (miembroExistente) {
      setFormData({
        nombre: miembroExistente.nombre || "",
        apellido: miembroExistente.apellido || "",
        cargo: miembroExistente.cargo || "",
        especialidad: miembroExistente.especialidad || "",
        telefono: miembroExistente.telefono || "",
        email: miembroExistente.email || "",
        estado: miembroExistente.estado || "Activo",
        salario: miembroExistente.salario || 0,
      })
    }
  }, [miembroExistente])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "salario" ? Number.parseFloat(value) || 0 : value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular delay de procesamiento
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSubmit(formData)

    // Limpiar formulario si no es edición
    if (!miembroExistente) {
      setFormData({
        nombre: "",
        apellido: "",
        cargo: "",
        especialidad: "",
        telefono: "",
        email: "",
        estado: "Activo",
        salario: 0,
      })
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="nombre">Nombre *</Label>
          <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="apellido">Apellido *</Label>
          <Input id="apellido" name="apellido" value={formData.apellido} onChange={handleInputChange} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="cargo">Cargo *</Label>
          <Select onValueChange={(value) => handleSelectChange("cargo", value)} value={formData.cargo}>
            <SelectTrigger id="cargo">
              <SelectValue placeholder="Seleccionar cargo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Técnico">Técnico</SelectItem>
              <SelectItem value="Técnico Senior">Técnico Senior</SelectItem>
              <SelectItem value="Jefe de Taller">Jefe de Taller</SelectItem>
              <SelectItem value="Administrativo">Administrativo</SelectItem>
              <SelectItem value="Recepcionista">Recepcionista</SelectItem>
              <SelectItem value="Gerente">Gerente</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="especialidad">Especialidad *</Label>
          <Select onValueChange={(value) => handleSelectChange("especialidad", value)} value={formData.especialidad}>
            <SelectTrigger id="especialidad">
              <SelectValue placeholder="Seleccionar especialidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mecánica General">Mecánica General</SelectItem>
              <SelectItem value="Carrocería">Carrocería</SelectItem>
              <SelectItem value="Pintura">Pintura</SelectItem>
              <SelectItem value="Electricidad">Electricidad</SelectItem>
              <SelectItem value="Transmisión">Transmisión</SelectItem>
              <SelectItem value="Frenos">Frenos</SelectItem>
              <SelectItem value="Atención al Cliente">Atención al Cliente</SelectItem>
              <SelectItem value="Administración">Administración</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="telefono">Teléfono *</Label>
          <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleInputChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="estado">Estado *</Label>
          <Select onValueChange={(value) => handleSelectChange("estado", value)} value={formData.estado}>
            <SelectTrigger id="estado">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="De Vacaciones">De Vacaciones</SelectItem>
              <SelectItem value="Permiso">Permiso</SelectItem>
              <SelectItem value="Inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="salario">Salario (L)</Label>
          <Input
            id="salario"
            name="salario"
            type="number"
            min="0"
            step="0.01"
            value={formData.salario}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : miembroExistente ? "Actualizar Miembro" : "Guardar Miembro"}
        </Button>
      </div>
    </form>
  )
}
