"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface HojaIngresoProps {
  vehicleId: string
}

interface VehicleData {
  id: string
  marca: string
  modelo: string
  anio: number
  placa: string
  kilometraje: number
  nivelCombustible: string
  observacionesIniciales: string
  danosExistentes: string
  accesorios: string
  fechaIngreso: string
  clienteId: string
}

export function HojaIngreso({ vehicleId }: HojaIngresoProps) {
  const { toast } = useToast()
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    id: vehicleId,
    marca: "",
    modelo: "",
    anio: new Date().getFullYear(),
    placa: "",
    kilometraje: 0,
    nivelCombustible: "1/4",
    observacionesIniciales: "",
    danosExistentes: "",
    accesorios: "",
    fechaIngreso: new Date().toISOString().split("T")[0],
    clienteId: "mock-client-id", // Placeholder
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Cargar datos del vehículo desde localStorage
    const savedVehicleData = localStorage.getItem(`vehicle_${vehicleId}_ingreso`)
    if (savedVehicleData) {
      setVehicleData(JSON.parse(savedVehicleData))
    } else {
      // Simular carga de datos básicos si no hay nada guardado
      setVehicleData((prev) => ({
        ...prev,
        marca: "Toyota",
        modelo: "Corolla",
        placa: "P-123456",
        kilometraje: 50000,
      }))
    }
  }, [vehicleId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setVehicleData((prev) => ({
      ...prev,
      [name]: name === "kilometraje" || name === "anio" ? Number(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setVehicleData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular guardado en localStorage
    await new Promise((resolve) => setTimeout(resolve, 1000))
    localStorage.setItem(`vehicle_${vehicleId}_ingreso`, JSON.stringify(vehicleData))

    toast({
      title: "Hoja de Ingreso Guardada",
      description: "Los datos del ingreso del vehículo han sido guardados exitosamente.",
    })
    setIsSubmitting(false)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hoja de Ingreso de Vehículo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="marca">Marca</Label>
              <Input id="marca" name="marca" value={vehicleData.marca} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input id="modelo" name="modelo" value={vehicleData.modelo} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="anio">Año</Label>
              <Input id="anio" name="anio" type="number" value={vehicleData.anio} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="placa">Placa</Label>
              <Input id="placa" name="placa" value={vehicleData.placa} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="kilometraje">Kilometraje</Label>
              <Input
                id="kilometraje"
                name="kilometraje"
                type="number"
                value={vehicleData.kilometraje}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nivelCombustible">Nivel de Combustible</Label>
              <Select
                name="nivelCombustible"
                value={vehicleData.nivelCombustible}
                onValueChange={(value) => handleSelectChange("nivelCombustible", value)}
              >
                <SelectTrigger id="nivelCombustible">
                  <SelectValue placeholder="Seleccionar nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vacio">Vacío</SelectItem>
                  <SelectItem value="1/4">1/4</SelectItem>
                  <SelectItem value="1/2">1/2</SelectItem>
                  <SelectItem value="3/4">3/4</SelectItem>
                  <SelectItem value="Lleno">Lleno</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="observacionesIniciales">Observaciones Iniciales</Label>
            <Textarea
              id="observacionesIniciales"
              name="observacionesIniciales"
              value={vehicleData.observacionesIniciales}
              onChange={handleChange}
              placeholder="Cualquier observación al momento del ingreso..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="danosExistentes">Daños Existentes (rayones, abolladuras, etc.)</Label>
            <Textarea
              id="danosExistentes"
              name="danosExistentes"
              value={vehicleData.danosExistentes}
              onChange={handleChange}
              placeholder="Describa cualquier daño visible..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="accesorios">Accesorios Recibidos (llaves, manuales, etc.)</Label>
            <Textarea
              id="accesorios"
              name="accesorios"
              value={vehicleData.accesorios}
              onChange={handleChange}
              placeholder="Lista de accesorios recibidos..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Hoja de Ingreso"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
