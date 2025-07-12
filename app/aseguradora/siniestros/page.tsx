"use client"  
  
import { useState, useEffect } from "react"  
import { Button } from "@/components/ui/button"  
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"  
import { Input } from "@/components/ui/input"  
import { Label } from "@/components/ui/label"  
import { Textarea } from "@/components/ui/textarea"  
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"  
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"  
import { Badge } from "@/components/ui/badge"  
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"  
import { Plus, Search, Edit, Trash2, ShieldCheck } from "lucide-react"  
import { toast } from "@/components/ui/use-toast"  
import SINIESTROS_SERVICES, { type SiniestroType } from "@/services/SINIESTROS_SERVICES.service"  
import CLIENTS_SERVICES, { type ClienteType } from "@/services/CLIENTES_SERVICES.SERVICE"  
import VEHICULO_SERVICES, { type VehiculoType } from "@/services/VEHICULOS.SERVICE"  
import ASEGURADORA_SERVICES, { type AseguradoraType } from "@/services/ASEGURADORA_SERVICES.SERVICE"  
  
export default function SiniestrosPage() {  
  const [siniestros, setSiniestros] = useState<SiniestroType[]>([])  
  const [clientes, setClientes] = useState<ClienteType[]>([])  
  const [vehiculos, setVehiculos] = useState<VehiculoType[]>([])  
  const [aseguradoras, setAseguradoras] = useState<AseguradoraType[]>([])  
  const [loading, setLoading] = useState(true)  
  const [searchTerm, setSearchTerm] = useState("")  
  const [selectedSiniestro, setSelectedSiniestro] = useState<SiniestroType | null>(null)  
  const [isDialogOpen, setIsDialogOpen] = useState(false)  
  const [isEditing, setIsEditing] = useState(false)  
  
  const [formData, setFormData] = useState<SiniestroType>({  
    numero_siniestro: "",  
    fecha_siniestro: "",  
    descripcion: "",  
    estado: "reportado",  
    monto_estimado: 0,  
    nivel_daño: 1,  
    aseguradora_id: 0,  
    cliente_id: "",  
    vehiculo_id: ""  
  })  
  
  useEffect(() => {  
    loadSiniestros()  
    loadClientes()  
    loadAseguradoras()  
  }, [])  
  
  // Cargar vehículos cuando cambia el cliente  
  useEffect(() => {  
    if (formData.cliente_id) {  
      loadVehiculos(formData.cliente_id)  
    } else {  
      setVehiculos([])  
    }  
  }, [formData.cliente_id])  
  
  const loadSiniestros = async () => {  
    try {  
      setLoading(true)  
      const data = await SINIESTROS_SERVICES.GET_SINIESTROS()  
      setSiniestros(data)  
    } catch (error) {  
      toast({  
        title: "Error",  
        description: "No se pudieron cargar los siniestros",  
        variant: "destructive"  
      })  
    } finally {  
      setLoading(false)  
    }  
  }  
  
  const loadClientes = async () => {  
    try {  
      const data = await CLIENTS_SERVICES.GET_ALL_CLIENTS()  
      setClientes(data)  
    } catch (error) {  
      console.error("Error al cargar clientes:", error)  
    }  
  }  
  
  const loadVehiculos = async (clienteId: string) => {  
    try {  
      const data = await VEHICULO_SERVICES.GET_ALL_VEHICULOS_BY_CLIENT(clienteId)  
      setVehiculos(data)  
    } catch (error) {  
      console.error("Error al cargar vehículos:", error)  
    }  
  }  
  
  const loadAseguradoras = async () => {  
    try {  
      const data = await ASEGURADORA_SERVICES.GET_ASEGURADORAS()  
      setAseguradoras(data)  
    } catch (error) {  
      console.error("Error al cargar aseguradoras:", error)  
    }  
  }  
  
  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault()  
      
    // Validaciones  
    if (!formData.cliente_id || !formData.vehiculo_id || !formData.aseguradora_id) {  
      toast({  
        title: "Error",  
        description: "Debe seleccionar cliente, vehículo y aseguradora",  
        variant: "destructive"  
      })  
      return  
    }  
  
    try {  
      if (isEditing && selectedSiniestro) {  
        await SINIESTROS_SERVICES.UPDATE_SINIESTRO({ ...formData, id: selectedSiniestro.id })  
        toast({  
          title: "Éxito",  
          description: "Siniestro actualizado correctamente"  
        })  
      } else {  
        await SINIESTROS_SERVICES.INSERT_SINIESTRO(formData)  
        toast({  
          title: "Éxito",  
          description: "Siniestro creado correctamente"  
        })  
      }  
      setIsDialogOpen(false)  
      resetForm()  
      loadSiniestros()  
    } catch (error) {  
      toast({  
        title: "Error",  
        description: "No se pudo guardar el siniestro",  
        variant: "destructive"  
      })  
    }  
  }  
  
  const handleDelete = async (id: number) => {  
    if (confirm("¿Está seguro de eliminar este siniestro?")) {  
      try {  
        await SINIESTROS_SERVICES.DELETE_SINIESTRO(id)  
        toast({  
          title: "Éxito",  
          description: "Siniestro eliminado correctamente"  
        })  
        loadSiniestros()  
      } catch (error) {  
        toast({  
          title: "Error",  
          description: "No se pudo eliminar el siniestro",  
          variant: "destructive"  
        })  
      }  
    }  
  }  
  
  const handleEstadoChange = async (id: string, estado: string) => {  
    try {  
      await SINIESTROS_SERVICES.UPDATE_ESTADO_SINIESTRO(id, estado)  
      toast({  
        title: "Éxito",  
        description: "Estado actualizado correctamente"  
      })  
      loadSiniestros()  
    } catch (error) {  
      toast({  
        title: "Error",  
        description: "No se pudo actualizar el estado",  
        variant: "destructive"  
      })  
    }  
  }  
  
  const resetForm = () => {  
    setFormData({  
      numero_siniestro: "",  
      fecha_siniestro: "",  
      descripcion: "",  
      estado: "reportado",  
      monto_estimado: 0,  
      nivel_daño: 1,  
      aseguradora_id: 0,  
      cliente_id: "",  
      vehiculo_id: ""  
    })  
    setSelectedSiniestro(null)  
    setIsEditing(false)  
    setVehiculos([])  
  }  
  
  const openEditDialog = (siniestro: SiniestroType) => {  
    console.log(siniestro)
    setFormData(siniestro)  
    setSelectedSiniestro(siniestro)  
    setIsEditing(true)  
    setIsDialogOpen(true)  
    if (siniestro.cliente_id) {  
      loadVehiculos(siniestro.cliente_id)  
    }  
  }  
  
  const getEstadoBadge = (estado: string) => {  
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {  
      reportado: "outline",  
      en_proceso: "secondary",  
      aprobado: "default",  
      rechazado: "destructive",  
      cerrado: "secondary"  
    }  
    return <Badge variant={variants[estado] || "outline"}>{estado}</Badge>  
  }  
  
  const filteredSiniestros = siniestros.filter(siniestro =>  
    siniestro.numero_siniestro?.toLowerCase().includes(searchTerm.toLowerCase()) ||  
    siniestro.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())  
  )  
  
  return (  
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">  
      <div className="flex items-center justify-between">  
        <div>  
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">  
            <ShieldCheck className="h-8 w-8" />  
            Gestión de Siniestros  
          </h1>  
          <p className="text-muted-foreground">  
            Administre los siniestros reportados y su seguimiento  
          </p>  
        </div>  
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>  
          <DialogTrigger asChild>  
            <Button onClick={resetForm}>  
              <Plus className="mr-2 h-4 w-4" />  
              Nuevo Siniestro  
            </Button>  
          </DialogTrigger>  
          <DialogContent className="max-w-4xl">  
            <DialogHeader>  
              <DialogTitle>  
                {isEditing ? "Editar Siniestro" : "Nuevo Siniestro"}  
              </DialogTitle>  
              <DialogDescription>  
                {isEditing ? "Modifique los datos del siniestro" : "Complete la información del nuevo siniestro"}  
              </DialogDescription>  
            </DialogHeader>  
            <form onSubmit={handleSubmit} className="space-y-4">  
              {/* Primera fila: Número y Fecha */}  
              <div className="grid grid-cols-2 gap-4">  
                <div className="space-y-2">  
                  <Label htmlFor="numero_siniestro">Número de Siniestro</Label>  
                  <Input  
                    id="numero_siniestro"  
                    value={formData.numero_siniestro}  
                    onChange={(e) => setFormData({...formData, numero_siniestro: e.target.value})}  
                    required  
                  />  
                </div>  
                <div className="space-y-2">  
                  <Label htmlFor="fecha_siniestro">Fecha del Siniestro</Label>  
                  <Input  
                    id="fecha_siniestro"  
                    type="datetime-local"  
                    value={isEditing ? formData?.fecha_siniestro?.slice(0,16) : formData?.fecha_siniestro}  
                    onChange={(e) => setFormData({...formData, fecha_siniestro: e.target.value})}  
                    required  
                  />  
                </div>  
              </div>  
  
              {/* Segunda fila: Cliente y Aseguradora */}  
              <div className="grid grid-cols-2 gap-4">  
                <div className="space-y-2">  
                  <Label htmlFor="cliente_id">Cliente</Label>  
                  <Select   
                    value={formData.cliente_id}   
                    onValueChange={(value) => setFormData({...formData, cliente_id: value, vehiculo_id: ""})}  
                  >  
                    <SelectTrigger>  
                      <SelectValue placeholder="Seleccionar cliente" />  
                    </SelectTrigger>  
                    <SelectContent>  
                      {clientes.map((cliente) => (  
                        <SelectItem key={cliente.id} value={cliente.id!}>  
                          {cliente.name}  
                        </SelectItem>  
                      ))}  
                    </SelectContent>  
                  </Select>  
                </div>  
                <div className="space-y-2">  
                  <Label htmlFor="aseguradora_id">Aseguradora</Label>  
                  <Select   
                    value={formData.aseguradora_id?.toString()}   
                    onValueChange={(value) => setFormData({...formData, aseguradora_id: parseInt(value)})}  
                  >  
                    <SelectTrigger>  
                      <SelectValue placeholder="Seleccionar aseguradora" />  
                    </SelectTrigger>  
                    <SelectContent>  
                      {aseguradoras.map((aseguradora) => (  
                        <SelectItem key={aseguradora.id} value={aseguradora.id!.toString()}>  
                          {aseguradora.nombre}  
                        </SelectItem>  
                      ))}  
                    </SelectContent>  
                  </Select>  
                </div>  
              </div>  
  
              {/* Tercera fila: Vehículo y Nivel de Daño */}  
              <div className="grid grid-cols-2 gap-4">  
                <div className="space-y-2">  
                  <Label htmlFor="vehiculo_id">Vehículo</Label>  
                  <Select   
                    value={formData.vehiculo_id}   
                    onValueChange={(value) => setFormData({...formData, vehiculo_id: value})}  
                    disabled={!formData.cliente_id || vehiculos.length === 0}  
                  >  
                    <SelectTrigger>  
                      <SelectValue   
                        placeholder={  
                          !formData.cliente_id   
                            ? "Selecciona un cliente primero"   
                            : vehiculos.length === 0   
                              ? "No hay vehículos para este cliente"  
                              : "Seleccionar vehículo"  
                        }   
                      />  
                    </SelectTrigger>  
                    <SelectContent>  
                      {vehiculos.map((vehiculo) => (  
                        <SelectItem key={vehiculo.id} value={vehiculo.id!}>  
                          {vehiculo.marca} {vehiculo.modelo} ({vehiculo.placa})  
                        </SelectItem>  
                      ))}  
                    </SelectContent>  
                  </Select>  
                </div>  
                <div className="space-y-2">  
                  <Label htmlFor="nivel_daño">Nivel de Daño (1-10)</Label>  
                  <Input  
                    id="nivel_daño"  
                    type="number"  
                    min="1"  
                    max="10"  
                    value={formData.nivel_daño}  
                    onChange={(e) => setFormData({...formData, nivel_daño: parseInt(e.target.value)})}  
                    required  
                  />  
                </div>  
              </div>  

                            {/* Cuarta fila: Estado y Monto */}  
              <div className="grid grid-cols-2 gap-4">  
                <div className="space-y-2">  
                  <Label htmlFor="estado">Estado</Label>  
                  <Select value={formData.estado} onValueChange={(value) => setFormData({...formData, estado: value})}>  
                    <SelectTrigger>  
                      <SelectValue />  
                    </SelectTrigger>  
                    <SelectContent>  
                      <SelectItem value="reportado">Reportado</SelectItem>  
                      <SelectItem value="en_proceso">En Proceso</SelectItem>  
                      <SelectItem value="aprobado">Aprobado</SelectItem>  
                      <SelectItem value="rechazado">Rechazado</SelectItem>  
                      <SelectItem value="cerrado">Cerrado</SelectItem>  
                    </SelectContent>  
                  </Select>  
                </div>  
                <div className="space-y-2">  
                  <Label htmlFor="monto_estimado">Monto Estimado</Label>  
                  <Input  
                    id="monto_estimado"  
                    type="number"  
                    step="0.01"  
                    value={formData.monto_estimado}  
                    onChange={(e) => setFormData({...formData, monto_estimado: parseFloat(e.target.value)})}  
                  />  
                </div>  
              </div>  
  
              {/* Descripción */}  
              <div className="space-y-2">  
                <Label htmlFor="descripcion">Descripción</Label>  
                <Textarea  
                  id="descripcion"  
                  value={formData.descripcion}  
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}  
                  rows={3}  
                />  
              </div>  
  
              <DialogFooter>  
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>  
                  Cancelar  
                </Button>  
                <Button type="submit">  
                  {isEditing ? "Actualizar" : "Crear"}  
                </Button>  
              </DialogFooter>  
            </form>  
          </DialogContent>  
        </Dialog>  
      </div>  
  
      <div className="flex items-center space-x-2">  
        <Search className="h-4 w-4" />  
        <Input  
          placeholder="Buscar siniestros..."  
          value={searchTerm}  
          onChange={(e) => setSearchTerm(e.target.value)}  
          className="max-w-sm"  
        />  
      </div>  
  
      <Card>  
        <CardHeader>  
          <CardTitle>Lista de Siniestros</CardTitle>  
          <CardDescription>  
            {filteredSiniestros.length} siniestro(s) encontrado(s)  
          </CardDescription>  
        </CardHeader>  
        <CardContent>  
          <Table>  
            <TableHeader>  
              <TableRow>  
                <TableHead>Número</TableHead>  
                <TableHead>Fecha</TableHead>  
                <TableHead>Cliente</TableHead>  
                <TableHead>Vehículo</TableHead>  
                <TableHead>Aseguradora</TableHead>  
                <TableHead>Nivel Daño</TableHead>  
                <TableHead>Estado</TableHead>  
                <TableHead>Monto</TableHead>  
                <TableHead>Acciones</TableHead>  
              </TableRow>  
            </TableHeader>  
            <TableBody>  
              {loading ? (  
                <TableRow>  
                  <TableCell colSpan={9} className="text-center">  
                    Cargando...  
                  </TableCell>  
                </TableRow>  
              ) : filteredSiniestros.length === 0 ? (  
                <TableRow>  
                  <TableCell colSpan={9} className="text-center">  
                    No se encontraron siniestros  
                  </TableCell>  
                </TableRow>  
              ) : (  
                filteredSiniestros.map((siniestro) => (  
                  <TableRow key={siniestro.id}>  
                    <TableCell className="font-medium">  
                      {siniestro.numero_siniestro}  
                    </TableCell>  
                    <TableCell>  
                      {siniestro.fecha_siniestro ? new Date(siniestro.fecha_siniestro).toLocaleDateString() : '-'}  
                    </TableCell>  
                    <TableCell>  
                      {siniestro.clientes?.name || '-'}  
                    </TableCell>  
                    <TableCell>  
                      {siniestro.vehiculos ? `${siniestro.vehiculos.marca} ${siniestro.vehiculos.modelo}` : '-'}  
                    </TableCell>  
                    <TableCell>  
                      {siniestro.aseguradoras?.nombre || '-'}  
                    </TableCell>  
                    <TableCell>  
                      <Badge variant="outline">{siniestro.nivel_daño || 1}</Badge>  
                    </TableCell>  
                    <TableCell>  
                      {getEstadoBadge(siniestro.estado || 'reportado')}  
                    </TableCell>  
                    <TableCell>  
                      ${siniestro.monto_estimado?.toLocaleString() || '0'}  
                    </TableCell>  
                    <TableCell>  
                      <div className="flex items-center gap-2">  
                        <Button  
                          variant="outline"  
                          size="sm"  
                          onClick={() => openEditDialog(siniestro)}  
                        >  
                          <Edit className="h-4 w-4" />  
                        </Button>  
                        <Button  
                          variant="outline"  
                          size="sm"  
                          onClick={() => handleDelete(siniestro.id!)}  
                        >  
                          <Trash2 className="h-4 w-4" />  
                        </Button>  
                      </div>  
                    </TableCell>  
                  </TableRow>  
                ))  
              )}  
            </TableBody>  
          </Table>  
        </CardContent>  
      </Card>  
    </div>  
  )  
}