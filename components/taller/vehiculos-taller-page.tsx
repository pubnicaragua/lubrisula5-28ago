"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Edit, MoreHorizontal, Plus, Search, Trash2, Eye, FileText, FileInput, Upload } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import * as XLSX from "xlsx"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import VEHICULO_SERVICES, { VehiculoType } from "@/services/VEHICULOS.SERVICE"
import CLIENTS_SERVICES, { ClienteType } from "@/services/CLIENTES_SERVICES.SERVICE"
import { NuevoVehiculoForm } from "../vehiculos/nuevo-vehiculo-form"
import EstadoVehiculoComponent from "../ui/EstadoVehiculo"
import autoTable from "jspdf-autotable"

const vehiculoSchema = z.object({
  marca: z.string().min(1, { message: "La marca es requerida" }),
  modelo: z.string().min(1, { message: "El modelo es requerido" }),
  ano: z.string().min(4, { message: "El año debe tener 4 dígitos" }),
  placa: z.string().min(1, { message: "La placa es requerida" }),
  color: z.string().min(1, { message: "El color es requerido" }),
  client_id: z.string().min(1, { message: "El cliente es requerido" }),
  tipo: z.string().min(1, { message: "El tipo de vehículo es requerido" }),
  vin: z.string().optional(),
})

interface VehiculosTallerPageProps {
  onOpenHojaIngreso?: (vehiculoId: string) => void
}

export function VehiculosTallerPage({ onOpenHojaIngreso }: VehiculosTallerPageProps) {
  const [vehiculos, setVehiculos] = useState<VehiculoType[]>([])
  const [clientes, setClientes] = useState<ClienteType[]>([])
  const [filteredVehiculos, setFilteredVehiculos] = useState<VehiculoType[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [vehiculoToDelete, setVehiculoToDelete] = useState<VehiculoType>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [State_VehicleToUpdate, SetState_VehiculeToUpdate] = useState<VehiculoType>(null)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  const editForm = useForm<z.infer<typeof vehiculoSchema>>({
    resolver: zodResolver(vehiculoSchema),
    defaultValues: {
      marca: "",
      modelo: "",
      ano: "",
      placa: "",
      color: "",
      client_id: "",
      tipo: "",
      vin: "",
    },
  })

  const FN_GET_ALL_VEHICULOS = async () => {
    const DataVehichulos = await VEHICULO_SERVICES.GET_ALL_VEHICULOS();
    setVehiculos(DataVehichulos)
  }

  const loadMockData = async () => {
    setIsLoading(true)
    const savedVehiculos = await VEHICULO_SERVICES.GET_ALL_VEHICULOS()
    const savedClientes = await CLIENTS_SERVICES.GET_ALL_CLIENTS()
    setVehiculos(savedVehiculos)
    setClientes(savedClientes)
    setIsLoading(false)
  }

  const FN_DELETE_VEHICULO = async () => {
    if (!vehiculoToDelete) return
    await VEHICULO_SERVICES.DELETE_VEHICULO(vehiculoToDelete.id)
    const updatedVehiculos = vehiculos.filter((vehiculo: any) => vehiculo.id !== vehiculoToDelete.id)
    setVehiculos(updatedVehiculos)

    toast({
      title: "Vehículo eliminado",
      description: "El vehículo ha sido eliminado exitosamente",
    })

    setVehiculoToDelete(null)
    setShowDeleteDialog(false)
  }


  const FN_ADD_VEHICLE = (vehicle: VehiculoType) => {
    setShowAddDialog(false)
    setVehiculos((prev) => [...prev, vehicle])
  }

  const FN_UPDATE_VEHICLE = (vehicle: VehiculoType) => {
    if (!State_VehicleToUpdate) return
    setVehiculos((prev) => prev.map((v) => (v.id === vehicle.id ? vehicle : v)))
    toast({
      title: "Vehículo actualizado",
      description: "El vehículo ha sido actualizado exitosamente",
    })

    setShowEditDialog(false)
    SetState_VehiculeToUpdate(null)
  }
  // Nueva función para importar vehículos con auto-registro de clientes
  const FN_IMPORT_VEHICULOS = async (file: File) => {
    setIsImporting(true)

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      let importedCount = 0
      let newClientsCount = 0
      let errorCount = 0
      const errors: string[] = []

      for (const row of jsonData as any[]) {
        try {
          // Buscar cliente por nombre
          let cliente = clientes.find(c =>
            c.name?.toLowerCase().includes(row.Cliente?.toLowerCase() || '') ||
            row.Cliente?.toLowerCase().includes(c.name?.toLowerCase() || '')
          )

          // Si no existe el cliente, crearlo automáticamente
          if (!cliente && row.Cliente) {
            try {
              const nuevoClienteData: ClienteType = {
                name: row.Cliente,
                phone: row.Telefono || row.Phone || "Sin teléfono",
                email: row.Email || `${row.Cliente.toLowerCase().replace(/\s+/g, '')}@auto-generado.com`,
                client_type: "Individual",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }

              // Crear cliente en la base de datos
              const clienteCreado = await CLIENTS_SERVICES.ADD_NEW_CLIENTE(nuevoClienteData)

              // Agregar a la lista local de clientes
              const clienteConId = { ...nuevoClienteData, id: clienteCreado[0]?.id || crypto.randomUUID() }
              setClientes(prev => [...prev, clienteConId])

              cliente = clienteConId
              newClientsCount++


            } catch (clientError) {
              console.error('Error al crear cliente:', clientError)
              errors.push(`No se pudo crear el cliente "${row.Cliente}" para vehículo ${row.Marca} ${row.Modelo}`)
              errorCount++
              continue
            }
          }

          if (!cliente) {
            errors.push(`Cliente "${row.Cliente}" no pudo ser procesado para vehículo ${row.Marca} ${row.Modelo}`)
            errorCount++
            continue
          }

          const vehiculoData: VehiculoType = {
            marca: row.Marca || row.marca,
            modelo: row.Modelo || row.modelo,
            ano: parseInt(row.Año || row.ano || row.year) || new Date().getFullYear(),
            placa: row.Placa || row.placa,
            color: row.Color || row.color,
            vin: row.VIN || row.vin || "",
            kilometraje: parseInt(row.Kilometraje || row.kilometraje) || 0,
            client_id: cliente.id,
            estado: "Activo",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }

          // Validar campos requeridos
          if (!vehiculoData.marca || !vehiculoData.modelo || !vehiculoData.placa) {
            errors.push(`Datos incompletos para vehículo en fila: ${JSON.stringify(row)}`)
            errorCount++
            continue
          }

          await VEHICULO_SERVICES.INSERT_VEHICULO(vehiculoData)
          importedCount++

        } catch (error) {
          console.error('Error al importar vehículo:', error)
          errors.push(`Error al procesar: ${row.Marca} ${row.Modelo}`)
          errorCount++
        }
      }

      // Actualizar la lista de vehículos
      await FN_GET_ALL_VEHICULOS()

      // Mostrar resultado
      toast({
        title: "Importación completada",
        description: `${importedCount} vehículos y ${newClientsCount} clientes nuevos importados. ${errorCount} errores.`,
        // variant: errorCount > 0 ? "destructive" : "default"
      })

      if (errors.length > 0) {
      }

      setImportDialogOpen(false)

    } catch (error) {
      console.error('Error al procesar archivo:', error)
      toast({
        title: "Error de importación",
        description: "No se pudo procesar el archivo. Verifique el formato.",
        // variant: "destructive"
      })
    } finally {
      setIsImporting(false)
    }
  }
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      FN_IMPORT_VEHICULOS(file)
    }
  }

  const exportToExcel = () => {
    const dataToExport = filteredVehiculos.map((vehiculo: any) => ({
      Marca: vehiculo.marca,
      Modelo: vehiculo.modelo,
      Año: vehiculo.anio,
      Placa: vehiculo.placa,
      Color: vehiculo.color,
      Tipo: vehiculo.tipo,
      VIN: vehiculo.vin || "N/A",
      Cliente: vehiculo.cliente ? `${vehiculo.cliente.nombre} ${vehiculo.cliente.apellido || ""}` : "N/A",
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vehículos")
    XLSX.writeFile(workbook, "Vehiculos.xlsx")
  }

  const exportToPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.text("Listado de Vehículos", 14, 22)

    doc.setFontSize(11)
    doc.text(`Generado: ${new Date().toLocaleDateString()}`, 14, 30)

    const tableColumn = ["Marca", "Modelo", "Año", "Placa", "Color", "Cliente"]
    const tableRows = filteredVehiculos.map((vehiculo) => [
      vehiculo.marca,
      vehiculo.modelo,
      vehiculo.ano,
      vehiculo.placa,
      vehiculo.color,
      vehiculo.client_name ? `${vehiculo.client_name}` : "N/A",
    ])


    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [66, 66, 66] },
    })

    doc.save("Vehiculos.pdf")
  }

  const handleHojaIngresoClick = (vehiculoId: string) => {
    if (onOpenHojaIngreso) {
      onOpenHojaIngreso(vehiculoId)
    } else {
      router.push(`/taller/vehiculos/${vehiculoId}/ingreso`)
    }
  }


  useEffect(() => {
    if (searchTerm) {
      const filtered = vehiculos.filter(
        (vehiculo) =>
          vehiculo.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehiculo.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehiculo.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehiculo.client_name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredVehiculos(filtered)
    } else {
      setFilteredVehiculos(vehiculos)
    }
  }, [searchTerm, vehiculos])

  useEffect(() => {
    if (State_VehicleToUpdate) {
      editForm.reset({
        marca: State_VehicleToUpdate.marca || "",
        modelo: State_VehicleToUpdate.modelo || "",
        ano: State_VehicleToUpdate.ano?.toString() || "",
        placa: State_VehicleToUpdate.placa || "",
        color: State_VehicleToUpdate.color || "",
        client_id: State_VehicleToUpdate.client_id || "",
        // tipo: State_VehicleToUpdate.tipo || "",
        vin: State_VehicleToUpdate.vin || "",
      })
    }
  }, [State_VehicleToUpdate, editForm])

  useEffect(() => {
    loadMockData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Vehículos</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToExcel}>
            Excel
          </Button>
          <Button variant="outline" onClick={exportToPDF}>
            PDF
          </Button>
          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" /> Importar Vehículos
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Importar Vehículos desde Excel</DialogTitle>
                <DialogDescription>
                  Selecciona un archivo Excel (.xlsx) con los datos de los vehículos.
                  <br />
                  <strong>Columnas requeridas:</strong> Marca, Modelo, Año, Placa, Color, Cliente, VIN (opcional), Kilometraje (opcional)
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    disabled={isImporting}
                  />
                </div>
                {isImporting && (
                  <div className="text-center">
                    <p>Importando vehículos...</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Vehículo
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Vehículos</CardTitle>
          <CardDescription>
            Administra todos los vehículos registrados en el taller (Mock Data Local - {vehiculos.length} vehículos,{" "}
            {clientes.length} clientes)
          </CardDescription>
          <div className="relative w-full max-w-sm mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar vehículos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Marca</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Año</TableHead>
                    <TableHead>Placa</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehiculos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No se encontraron vehículos
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVehiculos.map((vehiculo) => (
                      <TableRow key={vehiculo.id}>
                        <TableCell className="font-medium">{vehiculo.marca}</TableCell>
                        <TableCell>{vehiculo.modelo}</TableCell>
                        <TableCell>{vehiculo.ano}</TableCell>
                        <TableCell>{vehiculo.placa}</TableCell>
                        <TableCell>{vehiculo.color}</TableCell>
                        <TableCell><EstadoVehiculoComponent estado={vehiculo.estado} /></TableCell>
                        {/* <TableCell>{vehiculo.tipo}</TableCell> */}
                        <TableCell>
                          {vehiculo.client_name}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleHojaIngresoClick(vehiculo.id)}
                              className="h-8"
                            >
                              <FileInput className="h-4 w-4 mr-1" />
                              Hoja de Ingreso
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Abrir menú</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push(`/taller/vehiculos/${vehiculo.id}`)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => router.push(`/taller/vehiculos/${vehiculo.id}/inspeccion`)}
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  Hoja de Inspección
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    SetState_VehiculeToUpdate(vehiculo)
                                    setShowEditDialog(true)
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setVehiculoToDelete(vehiculo)
                                    setShowDeleteDialog(true)
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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

      {/* Diálogo para eliminar vehículo */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este vehículo? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={FN_DELETE_VEHICULO}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para agregar vehículo */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Vehículo</DialogTitle>
            <DialogDescription>Completa el formulario para registrar un nuevo vehículo</DialogDescription>
          </DialogHeader>
          <NuevoVehiculoForm vehiculoExistente={null} onSubmit={FN_ADD_VEHICLE} clients={[]} />

        </DialogContent>
      </Dialog>

      {/* Diálogo para editar vehículo */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Vehículo</DialogTitle>
            <DialogDescription>Modifica la información del vehículo</DialogDescription>
          </DialogHeader>
          <NuevoVehiculoForm vehiculoExistente={State_VehicleToUpdate} onSubmit={FN_UPDATE_VEHICLE} clients={[]} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
