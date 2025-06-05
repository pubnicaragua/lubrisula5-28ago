"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Edit, MoreHorizontal, Trash2, Eye, Plus, AlertTriangle } from "lucide-react"
import { NuevoMaterialForm } from "./nuevo-material-form"
import { useToast } from "@/hooks/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface Material {
  id: string
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
  created_at: string
  updated_at: string
}

export function MaterialesPintura() {
  const [materiales, setMateriales] = useState<Material[]>([
    {
      id: "1",
      nombre: "Pintura Bicapa",
      tipo: "pintura",
      categoria: "Pinturas Metálicas",
      marca: "Sikkens",
      modelo: "AB123",
      cantidad: 5,
      unidad: "litro",
      precio: 850,
      costo: 650,
      minimo: 2,
      ubicacion: "Estante A, Nivel 2",
      descripcion: "Pintura bicapa para acabados metálicos",
      proveedor: "Distribuidora XYZ",
      fecha_compra: "2023-03-15",
      fecha_vencimiento: "2024-03-15",
      created_at: "2023-03-15T10:00:00Z",
      updated_at: "2023-03-15T10:00:00Z",
    },
    {
      id: "2",
      nombre: "Barniz Transparente",
      tipo: "pintura",
      categoria: "Barnices",
      marca: "PPG",
      modelo: "TC200",
      cantidad: 3,
      unidad: "litro",
      precio: 950,
      costo: 750,
      minimo: 1,
      ubicacion: "Estante B, Nivel 1",
      descripcion: "Barniz transparente de alto brillo",
      proveedor: "Distribuidora ABC",
      fecha_compra: "2023-03-10",
      fecha_vencimiento: "2024-03-10",
      created_at: "2023-03-10T10:00:00Z",
      updated_at: "2023-03-10T10:00:00Z",
    },
    {
      id: "3",
      nombre: "Primer Anticorrosivo",
      tipo: "pintura",
      categoria: "Primers",
      marca: "3M",
      modelo: "P100",
      cantidad: 8,
      unidad: "litro",
      precio: 550,
      costo: 400,
      minimo: 3,
      ubicacion: "Estante A, Nivel 1",
      descripcion: "Primer anticorrosivo para metales",
      proveedor: "Distribuidora XYZ",
      fecha_compra: "2023-03-05",
      fecha_vencimiento: "2024-03-05",
      created_at: "2023-03-05T10:00:00Z",
      updated_at: "2023-03-05T10:00:00Z",
    },
    {
      id: "4",
      nombre: "Catalizador Rápido",
      tipo: "pintura",
      categoria: "Catalizadores",
      marca: "Sikkens",
      modelo: "CR50",
      cantidad: 4,
      unidad: "litro",
      precio: 450,
      costo: 350,
      minimo: 2,
      ubicacion: "Estante C, Nivel 2",
      descripcion: "Catalizador de secado rápido para pinturas",
      proveedor: "Distribuidora XYZ",
      fecha_compra: "2023-03-20",
      fecha_vencimiento: "2024-03-20",
      created_at: "2023-03-20T10:00:00Z",
      updated_at: "2023-03-20T10:00:00Z",
    },
    {
      id: "5",
      nombre: "Diluyente Universal",
      tipo: "pintura",
      categoria: "Diluyentes",
      marca: "PPG",
      modelo: "DU100",
      cantidad: 10,
      unidad: "litro",
      precio: 250,
      costo: 180,
      minimo: 5,
      ubicacion: "Estante D, Nivel 1",
      descripcion: "Diluyente universal para pinturas automotrices",
      proveedor: "Distribuidora ABC",
      fecha_compra: "2023-03-25",
      fecha_vencimiento: "2024-03-25",
      created_at: "2023-03-25T10:00:00Z",
      updated_at: "2023-03-25T10:00:00Z",
    },
  ])

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchMateriales()
  }, [])

  const fetchMateriales = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("materiales")
        .select("*")
        .eq("tipo", "pintura")
        .order("nombre", { ascending: true })

      if (error) {
        throw error
      }

      if (data) {
        setMateriales(data)
      }
    } catch (error) {
      console.error("Error al cargar materiales:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los materiales. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddMaterial = () => {
    setCurrentMaterial(null)
    setIsAddOpen(true)
  }

  const handleEditMaterial = (material: Material) => {
    setCurrentMaterial(material)
    setIsEditOpen(true)
  }

  const handleViewMaterial = (material: Material) => {
    setCurrentMaterial(material)
    setIsViewOpen(true)
  }

  const handleDeleteMaterial = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este material? Esta acción no se puede deshacer.")) {
      try {
        const { error } = await supabase.from("materiales").delete().eq("id", id)

        if (error) {
          throw error
        }

        setMateriales((prev) => prev.filter((material) => material.id !== id))
        toast({
          title: "Material eliminado",
          description: "El material ha sido eliminado correctamente",
        })
      } catch (error) {
        console.error("Error al eliminar material:", error)
        toast({
          title: "Error",
          description: "No se pudo eliminar el material. Inténtalo de nuevo.",
          variant: "destructive",
        })
      }
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("es-MX")
  }

  const isLowStock = (cantidad: number, minimo: number) => {
    return cantidad <= minimo
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Materiales de Pintura</h2>
        <Button onClick={handleAddMaterial}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Material
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Cargando materiales...</p>
        </div>
      ) : materiales.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No hay materiales de pintura registrados</p>
          <Button onClick={handleAddMaterial}>
            <Plus className="mr-2 h-4 w-4" /> Agregar Material
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materiales.map((material) => (
                <TableRow key={material.id}>
                  <TableCell className="font-medium">{material.nombre}</TableCell>
                  <TableCell>{material.marca}</TableCell>
                  <TableCell>{material.categoria}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isLowStock(material.cantidad, material.minimo) && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                      {material.cantidad} {material.unidad}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(material.precio)}</TableCell>
                  <TableCell>
                    {isLowStock(material.cantidad, material.minimo) ? (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        Stock Bajo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        Disponible
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewMaterial(material)}>
                          <Eye className="mr-2 h-4 w-4" /> Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditMaterial(material)}>
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteMaterial(material.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Diálogo para agregar nuevo material */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Nuevo Material de Pintura</DialogTitle>
            <DialogDescription>
              Ingresa la información del nuevo material. Haz clic en guardar cuando hayas terminado.
            </DialogDescription>
          </DialogHeader>
          <NuevoMaterialForm
            onSubmit={() => {
              setIsAddOpen(false)
              fetchMateriales()
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar material */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Editar Material</DialogTitle>
            <DialogDescription>
              Modifica la información del material. Haz clic en actualizar cuando hayas terminado.
            </DialogDescription>
          </DialogHeader>
          {currentMaterial && (
            <NuevoMaterialForm
              material={currentMaterial}
              isEditing={true}
              onSubmit={() => {
                setIsEditOpen(false)
                fetchMateriales()
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo para ver detalles del material */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentMaterial?.nombre}</DialogTitle>
            <DialogDescription>Detalles completos del material</DialogDescription>
          </DialogHeader>
          {currentMaterial && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <h4 className="font-medium">Tipo</h4>
                <p className="text-sm text-muted-foreground">
                  {currentMaterial.tipo === "pintura" ? "Material de Pintura" : currentMaterial.tipo}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Categoría</h4>
                <p className="text-sm text-muted-foreground">{currentMaterial.categoria}</p>
              </div>
              <div>
                <h4 className="font-medium">Marca</h4>
                <p className="text-sm text-muted-foreground">{currentMaterial.marca}</p>
              </div>
              <div>
                <h4 className="font-medium">Modelo/Referencia</h4>
                <p className="text-sm text-muted-foreground">{currentMaterial.modelo || "N/A"}</p>
              </div>
              <div>
                <h4 className="font-medium">Cantidad</h4>
                <p className="text-sm text-muted-foreground">
                  {currentMaterial.cantidad} {currentMaterial.unidad}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Cantidad Mínima</h4>
                <p className="text-sm text-muted-foreground">
                  {currentMaterial.minimo} {currentMaterial.unidad}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Precio de Venta</h4>
                <p className="text-sm text-muted-foreground">{formatCurrency(currentMaterial.precio)}</p>
              </div>
              <div>
                <h4 className="font-medium">Costo de Adquisición</h4>
                <p className="text-sm text-muted-foreground">{formatCurrency(currentMaterial.costo)}</p>
              </div>
              <div>
                <h4 className="font-medium">Ubicación</h4>
                <p className="text-sm text-muted-foreground">{currentMaterial.ubicacion || "N/A"}</p>
              </div>
              <div>
                <h4 className="font-medium">Proveedor</h4>
                <p className="text-sm text-muted-foreground">{currentMaterial.proveedor || "N/A"}</p>
              </div>
              <div>
                <h4 className="font-medium">Fecha de Compra</h4>
                <p className="text-sm text-muted-foreground">{formatDate(currentMaterial.fecha_compra)}</p>
              </div>
              <div>
                <h4 className="font-medium">Fecha de Vencimiento</h4>
                <p className="text-sm text-muted-foreground">{formatDate(currentMaterial.fecha_vencimiento)}</p>
              </div>
              <div className="col-span-2">
                <h4 className="font-medium">Descripción</h4>
                <p className="text-sm text-muted-foreground">{currentMaterial.descripcion || "Sin descripción"}</p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Cerrar
            </Button>
            {currentMaterial && (
              <Button
                onClick={() => {
                  setIsViewOpen(false)
                  handleEditMaterial(currentMaterial)
                }}
              >
                <Edit className="mr-2 h-4 w-4" /> Editar
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
