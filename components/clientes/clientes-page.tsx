"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter, FileText, Edit, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { NuevoClienteForm } from "./nuevo-cliente-form"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Cliente {
  id: string
  nombre: string
  apellido: string
  empresa?: string
  telefono: string
  email: string
  tipoCliente: "Individual" | "Empresa" | "Flota" | "Aseguradora"
  fechaRegistro: string
  ultimaVisita?: string
  estado: "Activo" | "Inactivo"
}

// Datos mock iniciales
const clientesIniciales: Cliente[] = [
  {
    id: "1",
    nombre: "Juan",
    apellido: "Pérez",
    empresa: "Transportes ABC",
    telefono: "9876-5432",
    email: "juan.perez@transportesabc.com",
    tipoCliente: "Empresa",
    fechaRegistro: "2023-01-15",
    ultimaVisita: "2023-04-10",
    estado: "Activo",
  },
  {
    id: "2",
    nombre: "María",
    apellido: "González",
    telefono: "8765-4321",
    email: "maria.gonzalez@email.com",
    tipoCliente: "Individual",
    fechaRegistro: "2023-02-20",
    ultimaVisita: "2023-04-05",
    estado: "Activo",
  },
  {
    id: "3",
    nombre: "Carlos",
    apellido: "Rodríguez",
    empresa: "Seguros XYZ",
    telefono: "7654-3210",
    email: "carlos.rodriguez@segurosxyz.com",
    tipoCliente: "Aseguradora",
    fechaRegistro: "2023-03-10",
    ultimaVisita: "2023-03-25",
    estado: "Activo",
  },
]

export function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [open, setOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedClientes = localStorage.getItem("clientes")
    if (savedClientes) {
      setClientes(JSON.parse(savedClientes))
    } else {
      setClientes(clientesIniciales)
      localStorage.setItem("clientes", JSON.stringify(clientesIniciales))
    }
  }, [])

  // Guardar en localStorage cuando cambie el estado
  useEffect(() => {
    if (clientes.length > 0) {
      localStorage.setItem("clientes", JSON.stringify(clientes))
    }
  }, [clientes])

  const handleAddCliente = (nuevoCliente: Omit<Cliente, "id" | "fechaRegistro" | "estado">) => {
    const cliente: Cliente = {
      ...nuevoCliente,
      id: Date.now().toString(),
      fechaRegistro: new Date().toISOString().split("T")[0],
      estado: "Activo",
    }

    setClientes((prev) => [...prev, cliente])
    setOpen(false)

    toast({
      title: "Cliente creado",
      description: "El cliente ha sido registrado exitosamente",
    })
  }

  const handleEditCliente = (clienteEditado: Omit<Cliente, "id" | "fechaRegistro" | "estado">) => {
    if (!editingCliente) return

    const clienteActualizado: Cliente = {
      ...editingCliente,
      ...clienteEditado,
    }

    setClientes((prev) => prev.map((c) => (c.id === editingCliente.id ? clienteActualizado : c)))
    setEditingCliente(null)
    setOpen(false)

    toast({
      title: "Cliente actualizado",
      description: "Los datos del cliente han sido actualizados exitosamente",
    })
  }

  const handleDeleteCliente = () => {
    if (!clienteToDelete) return

    setClientes((prev) => prev.filter((c) => c.id !== clienteToDelete.id))
    setDeleteDialogOpen(false)
    setClienteToDelete(null)

    toast({
      title: "Cliente eliminado",
      description: "El cliente ha sido eliminado exitosamente",
    })
  }

  const openEditDialog = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setOpen(true)
  }

  const openDeleteDialog = (cliente: Cliente) => {
    setClienteToDelete(cliente)
    setDeleteDialogOpen(true)
  }

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cliente.empresa && cliente.empresa.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getEstadoBadge = (estado: Cliente["estado"]) => {
    return estado === "Activo" ? (
      <Badge className="bg-green-500 hover:bg-green-600">{estado}</Badge>
    ) : (
      <Badge className="bg-gray-500 hover:bg-gray-600">{estado}</Badge>
    )
  }

  const getTipoClienteBadge = (tipo: Cliente["tipoCliente"]) => {
    const colors = {
      Individual: "bg-blue-500 hover:bg-blue-600",
      Empresa: "bg-purple-500 hover:bg-purple-600",
      Flota: "bg-orange-500 hover:bg-orange-600",
      Aseguradora: "bg-green-500 hover:bg-green-600",
    }
    return <Badge className={colors[tipo]}>{tipo}</Badge>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <MainNav />
        <div className="ml-auto flex items-center gap-4">
          <ModeToggle />
          <UserNav />
        </div>
      </header>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Clientes</h1>
          <div className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingCliente(null)}>
                  <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editingCliente ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
                  <DialogDescription>
                    {editingCliente
                      ? "Modifica la información del cliente."
                      : "Ingresa la información del nuevo cliente."}
                  </DialogDescription>
                </DialogHeader>
                <NuevoClienteForm
                  onSubmit={editingCliente ? handleEditCliente : handleAddCliente}
                  clienteExistente={editingCliente}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar clientes por nombre, email o empresa..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filtrar clientes</span>
          </Button>
          <Button variant="outline" size="icon">
            <FileText className="h-4 w-4" />
            <span className="sr-only">Exportar clientes</span>
          </Button>
        </div>

        <Tabs defaultValue="todos" className="space-y-4">
          <TabsList>
            <TabsTrigger value="todos">Todos ({filteredClientes.length})</TabsTrigger>
            <TabsTrigger value="individuales">
              Individuales ({filteredClientes.filter((c) => c.tipoCliente === "Individual").length})
            </TabsTrigger>
            <TabsTrigger value="empresas">
              Empresas ({filteredClientes.filter((c) => c.tipoCliente === "Empresa").length})
            </TabsTrigger>
            <TabsTrigger value="flotas">
              Flotas ({filteredClientes.filter((c) => c.tipoCliente === "Flota").length})
            </TabsTrigger>
            <TabsTrigger value="aseguradoras">
              Aseguradoras ({filteredClientes.filter((c) => c.tipoCliente === "Aseguradora").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="todos">
            <Card>
              <CardHeader>
                <CardTitle>Todos los Clientes</CardTitle>
                <CardDescription>
                  Mostrando {filteredClientes.length} clientes registrados en el sistema.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha Registro</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClientes.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell className="font-medium">
                          {cliente.nombre} {cliente.apellido}
                          {cliente.empresa && <div className="text-sm text-muted-foreground">{cliente.empresa}</div>}
                        </TableCell>
                        <TableCell>{cliente.email}</TableCell>
                        <TableCell>{cliente.telefono}</TableCell>
                        <TableCell>{getTipoClienteBadge(cliente.tipoCliente)}</TableCell>
                        <TableCell>{getEstadoBadge(cliente.estado)}</TableCell>
                        <TableCell>{cliente.fechaRegistro}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(cliente)}
                              title="Editar cliente"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(cliente)}
                              title="Eliminar cliente"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tabs filtradas por tipo */}
          {["individuales", "empresas", "flotas", "aseguradoras"].map((tab) => {
            const tipoMap = {
              individuales: "Individual",
              empresas: "Empresa",
              flotas: "Flota",
              aseguradoras: "Aseguradora",
            }
            const tipo = tipoMap[tab as keyof typeof tipoMap] as Cliente["tipoCliente"]
            const clientesFiltrados = filteredClientes.filter((c) => c.tipoCliente === tipo)

            return (
              <TabsContent key={tab} value={tab}>
                <Card>
                  <CardHeader>
                    <CardTitle>Clientes {tipo}s</CardTitle>
                    <CardDescription>
                      Mostrando {clientesFiltrados.length} clientes de tipo {tipo.toLowerCase()}.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Teléfono</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Fecha Registro</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientesFiltrados.map((cliente) => (
                          <TableRow key={cliente.id}>
                            <TableCell className="font-medium">
                              {cliente.nombre} {cliente.apellido}
                              {cliente.empresa && (
                                <div className="text-sm text-muted-foreground">{cliente.empresa}</div>
                              )}
                            </TableCell>
                            <TableCell>{cliente.email}</TableCell>
                            <TableCell>{cliente.telefono}</TableCell>
                            <TableCell>{getEstadoBadge(cliente.estado)}</TableCell>
                            <TableCell>{cliente.fechaRegistro}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditDialog(cliente)}
                                  title="Editar cliente"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openDeleteDialog(cliente)}
                                  title="Eliminar cliente"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            )
          })}
        </Tabs>
      </div>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el cliente{" "}
              <strong>
                {clienteToDelete?.nombre} {clienteToDelete?.apellido}
              </strong>{" "}
              del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCliente}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
