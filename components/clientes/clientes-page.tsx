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
import CLIENTS_SERVICES, { ClienteType } from "@/services/CLIENTES_SERVICES.SERVICE"

export function ClientesPage() {
  const [State_Clientes, setState_Clientes] = useState<ClienteType[]>([])
  const [open, setOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<ClienteType | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clienteToDelete, setClienteToDelete] = useState<ClienteType | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const FN_GET_CLIENTS = async () => {
    const taller_id = localStorage.getItem("taller_id") || ""
    const res = await CLIENTS_SERVICES.GET_ALL_CLIENTS(taller_id)
    setState_Clientes(res)
  }
  const FN_UPDATE_CLIENTE = async (clienteEditado: ClienteType) => {
    if (!editingCliente) return
    const res = await CLIENTS_SERVICES.UPDATE_CLIENTE(clienteEditado);

    const clienteActualizado: ClienteType = {
      ...editingCliente,
      ...clienteEditado,
    }

    setState_Clientes((prev) => prev.map((c) => (c.id === editingCliente.id ? clienteActualizado : c)))
    setEditingCliente(null)
    setOpen(false)

    toast({
      title: "Cliente actualizado",
      description: "Los datos del cliente han sido actualizados exitosamente",
    })
  }
  const FN_DELETE_CLIENTE = async (id: string) => {
    console.log(id)
    await CLIENTS_SERVICES.DELETE_CLIENTE(id)
    setState_Clientes((prev) => prev.filter((c) => c.id !== clienteToDelete.id))
    setDeleteDialogOpen(false)
    setClienteToDelete(null)
    toast({
      title: "Cliente eliminado",
      description: "El cliente ha sido eliminado exitosamente",
    })
  }
  const FN_ADD_NEW_CLIENTE = async (nuevoCliente: ClienteType) => {
    console.log(nuevoCliente)
    const NewData: ClienteType = { ...nuevoCliente, created_at: new Date().toISOString() }
    const res = await CLIENTS_SERVICES.ADD_NEW_CLIENTE(NewData)
    if (!res.success) {
      alert(res.error)
      return false
    }

    setState_Clientes((prev) => [...prev, { ...NewData, status: "Activo" }])
    setOpen(false)
    toast({
      title: "Cliente creado",
      description: "El cliente ha sido registrado exitosamente",
    })
    return true

  }

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    FN_GET_CLIENTS()
  }, [])

  // Guardar en localStorage cuando cambie el estado
  useEffect(() => {
    if (State_Clientes.length > 0) {
      localStorage.setItem("clientes", JSON.stringify(State_Clientes))
    }
  }, [State_Clientes])


  const openEditDialog = (cliente: ClienteType) => {
    setEditingCliente(cliente)
    setOpen(true)
  }

  const openDeleteDialog = (cliente: ClienteType) => {
    setClienteToDelete(cliente)
    setDeleteDialogOpen(true)
  }

  const filteredClientes = State_Clientes.filter(
    (cliente) =>
      cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cliente.company && cliente.company.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getEstadoBadge = (estado: "Activo" | "Inactivo") => {
    return estado === "Activo" ? (
      <Badge className="bg-green-500 hover:bg-green-600">{estado}</Badge>
    ) : (
      <Badge className="bg-gray-500 hover:bg-gray-600">{estado}</Badge>
    )
  }

  const getTipoClienteBadge = (tipo: string) => {
    const colors = {
      Individual: "bg-blue-500 hover:bg-blue-600",
      Empresa: "bg-purple-500 hover:bg-purple-600",
      Flota: "bg-orange-500 hover:bg-orange-600",
      Aseguradora: "bg-green-500 hover:bg-green-600",
    }
    return <Badge className={colors[tipo]}>{tipo}</Badge>
  }

  return (
    <main className="container mx-auto h-full overflow-auto">
      {/* <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <MainNav />
        <div className="ml-auto flex items-center gap-4">
          <ModeToggle />
          <UserNav />
        </div>
      </header> */}
      <div className="flex-1 p-1">
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
                  onSubmit={editingCliente ? FN_UPDATE_CLIENTE : FN_ADD_NEW_CLIENTE}
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
              Individuales ({filteredClientes.filter((c) => c.client_type === "Individual").length})
            </TabsTrigger>
            <TabsTrigger value="empresas">
              Empresas ({filteredClientes.filter((c) => c.client_type === "Empresa").length})
            </TabsTrigger>
            <TabsTrigger value="flotas">
              Flotas ({filteredClientes.filter((c) => c.client_type === "Flota").length})
            </TabsTrigger>
            <TabsTrigger value="aseguradoras">
              Aseguradoras ({filteredClientes.filter((c) => c.client_type === "Aseguradora").length})
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
                          {cliente.name}
                          {cliente.company && <div className="text-sm text-muted-foreground">{cliente.company}</div>}
                        </TableCell>
                        <TableCell>{cliente.email}</TableCell>
                        <TableCell>{cliente.phone}</TableCell>
                        <TableCell>{getTipoClienteBadge(cliente.client_type)}</TableCell>
                        <TableCell>{getEstadoBadge(cliente.status)}</TableCell>
                        <TableCell>{cliente.created_at}</TableCell>
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
            const tipo = tipoMap[tab as keyof typeof tipoMap] as ClienteType["client_type"]
            const clientesFiltrados = filteredClientes.filter((c) => c.client_type === tipo)

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
                              {cliente.name}
                              {cliente.company && (
                                <div className="text-sm text-muted-foreground">{cliente.company}</div>
                              )}
                            </TableCell>
                            <TableCell>{cliente.email}</TableCell>
                            <TableCell>{cliente.phone}</TableCell>
                            <TableCell>{getEstadoBadge(cliente.status)}</TableCell>
                            <TableCell>{cliente.created_at}</TableCell>
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
                {clienteToDelete?.name}
              </strong>{" "}
              del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => FN_DELETE_CLIENTE(clienteToDelete.id)}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
