


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
import { Plus, Trash } from "lucide-react";
import SERVICIOS_SERVICES, { ServicioType, CategoriaServicioType } from "@/services/SERVICIOS.SERVICE";
export default function FormNuevoPaqueteServicio({ onSuccess }: { onSuccess?: (NewServicio: ServicioType) => void }) {
    const [openDialog, setOpenDialog] = useState(false)
    const [State_Loadding, SetState_Loadding] = useState(false)
    const [State_Form, SetState_Form] = useState<Omit<ServicioType, 'categorias_servicio'>>({ estado: true })
    const [State_Servicios, SetState_Servicios] = useState<ServicioType[]>([])
    const [State_ListServiciosSelected, SetState_ListServiciosSelected] = useState<ServicioType[]>([])
    const [State_ServicioSelected, SetState_ServicioSelected] = useState<ServicioType>({})
    const [State_Categorias, SetState_Categorias] = useState<CategoriaServicioType[]>([])

    const FN_GET_CATEGORIAS_SERVICIO = async () => {
        const res = await SERVICIOS_SERVICES.GET_GATEGORIAS_SERVICIO();
        SetState_Categorias(res)
    }
    const FN_GET_ALL_SERVICIOS = async () => {
        const res = await SERVICIOS_SERVICES.GET_ALL_SERVICIOS()
        SetState_Servicios(res)
    }
    const FN_GUARDAR_SERVICE = async () => {
        SetState_Loadding(true)
        const res = await SERVICIOS_SERVICES.INSERT_SERVICIO(State_Form)
        SetState_Loadding(false)
        setOpenDialog(false)
        onSuccess(res)
    }
    useEffect(() => {
        FN_GET_ALL_SERVICIOS()
        FN_GET_CATEGORIAS_SERVICIO()
    }, [])
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button className="rounded-full">
                    <Plus className="mr-2 h-4 w-4" /> Crear Nuevo Paquete
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Paquete de Servicios</DialogTitle>
                    <DialogDescription>Complete los datos para crear un nuevo paquete de servicios al catálogo.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 grid-rows-2 gap-4">
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="nombre">Nombre del paquete</Label>
                            <Input id="nombre" placeholder="Nombre del servicio"
                                onChange={(e) => SetState_Form({ ...State_Form, nombre: e.target.value })} />
                        </div>
                        <div className="space-y-2 col-span-2">
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
                        <div className="space-y-2 col-span-3">
                            <Label htmlFor="categoria">Servicios disponibles</Label>
                            <Select onValueChange={(e) => SetState_ServicioSelected(State_Servicios.find(serv => serv.id === parseInt(e)))}>
                                <SelectTrigger id="categoria">
                                    <SelectValue placeholder="Seleccionar servicio" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        State_Servicios?.map(serv => (
                                            <SelectItem key={serv.id} value={serv.id.toString()}>SERV - {serv.id} - {serv.nombre} - {serv.categorias_servicio.nombre}</SelectItem>

                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="pt-5 flex justify-center items-center col-span-1">

                            <Button className="w-full rounded-full" onClick={() =>{ 
                                 !State_ListServiciosSelected.find(item=>item.id === State_ServicioSelected.id) &&
                                SetState_ListServiciosSelected([...State_ListServiciosSelected, State_ServicioSelected])

                            }}>
                                <Plus className="mr-2 h-4 w-4" /> Agregar
                            </Button>
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
                    <div className="space-y-2 grid grid-cols-4 gap-2">
                        {
                            State_ListServiciosSelected.map((serv, index) => (
                                <>

                                    <aside key={serv.nombre + serv.id + index} className="col-span-3 flex justify-center items-center">
                                        <Input value={`SERV - ${serv.id}  ${serv.nombre} - ${serv.categorias_servicio.nombre}`} disabled className="" />
                                    </aside>
                                    <aside key={serv.nombre + serv.id + index + 'button'} className="col-span-1 flex justify-center items-center">
                                        <Button
                                            variant="outline"
                                            className="w-full rounded-full"
                                            onClick={() => SetState_ListServiciosSelected(State_ListServiciosSelected.filter(item => item.id !== serv.id))}
                                        >
                                            <Trash />
                                            Eliminar
                                        </Button>
                                    </aside>
                                </>

                            ))
                        }
                    </div>
                    {/* <div className="space-y-2">
                        <Label htmlFor="materiales">Materiales Requeridos</Label>
                        <Textarea id="materiales" placeholder="Materiales separados por comas" onChange={(e) => SetState_Form({ ...State_Form, materiales: e.target.value })} />
                    </div> */}
                    <div className="flex items-center space-x-2">
                        <Switch id="activo" defaultChecked onCheckedChange={(check) => SetState_Form({ ...State_Form, estado: check })} />
                        <Label htmlFor="activo">Servicio Activo</Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenDialog(false)}>
                        Cancelar
                    </Button>
                    <Button disabled={State_Loadding} onClick={() => FN_GUARDAR_SERVICE()}>{State_Loadding ? 'Procesando...' : 'Guardar Paquete de Servicios'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}