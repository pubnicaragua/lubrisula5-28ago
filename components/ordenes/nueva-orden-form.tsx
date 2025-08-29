"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import ORDENES_TRABAJO_SERVICES, { OrdenTrabajoType } from "@/services/ORDENES.SERVICE"
import CLIENTS_SERVICES, { ClienteType } from "@/services/CLIENTES_SERVICES.SERVICE"
import VEHICULO_SERVICES, { VehiculoType } from "@/services/VEHICULOS.SERVICE"
import TECNICO_SERVICES, { TecnicoType } from "@/services/TECNICO_SERVICES.SERVICE"
import SERVICIOS_SERVICES, { TipoServicioType } from "@/services/SERVICIOS.SERVICE"


interface NuevaOrdenFormProps {
  onSubmit: (orden: OrdenTrabajoType | null) => void
  ordenExistente?: OrdenTrabajoType
}

export function NuevaOrdenForm({ onSubmit, ordenExistente }: NuevaOrdenFormProps) {
  const [formData, setFormData] = useState<OrdenTrabajoType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [State_Clientes, SetStateClientes] = useState<ClienteType[]>([])
  const [State_Vehiculos, SetState_Vehiculos] = useState<VehiculoType[]>([])
  const [State_Tecnicos, SetState_Tecnicos] = useState<TecnicoType[]>([])
  const [State_TiposServicios, SetState_TiposServicios] = useState<TipoServicioType[]>([])
  // const [State_EstadoOrden, SetState_EstadoOrden] = useState<TipoServicioType[]>([])
  const GET_CLIENTES = async () => {
    const res = await CLIENTS_SERVICES.GET_ALL_CLIENTS();
    SetStateClientes(res)
  }
  const GET_VEHICULOS = async (client_id: string) => {
    const res = await VEHICULO_SERVICES.GET_ALL_VEHICULOS_BY_CLIENT(client_id);
    SetState_Vehiculos(res)
  }
  const GET_TECNICOS = async () => {
    const res = await TECNICO_SERVICES.GET_ALL_TECNICOS();
    SetState_Tecnicos(res)
  }
  const GET_TIPOS_SERVICIOS = async () => {
    const res = await SERVICIOS_SERVICES.GET_ALL_TIPO_SERVICIOS();
    SetState_TiposServicios(res)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "costoEstimado" || name === "costoFinal" ? Number.parseFloat(value) || 0 : value,
    })
  }

  const handleSelectChange = async (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })

    // Si cambia el cliente, actualizar el nombre del cliente
    if (name === "client_id" && !ordenExistente) {
      await GET_VEHICULOS(value)
    }
    if (name === "client_id" && ordenExistente) {
      await GET_VEHICULOS(formData.client_id)
    }

    // // Si cambia el vehículo, actualizar la info del vehículo
    // if (name === "vehiculo_id") {
    //   const vehiculo = vehiculos.find((v) => v.id === value)
    //   if (vehiculo) {
    //     setFormData((prev) => ({
    //       ...prev,
    //       vehiculoId: value,
    //       vehiculoInfo: `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.año} (${vehiculo.placa})`,
    //     }))
    //   }
    // }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular delay de procesamiento
    if (!ordenExistente) {
      await ORDENES_TRABAJO_SERVICES.INSERT_ORDEN({
        client_id: formData.client_id,
        costo: formData.costo,
        descripcion: formData.descripcion,
        estado: formData.estado,
        fecha_entrega: formData.fecha_entrega,
        fecha_ingreso: formData.fecha_ingreso,
        observacion: formData.observacion,
        prioridad: formData.prioridad,
        tecnico_id: formData.tecnico_id,
        tipo_servicio_id: formData.servicio_id,
        vehiculo_id: formData.vehiculo_id
      })

    }
    if (ordenExistente) {
      await ORDENES_TRABAJO_SERVICES.UPDATE_ORDEN(formData.id, {
        client_id: formData.client_id,
        costo: formData.costo,
        descripcion: formData.descripcion,
        estado: formData.estado,
        fecha_entrega: formData.fecha_entrega,
        fecha_ingreso: formData.fecha_ingreso,
        observacion: formData.observacion,
        prioridad: formData.prioridad,
        tecnico_id: formData.tecnico_id,
        tipo_servicio_id: formData.servicio_id,
        vehiculo_id: formData.vehiculo_id
      })
    }
    onSubmit(formData)

    // // Limpiar formulario si no es edición
    // if (!ordenExistente) {
    //   setFormData({
    //     clienteId: "",
    //     clienteNombre: "",
    //     vehiculoId: "",
    //     vehiculoInfo: "",
    //     descripcion: "",
    //     tipoServicio: "Mantenimiento",
    //     fechaIngreso: new Date().toISOString().split("T")[0],
    //     fechaEstimadaEntrega: "",
    //     tecnicoAsignado: "",
    //     prioridad: "Normal",
    //     estado: "Pendiente",
    //     costoEstimado: 0,
    //     observaciones: "",
    //   })
    // }

    setIsSubmitting(false)
  }
  // Cargar datos
  useEffect(() => {
    GET_CLIENTES()
    GET_TECNICOS()
    GET_TIPOS_SERVICIOS()
  }, []);
    // Cargar datos de la orden existente si se está editando
  useEffect(() => {
    if (ordenExistente) {
      setFormData(ordenExistente)
      GET_VEHICULOS(ordenExistente?.client_id)
    }
  }, [ordenExistente])


  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="client_id">Cliente *</Label>
          <Select onValueChange={(value) => handleSelectChange("client_id", value)} value={formData?.client_id} defaultValue={ordenExistente?.client_id}>
            <SelectTrigger id="client_id">
              <SelectValue placeholder="Seleccionar cliente" />
            </SelectTrigger>
            <SelectContent>
              {State_Clientes.map((cliente) => (
                <SelectItem key={cliente.id} value={cliente.id}>
                  {cliente.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="vehiculoId">Vehículo *</Label>
          <Select
            onValueChange={(value) => handleSelectChange("vehiculo_id", value)}
            value={formData?.vehiculo_id}
            disabled={!formData?.client_id}
            defaultValue={ordenExistente?.vehiculo_id}
          >
            <SelectTrigger id="id">
              <SelectValue
                placeholder={!formData?.client_id ? "Selecciona un cliente primero" : "Seleccionar vehículo"}
              />
            </SelectTrigger>
            <SelectContent>
              {State_Vehiculos.map((vehiculo) => (
                <SelectItem key={vehiculo.id} value={vehiculo.id}>
                  {vehiculo.marca} {vehiculo.modelo} ({vehiculo.placa})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="descripcion">Descripción del Servicio *</Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          value={formData?.descripcion}
          onChange={handleInputChange}
          placeholder="Describe el servicio a realizar..."
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="servicio_id">Tipo de Servicio *</Label>
          <Select onValueChange={(value) => handleSelectChange("servicio_id", value)} value={formData?.servicio_id} defaultValue={ordenExistente?.servicio_id}>
            <SelectTrigger id="servicio_id">
              <SelectValue placeholder="Seleccionar servicio" />
            </SelectTrigger>
            <SelectContent>

              {State_TiposServicios.map((serv) => (
                <SelectItem key={serv.id} value={serv.id}>
                  {serv.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tecnico_id">Técnico Asignado *</Label>
          <Select
            onValueChange={(value) => handleSelectChange("tecnico_id", value)}
            value={formData?.tecnico_id?.toString()}
            defaultValue={ordenExistente?.tecnico_id.toString()}
          >
            <SelectTrigger id="tecnico_id">
              <SelectValue placeholder="Seleccionar técnico" />
            </SelectTrigger>
            <SelectContent>
              {State_Tecnicos.map((tecnico) => (
                <SelectItem key={tecnico.id} value={tecnico.id.toString()}>
                  {tecnico.nombre} {tecnico.apellido} - {tecnico.area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="fecha_ingreso">Fecha de Ingreso *</Label>
          <Input
            id="fecha_ingreso"
            name="fecha_ingreso"
            type="date"
            value={ordenExistente ? formData?.fecha_ingreso?.slice(0, 10) : formData?.fecha_ingreso}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="fecha_entrega">Fecha Estimada de Entrega *</Label>
          <Input
            id="fecha_entrega"
            name="fecha_entrega"
            type="date"
            value={ordenExistente ? formData?.fecha_entrega?.slice(0, 10) : formData?.fecha_entrega}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="prioridad">Prioridad *</Label>
          <Select onValueChange={(value) => handleSelectChange("prioridad", value)} value={formData?.prioridad} defaultValue={ordenExistente?.prioridad}>
            <SelectTrigger id="prioridad">
              <SelectValue placeholder="Seleccionar prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Baja">Baja</SelectItem>
              <SelectItem value="Normal">Normal</SelectItem>
              <SelectItem value="Alta">Alta</SelectItem>
              <SelectItem value="Urgente">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="estado">Estado *</Label>
          <Select onValueChange={(value) => handleSelectChange("estado", value)} value={formData?.estado} defaultValue={ordenExistente?.estado}>
            <SelectTrigger id="estado">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="En Proceso">En Proceso</SelectItem>
              <SelectItem value="Completada">Completada</SelectItem>
              <SelectItem value="Entregada">Entregada</SelectItem>
              <SelectItem value="Cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="costo">Costo Estimado (L)</Label>
          <Input
            id="costo"
            name="costo"
            type="number"
            // min="0"
            step="0.01"
            value={formData?.costo}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="observacion">Observaciones</Label>
        <Textarea
          id="observacion"
          name="observacion"
          value={formData?.observacion}
          onChange={handleInputChange}
          placeholder="Observaciones adicionales..."
          rows={3}
        />
      </div>

      <div className="flex justify-end mt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : ordenExistente ? "Actualizar Orden" : "Crear Orden"}
        </Button>
      </div>
    </form>
  )
}
