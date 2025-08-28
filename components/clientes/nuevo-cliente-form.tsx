"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { ClienteType } from "@/services/CLIENTES_SERVICES.SERVICE"

// interface Cliente {
//   nombre: string
//   apellido: string
//   empresa?: string
//   telefono: string
//   email: string
//   tipoCliente: "Individual" | "Empresa" | "Flota" | "Aseguradora"
// }

interface NuevoClienteFormProps {
  onSubmit: (cliente: ClienteType) => any
  clienteExistente?: ClienteType
}

export function NuevoClienteForm({ onSubmit, clienteExistente }: NuevoClienteFormProps) {
  const [formData, setFormData] = useState<ClienteType | null>()

  const [isSubmitting, setIsSubmitting] = useState(false)
  // Cargar datos del cliente existente si se está editando
  useEffect(() => {
    if (clienteExistente) {
      setFormData({ ...clienteExistente })
    }
  }, [clienteExistente])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value, updated_at: new Date().toISOString() })
  }

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, client_type: value as ClienteType["client_type"], updated_at: new Date().toISOString() })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simular delay de procesamiento
    const res = await onSubmit(formData)
    if (!res) return setIsSubmitting(false)
    // Limpiar formulario si no es edición
    if (!clienteExistente) {
      setFormData({
        name: "",
        // apellido: "",
        company: "",
        phone: "",
        email: "",
        client_type: "Individual",
        created_at: "",
        updated_at: "",
        password: "123456" // Default password, should be changed later

      })
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="">
        <div className="grid gap-2">
          <Label htmlFor="name">Nombre *</Label>
          <Input type="text" id="name" name="name" value={formData?.name} onChange={handleInputChange} required />
        </div>
        {/* <div className="grid gap-2">
          <Label htmlFor="apellido">Apellido *</Label>
          <Input type="text" id="apellido" name="apellido" value={formData?.name} onChange={handleInputChange} required />
        </div> */}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="company">Empresa</Label>
        <Input type="text" id="company" name="company" value={formData?.company} onChange={handleInputChange} />
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="grid gap-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" value={formData?.email} onChange={handleInputChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Password *</Label>
          <Input id="password" name="password" type="text" value={formData?.password} onChange={handleInputChange} required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Teléfono *</Label>
          <Input type="number" id="phone" name="phone" value={formData?.phone} onChange={handleInputChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="client_type">Tipo de Cliente *</Label>
          <Select onValueChange={handleSelectChange} value={formData?.client_type} defaultValue={clienteExistente?.client_type}>
            <SelectTrigger id="client_type">
              <SelectValue placeholder={clienteExistente?.client_type} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Individual">Individual</SelectItem>
              <SelectItem value="Empresa">Empresa</SelectItem>
              <SelectItem value="Flota">Flota</SelectItem>
              <SelectItem value="Aseguradora">Aseguradora</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>


      <div className="flex justify-end mt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : clienteExistente ? "Actualizar Cliente" : "Guardar Cliente"}
        </Button>
      </div>
    </form>
  )
}
