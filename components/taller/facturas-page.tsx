"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/hooks/use-toast"
import { FileSpreadsheet, FileIcon as FilePdf, Plus, Pencil, Trash2, Search, Filter } from "lucide-react"
import * as XLSX from "xlsx"
import { jsPDF } from "jspdf"
import "jspdf-autotable"

interface Factura {
  id: string
  numero: string
  fecha: string
  cliente_id: string
  cliente_nombre: string
  orden_id: string
  orden_numero: string
  subtotal: number
  impuestos: number
  total: number
  estado: string
  metodo_pago: string
  notas: string
}

interface Cliente {
  id: string
  nombre: string
  email: string
}

interface Orden {
  id: string
  numero: string
  cliente_id: string
}

export function FacturasPage() {
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const [facturas, setFacturas] = useState<Factura[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [ordenes, setOrdenes] = useState<Orden[]>([])
  const [filteredFacturas, setFilteredFacturas] = useState<Factura[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentFactura, setCurrentFactura] = useState<Factura | null>(null)

  const [formData, setFormData] = useState({
    numero: "",
    fecha: new Date().toISOString().split("T")[0],
    cliente_id: "",
    orden_id: "",
    subtotal: 0,
    impuestos: 0,
    total: 0,
    estado: "pendiente",
    metodo_pago: "efectivo",
    notas: "",
  })

  const estadosFactura = [
    { value: "pendiente", label: "Pendiente" },
    { value: "pagada", label: "Pagada" },
    { value: "cancelada", label: "Cancelada" },
    { value: "vencida", label: "Vencida" },
  ]

  const metodosPago = [
    { value: "efectivo", label: "Efectivo" },
    { value: "tarjeta", label: "Tarjeta de Crédito/Débito" },
    { value: "transferencia", label: "Transferencia Bancaria" },
    { value: "cheque", label: "Cheque" },
  ]

  useEffect(() => {
    fetchFacturas()
    fetchClientes()
    fetchOrdenes()
  }, [])

  useEffect(() => {
    if (facturas.length > 0) {
      filterFacturas()
    }
  }, [searchTerm, statusFilter, facturas])

  const fetchFacturas = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("facturas")
        .select(`
          *,
          clientes(id, nombre, email),
          ordenes(id, numero)
        `)
        .order("fecha", { ascending: false })

      if (error) throw error

      const formattedData = data.map((item) => ({
        id: item.id,
        numero: item.numero,
        fecha: new Date(item.fecha).toLocaleDateString(),
        cliente_id: item.cliente_id,
        cliente_nombre: item.clientes?.nombre || "Cliente no encontrado",
        orden_id: item.orden_id,
        orden_numero: item.ordenes?.numero || "Orden no encontrada",
        subtotal: item.subtotal,
        impuestos: item.impuestos,
        total: item.total,
        estado: item.estado,
        metodo_pago: item.metodo_pago,
        notas: item.notas,
      }))

      setFacturas(formattedData)
      setFilteredFacturas(formattedData)
    } catch (error) {
      console.error("Error al cargar facturas:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las facturas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchClientes = async () => {
    try {
      const { data, error } = await supabase.from("clientes").select("id, nombre, email").order("nombre")

      if (error) throw error
      setClientes(data)
    } catch (error) {
      console.error("Error al cargar clientes:", error)
    }
  }

  const fetchOrdenes = async () => {
    try {
      const { data, error } = await supabase
        .from("ordenes")
        .select("id, numero, cliente_id")
        .order("numero", { ascending: false })

      if (error) throw error
      setOrdenes(data)
    } catch (error) {
      console.error("Error al cargar órdenes:", error)
    }
  }

  const filterFacturas = () => {
    let filtered = facturas

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (factura) =>
          factura.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
          factura.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          factura.orden_numero.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por estado
    if (statusFilter !== "todos") {
      filtered = filtered.filter((factura) => factura.estado === statusFilter)
    }

    setFilteredFacturas(filtered)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Calcular total automáticamente cuando cambian subtotal o impuestos
    if (name === "subtotal" || name === "impuestos") {
      const subtotal = name === "subtotal" ? Number.parseFloat(value) || 0 : formData.subtotal
      const impuestos = name === "impuestos" ? Number.parseFloat(value) || 0 : formData.impuestos
      setFormData((prev) => ({ ...prev, total: subtotal + impuestos }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Si se selecciona una orden, cargar datos del cliente automáticamente
    if (name === "orden_id") {
      const orden = ordenes.find((o) => o.id === value)
      if (orden) {
        setFormData((prev) => ({ ...prev, cliente_id: orden.cliente_id }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (currentFactura) {
        // Actualizar factura existente
        const { error } = await supabase
          .from("facturas")
          .update({
            numero: formData.numero,
            fecha: formData.fecha,
            cliente_id: formData.cliente_id,
            orden_id: formData.orden_id,
            subtotal: formData.subtotal,
            impuestos: formData.impuestos,
            total: formData.total,
            estado: formData.estado,
            metodo_pago: formData.metodo_pago,
            notas: formData.notas,
          })
          .eq("id", currentFactura.id)

        if (error) throw error

        toast({
          title: "Factura actualizada",
          description: `La factura ${formData.numero} ha sido actualizada correctamente`,
        })
      } else {
        // Crear nueva factura
        const { error } = await supabase.from("facturas").insert({
          numero: formData.numero,
          fecha: formData.fecha,
          cliente_id: formData.cliente_id,
          orden_id: formData.orden_id,
          subtotal: formData.subtotal,
          impuestos: formData.impuestos,
          total: formData.total,
          estado: formData.estado,
          metodo_pago: formData.metodo_pago,
          notas: formData.notas,
        })

        if (error) throw error

        toast({
          title: "Factura creada",
          description: `La factura ${formData.numero} ha sido creada correctamente`,
        })
      }

      // Cerrar diálogo y recargar datos
      setIsDialogOpen(false)
      resetForm()
      fetchFacturas()
    } catch (error) {
      console.error("Error al guardar factura:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la factura",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (factura: Factura) => {
    setCurrentFactura(factura)
    setFormData({
      numero: factura.numero,
      fecha: new Date(factura.fecha).toISOString().split("T")[0],
      cliente_id: factura.cliente_id,
      orden_id: factura.orden_id,
      subtotal: factura.subtotal,
      impuestos: factura.impuestos,
      total: factura.total,
      estado: factura.estado,
      metodo_pago: factura.metodo_pago,
      notas: factura.notas,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!currentFactura) return

    try {
      const { error } = await supabase.from("facturas").delete().eq("id", currentFactura.id)

      if (error) throw error

      toast({
        title: "Factura eliminada",
        description: `La factura ${currentFactura.numero} ha sido eliminada correctamente`,
      })

      setIsDeleteDialogOpen(false)
      fetchFacturas()
    } catch (error) {
      console.error("Error al eliminar factura:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la factura",
        variant: "destructive",
      })
    }
  }

  const confirmDelete = (factura: Factura) => {
    setCurrentFactura(factura)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setCurrentFactura(null)
    setFormData({
      numero: "",
      fecha: new Date().toISOString().split("T")[0],
      cliente_id: "",
      orden_id: "",
      subtotal: 0,
      impuestos: 0,
      total: 0,
      estado: "pendiente",
      metodo_pago: "efectivo",
      notas: "",
    })
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredFacturas.map((f) => ({
        Número: f.numero,
        Fecha: f.fecha,
        Cliente: f.cliente_nombre,
        Orden: f.orden_numero,
        Subtotal: f.subtotal,
        Impuestos: f.impuestos,
        Total: f.total,
        Estado: f.estado,
        "Método de Pago": f.metodo_pago,
        Notas: f.notas,
      })),
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Facturas")
    XLSX.writeFile(workbook, "Facturas.xlsx")
  }

  const exportToPDF = () => {
    const doc = new jsPDF()

    // Título
    doc.setFontSize(18)
    doc.text("Reporte de Facturas", 14, 22)

    // Fecha de generación
    doc.setFontSize(11)
    doc.text(`Generado: ${new Date().toLocaleDateString()}`, 14, 30)

    // Tabla
    const tableColumn = ["Número", "Fecha", "Cliente", "Total", "Estado"]
    const tableRows = filteredFacturas.map((f) => [
      f.numero,
      f.fecha,
      f.cliente_nombre,
      `$${f.total.toFixed(2)}`,
      f.estado,
    ])

    // @ts-ignore - jspdf-autotable types
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [66, 66, 66] },
    })

    doc.save("Facturas.pdf")
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Facturación</h1>
        <div className="flex gap-2">
          <Button onClick={exportToExcel} variant="outline" size="sm">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button onClick={exportToPDF} variant="outline" size="sm">
            <FilePdf className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button
            onClick={() => {
              resetForm()
              setIsDialogOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Factura
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Facturas</CardTitle>
          <CardDescription>Administra todas las facturas de tu taller automotriz</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, cliente u orden..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                {estadosFactura.map((estado) => (
                  <SelectItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Orden</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="text-right">Impuestos</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Método de Pago</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFacturas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center h-24">
                        No se encontraron facturas
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFacturas.map((factura) => (
                      <TableRow key={factura.id}>
                        <TableCell className="font-medium">{factura.numero}</TableCell>
                        <TableCell>{factura.fecha}</TableCell>
                        <TableCell>{factura.cliente_nombre}</TableCell>
                        <TableCell>{factura.orden_numero}</TableCell>
                        <TableCell className="text-right">${factura.subtotal.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${factura.impuestos.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">${factura.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              factura.estado === "pagada"
                                ? "bg-green-100 text-green-800"
                                : factura.estado === "pendiente"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : factura.estado === "vencida"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {factura.estado.charAt(0).toUpperCase() + factura.estado.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {factura.metodo_pago.charAt(0).toUpperCase() + factura.metodo_pago.slice(1)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(factura)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => confirmDelete(factura)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo para crear/editar factura */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {currentFactura ? `Editar Factura ${currentFactura.numero}` : "Crear Nueva Factura"}
            </DialogTitle>
            <DialogDescription>Complete los detalles de la factura y guarde los cambios.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="detalles" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="detalles">Detalles Principales</TabsTrigger>
                <TabsTrigger value="pagos">Pagos y Notas</TabsTrigger>
              </TabsList>

              <TabsContent value="detalles" className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numero">Número de Factura</Label>
                    <Input id="numero" name="numero" value={formData.numero} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha</Label>
                    <Input
                      id="fecha"
                      name="fecha"
                      type="date"
                      value={formData.fecha}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cliente_id">Cliente</Label>
                    <Select
                      value={formData.cliente_id}
                      onValueChange={(value) => handleSelectChange("cliente_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientes.map((cliente) => (
                          <SelectItem key={cliente.id} value={cliente.id}>
                            {cliente.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="orden_id">Orden de Trabajo</Label>
                    <Select value={formData.orden_id} onValueChange={(value) => handleSelectChange("orden_id", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar orden" />
                      </SelectTrigger>
                      <SelectContent>
                        {ordenes.map((orden) => (
                          <SelectItem key={orden.id} value={orden.id}>
                            {orden.numero}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtotal">Subtotal</Label>
                    <Input
                      id="subtotal"
                      name="subtotal"
                      type="number"
                      step="0.01"
                      value={formData.subtotal}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="impuestos">Impuestos</Label>
                    <Input
                      id="impuestos"
                      name="impuestos"
                      type="number"
                      step="0.01"
                      value={formData.impuestos}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="total">Total</Label>
                    <Input
                      id="total"
                      name="total"
                      type="number"
                      step="0.01"
                      value={formData.total}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pagos" className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select value={formData.estado} onValueChange={(value) => handleSelectChange("estado", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {estadosFactura.map((estado) => (
                          <SelectItem key={estado.value} value={estado.value}>
                            {estado.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metodo_pago">Método de Pago</Label>
                    <Select
                      value={formData.metodo_pago}
                      onValueChange={(value) => handleSelectChange("metodo_pago", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar método de pago" />
                      </SelectTrigger>
                      <SelectContent>
                        {metodosPago.map((metodo) => (
                          <SelectItem key={metodo.value} value={metodo.value}>
                            {metodo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notas">Notas</Label>
                    <Textarea id="notas" name="notas" value={formData.notas} onChange={handleInputChange} rows={4} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{currentFactura ? "Actualizar Factura" : "Crear Factura"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar la factura {currentFactura?.numero}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
