"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { NuevoClienteForm } from "./nuevo-cliente-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

interface Cliente {
  id: string
  name: string
  email: string | null
  phone: string
  company: string | null
  client_type: string
}

interface ClientesPageProps {
  initialClients: Cliente[]
  tableExists: boolean
}

export function ClientesPage({ initialClients = [], tableExists = false }: ClientesPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [clients, setClients] = useState<Cliente[]>(initialClients)
  const [isLoading, setIsLoading] = useState(false)

  const filteredClientes = clients.filter(
    (cliente) =>
      cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cliente.email && cliente.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      cliente.phone.includes(searchTerm) ||
      (cliente.company && cliente.company.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleClienteCreado = (nuevoCliente: Cliente) => {
    setClients((prevClients) => [nuevoCliente, ...prevClients])
  }

  const inicializarTabla = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/initialize-clients", {
        method: "POST",
      })
      const data = await response.json()

      if (data.success) {
        // Recargar la página para obtener los datos actualizados
        window.location.reload()
      } else {
        console.error("Error al inicializar tabla:", data.error)
      }
    } catch (error) {
      console.error("Error al inicializar tabla:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!tableExists) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
          <div className="flex items-center space-x-2">
            <ModeToggle />
            <UserNav />
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error de Configuración</AlertTitle>
          <AlertDescription>
            La tabla de clientes no existe en la base de datos. Es necesario inicializar la tabla para utilizar esta
            funcionalidad.
          </AlertDescription>
        </Alert>

        <div className="flex gap-4">
          <Button onClick={inicializarTabla} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inicializando...
              </>
            ) : (
              "Inicializar Tabla de Clientes"
            )}
          </Button>

          <Button variant="outline" asChild>
            <Link href="/inicializar-sistema">Ir a Inicialización del Sistema</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
        <div className="flex items-center space-x-2">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input placeholder="Buscar cliente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Button type="submit">Buscar</Button>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Nuevo Cliente</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Cliente</DialogTitle>
              <DialogDescription>
                Complete los datos del cliente. Haga clic en guardar cuando termine.
              </DialogDescription>
            </DialogHeader>
            <NuevoClienteForm onClienteCreado={handleClienteCreado} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClientes.length > 0 ? (
              filteredClientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.name}</TableCell>
                  <TableCell>{cliente.email || "-"}</TableCell>
                  <TableCell>{cliente.phone}</TableCell>
                  <TableCell>{cliente.company || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        cliente.client_type === "Particular"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {cliente.client_type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="mr-2">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron clientes.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ClientesPage
