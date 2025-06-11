"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { createVehicle, updateVehicle } from "@/lib/actions/vehicles"
import { useToast } from "@/hooks/use-toast"

interface Vehiculo {
  id?: string
  marca: string
  modelo: string
  año: number
  placa: string
  vin: string
  color: string
  cliente: string
  estado: "Activo" | "En Servicio" | "Entregado" | "Inactivo"
}

interface Client {
  id: string
  name: string
}

interface NuevoVehiculoFormProps {
  onSubmit: (vehiculo: any) => void
  clients?: Client[]
  vehiculoExistente?: any
}

export function NuevoVehiculoForm({ onSubmit, clients = [], vehiculoExistente }: NuevoVehiculoFormProps) {
  const currentYear = new Date().getFullYear()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<Vehiculo>({
    marca: "",
    modelo: "",
    año: currentYear,
    placa: "",
    vin: "",
    color: "",
    cliente: "",
    estado: "Activo",
  })

  // Si hay un vehículo existente, cargar sus datos en el formulario
  useEffect(() => {
    if (vehiculoExistente) {
      setFormData({
        marca: vehiculoExistente.make || "",
        modelo: vehiculoExistente.model || "",
        año: vehiculoExistente.year || currentYear,
        placa: vehiculoExistente.license_plate || "",
        vin: vehiculoExistente.vin || "",
        color: vehiculoExistente.color || "",
        cliente: vehiculoExistente.client_id || "",
        estado: vehiculoExistente.status || "Activo",
      })
    }
  }, [vehiculoExistente, currentYear])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: name === "año" ? Number.parseInt(value) : value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Mapear los datos del formulario al formato esperado por la API
      const vehicleData = {
        make: formData.marca,
        model: formData.modelo,
        year: formData.año,
        license_plate: formData.placa,
        vin: formData.vin,
        color: formData.color,
        client_id: formData.cliente,
        status: formData.estado,
      }

      let result

      if (vehiculoExistente?.id) {
        // Actualizar vehículo existente
        result = await updateVehicle(vehiculoExistente.id, vehicleData)
      } else {
        // Crear nuevo vehículo
        result = await createVehicle(vehicleData)
      }

      if (result.success) {
        onSubmit(result.data)
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo guardar el vehículo",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al guardar vehículo:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar el vehículo",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="marca">Marca</Label>
          <Input id="marca" name="marca" value={formData.marca} onChange={handleInputChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="modelo">Modelo</Label>
          <Input id="modelo" name="modelo" value={formData.modelo} onChange={handleInputChange} required />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="año">Año</Label>
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
          <Label htmlFor="placa">Placa</Label>
          <Input id="placa" name="placa" value={formData.placa} onChange={handleInputChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="color">Color</Label>
          <Input id="color" name="color" value={formData.color} onChange={handleInputChange} required />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="vin">VIN</Label>
        <Input id="vin" name="vin" value={formData.vin} onChange={handleInputChange} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="cliente">Cliente</Label>
        <Select onValueChange={(value) => handleSelectChange("cliente", value)} value={formData.cliente}>
          <SelectTrigger id="cliente">
            <SelectValue placeholder="Seleccionar cliente" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="estado">Estado</Label>
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
