


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
import { useEffect, useState } from "react";
import { Clock, DollarSign, MoreHorizontal, Plus, Trash, Wrench } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator"
import SERVICIOS_SERVICES, { PaqueteServicioType } from "@/services/SERVICIOS.SERVICE";
export default function FormAgregarServicioAPaquete({ servicio_id, onSuccess, openDialog, setOpenDialog }: { servicio_id: number, onSuccess: (NewServicio: boolean) => void, openDialog: boolean, setOpenDialog: (open: boolean) => void }) {
    const [State_Loadding, SetState_Loadding] = useState(false)

    const [State_PaqueteServices, SetState_PaqueteServices] = useState<PaqueteServicioType[]>([])
    const [State_PaqueteServicesSelected, SetState_PaqueteServicesSelected] = useState<PaqueteServicioType>({})

    const FN_GET_PAQUETES = async () => {
        const paquetes = await SERVICIOS_SERVICES.GET_ALL_PAQUETES_SERVICIOS()
        SetState_PaqueteServices(paquetes)
    }
    const FN_GUARDAR = async () => {
        SetState_Loadding(true)
        const res = await SERVICIOS_SERVICES.AGREGAR_SERVICIO_AL_PAQUETE(servicio_id, State_PaqueteServicesSelected.id)
        console.log(res)
        SetState_Loadding(false)
        setOpenDialog(false)
        onSuccess(res)
    }
    useEffect(() => {
        console.log('ejecuta')
        if (openDialog) {
            console.log('ejecuta')
            FN_GET_PAQUETES()
            SetState_PaqueteServicesSelected({})
        }

    }, [openDialog])
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            {/* <DialogTrigger asChild>
                <Button className="rounded-full">
                    <Plus className="mr-2 h-4 w-4" /> Crear Nuevo Paquete
                </Button>
            </DialogTrigger> */}
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Paquete de Servicios</DialogTitle>
                    <DialogDescription>Complete los datos para crear un nuevo paquete de servicios al catálogo.</DialogDescription>
                </DialogHeader>
                {
                    State_PaqueteServices?.map((paq) => (
                        <Card key={paq.id}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{paq?.nombre}</CardTitle>
                                        <CardDescription>PKG-{paq?.id}</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-blue-100 text-blue-800">{paq?.categorias_servicio?.nombre}</Badge>
                                        {/* <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>Editar paquete</DropdownMenuItem>
                                                <DropdownMenuItem>Ver historial</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className={paq.activo ? "text-red-600" : "text-green-600"} onClick={() => FN_DESACTIVAR_PAQUETE(paq.id, paq.activo ? false : true)}>{paq.activo ? 'Desactivar' : 'Activar'}</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu> */}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        Paquete de mantenimiento básico que incluye cambio de aceite, revisión de niveles y
                                        diagnóstico general.
                                    </p>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center text-sm">
                                            <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                                            <span className="font-medium">${paq?.precio}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                            <span className="font-medium">{paq?.tiempo_estimado} {paq?.tipo_tiempo_estimado}</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div>
                                        <h4 className="text-sm font-medium mb-2">Servicios incluidos:</h4>
                                        <div className="space-y-2">
                                            {
                                                paq?.servicios?.map((serv) => (
                                                    <div key={serv.id} className="flex justify-between items-center">
                                                        <div className="flex items-center">
                                                            <Wrench className="h-4 w-4 mr-2 text-muted-foreground" />
                                                            <span>SERV - {serv.id} - {serv.nombre}</span>
                                                        </div>
                                                        <span className="text-sm text-muted-foreground">${serv.precio}</span>
                                                    </div>
                                                ))
                                            }

                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <div className="text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">Ahorro:</span> $200
                                </div>
                                <Button
                                    disabled={State_Loadding}
                                    className={State_PaqueteServicesSelected?.id === paq?.id ? "bg-lime-500" : ''}
                                    onClick={State_PaqueteServicesSelected?.id === paq?.id ? FN_GUARDAR : () => SetState_PaqueteServicesSelected(paq)}>{State_PaqueteServicesSelected?.id === paq?.id ? 'Confirmar' : 'Agregar servicio a este paquete'}</Button>
                            </CardFooter>
                        </Card>
                    ))
                }
                {/* <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenDialog(false)}>
                        Cancelar
                    </Button>
                    <Button disabled={State_Loadding} onClick={() => FN_GUARDAR()}>{State_Loadding ? 'Procesando...' : 'Guardar Paquete de Servicios'}</Button>
                </DialogFooter> */}
            </DialogContent>
        </Dialog>
    )
}