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
import { FileSpreadsheet, FileIcon as FilePdf, Plus, Pencil, Trash2, Search, AlertTriangle } from "lucide-react"
import * as XLSX from "xlsx"
import { jsPDF } from "jspdf"
import "jspdf-autotable"

interface Producto {
  id: string
  codigo: string
  nombre: string
  descripcion: string
  categoria: string
  precio_compra: number
  precio_venta: number
  stock_actual: number
  stock_minimo: number
  proveedor: string
  ubicacion: string
  fecha_ingreso: string
  estado: string
}

export function InventarioPage() {
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const [productos, setProductos] = useState<Producto[]>([])
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("todas")
  const [stockFilter, setStockFilter] = useState("todos")

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentProducto, setCurrentProducto] = useState<Producto | null>(null)

  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    categoria: "repuestos",
    precio_compra: 0,
    precio_venta: 0,
    stock_actual: 0,
    stock_minimo: 5,
    proveedor: "",
    ubicacion: "",
    fecha_ingreso: new Date().toISOString().split("T")[0],
    estado: "activo",
  })

  const categorias = [
    { value: "repuestos", label: "Repuestos" },
    { value: "herramientas", label: "Herramientas" },
    { value: "aceites", label: "Aceites y Lubricantes" },
    { value: "pintura", label: "Pintura" },
    { value: "consumibles", label: "Consumibles" },
  ]

  const estados = [
    { value: "activo", label: "Activo" },
    { value: "descontinuado", label: "Descontinuado" },
    { value: "agotado", label: "Agotado" },
  ]

  useEffect(() => {
    fetchProductos()
  }, [])

  useEffect(() => {
    if (productos.length > 0) {
      filterProductos()
    }
  }, [searchTerm, categoryFilter, stockFilter, productos])

  const fetchProductos = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("inventario").select("*").order("nombre")

      if (error) throw error

      setProductos(data)
      setFilteredProductos(data)
    } catch (error) {
      console.error("Error al cargar inventario:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar el inventario",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterProductos = () => {
    let filtered = productos

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (producto) =>
          producto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          producto.proveedor.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por categoría
    if (categoryFilter !== "todas") {
      filtered = filtered.filter((producto) => producto.categoria === categoryFilter)
    }

    // Filtrar por estado de stock
    if (stockFilter === "bajo") {
      filtered = filtered.filter((producto) => producto.stock_actual <= producto.stock_minimo)
    } else if (stockFilter === "agotado") {
      filtered = filtered.filter((producto) => producto.stock_actual === 0)
    }

    setFilteredProductos(filtered)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Calcular precio de venta automáticamente con un margen del 30%
    if (name === "precio_compra") {
      const precioCompra = Number.parseFloat(value) || 0
      const precioVenta = precioCompra * 1.3
      setFormData((prev) => ({ ...prev, precio_venta: precioVenta }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (currentProducto) {
        // Actualizar producto existente
        const { error } = await supabase
          .from("inventario")
          .update({
            codigo: formData.codigo,
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            categoria: formData.categoria,
            precio_compra: formData.precio_compra,
            precio_venta: formData.precio_venta,
            stock_actual: formData.stock_actual,
            stock_minimo: formData.stock_minimo,
            proveedor: formData.proveedor,
            ubicacion: formData.ubicacion,
            fecha_ingreso: formData.fecha_ingreso,
            estado: formData.estado,
          })
          .eq("id", currentProducto.id)

        if (error) throw error

        toast({
          title: "Producto actualizado",
          description: `El producto ${formData.nombre} ha sido actualizado correctamente`,
        })
      } else {
        // Crear nuevo producto
        const { error } = await supabase.from("inventario").insert({
          codigo: formData.codigo,
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          categoria: formData.categoria,
          precio_compra: formData.precio_compra,
          precio_venta: formData.precio_venta,
          stock_actual: formData.stock_actual,
          stock_minimo: formData.stock_minimo,
          proveedor: formData.proveedor,
          ubicacion: formData.ubicacion,
          fecha_ingreso: formData.fecha_ingreso,
          estado: formData.estado,
        })

        if (error) throw error

        toast({
          title: "Producto creado",
          description: `El producto ${formData.nombre} ha sido creado correctamente`,
        })
      }

      // Cerrar diálogo y recargar datos
      setIsDialogOpen(false)
      resetForm()
      fetchProductos()
    } catch (error) {
      console.error("Error al guardar producto:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el producto",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (producto: Producto) => {
    setCurrentProducto(producto)
    setFormData({
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      categoria: producto.categoria,
      precio_compra: producto.precio_compra,
      precio_venta: producto.precio_venta,
      stock_actual: producto.stock_actual,
      stock_minimo: producto.stock_minimo,
      proveedor: producto.proveedor,
      ubicacion: producto.ubicacion,
      fecha_ingreso: new Date(producto.fecha_ingreso).toISOString().split("T")[0],
      estado: producto.estado,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!currentProducto) return

    try {
      const { error } = await supabase.from("inventario").delete().eq("id", currentProducto.id)

      if (error) throw error

      toast({
        title: "Producto eliminado",
        description: `El producto ${currentProducto.nombre} ha sido eliminado correctamente`,
      })

      setIsDeleteDialogOpen(false)
      fetchProductos()
    } catch (error) {
      console.error("Error al eliminar producto:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      })
    }
  }

  const confirmDelete = (producto: Producto) => {
    setCurrentProducto(producto)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setCurrentProducto(null)
    setFormData({
      codigo: "",
      nombre: "",
      descripcion: "",
      categoria: "repuestos",
      precio_compra: 0,
      precio_venta: 0,
      stock_actual: 0,
      stock_minimo: 5,
      proveedor: "",
      ubicacion: "",
      fecha_ingreso: new Date().toISOString().split("T")[0],
      estado: "activo",
    })
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredProductos.map((p) => ({
        Código: p.codigo,
        Nombre: p.nombre,
        Descripción: p.descripcion,
        Categoría: p.categoria,
        "Precio Compra": p.precio_compra,
        "Precio Venta": p.precio_venta,
        "Stock Actual": p.stock_actual,
        "Stock Mínimo": p.stock_minimo,
        Proveedor: p.proveedor,
        Ubicación: p.ubicacion,
        "Fecha Ingreso": p.fecha_ingreso,
        Estado: p.estado,
      })),
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario")
    XLSX.writeFile(workbook, "Inventario.xlsx")
  }

  const exportToPDF = () => {
    const doc = new jsPDF()

    // Título
    doc.setFontSize(18)
    doc.text("Reporte de Inventario", 14, 22)

    // Fecha de generación
    doc.setFontSize(11)
    doc.text(`Generado: ${new Date().toLocaleDateString()}`, 14, 30)

    // Tabla
    const tableColumn = ["Código", "Nombre", "Categoría", "Stock", "Precio Venta", "Estado"]
    const tableRows = filteredProductos.map((p) => [
      p.codigo,
      p.nombre,
      p.categoria,
      p.stock_actual,
      `$${p.precio_venta.toFixed(2)}`,
      p.estado,
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

    doc.save("Inventario.pdf")
  }

  // Contar productos con stock bajo
  const stockBajoCount = productos.filter((p) => p.stock_actual <= p.stock_minimo && p.stock_actual > 0).length
  const stockAgotadoCount = productos.filter((p) => p.stock_actual === 0).length

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
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
            Nuevo Producto
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productos.length}</div>
            <p className="text-xs text-muted-foreground">Productos en inventario</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockBajoCount}</div>
            <p className="text-xs text-muted-foreground">Productos por debajo del stock mínimo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agotados</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockAgotadoCount}</div>
            <p className="text-xs text-muted-foreground">Productos sin existencias</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Inventario</CardTitle>
          <CardDescription>Administra todos los productos y repuestos de tu taller</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código, nombre o proveedor..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las categorías</SelectItem>
                {categorias.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todo el inventario</SelectItem>
                <SelectItem value="bajo">Stock bajo</SelectItem>
                <SelectItem value="agotado">Agotados</SelectItem>
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
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Precio Compra</TableHead>
                    <TableHead className="text-right">Precio Venta</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProductos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center h-24">
                        No se encontraron productos
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProductos.map((producto) => (
                      <TableRow key={producto.id}>
                        <TableCell className="font-medium">{producto.codigo}</TableCell>
                        <TableCell>{producto.nombre}</TableCell>
                        <TableCell>{producto.categoria}</TableCell>
                        <TableCell
                          className={`text-right font-medium ${
                            producto.stock_actual === 0
                              ? "text-red-500"
                              : producto.stock_actual <= producto.stock_minimo
                                ? "text-yellow-500"
                                : "text-green-500"
                          }`}
                        >
                          {producto.stock_actual}
                        </TableCell>
                        <TableCell className="text-right">${producto.precio_compra.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${producto.precio_venta.toFixed(2)}</TableCell>
                        <TableCell>{producto.proveedor}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              producto.estado === "activo"
                                ? "bg-green-100 text-green-800"
                                : producto.estado === "descontinuado"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {producto.estado.charAt(0).toUpperCase() + producto.estado.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(producto)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => confirmDelete(producto)}>
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

      {/* Diálogo para crear/editar producto */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {currentProducto ? `Editar Producto ${currentProducto.nombre}` : "Crear Nuevo Producto"}
            </DialogTitle>
            <DialogDescription>Complete los detalles del producto y guarde los cambios.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="detalles" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="detalles">Información Básica</TabsTrigger>
                <TabsTrigger value="precios">Precios y Stock</TabsTrigger>
                <TabsTrigger value="adicional">Información Adicional</TabsTrigger>
              </TabsList>

              <TabsContent value="detalles" className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="codigo">Código</Label>
                    <Input id="codigo" name="codigo" value={formData.codigo} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoría</Label>
                    <Select
                      value={formData.categoria}
                      onValueChange={(value) => handleSelectChange("categoria", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select value={formData.estado} onValueChange={(value) => handleSelectChange("estado", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {estados.map((estado) => (
                          <SelectItem key={estado.value} value={estado.value}>
                            {estado.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="precios" className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="precio_compra">Precio de Compra</Label>
                    <Input
                      id="precio_compra"
                      name="precio_compra"
                      type="number"
                      step="0.01"
                      value={formData.precio_compra}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="precio_venta">Precio de Venta</Label>
                    <Input
                      id="precio_venta"
                      name="precio_venta"
                      type="number"
                      step="0.01"
                      value={formData.precio_venta}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock_actual">Stock Actual</Label>
                    <Input
                      id="stock_actual"
                      name="stock_actual"
                      type="number"
                      value={formData.stock_actual}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock_minimo">Stock Mínimo</Label>
                    <Input
                      id="stock_minimo"
                      name="stock_minimo"
                      type="number"
                      value={formData.stock_minimo}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="adicional" className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="proveedor">Proveedor</Label>
                    <Input id="proveedor" name="proveedor" value={formData.proveedor} onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ubicacion">Ubicación en Almacén</Label>
                    <Input id="ubicacion" name="ubicacion" value={formData.ubicacion} onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fecha_ingreso">Fecha de Ingreso</Label>
                    <Input
                      id="fecha_ingreso"
                      name="fecha_ingreso"
                      type="date"
                      value={formData.fecha_ingreso}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{currentProducto ? "Actualizar Producto" : "Crear Producto"}</Button>
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
              ¿Está seguro de que desea eliminar el producto {currentProducto?.nombre}? Esta acción no se puede
              deshacer.
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
