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
import { NuevoVehiculoForm } from "./nuevo-vehiculo-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  color: string | null
  license_plate: string | null
  vin: string | null
  client: {
    name: string
  } | null
}

interface Client {
  id: string
  name: string
}

interface VehiculosPageProps {
  initialVehicles: Vehicle[]
  clients: Client[]
  tableExists: boolean
}

export function VehiculosPage({ initialVehicles = [], clients = [], tableExists = false }: VehiculosPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles)
  const [isLoading, setIsLoading] = useState(false)

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle.license_plate && vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vehicle.client && vehicle.client.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleVehiculoCreado = (nuevoVehiculo: Vehicle) => {
    setVehicles((prevVehicles) => [nuevoVehiculo, ...prevVehicles])
  }

  const inicializarTabla = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/initialize-vehicles", {
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
          <h2 className="text-3xl font-bold tracking-tight">Vehículos</h2>
          <div className="flex items-center space-x-2">
            <ModeToggle />
            <UserNav />
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error de Configuración</AlertTitle>
          <AlertDescription>
            La tabla de vehículos no existe en la base de datos. Es necesario inicializar la tabla para utilizar esta
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
              "Inicializar Tabla de Vehículos"
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
        <h2 className="text-3xl font-bold tracking-tight">Vehículos</h2>
        <div className="flex items-center space-x-2">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input placeholder="Buscar vehículo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Button type="submit">Buscar</Button>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Nuevo Vehículo</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Vehículo</DialogTitle>
              <DialogDescription>
                Complete los datos del vehículo. Haga clic en guardar cuando termine.
              </DialogDescription>
            </DialogHeader>
            <NuevoVehiculoForm clients={clients} onVehiculoCreado={handleVehiculoCreado} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Marca</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Año</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>Propietario</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.make}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>{vehicle.color || "-"}</TableCell>
                  <TableCell>{vehicle.license_plate || "-"}</TableCell>
                  <TableCell>{vehicle.client ? vehicle.client.name : "-"}</TableCell>
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
                <TableCell colSpan={7} className="h-24 text-center">
                  No se encontraron vehículos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default VehiculosPage
