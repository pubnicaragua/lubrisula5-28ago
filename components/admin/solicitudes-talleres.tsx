"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Clock, MapPin, Mail, Phone } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

type Solicitud = {
  id: number
  nombre_taller: string
  direccion: string
  ciudad: string
  estado: string
  codigo_postal: string
  nombre_contacto: string
  telefono: string
  email: string
  descripcion: string | null
  modulos_seleccionados: string[]
  estado_solicitud: "pendiente" | "aprobada" | "rechazada"
  fecha_solicitud: string
  fecha_actualizacion: string | null
}

type SolicitudesTalleresProps = {
  solicitudes: Solicitud[]
}

export function SolicitudesTalleres({ solicitudes }: SolicitudesTalleresProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState<number | null>(null)
  const [localSolicitudes, setLocalSolicitudes] = useState<Solicitud[]>(solicitudes)

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const getModuloLabel = (moduloId: string) => {
    const modulos: Record<string, string> = {
      dashboard: "Dashboard",
      clientes: "Clientes",
      vehiculos: "Vehículos",
      ordenes: "Órdenes de Trabajo",
      cotizaciones: "Cotizaciones",
      reportes: "Reportes",
      citas: "Citas",
      inventario: "Inventario",
      compras: "Compras",
      kanban: "Kanban",
      comunicaciones: "Comunicaciones",
      configuracion: "Configuración",
    }
    return modulos[moduloId] || moduloId
  }

  const handleStatusChange = async (id: number, newStatus: "aprobada" | "rechazada") => {
    setIsProcessing(id)
    try {
      const response = await fetch(`/api/solicitudes-talleres/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado_solicitud: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar el estado de la solicitud")
      }

      // Actualizar el estado local
      setLocalSolicitudes(
        localSolicitudes.map((solicitud) =>
          solicitud.id === id
            ? { ...solicitud, estado_solicitud: newStatus, fecha_actualizacion: new Date().toISOString() }
            : solicitud,
        ),
      )

      toast({
        title: "Estado actualizado",
        description: `La solicitud ha sido ${newStatus === "aprobada" ? "aprobada" : "rechazada"} correctamente.`,
        variant: newStatus === "aprobada" ? "default" : "destructive",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar el estado de la solicitud.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(null)
    }
  }

  const pendientes = localSolicitudes.filter((s) => s.estado_solicitud === "pendiente")
  const aprobadas = localSolicitudes.filter((s) => s.estado_solicitud === "aprobada")
  const rechazadas = localSolicitudes.filter((s) => s.estado_solicitud === "rechazada")

  const renderSolicitud = (solicitud: Solicitud) => (
    <Card key={solicitud.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{solicitud.nombre_taller}</CardTitle>
            <CardDescription>
              {solicitud.ciudad}, {solicitud.estado} •{" "}
              {formatDistanceToNow(new Date(solicitud.fecha_solicitud), { addSuffix: true, locale: es })}
            </CardDescription>
          </div>
          <Badge
            variant={
              solicitud.estado_solicitud === "pendiente"
                ? "outline"
                : solicitud.estado_solicitud === "aprobada"
                  ? "success"
                  : "destructive"
            }
          >
            {solicitud.estado_solicitud === "pendiente" && <Clock className="h-3 w-3 mr-1" />}
            {solicitud.estado_solicitud === "aprobada" && <CheckCircle className="h-3 w-3 mr-1" />}
            {solicitud.estado_solicitud === "rechazada" && <XCircle className="h-3 w-3 mr-1" />}
            {solicitud.estado_solicitud.charAt(0).toUpperCase() + solicitud.estado_solicitud.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              {solicitud.direccion}, {solicitud.codigo_postal}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{solicitud.email}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Phone className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{solicitud.telefono}</span>
          <span className="text-sm text-gray-500 ml-1">({solicitud.nombre_contacto})</span>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">
            Módulos seleccionados ({solicitud.modulos_seleccionados.length}):
          </div>
          <div className="flex flex-wrap gap-2">
            {solicitud.modulos_seleccionados.map((modulo) => (
              <Badge key={modulo} variant="secondary">
                {getModuloLabel(modulo)}
              </Badge>
            ))}
          </div>
        </div>

        {expandedId === solicitud.id && (
          <div className="mt-4 pt-4 border-t">
            {solicitud.descripcion && (
              <>
                <div className="text-sm font-medium mb-2">Descripción:</div>
                <p className="text-sm">{solicitud.descripcion}</p>
              </>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div>
          {solicitud.estado_solicitud === "pendiente" && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleStatusChange(solicitud.id, "rechazada")}
                disabled={isProcessing === solicitud.id}
              >
                {isProcessing === solicitud.id ? "Rechazando..." : "Rechazar"}
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleStatusChange(solicitud.id, "aprobada")}
                disabled={isProcessing === solicitud.id}
                className="ml-2"
              >
                {isProcessing === solicitud.id ? "Aprobando..." : "Aprobar"}
              </Button>
            </>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={() => toggleExpand(solicitud.id)}>
          {expandedId === solicitud.id ? (
            <>
              Menos detalles <ChevronUp className="h-4 w-4 ml-2" />
            </>
          ) : (
            <>
              Ver detalles <ChevronDown className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <Tabs defaultValue="pendientes" className="w-full">
      <TabsList>
        <TabsTrigger value="pendientes">Pendientes ({pendientes.length})</TabsTrigger>
        <TabsTrigger value="aprobadas">Aprobadas ({aprobadas.length})</TabsTrigger>
        <TabsTrigger value="rechazadas">Rechazadas ({rechazadas.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="pendientes">
        {pendientes.length > 0 ? (
          pendientes.map(renderSolicitud)
        ) : (
          <div className="text-sm text-gray-500">No hay solicitudes pendientes.</div>
        )}
      </TabsContent>
      <TabsContent value="aprobadas">
        {aprobadas.length > 0 ? (
          aprobadas.map(renderSolicitud)
        ) : (
          <div className="text-sm text-gray-500">No hay solicitudes aprobadas.</div>
        )}
      </TabsContent>
      <TabsContent value="rechazadas">
        {rechazadas.length > 0 ? (
          rechazadas.map(renderSolicitud)
        ) : (
          <div className="text-sm text-gray-500">No hay solicitudes rechazadas.</div>
        )}
      </TabsContent>
    </Tabs>
  )
}
