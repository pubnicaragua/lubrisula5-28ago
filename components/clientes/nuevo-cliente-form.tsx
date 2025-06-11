"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface Cliente {
  nombre: string
  empresa: string
  telefono: string
  email: string
  tipoCliente: "Individual" | "Empresa" | "Flota" | "Aseguradora"
  ultimaVisita: string
}

interface NuevoClienteFormProps {
  onSubmit: (cliente: Cliente) => void
}

export function NuevoClienteForm({ onSubmit }: NuevoClienteFormProps) {
  const [formData, setFormData] = useState<Cliente>({
    nombre: "",
    empresa: "",
    telefono: "",
    email: "",
    tipoCliente: "Individual",
    ultimaVisita: new Date().toLocaleDateString(),
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, tipoCliente: value as Cliente["tipoCliente"] })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="empresa">Empresa</Label>
        <Input id="empresa" name="empresa" value={formData.empresa} onChange={handleInputChange} />
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
      <div className="grid gap-2">
        <Label htmlFor="tipoCliente">Tipo de Cliente</Label>
        <Select onValueChange={handleSelectChange} defaultValue={formData.tipoCliente}>
          <SelectTrigger id="tipoCliente">
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Individual">Individual</SelectItem>
            <SelectItem value="Empresa">Empresa</SelectItem>
            <SelectItem value="Flota">Flota</SelectItem>
            <SelectItem value="Aseguradora">Aseguradora</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end mt-4">
        <Button type="submit">Guardar Cliente</Button>
      </div>
    </form>
  )
}
