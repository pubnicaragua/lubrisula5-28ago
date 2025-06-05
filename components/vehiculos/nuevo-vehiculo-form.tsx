"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"

interface VehiculoForm {
  marca: string
  modelo: string
  año: number
  placa: string
  vin: string
  color: string
  clienteId: string
  estado: "Activo" | "En Servicio" | "Entregado" | "Inactivo"
  kilometraje?: string
}

interface Client {
  id: string
  nombre: string
  apellido: string
}

interface NuevoVehiculoFormProps {
  onSubmit: (vehiculo: VehiculoForm) => void
  clients?: Client[]
  vehiculoExistente?: any
}

export function NuevoVehiculoForm({ onSubmit, clients = [], vehiculoExistente }: NuevoVehiculoFormProps) {
  const currentYear = new Date().getFullYear()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<VehiculoForm>({
    marca: "",
    modelo: "",
    año: currentYear,
    placa: "",
    vin: "",
    color: "",
    clienteId: "",
    estado: "Activo",
    kilometraje: "",
  })

  // Cargar datos del vehículo existente si se está editando
  useEffect(() => {
    if (vehiculoExistente) {
      setFormData({
        marca: vehiculoExistente.marca || "",
        modelo: vehiculoExistente.modelo || "",
        año: vehiculoExistente.año || currentYear,
        placa: vehiculoExistente.placa || "",
        vin: vehiculoExistente.vin || "",
        color: vehiculoExistente.color || "",
        clienteId: vehiculoExistente.clienteId || "",
        estado: vehiculoExistente.estado || "Activo",
        kilometraje: vehiculoExistente.kilometraje || "",
      })
    }
  }, [vehiculoExistente, currentYear])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "año" ? Number.parseInt(value) : value,
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
    if (!vehiculoExistente) {
      setFormData({
        marca: "",
        modelo: "",
        año: currentYear,
        placa: "",
        vin: "",
        color: "",
        clienteId: "",
        estado: "Activo",
        kilometraje: "",
      })
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="marca">Marca *</Label>
          <Input id="marca" name="marca" value={formData.marca} onChange={handleInputChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="modelo">Modelo *</Label>
          <Input id="modelo" name="modelo" value={formData.modelo} onChange={handleInputChange} required />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="año">Año *</Label>
          <Input
            id="año"
            name="año"
            type="number"
            min="1900"
            max={currentYear + 1}
            value={formData.año}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="placa">Placa *</Label>
          <Input id="placa" name="placa" value={formData.placa} onChange={handleInputChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="color">Color *</Label>
          <Input id="color" name="color" value={formData.color} onChange={handleInputChange} required />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="vin">VIN *</Label>
        <Input id="vin" name="vin" value={formData.vin} onChange={handleInputChange} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="kilometraje">Kilometraje</Label>
        <Input
          id="kilometraje"
          name="kilometraje"
          value={formData.kilometraje}
          onChange={handleInputChange}
          placeholder="Ej: 45,000"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="clienteId">Cliente *</Label>
        <Select onValueChange={(value) => handleSelectChange("clienteId", value)} value={formData.clienteId}>
          <SelectTrigger id="clienteId">
            <SelectValue placeholder="Seleccionar cliente" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.nombre} {client.apellido}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="estado">Estado *</Label>
        <Select onValueChange={(value) => handleSelectChange("estado", value)} value={formData.estado}>
          <SelectTrigger id="estado">
            <SelectValue placeholder="Seleccionar estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="En Servicio">En Servicio</SelectItem>
            <SelectItem value="Entregado">Entregado</SelectItem>
            <SelectItem value="Inactivo">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end mt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : vehiculoExistente ? "Actualizar Vehículo" : "Guardar Vehículo"}
        </Button>
      </div>
    </form>
  )
}
