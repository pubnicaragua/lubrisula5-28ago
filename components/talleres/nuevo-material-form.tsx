"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface Proveedor {
  id: string
  name: string
}

interface NuevoMaterialFormProps {
  procesoId: string
  onSubmit: () => void
}

export function NuevoMaterialForm({ procesoId, onSubmit }: NuevoMaterialFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [loadingProveedores, setLoadingProveedores] = useState(true)

  const [formData, setFormData] = useState({
    nombre: "",
    unidad: "",
    proceso_id: procesoId,
    proveedor_id: "",
    precio_total: 0,
    cantidad: 0,
    precio_unitario: 0,
    rendimiento_vehiculo: 0,
    rendimiento_hora_reparar: 0,
    rendimiento_hora_pintura: 0,
    inventario_inicial: 0,
    inventario_final: 0,
    stock_minimo: 0,
    categoria: "consumible",
  })

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await fetch("/api/proveedores")
        const data = await response.json()

        if (response.ok) {
          setProveedores(data)
        } else {
          toast({
            title: "Error",
            description: data.error || "Error al cargar los proveedores",
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
        setLoadingProveedores(false)
      }
    }

    fetchProveedores()
  }, [toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Convertir a número si es un campo numérico
    if (
      [
        "precio_total",
        "cantidad",
        "precio_unitario",
        "rendimiento_vehiculo",
        "rendimiento_hora_reparar",
        "rendimiento_hora_pintura",
        "inventario_inicial",
        "inventario_final",
        "stock_minimo",
      ].includes(name)
    ) {
      const numValue = Number.parseFloat(value) || 0
      setFormData({ ...formData, [name]: numValue })

      // Calcular precio unitario automáticamente
      if (name === "precio_total" || name === "cantidad") {
        const precioTotal = name === "precio_total" ? numValue : formData.precio_total
        const cantidad = name === "cantidad" ? numValue : formData.cantidad

        if (cantidad > 0) {
          setFormData((prev) => ({
            ...prev,
            [name]: numValue,
            precio_unitario: precioTotal / cantidad,
          }))
        } else {
          setFormData((prev) => ({
            ...prev,
            [name]: numValue,
          }))
        }
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/materiales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Material creado",
          description: "El material ha sido creado exitosamente.",
        })
        onSubmit()
      } else {
        toast({
          title: "Error",
          description: data.error || "Error al crear el material",
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
        <Label htmlFor="nombre">Nombre del Material</Label>
        <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="unidad">Unidad de Medida</Label>
          <Input
            id="unidad"
            name="unidad"
            value={formData.unidad}
            onChange={handleInputChange}
            placeholder="Ej: litros, kg, unidades"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="categoria">Categoría</Label>
          <Select value={formData.categoria} onValueChange={(value) => handleSelectChange("categoria", value)}>
            <SelectTrigger id="categoria">
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pintura">Material de Pintura</SelectItem>
              <SelectItem value="reparacion">Material de Reparación</SelectItem>
              <SelectItem value="mecanica">Material de Mecánica</SelectItem>
              <SelectItem value="consumible">Consumible General</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="proveedor_id">Proveedor</Label>
        <Select value={formData.proveedor_id} onValueChange={(value) => handleSelectChange("proveedor_id", value)}>
          <SelectTrigger id="proveedor_id">
            <SelectValue placeholder={loadingProveedores ? "Cargando proveedores..." : "Seleccionar proveedor"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Sin proveedor</SelectItem>
            {proveedores.map((proveedor) => (
              <SelectItem key={proveedor.id} value={proveedor.id}>
                {proveedor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="precio_total">Precio Total (L)</Label>
          <Input
            id="precio_total"
            name="precio_total"
            type="number"
            step="0.01"
            min="0"
            value={formData.precio_total}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="cantidad">Cantidad</Label>
          <Input
            id="cantidad"
            name="cantidad"
            type="number"
            step="0.01"
            min="0"
            value={formData.cantidad}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="precio_unitario">Precio Unitario (L)</Label>
        <Input
          id="precio_unitario"
          name="precio_unitario"
          type="number"
          step="0.01"
          min="0"
          value={formData.precio_unitario}
          onChange={handleInputChange}
          disabled={formData.cantidad > 0}
        />
        <p className="text-xs text-muted-foreground">
          {formData.cantidad > 0
            ? "Calculado automáticamente a partir del precio total y la cantidad"
            : "Ingrese manualmente o especifique precio total y cantidad"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="rendimiento_vehiculo">Rendimiento por Vehículo</Label>
          <Input
            id="rendimiento_vehiculo"
            name="rendimiento_vehiculo"
            type="number"
            step="0.0001"
            min="0"
            value={formData.rendimiento_vehiculo}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="rendimiento_hora_reparar">Rendimiento por Hora (Reparación)</Label>
          <Input
            id="rendimiento_hora_reparar"
            name="rendimiento_hora_reparar"
            type="number"
            step="0.0001"
            min="0"
            value={formData.rendimiento_hora_reparar}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="rendimiento_hora_pintura">Rendimiento por Hora (Pintura)</Label>
          <Input
            id="rendimiento_hora_pintura"
            name="rendimiento_hora_pintura"
            type="number"
            step="0.0001"
            min="0"
            value={formData.rendimiento_hora_pintura}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="inventario_inicial">Inventario Inicial</Label>
          <Input
            id="inventario_inicial"
            name="inventario_inicial"
            type="number"
            step="0.01"
            min="0"
            value={formData.inventario_inicial}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="inventario_final">Inventario Actual</Label>
          <Input
            id="inventario_final"
            name="inventario_final"
            type="number"
            step="0.01"
            min="0"
            value={formData.inventario_final}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="stock_minimo">Stock Mínimo</Label>
          <Input
            id="stock_minimo"
            name="stock_minimo"
            type="number"
            step="0.01"
            min="0"
            value={formData.stock_minimo}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Material"}
        </Button>
      </div>
    </form>
  )
}
