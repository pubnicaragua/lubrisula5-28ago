"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "../ui/input"
import CLIENTS_SERVICES, { ClienteType } from "@/services/CLIENTES_SERVICES.SERVICE"
import VEHICULO_SERVICES, { VehiculoType } from "@/services/VEHICULOS.SERVICE"
import TECNICO_SERVICES, { TecnicoType } from "@/services/TECNICO_SERVICES.SERVICE"
import SERVICIOS_SERVICES, { TipoServicioType } from "@/services/SERVICIOS.SERVICE"
import CITAS_SERVICES, { CitaType } from "@/services/CITAS.SERVICE"

const horasDisponibles = [
    "09:00", "09:30",
    "10:00", "10:30",
    "11:00", "11:30",
    "12:00", "12:30",
    "14:00", "14:30",
    "15:00", "15:30",
    "16:00", "16:30",
    "17:00", "17:30"
];

export default function Form_NuevaCita({ onSucces }: { onSucces?: () => void }) {

    const [State_OpenDialog, SetState_OpenDialog] = useState(false)
    const [State_Clientes, SetState_Clientes] = useState<ClienteType[]>([])
    const [State_Vehiculos, SetState_Vehiculos] = useState<VehiculoType[]>([])
    const [State_Tecnicos, SetState_Tecnicos] = useState<TecnicoType[]>([])
    const [State_Servicios, SetState_Servicios] = useState<TipoServicioType[]>([])
    const [State_IndexHoraInicio, SetState_IndexHoraInicio] = useState<number>(0)
    const [State_IsLoadding, SetState_IsLoadding] = useState<boolean>(false)
    const [State_Form, SetState_Form] = useState<Omit<CitaType, 'id'>>({})

    const FN_GET_CLIENTES = async () => {
        const taller_id = localStorage.getItem("taller_id") || ""
        const res = await CLIENTS_SERVICES.GET_ALL_CLIENTS(taller_id);
        SetState_Clientes(res)
    }
    const FN_GET_VEHICULOS = async (client_id: string) => {
        SetState_Form({ ...State_Form, client_id })
        const res = await VEHICULO_SERVICES.GET_ALL_VEHICULOS_BY_CLIENT(client_id);
        SetState_Vehiculos(res)
    }
    const FN_GET_TECNICOS = async () => {
        const res = await TECNICO_SERVICES.GET_ALL_TECNICOS();
        SetState_Tecnicos(res)
    }
    const FN_GET_SERVICIOS = async () => {
        const res = await SERVICIOS_SERVICES.GET_ALL_TIPO_SERVICIOS();
        SetState_Servicios(res)
    }
    useEffect(() => {
        FN_GET_CLIENTES();
        FN_GET_TECNICOS();
        FN_GET_SERVICIOS();
    }, [])
    const FN_ADD_NEW_CITA = async () => {
        SetState_IsLoadding(true)
        await CITAS_SERVICES.INSERT_CITA(State_Form)
        SetState_IsLoadding(false)
        SetState_OpenDialog(false)
        onSucces()
    }
    return (
        <Dialog open={State_OpenDialog} onOpenChange={SetState_OpenDialog}>
            <DialogTrigger asChild>
                <Button className="rounded-full w-full">
                    <Plus className="mr-2 h-4 w-4" /> Nueva Cita
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Programar Nueva Cita</DialogTitle>
                    <DialogDescription>Complete los datos para programar una nueva cita en el taller.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cliente">Cliente</Label>
                            <Select onValueChange={(value) => FN_GET_VEHICULOS(value)}>

                                <SelectTrigger id="cliente" >
                                    <SelectValue placeholder="Seleccionar cliente" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        State_Clientes.map((client) => (
                                            <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>

                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vehiculo">Vehículo</Label>
                            <Select onValueChange={(value) => SetState_Form({ ...State_Form, vehiculo_id: value })}>
                                <SelectTrigger id="vehiculo">
                                    <SelectValue placeholder="Seleccionar vehículo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        State_Vehiculos.map(v => (
                                            <SelectItem key={v.id} value={v.id}>{v.marca} {v.modelo} - {v.ano}</SelectItem>

                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fecha">Fecha</Label>
                            <Input
                                id="fehca"
                                name="fecha"
                                type="date"
                                placeholder="Fecha programada"
                                onChange={(value) => SetState_Form({ ...State_Form, fecha: value.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hora">Hora Inicio</Label>
                            <Select onValueChange={(value) => { SetState_Form({ ...State_Form, hora_inicio: value }); SetState_IndexHoraInicio(horasDisponibles.indexOf(value)) }}>
                                <SelectTrigger id="hora">
                                    <SelectValue placeholder="Seleccionar hora" />
                                </SelectTrigger>
                                <SelectContent>
                                    {horasDisponibles.map((hora, index) => (
                                        <SelectItem key={hora} value={hora}>
                                            {hora}
                                        </SelectItem>
                                    )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hora">Hora Final</Label>
                            <Select onValueChange={(value) => SetState_Form({ ...State_Form, hora_fin: value })}>
                                <SelectTrigger id="hora">
                                    <SelectValue placeholder="Seleccionar hora" />
                                </SelectTrigger>
                                <SelectContent>
                                    {horasDisponibles.slice(State_IndexHoraInicio + 1).map(hora => (
                                        <SelectItem key={hora} value={hora}>
                                            {hora}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="tecnico">Técnico</Label>
                            <Select onValueChange={(value) => SetState_Form({ ...State_Form, tecnico_id: parseInt(value) })}>
                                <SelectTrigger id="tecnico">
                                    <SelectValue placeholder="Asignar técnico" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        State_Tecnicos.map(t => (
                                            <SelectItem key={t.id} value={t.id.toString()}>{t.nombre} {t.apellido} - {t.area}</SelectItem>

                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="servicio">Servicio</Label>
                            <Select onValueChange={(value) => SetState_Form({ ...State_Form, tipo_servicio_id: value })}>
                                <SelectTrigger id="servicio">
                                    <SelectValue placeholder="Seleccionar servicio" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        State_Servicios.map(s => (
                                            <SelectItem key={s.id} value={s.id}>{s.nombre}</SelectItem>

                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notas">Nota</Label>
                        <Textarea id="notas" placeholder="Añadir notas o comentarios sobre la cita" onChange={(value) => SetState_Form({ ...State_Form, nota: value.target.value })} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => SetState_OpenDialog(false)}>
                        Cancelar
                    </Button>
                    <Button disabled={State_IsLoadding} onClick={FN_ADD_NEW_CITA}>{State_IsLoadding ? 'Procesando...' : 'Programar Cita'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}