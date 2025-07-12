"use client"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import VEHICULO_SERVICES, { VehiculoType } from "@/services/VEHICULOS.SERVICE"
import CLIENTS_SERVICES, { ClienteType } from "@/services/CLIENTES_SERVICES.SERVICE"

interface NuevoVehiculoFormProps {
  onSubmit: (vehiculo: VehiculoType) => void
  clients?: ClienteType[],
  vehiculoExistente?: VehiculoType
}

export function NuevoVehiculoForm({ onSubmit, clients = [], vehiculoExistente }: NuevoVehiculoFormProps) {
  const currentYear = new Date().getFullYear()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [State_Clientes, SetState_Clientes] = useState<ClienteType[]>([])
  const [State_FormData, SetState_FormData] = useState<VehiculoType | null>(null)
  // const [State_Estado, SetState_Estado] = useState<string>('')

  const FN_GET_CLIENTES = async () => {
    // Aquí podrías llamar a un servicio para obtener los clientes si no se pasan como prop 
    const DataClientes: ClienteType[] = await CLIENTS_SERVICES.GET_ALL_CLIENTS();
    SetState_Clientes(DataClientes)
  }
  // Cargar datos del vehículo existente si se está editando
  useEffect(() => {
    if (vehiculoExistente) {
      SetState_FormData(vehiculoExistente)
      // SetState_Estado(vehiculoExistente.estado)
    }
  }, [vehiculoExistente]);

  useEffect(() => {
    FN_GET_CLIENTES()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    SetState_FormData({
      ...State_FormData,
      [name]: name === "año" ? Number.parseInt(value) : value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    SetState_FormData({ ...State_FormData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    //si existe un vehiculo actualizarlo si no existe entonces inserta
    if (vehiculoExistente) {
      const RequestData: VehiculoType = { ...State_FormData, updated_at: new Date().toISOString() }
      const res = await VEHICULO_SERVICES.UPDATE_VEHICULO(RequestData as VehiculoType)

    } else {
      const res = await VEHICULO_SERVICES.INSERT_VEHICULO(State_FormData as VehiculoType)
    }

    const RequestData: VehiculoType = { ...State_FormData, updated_at: new Date().toISOString(), client_name: State_Clientes.find(client => client.id === State_FormData.client_id).name }
    onSubmit(RequestData)

    // Limpiar formulario si no es edición
    if (!vehiculoExistente) {
      SetState_FormData({
        id: "",
        client_id: "",
        client_name: "",
        marca: "",
        modelo: "",
        ano: currentYear,
        color: "",
        placa: "",
        vin: "",
        kilometraje: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        estado: "Activo",
      })
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="marca">Marca *</Label>
          <Input id="marca" name="marca" value={State_FormData?.marca} onChange={handleInputChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="modelo">Modelo *</Label>
          <Input id="modelo" name="modelo" value={State_FormData?.modelo} onChange={handleInputChange} required />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="ano">Año *</Label>
          <Input
            id="ano"
            name="ano"
            type="number"
            min="1900"
            max={currentYear + 1}
            value={State_FormData?.ano}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="placa">Placa *</Label>
          <Input id="placa" name="placa" value={State_FormData?.placa} onChange={handleInputChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="color">Color *</Label>
          <Input id="color" name="color" value={State_FormData?.color} onChange={handleInputChange} required />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="vin">VIN *</Label>
        <Input id="vin" name="vin" value={State_FormData?.vin} onChange={handleInputChange} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="kilometraje">Kilometraje</Label>
        <Input
          id="kilometraje"
          name="kilometraje"
          value={State_FormData?.kilometraje}
          onChange={handleInputChange}
          placeholder="Ej: 45,000"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="clienteId">Cliente *</Label>
        <Select onValueChange={(value) => handleSelectChange("client_id", value)} value={State_FormData?.client_id} defaultValue={vehiculoExistente?.client_id}>
          <SelectTrigger id="clienteId">
            <SelectValue placeholder="Seleccionar cliente" />
          </SelectTrigger>
          <SelectContent>
            {State_Clientes.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="estado">Estado *</Label>
        <Select onValueChange={(value) => handleSelectChange("estado", value)} value={State_FormData?.estado} defaultValue={vehiculoExistente?.estado}>
          <SelectTrigger id="estado">
            <SelectValue placeholder={vehiculoExistente?.estado} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="En Servicio">En Servicio</SelectItem>
            <SelectItem value="Entregado">Entregado</SelectItem>
            <SelectItem value="Inactivo">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end mt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : vehiculoExistente ? "Actualizar Vehículo" : "Guardar Vehículo"}
        </Button>
      </div>
    </form>
  )
}
