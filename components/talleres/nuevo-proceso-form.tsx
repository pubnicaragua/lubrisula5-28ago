"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface NuevoProcesoFormProps {
  onSubmit: () => void
}

export function NuevoProcesoForm({ onSubmit }: NuevoProcesoFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    tiempo_estimado: 0,
    orden: 0,
    tipo: "reparacion",
    validaciones: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "tiempo_estimado" || name === "orden" ? Number.parseInt(value) || 0 : value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/procesos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Proceso creado",
          description: "El proceso ha sido creado exitosamente.",
        })
        onSubmit()
      } else {
        toast({
          title: "Error",
          description: data.error || "Error al crear el proceso",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al conectar con el servidor",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="nombre">Nombre del Proceso</Label>
        <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleInputChange}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="tiempo_estimado">Tiempo Estimado (minutos)</Label>
          <Input
            id="tiempo_estimado"
            name="tiempo_estimado"
            type="number"
            min="0"
            value={formData.tiempo_estimado}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="orden">Orden</Label>
          <Input id="orden" name="orden" type="number" min="0" value={formData.orden} onChange={handleInputChange} />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="tipo">Tipo de Proceso</Label>
        <Select value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ingreso">Ingreso</SelectItem>
            <SelectItem value="desarmado">Desarmado</SelectItem>
            <SelectItem value="reparacion">Reparación</SelectItem>
            <SelectItem value="empapelado">Empapelado</SelectItem>
            <SelectItem value="pintura">Pintura</SelectItem>
            <SelectItem value="mecanica">Mecánica</SelectItem>
            <SelectItem value="armado">Armado</SelectItem>
            <SelectItem value="control_calidad">Control de Calidad</SelectItem>
            <SelectItem value="entrega">Entrega</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="validaciones">Validaciones</Label>
        <Textarea
          id="validaciones"
          name="validaciones"
          value={formData.validaciones}
          onChange={handleInputChange}
          placeholder="Requisitos o validaciones para completar este proceso"
          rows={3}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Proceso"}
        </Button>
      </div>
    </form>
  )
}
