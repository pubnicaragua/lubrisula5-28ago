


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import SERVICIOS_SERVICES, { ServicioType, CategoriaServicioType } from "@/services/SERVICIOS.SERVICE";
export default function FormNuevoServicio({ onSuccess }: { onSuccess: (NewServicio: ServicioType) => void }) {
    const [openDialog, setOpenDialog] = useState(false)
    const [State_Loadding, SetState_Loadding] = useState(false)
    const [State_Form, SetState_Form] = useState<Omit<ServicioType, 'categorias_servicio'>>({ activo: true })
    const [State_Categorias, SetState_Categorias] = useState<CategoriaServicioType[]>([])

    const FN_GET_CATEGORIAS_SERVICIO = async () => {
        const res = await SERVICIOS_SERVICES.GET_GATEGORIAS_SERVICIO();
        SetState_Categorias(res)
    }
    const FN_GUARDAR_SERVICE = async () => {
        SetState_Loadding(true)
        const res = await SERVICIOS_SERVICES.INSERT_SERVICIO(State_Form)
        SetState_Loadding(false)
        setOpenDialog(false)
        onSuccess(res)
    }
    useEffect(() => {
        FN_GET_CATEGORIAS_SERVICIO()
    }, [])
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button className="rounded-full">
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Servicio
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Agregar Nuevo Servicio</DialogTitle>
                    <DialogDescription>Complete los datos para agregar un nuevo servicio al catálogo.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre del Servicio</Label>
                            <Input id="nombre" placeholder="Nombre del servicio"
                                onChange={(e) => SetState_Form({ ...State_Form, nombre: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="categoria">Categoría</Label>
                            <Select onValueChange={(e) => SetState_Form({ ...State_Form, categoria_servicio_id: parseInt(e) })}>
                                <SelectTrigger id="categoria">
                                    <SelectValue placeholder="Seleccionar categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        State_Categorias.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id.toLocaleString()}>{cat.nombre}</SelectItem>

                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="precio">Precio (MXN)</Label>
                            <Input id="precio" type="number" placeholder="0.00" onChange={(e) => SetState_Form({ ...State_Form, precio: parseFloat(e.target.value) })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tiempo" >Tiempo Estimado</Label>
                            <Input id="tiempo" type="number" placeholder="Selecciona la cantidad de tiempo" onChange={(e) => SetState_Form({ ...State_Form, tiempo_estimado: parseFloat(e.target.value) })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duracion">Duracion</Label>
                            <Select onValueChange={(e) => SetState_Form({ ...State_Form, tipo_tiempo_estimado: e })}>
                                <SelectTrigger id="duracion">
                                    <SelectValue placeholder="Seleccionar categoría" />
                                </SelectTrigger>
                                <SelectContent id="duracion">
                                    <SelectItem key="dias" value="dias">dias</SelectItem>
                                    <SelectItem key="horas" value="horas">horas</SelectItem>
                                    <SelectItem key="minutos" value="minutos">minutos</SelectItem>

                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <Textarea id="descripcion" placeholder="Descripción detallada del servicio" onChange={(e) => SetState_Form({ ...State_Form, descripcion: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="materiales">Materiales Requeridos</Label>
                        <Textarea id="materiales" placeholder="Materiales separados por comas" onChange={(e) => SetState_Form({ ...State_Form, materiales: e.target.value })} />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="activo" defaultChecked onCheckedChange={(check) => SetState_Form({ ...State_Form, activo: check })} />
                        <Label htmlFor="activo">Servicio Activo</Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenDialog(false)}>
                        Cancelar
                    </Button>
                    <Button disabled={State_Loadding} onClick={() => FN_GUARDAR_SERVICE()}>{State_Loadding ? 'Procesando...' : 'Guardar Servicio'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}