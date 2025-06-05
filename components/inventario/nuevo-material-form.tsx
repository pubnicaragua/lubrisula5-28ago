"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface NuevoMaterialFormProps {
  onSubmit: () => void
  material?: Material
  isEditing?: boolean
}

interface Material {
  id?: string
  nombre: string
  tipo: string
  categoria: string
  marca: string
  modelo?: string
  cantidad: number
  unidad: string
  precio: number
  costo: number
  minimo: number
  ubicacion: string
  descripcion?: string
  proveedor?: string
  fecha_compra?: string
  fecha_vencimiento?: string
}

export function NuevoMaterialForm({ onSubmit, material, isEditing = false }: NuevoMaterialFormProps) {
  const [formData, setFormData] = useState<Material>(
    material || {
      nombre: "",
      tipo: "pintura",
      categoria: "",
      marca: "",
      modelo: "",
      cantidad: 0,
      unidad: "unidad",
      precio: 0,
      costo: 0,
      minimo: 0,
      ubicacion: "",
      descripcion: "",
      proveedor: "",
      fecha_compra: new Date().toISOString().split("T")[0],
      fecha_vencimiento: "",
    },
  )

  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "cantidad" || name === "precio" || name === "costo" || name === "minimo"
          ? Number.parseFloat(value)
          : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validaciones básicas
      if (!formData.nombre || !formData.marca || !formData.cantidad || !formData.precio) {
        toast({
          title: "Error de validación",
          description: "Por favor completa todos los campos obligatorios",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Aquí iría la lógica para guardar en Supabase
      if (isEditing && material?.id) {
        // Actualizar material existente
        const { error } = await supabase
          .from("materiales")
          .update({
            nombre: formData.nombre,
            tipo: formData.tipo,
            categoria: formData.categoria,
            marca: formData.marca,
            modelo: formData.modelo,
            cantidad: formData.cantidad,
            unidad: formData.unidad,
            precio: formData.precio,
            costo: formData.costo,
            minimo: formData.minimo,
            ubicacion: formData.ubicacion,
            descripcion: formData.descripcion,
            proveedor: formData.proveedor,
            fecha_compra: formData.fecha_compra,
            fecha_vencimiento: formData.fecha_vencimiento,
            updated_at: new Date().toISOString(),
          })
          .eq("id", material.id)

        if (error) {
          throw error
        }

        toast({
          title: "Material actualizado",
          description: `El material ${formData.nombre} ha sido actualizado correctamente`,
        })
      } else {
        // Crear nuevo material
        const { error } = await supabase.from("materiales").insert({
          nombre: formData.nombre,
          tipo: formData.tipo,
          categoria: formData.categoria,
          marca: formData.marca,
          modelo: formData.modelo,
          cantidad: formData.cantidad,
          unidad: formData.unidad,
          precio: formData.precio,
          costo: formData.costo,
          minimo: formData.minimo,
          ubicacion: formData.ubicacion,
          descripcion: formData.descripcion,
          proveedor: formData.proveedor,
          fecha_compra: formData.fecha_compra,
          fecha_vencimiento: formData.fecha_vencimiento,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (error) {
          throw error
        }

        toast({
          title: "Material creado",
          description: `El material ${formData.nombre} ha sido creado correctamente`,
        })
      }

      onSubmit()
    } catch (error) {
      console.error("Error al guardar material:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar el material. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre del Material *</Label>
          <Input
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Pintura Bicapa"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo *</Label>
          <Select value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pintura">Material de Pintura</SelectItem>
              <SelectItem value="reparacion">Material de Reparación</SelectItem>
              <SelectItem value="herramienta">Herramienta</SelectItem>
              <SelectItem value="repuesto">Repuesto</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoria">Categoría *</Label>
          <Input
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            placeholder="Ej: Pinturas Metálicas"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="marca">Marca *</Label>
          <Input
            id="marca"
            name="marca"
            value={formData.marca}
            onChange={handleChange}
            placeholder="Ej: Sikkens"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="modelo">Modelo/Referencia</Label>
          <Input
            id="modelo"
            name="modelo"
            value={formData.modelo || ""}
            onChange={handleChange}
            placeholder="Ej: AB123"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cantidad">Cantidad *</Label>
          <Input
            id="cantidad"
            name="cantidad"
            type="number"
            min="0"
            step="0.01"
            value={formData.cantidad}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unidad">Unidad de Medida *</Label>
          <Select value={formData.unidad} onValueChange={(value) => handleSelectChange("unidad", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar unidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unidad">Unidad</SelectItem>
              <SelectItem value="litro">Litro</SelectItem>
              <SelectItem value="galon">Galón</SelectItem>
              <SelectItem value="ml">Mililitro</SelectItem>
              <SelectItem value="gramo">Gramo</SelectItem>
              <SelectItem value="kg">Kilogramo</SelectItem>
              <SelectItem value="metro">Metro</SelectItem>
              <SelectItem value="cm">Centímetro</SelectItem>
              <SelectItem value="pulgada">Pulgada</SelectItem>
              <SelectItem value="onza">Onza</SelectItem>
              <SelectItem value="par">Par</SelectItem>
              <SelectItem value="juego">Juego</SelectItem>
              <SelectItem value="caja">Caja</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="precio">Precio de Venta (MXN) *</Label>
          <Input
            id="precio"
            name="precio"
            type="number"
            min="0"
            step="0.01"
            value={formData.precio}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="costo">Costo de Adquisición (MXN) *</Label>
          <Input
            id="costo"
            name="costo"
            type="number"
            min="0"
            step="0.01"
            value={formData.costo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="minimo">Cantidad Mínima</Label>
          <Input
            id="minimo"
            name="minimo"
            type="number"
            min="0"
            step="0.01"
            value={formData.minimo}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ubicacion">Ubicación en Almacén</Label>
          <Input
            id="ubicacion"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            placeholder="Ej: Estante A, Nivel 2"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="proveedor">Proveedor</Label>
          <Input
            id="proveedor"
            name="proveedor"
            value={formData.proveedor || ""}
            onChange={handleChange}
            placeholder="Ej: Distribuidora XYZ"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fecha_compra">Fecha de Compra</Label>
          <Input
            id="fecha_compra"
            name="fecha_compra"
            type="date"
            value={formData.fecha_compra || ""}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fecha_vencimiento">Fecha de Vencimiento</Label>
          <Input
            id="fecha_vencimiento"
            name="fecha_vencimiento"
            type="date"
            value={formData.fecha_vencimiento || ""}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion || ""}
          onChange={handleChange}
          placeholder="Descripción detallada del material..."
          rows={3}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSubmit}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : isEditing ? "Actualizar Material" : "Guardar Material"}
        </Button>
      </div>
    </form>
  )
}
