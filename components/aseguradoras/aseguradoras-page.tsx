"use client"

import { useEffect, useState } from "react"
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
import ASEGURADORA_SERVICE, { AseguradoraType } from "@/services/ASEGURADORA_SERVICES.service"

interface AseguradorasPageProps {
  aseguradoras: AseguradoraType[]
  error: string | null
}

export function AseguradorasPage({ aseguradoras, error }: AseguradorasPageProps) {
  const { toast } = useToast()
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentAseguradora, setCurrentAseguradora] = useState<AseguradoraType | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [aseguradoraToDelete, setAseguradoraToDelete] = useState<AseguradoraType | null>(null)
  const [State_Aseguradoras, SetState_Aseguradoras] = useState<AseguradoraType[]>([])


  const Fn_GET_ASEGURADORAS = async () => {
    const res: AseguradoraType[] = await ASEGURADORA_SERVICE.GET_ASEGURADORAS()
    SetState_Aseguradoras(res)
  }
  const Fn_UPDATE_ASEGURADORA = (NewDataAseguradora: AseguradoraType) => {
    SetState_Aseguradoras([...State_Aseguradoras.filter((aseguradora) => aseguradora.id !== NewDataAseguradora.id), NewDataAseguradora])
  }
  const Fn_AGREGAR_ASEGURADORA = (NewDataAseguradora: AseguradoraType) => {
    SetState_Aseguradoras([...State_Aseguradoras, NewDataAseguradora])
  }
  const Fn_ELIMINAR_ASEGURADORA = (id: number) => {
    SetState_Aseguradoras(State_Aseguradoras.filter((aseguradora) => aseguradora.id !== id))
  }
  useEffect(() => {
    SetState_Aseguradoras(aseguradoras)
  }, [aseguradoras])

  // Inicializar el estado con las aseguradoras pasadas como props
  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true)
      await ASEGURADORA_SERVICE.DELETE_ASEGURADORA(id)
      Fn_ELIMINAR_ASEGURADORA(id)
      toast({
        title: "Aseguradora eliminada",
        description: "La aseguradora ha sido eliminada correctamente.",
        variant: "success",
      })
      setIsDeleting(false)
      setAseguradoraToDelete(null)
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
              onSuccess={(NewData) => {
                setIsCreating(false)
                Fn_AGREGAR_ASEGURADORA(NewData)
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
          {State_Aseguradoras.length === 0 ? (
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
                {State_Aseguradoras.map((aseguradora) => (
                  <TableRow key={aseguradora.id}>
                    <TableCell className="font-medium">{aseguradora.nombre || "N/A"}</TableCell>
                    <TableCell>{aseguradora.correo || "N/A"}</TableCell>
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
              onSuccess={(data) => {
                setIsEditing(false)
                setCurrentAseguradora(null)
                Fn_UPDATE_ASEGURADORA(data)
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
