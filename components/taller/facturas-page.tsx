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
import { useToast } from "@/hooks/use-toast"
import { FileSpreadsheet, FileIcon as FilePdf, Plus, Pencil, Trash2, Search, Filter } from "lucide-react"
import * as XLSX from "xlsx"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import FACTURAS_SERVICES, { FacturaType, MetodoPagoType } from "@/services/FACTURAS.SERVICE"
import CLIENTS_SERVICES, { ClienteType } from "@/services/CLIENTES_SERVICES.SERVICE"
import ORDENES_TRABAJO_SERVICES, { OrdenTrabajoType } from "@/services/ORDENES.SERVICE"
import autoTable from "jspdf-autotable"

export function FacturasPage() {
  const { toast } = useToast()

  const [State_Facturas, SetState_Facturas] = useState<FacturaType[]>([])
  const [State_Clientes, SetState_Clientes] = useState<ClienteType[]>([])
  const [ordenes, SetState_OrdenesTrabajo] = useState<OrdenTrabajoType[]>([])
  const [State_MetodosPagos, SetState_MetodosPagos] = useState<MetodoPagoType[]>([])

  const [filteredFacturas, setFilteredFacturas] = useState<FacturaType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [State_IsEditingMode, SetState_IsEditingMode] = useState<boolean>(false)
  const [State_FacturaToDelete, SetState_FacturaToDelete] = useState<FacturaType | null>(null)

  const [formData, setFormData] = useState<FacturaType>()

  const estadosFactura = [
    { value: "Pendiente", label: "Pendiente" },
    { value: "Pagado", label: "Pagado" },
    { value: "Cancelado", label: "Cancelado" },
    { value: "Vencido", label: "Vencido" },
  ]

  const FN_GET_FACTURAS = async () => {
    const res = await FACTURAS_SERVICES.GET_ALL_FACTURAS()
    SetState_Facturas(res)
    setIsLoading(false)
  }
  const FN_GET_ALL_CLIENTS = async () => {
    const res = await CLIENTS_SERVICES.GET_ALL_CLIENTS()
    SetState_Clientes(res)
  }
  const FN_GET_ORDENES_DE_TRABAJO = async () => {
    const res = await ORDENES_TRABAJO_SERVICES.GET_ALL_ORDENES()
    SetState_OrdenesTrabajo(res)
  }
  const FN_GET_METODOS_PAGO = async () => {
    const res = await FACTURAS_SERVICES.GET_ALL_METODOS_PAGO()
    SetState_MetodosPagos(res)
  }

  useEffect(() => {
    if (State_Facturas.length > 0) {
      filterFacturas()
    }
  }, [searchTerm, statusFilter, State_Facturas])

  const filterFacturas = () => {
    let filtered = State_Facturas

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (factura) =>
          factura.num_factura.toLowerCase().includes(searchTerm.toLowerCase()) ||
          factura.client_name.toLowerCase().includes(searchTerm.toLowerCase())
        // factura.orden_numero.toLowerCase().includes(searchTerm.toLowerCase()),
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
      const impuestos = name === "impuestos" ? Number.parseFloat(value) || 0 : formData.impuesto
      setFormData((prev) => ({ ...prev, total: subtotal + impuestos }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    console.log(name)
    console.log(value)
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Si se selecciona una orden, cargar datos del cliente automáticamente
    if (name === "orden_id") {
      const orden = ordenes.find((o) => o.id === value)
      if (orden) {
        setFormData((prev) => ({ ...prev, cliente_id: orden.client_id }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log(formData)
    //si no se esta editando factura entonces inserta una nueva
    if (!State_IsEditingMode) {
      await FACTURAS_SERVICES.INSERT_FACTURA(formData);
    }
    if (State_IsEditingMode) {
      await FACTURAS_SERVICES.UPDATE_FACTURA({
        id: formData.id,
        client_id: formData.client_id,
        estado: formData.estado,
        orden_trabajo_id: formData.orden_trabajo_id,
        num_factura: formData.num_factura,
        metodo_pago_id: formData.metodo_pago_id,
        entidad_bancaria_id: formData.entidad_bancaria_id,
        subtotal: formData.subtotal,
        fecha_emision: formData.fecha_emision,
        impuesto: formData.impuesto,
        descuento: formData.descuento,
        total: formData.total,
        nota: formData.nota
      });
    }
    await FN_GET_FACTURAS()
    setIsDialogOpen(false)
    SetState_IsEditingMode(false)

    //   toast({
    //     title: "Factura creada",
    //     description: `La factura ${formData.numero} ha sido creada correctamente`,
    //   })
    // }

    // Cerrar diálogo y resetear formulario
    // resetForm()
  }

  const handleEdit = (factura: FacturaType) => {
    console.log(factura)
    // setCurrentFactura(factura)
    FN_GET_ALL_CLIENTS()
    FN_GET_ORDENES_DE_TRABAJO()
    FN_GET_METODOS_PAGO()
    SetState_IsEditingMode(true)
    setFormData(factura)
    setIsDialogOpen(true)
  }



  const confirmDelete = async (factura: FacturaType) => {
    await FACTURAS_SERVICES.DELTE_FACTURA(factura.id)
    await FN_GET_FACTURAS()
    setIsDeleteDialogOpen(false)
  }

  const resetForm = () => {
    // setCurrentFactura(null)
    setFormData({
      num_factura: "",
      fecha_emision: new Date().toISOString().split("T")[0],
      client_id: "",
      orden_trabajo_id: "",
      subtotal: 0,
      impuesto: 0,
      total: 0,
      estado: "pendiente",
      metodo_pago_id: 0,
      nota: ""
    })
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredFacturas.map((f) => ({
        Número: f.num_factura,
        Fecha: f.fecha_emision,
        Cliente: f.client_name,
        Orden: "...",
        Subtotal: f.subtotal,
        Impuestos: f.impuesto,
        Total: f.total,
        Estado: f.estado,
        "Método de Pago": f.metodo_pago_name,
        Notas: "....",
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
      f.num_factura,
      f.fecha_emision,
      f.client_name,
      `$${f.total.toFixed(2)}`,
      f.estado,
    ])

    
     autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        theme: "grid",
        styles: { fontSize: 9 },
        headStyles: { fillColor: [66, 66, 66] },
      })

    doc.save("Facturas.pdf")
  }

  function getEstadoFacturaClass(estado: string): string {
    switch (estado) {
      case "Pagado":
        return "bg-green-100 text-green-800";
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "Vencido":
        return "bg-red-100 text-red-800";
      case "Cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }


  useEffect(() => {
    FN_GET_FACTURAS()
  }, [])

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
              SetState_IsEditingMode(false)
              FN_GET_ALL_CLIENTS()
              FN_GET_ORDENES_DE_TRABAJO()
              FN_GET_METODOS_PAGO()
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
          <CardDescription>
            Administra todas las facturas de tu taller automotriz (Mock Data Local - {State_Facturas.length} facturas,{" "}
            {State_Clientes.length} clientes)
          </CardDescription>
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
                        <TableCell className="font-medium">{factura.num_factura}</TableCell>
                        <TableCell>{new Date(factura.fecha_emision).toLocaleDateString()}</TableCell>
                        <TableCell>{factura.client_name}</TableCell>
                        <TableCell>{factura.orden_numero} - {factura.orden_client_name} - {factura.orden_servicio_name} - {factura.orden_estado}</TableCell>
                        <TableCell className="text-right">${factura.subtotal.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${factura.impuesto.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">${factura.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <span
                            className={"px-2 py-1 rounded-full text-xs font-medium " + getEstadoFacturaClass(factura.estado)}
                          >
                            {factura.estado}
                          </span>
                        </TableCell>
                        <TableCell>
                          {factura.metodo_pago_name.charAt(0).toUpperCase() + factura.metodo_pago_name.slice(1)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(factura)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => {
                              SetState_FacturaToDelete(factura)
                              setIsDeleteDialogOpen(true)
                            }
                            }>
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
              {State_IsEditingMode ? `Editar Factura ${formData.num_factura}` : "Crear Nueva Factura"}
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
                    <Label htmlFor="num_factura">Número de Factura</Label>
                    <Input id="num_factura" name="num_factura" value={formData?.num_factura} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fecha_emision">Fecha Emision</Label>
                    <Input
                      id="fecha_emision"
                      name="fecha_emision"
                      type="date"
                      value={State_IsEditingMode ? formData?.fecha_emision.slice(0, 10) : formData?.fecha_emision}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client_id">Cliente</Label>
                    <Select
                      value={formData?.client_id}
                      onValueChange={(value) => handleSelectChange("client_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {State_Clientes.map((cliente) => (
                          <SelectItem key={cliente.id} value={cliente.id}>
                            {cliente.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="orden_trabajo_id">Orden de Trabajo</Label>
                    <Select value={formData?.orden_trabajo_id} onValueChange={(value) => handleSelectChange("orden_trabajo_id", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar orden" />
                      </SelectTrigger>
                      <SelectContent>
                        {ordenes.map((orden) => (
                          <SelectItem key={orden.id} value={orden.id}>
                            {orden.numero_orden} - {orden.client_name} - {orden.servicio_name} - {orden.estado}
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
                      value={formData?.subtotal}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="impuesto">Impuestos</Label>
                    <Input
                      id="impuesto"
                      name="impuesto"
                      type="number"
                      step="0.01"
                      value={formData?.impuesto}
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
                      value={formData?.total}
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
                    <Select value={formData?.estado} onValueChange={(value) => handleSelectChange("estado", value)}>
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
                      value={formData?.metodo_pago_id.toString()}
                      onValueChange={(value) => handleSelectChange("metodo_pago_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar método de pago" />
                      </SelectTrigger>
                      <SelectContent>
                        {State_MetodosPagos.map((metodo) => (
                          <SelectItem key={metodo.id} value={metodo.id.toString()}>
                            {metodo.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notas">Notas</Label>
                    <Textarea id="nota" name="nota" value={formData?.nota} onChange={handleInputChange} rows={4} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{State_IsEditingMode ? "Actualizar Factura" : "Crear Factura"}</Button>
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
              ¿Está seguro de que desea eliminar la factura {State_FacturaToDelete?.num_factura}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => confirmDelete(State_FacturaToDelete)}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
