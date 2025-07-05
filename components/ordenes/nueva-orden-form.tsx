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

interface OrdenForm {
  clienteId: string
  clienteNombre: string
  vehiculoId: string
  vehiculoInfo: string
  descripcion: string
  tipoServicio: "Mantenimiento" | "Reparación" | "Diagnóstico" | "Revisión" | "Otro"
  fechaIngreso: string
  fechaEstimadaEntrega: string
  fechaEntrega?: string
  tecnicoAsignado: string
  prioridad: "Baja" | "Normal" | "Alta" | "Urgente"
  estado: "Pendiente" | "En Proceso" | "Completada" | "Entregada" | "Cancelada"
  costoEstimado?: number
  costoFinal?: number
  observaciones?: string
}

interface NuevaOrdenFormProps {
  onSubmit: (orden: OrdenTrabajoType | null) => void
  ordenExistente?: any
}

export function NuevaOrdenForm({ onSubmit, ordenExistente }: NuevaOrdenFormProps) {
  const [formData, setFormData] = useState<OrdenTrabajoType | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clientes, setClientes] = useState<any[]>([])
  const [vehiculos, setVehiculos] = useState<any[]>([])
  const [tecnicos, setTecnicos] = useState<any[]>([])

  const [State_Clientes, SetStateClientes] = useState<ClienteType[]>([])
  const [State_Vehiculos, SetState_Vehiculos] = useState<VehiculoType[]>([])
  const [State_Tecnicos, SetState_Tecnicos] = useState<TecnicoType[]>([])
  const [State_TiposServicios, SetState_TiposServicios] = useState<TipoServicioType[]>([])
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
    console.log(res)
    SetState_Tecnicos(res)
  }
  const GET_TIPOS_SERVICIOS = async () => {
    const res = await SERVICIOS_SERVICES.GET_ALL_SERVICIOS();
    SetState_TiposServicios(res)
  }

  // Cargar datos del localStorage
  useEffect(() => {
    GET_CLIENTES()
    GET_TECNICOS()
    GET_TIPOS_SERVICIOS()
    const savedClientes = localStorage.getItem("clientes")
    const savedVehiculos = localStorage.getItem("vehiculos")
    const savedMiembros = localStorage.getItem("miembros")

    if (savedClientes) {
      setClientes(JSON.parse(savedClientes))
    }
    if (savedVehiculos) {
      setVehiculos(JSON.parse(savedVehiculos))
    }
    if (savedMiembros) {
      const miembros = JSON.parse(savedMiembros)
      setTecnicos(miembros.filter((m: any) => m.cargo.includes("Técnico")))
    }
  }, []);


  // Cargar datos de la orden existente si se está editando
  // useEffect(() => {
  //   if (ordenExistente) {
  //     setFormData({
  //       cliente_id: ordenExistente.clienteId || "",
  //       client_name: ordenExistente.clienteNombre || "",
  //       vehiculo_id: ordenExistente.vehiculoId || "",
  //       vehiculoInfo: ordenExistente.vehiculoInfo || "",
  //       descripcion: ordenExistente.descripcion || "",
  //       tipoServicio: ordenExistente.tipoServicio || "Mantenimiento",
  //       fechaIngreso: ordenExistente.fechaIngreso || new Date().toISOString().split("T")[0],
  //       fechaEstimadaEntrega: ordenExistente.fechaEstimadaEntrega || "",
  //       fechaEntrega: ordenExistente.fechaEntrega || "",
  //       tecnicoAsignado: ordenExistente.tecnicoAsignado || "",
  //       prioridad: ordenExistente.prioridad || "Normal",
  //       estado: ordenExistente.estado || "Pendiente",
  //       costoEstimado: ordenExistente.costoEstimado || 0,
  //       costoFinal: ordenExistente.costoFinal || 0,
  //       observaciones: ordenExistente.observaciones || "",
  //     })
  //   }
  // }, [ordenExistente])

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
    if (name === "client_id") {
      await GET_VEHICULOS(value)
      const cliente = clientes.find((c) => c.id === value)
      if (cliente) {
        setFormData((prev) => ({
          ...prev,
          clienteId: value,
          clienteNombre: `${cliente.nombre} ${cliente.apellido}`,
        }))
      }
    }

    // Si cambia el vehículo, actualizar la info del vehículo
    if (name === "vehiculo_id") {
      const vehiculo = vehiculos.find((v) => v.id === value)
      if (vehiculo) {
        setFormData((prev) => ({
          ...prev,
          vehiculoId: value,
          vehiculoInfo: `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.año} (${vehiculo.placa})`,
        }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular delay de procesamiento
    ORDENES_TRABAJO_SERVICES.INSERT_ORDEN(formData)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSubmit(null)

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

  // Filtrar vehículos por cliente seleccionado
  // const vehiculosFiltrados = vehiculos.filter((v) => v.clienteId === formData.clienteId)

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="clienteId">Cliente *</Label>
          <Select onValueChange={(value) => handleSelectChange("client_id", value)} value={formData?.cliente_id}>
            <SelectTrigger id="id">
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
            disabled={!formData?.cliente_id}
          >
            <SelectTrigger id="id">
              <SelectValue
                placeholder={!formData?.cliente_id ? "Selecciona un cliente primero" : "Seleccionar vehículo"}
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
          <Label htmlFor="tipoServicio">Tipo de Servicio *</Label>
          <Select onValueChange={(value) => handleSelectChange("tipo_servicio_id", value)} value="Mantenimiento">
            <SelectTrigger id="id">
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
              <SelectItem value="Reparación">Reparación</SelectItem>
              <SelectItem value="Diagnóstico">Diagnóstico</SelectItem>
              <SelectItem value="Revisión">Revisión</SelectItem>
              <SelectItem value="Otro">Otro</SelectItem> */}
              {State_TiposServicios.map((serv) => (
                <SelectItem key={serv.id} value={serv.nombre}>
                  {serv.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tecnicoAsignado">Técnico Asignado *</Label>
          <Select
            onValueChange={(value) => handleSelectChange("tecnico_name", value)}
            value={formData?.tecnico_name}
          >
            <SelectTrigger id="tecnico_name">
              <SelectValue placeholder="Seleccionar técnico" />
            </SelectTrigger>
            <SelectContent>
              {State_Tecnicos.map((tecnico) => (
                <SelectItem key={tecnico.id} value={`${tecnico.nombre} ${tecnico.apellido}`}>
                  {tecnico.nombre} {tecnico.apellido} - {tecnico.area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="fechaIngreso">Fecha de Ingreso *</Label>
          <Input
            id="fechaIngreso"
            name="fechaIngreso"
            type="date"
            value={formData?.fecha_creacion}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="fechaEstimadaEntrega">Fecha Estimada de Entrega *</Label>
          <Input
            id="fechaEstimadaEntrega"
            name="fechaEstimadaEntrega"
            type="date"
            value={formData?.fecha_entrega}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="fechaEntrega">Fecha de Entrega</Label>
          <Input
            id="fechaEntrega"
            name="fechaEntrega"
            type="date"
            value={formData?.fecha_entrega || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="prioridad">Prioridad *</Label>
          <Select onValueChange={(value) => handleSelectChange("prioridad", value)} value={formData?.prioridad}>
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
          <Select onValueChange={(value) => handleSelectChange("estado", value)} value={formData?.estado}>
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
          <Label htmlFor="costoEstimado">Costo Estimado (L)</Label>
          <Input
            id="costoEstimado"
            name="costoEstimado"
            type="number"
            // min="0"
            step="0.01"
            value={formData?.costo}
            onChange={handleInputChange}
          />
        </div>
      </div>
      {formData?.estado === "Completada" || formData?.estado === "En Proceso" ? (
        <div className="grid gap-2">
          <Label htmlFor="costoFinal">Costo Final (L)</Label>
          <Input
            id="costoFinal"
            name="costoFinal"
            type="number"
            min="0"
            step="0.01"
            value={formData?.costo || 0}
            onChange={handleInputChange}
          />
        </div>
      ) : null}

      <div className="grid gap-2">
        <Label htmlFor="observaciones">Observaciones</Label>
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
