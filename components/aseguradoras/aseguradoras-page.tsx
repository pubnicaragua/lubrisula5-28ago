"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Edit, Trash2, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { NuevaAseguradoraForm } from "./nueva-aseguradora-form"
import { EditarAseguradoraForm } from "./editar-aseguradora-form"
import { eliminarAseguradora } from "@/lib/actions/aseguradoras"

interface Aseguradora {
  id: number
  nombre: string | null
  corrreo: string | null
  telefono: string | null
  estado_tributario: string | null
  nivel_tarifa: string | null
  created_at: string
  clientes?: any[]
  flotas?: any[]
}

interface AseguradorasPageProps {
  aseguradoras: Aseguradora[]
  error: string | null
}

export function AseguradorasPage({ aseguradoras, error }: AseguradorasPageProps) {
  const { toast } = useToast()
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentAseguradora, setCurrentAseguradora] = useState<Aseguradora | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [aseguradoraToDelete, setAseguradoraToDelete] = useState<Aseguradora | null>(null)

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true)
      await eliminarAseguradora(id)
      toast({
        title: "Aseguradora eliminada",
        description: "La aseguradora ha sido eliminada correctamente",
      })
      setIsDeleting(false)
      setAseguradoraToDelete(null)
      // Recargar la página para actualizar la lista
      window.location.reload()
    } catch (error) {
      console.error("Error al eliminar aseguradora:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la aseguradora. Intente nuevamente.",
        variant: "destructive",
      })
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestión de Aseguradoras</h1>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Aseguradora
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Crear Nueva Aseguradora</DialogTitle>
            </DialogHeader>
            <NuevaAseguradoraForm
              onSuccess={() => {
                setIsCreating(false)
                toast({
                  title: "Aseguradora creada",
                  description: "La aseguradora ha sido creada correctamente",
                })
                // Recargar la página para actualizar la lista
                window.location.reload()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Aseguradoras</CardTitle>
          <CardDescription>Lista de todas las aseguradoras registradas en el sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          {aseguradoras.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No hay aseguradoras registradas</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Estado Tributario</TableHead>
                  <TableHead>Nivel Tarifa</TableHead>
                  <TableHead>Clientes</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aseguradoras.map((aseguradora) => (
                  <TableRow key={aseguradora.id}>
                    <TableCell className="font-medium">{aseguradora.nombre || "N/A"}</TableCell>
                    <TableCell>{aseguradora.corrreo || "N/A"}</TableCell>
                    <TableCell>{aseguradora.telefono || "N/A"}</TableCell>
                    <TableCell>{aseguradora.estado_tributario || "N/A"}</TableCell>
                    <TableCell>{aseguradora.nivel_tarifa || "N/A"}</TableCell>
                    <TableCell>{aseguradora.clientes?.length || 0}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setCurrentAseguradora(aseguradora)
                            setIsEditing(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setAseguradoraToDelete(aseguradora)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Diálogo para editar aseguradora */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Aseguradora</DialogTitle>
          </DialogHeader>
          {currentAseguradora && (
            <EditarAseguradoraForm
              aseguradora={currentAseguradora}
              onSuccess={() => {
                setIsEditing(false)
                setCurrentAseguradora(null)
                toast({
                  title: "Aseguradora actualizada",
                  description: "La aseguradora ha sido actualizada correctamente",
                })
                // Recargar la página para actualizar la lista
                window.location.reload()
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmar eliminación */}
      <Dialog open={!!aseguradoraToDelete} onOpenChange={(open) => !open && setAseguradoraToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>¿Está seguro que desea eliminar la aseguradora "{aseguradoraToDelete?.nombre}"?</p>
            <p className="text-sm text-muted-foreground mt-2">Esta acción no se puede deshacer.</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => aseguradoraToDelete && handleDelete(aseguradoraToDelete.id)}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
