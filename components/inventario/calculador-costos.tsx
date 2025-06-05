"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Calculator } from "lucide-react"

interface MaterialSeleccionado {
  id: string
  nombre: string
  tipo: string
  cantidad: number
  unidad: string
  precio: number
  costo: number
}

export function CalculadorCostos() {
  const [tipoCalculo, setTipoCalculo] = useState<"pintura" | "reparacion" | "mixto">("pintura")
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState<MaterialSeleccionado[]>([])
  const [materialActual, setMaterialActual] = useState<string>("")
  const [cantidadActual, setCantidadActual] = useState<number>(1)
  const [horasManoObra, setHorasManoObra] = useState<number>(0)
  const [costoHora, setCostoHora] = useState<number>(350)
  const [margenGanancia, setMargenGanancia] = useState<number>(30)
  const [resultados, setResultados] = useState<{
    subtotalMateriales: number
    subtotalManoObra: number
    subtotal: number
    margen: number
    total: number
  } | null>(null)

  // Lista de materiales disponibles (simulada)
  const materialesDisponibles = [
    {
      id: "1",
      nombre: "Pintura Bicapa",
      tipo: "pintura",
      unidad: "litro",
      precio: 850,
      costo: 650,
    },
    {
      id: "2",
      nombre: "Barniz Transparente",
      tipo: "pintura",
      unidad: "litro",
      precio: 950,
      costo: 750,
    },
    {
      id: "3",
      nombre: "Primer Anticorrosivo",
      tipo: "pintura",
      unidad: "litro",
      precio: 550,
      costo: 400,
    },
    {
      id: "6",
      nombre: "Masilla Plástica",
      tipo: "reparacion",
      unidad: "kg",
      precio: 350,
      costo: 250,
    },
    {
      id: "7",
      nombre: "Lija 400",
      tipo: "reparacion",
      unidad: "unidad",
      precio: 15,
      costo: 10,
    },
    {
      id: "8",
      nombre: "Cinta de Enmascarar",
      tipo: "reparacion",
      unidad: "unidad",
      precio: 45,
      costo: 30,
    },
  ]

  const handleAgregarMaterial = () => {
    if (!materialActual || cantidadActual <= 0) return

    const material = materialesDisponibles.find((m) => m.id === materialActual)
    if (!material) return

    const materialExistente = materialesSeleccionados.find((m) => m.id === materialActual)
    if (materialExistente) {
      setMaterialesSeleccionados(
        materialesSeleccionados.map((m) =>
          m.id === materialActual ? { ...m, cantidad: m.cantidad + cantidadActual } : m,
        ),
      )
    } else {
      setMaterialesSeleccionados([
        ...materialesSeleccionados,
        {
          ...material,
          cantidad: cantidadActual,
        },
      ])
    }

    setMaterialActual("")
    setCantidadActual(1)
  }

  const handleEliminarMaterial = (id: string) => {
    setMaterialesSeleccionados(materialesSeleccionados.filter((m) => m.id !== id))
  }

  const handleCalcular = () => {
    const subtotalMateriales = materialesSeleccionados.reduce(
      (total, material) => total + material.costo * material.cantidad,
      0,
    )
    const subtotalManoObra = horasManoObra * costoHora
    const subtotal = subtotalMateriales + subtotalManoObra
    const margen = subtotal * (margenGanancia / 100)
    const total = subtotal + margen

    setResultados({
      subtotalMateriales,
      subtotalManoObra,
      subtotal,
      margen,
      total,
    })
  }

  const handleLimpiar = () => {
    setMaterialesSeleccionados([])
    setHorasManoObra(0)
    setCostoHora(350)
    setMargenGanancia(30)
    setResultados(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Selección de Materiales</CardTitle>
            <CardDescription>Selecciona los materiales a utilizar en el trabajo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tipoCalculo">Tipo de Cálculo</Label>
              <Select
                value={tipoCalculo}
                onValueChange={(value) => setTipoCalculo(value as "pintura" | "reparacion" | "mixto")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo de cálculo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pintura">Trabajo de Pintura</SelectItem>
                  <SelectItem value="reparacion">Trabajo de Reparación</SelectItem>
                  <SelectItem value="mixto">Trabajo Mixto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <Label htmlFor="material">Material</Label>
                <Select value={materialActual} onValueChange={setMaterialActual}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materialesDisponibles
                      .filter(
                        (m) =>
                          tipoCalculo === "mixto" ||
                          (tipoCalculo === "pintura" && m.tipo === "pintura") ||
                          (tipoCalculo === "reparacion" && m.tipo === "reparacion"),
                      )
                      .map((material) => (
                        <SelectItem key={material.id} value={material.id}>
                          {material.nombre} ({formatCurrency(material.costo)}/{material.unidad})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input
                  id="cantidad"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={cantidadActual}
                  onChange={(e) => setCantidadActual(Number.parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <Button onClick={handleAgregarMaterial} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Agregar Material
            </Button>

            {materialesSeleccionados.length > 0 && (
              <div className="rounded-md border mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                      <TableHead className="text-right">Costo</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materialesSeleccionados.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">{material.nombre}</TableCell>
                        <TableCell className="text-right">
                          {material.cantidad} {material.unidad}
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(material.costo)}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(material.costo * material.cantidad)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEliminarMaterial(material.id)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mano de Obra y Cálculo</CardTitle>
            <CardDescription>Configura los parámetros de mano de obra y realiza el cálculo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="horasManoObra">Horas de Mano de Obra</Label>
              <Input
                id="horasManoObra"
                type="number"
                min="0"
                step="0.5"
                value={horasManoObra}
                onChange={(e) => setHorasManoObra(Number.parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="costoHora">Costo por Hora (MXN)</Label>
              <Input
                id="costoHora"
                type="number"
                min="0"
                value={costoHora}
                onChange={(e) => setCostoHora(Number.parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="margenGanancia">Margen de Ganancia (%)</Label>
              <Input
                id="margenGanancia"
                type="number"
                min="0"
                max="100"
                value={margenGanancia}
                onChange={(e) => setMargenGanancia(Number.parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleCalcular} className="flex-1">
                <Calculator className="mr-2 h-4 w-4" /> Calcular
              </Button>
              <Button variant="outline" onClick={handleLimpiar}>
                Limpiar
              </Button>
            </div>

            {resultados && (
              <Card className="mt-4 bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Resultados del Cálculo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal Materiales:</span>
                      <span className="font-medium">{formatCurrency(resultados.subtotalMateriales)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subtotal Mano de Obra:</span>
                      <span className="font-medium">{formatCurrency(resultados.subtotalManoObra)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>Subtotal:</span>
                      <span className="font-medium">{formatCurrency(resultados.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Margen de Ganancia ({margenGanancia}%):</span>
                      <span className="font-medium">{formatCurrency(resultados.margen)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-lg font-bold">Total:</span>
                      <span className="text-lg font-bold">{formatCurrency(resultados.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
