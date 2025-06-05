"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface Repuesto {
  codigo: string
  nombre: string
  marca: string
  modelo: string
  categoria: string
  proveedor: string
  precio: number
  stock: number
  stockMinimo: number
  ubicacion: string
  estado: "Disponible" | "Bajo Stock" | "Agotado" | "Descontinuado" | "En Pedido"
}

interface NuevoRepuestoFormProps {
  onSubmit: (repuesto: Repuesto) => void
}

export function NuevoRepuestoForm({ onSubmit }: NuevoRepuestoFormProps) {
  const [formData, setFormData] = useState<Repuesto>({
    codigo: `REP-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
    nombre: "",
    marca: "",
    modelo: "",
    categoria: "Filtros",
    proveedor: "",
    precio: 0,
    stock: 0,
    stockMinimo: 1,
    ubicacion: "",
    estado: "Disponible",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "precio" || name === "stock" || name === "stockMinimo" ? Number.parseFloat(value) || 0 : value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Determinar el estado basado en el stock
    let estado: Repuesto["estado"] = "Disponible"
    if (formData.stock === 0) {
      estado = "Agotado"
    } else if (formData.stock <= formData.stockMinimo) {
      estado = "Bajo Stock"
    }

    setFormData({ ...formData, estado: estado })

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="codigo">Código</Label>
        <Input type="text" id="codigo" name="codigo" value={formData.codigo} onChange={handleInputChange} readOnly />
      </div>
      <div>
        <Label htmlFor="nombre">Nombre</Label>
        <Input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="marca">Marca</Label>
        <Input type="text" id="marca" name="marca" value={formData.marca} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="modelo">Modelo</Label>
        <Input type="text" id="modelo" name="modelo" value={formData.modelo} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="categoria">Categoría</Label>
        <Select onValueChange={(value) => handleSelectChange("categoria", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una categoría" value={formData.categoria} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Filtros">Filtros</SelectItem>
            <SelectItem value="Frenos">Frenos</SelectItem>
            <SelectItem value="Suspension">Suspensión</SelectItem>
            <SelectItem value="Motor">Motor</SelectItem>
            <SelectItem value="Transmision">Transmisión</SelectItem>
            <SelectItem value="Electricidad">Electricidad</SelectItem>
            <SelectItem value="Carroceria">Carrocería</SelectItem>
            <SelectItem value="Refrigeracion">Refrigeración</SelectItem>
            <SelectItem value="Direccion">Dirección</SelectItem>
            <SelectItem value="Otros">Otros</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="proveedor">Proveedor</Label>
        <Input type="text" id="proveedor" name="proveedor" value={formData.proveedor} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="precio">Precio</Label>
        <Input type="number" id="precio" name="precio" value={formData.precio} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="stock">Stock</Label>
        <Input type="number" id="stock" name="stock" value={formData.stock} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="stockMinimo">Stock Mínimo</Label>
        <Input
          type="number"
          id="stockMinimo"
          name="stockMinimo"
          value={formData.stockMinimo}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Label htmlFor="ubicacion">Ubicación</Label>
        <Input type="text" id="ubicacion" name="ubicacion" value={formData.ubicacion} onChange={handleInputChange} />
      </div>
      <Button type="submit">Guardar Repuesto</Button>
    </form>
  )
}
