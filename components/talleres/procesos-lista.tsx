"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Clock, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Proceso {
  id: string
  nombre: string
  descripcion: string
  tiempo_estimado: number
  orden: number
  tipo: string
  validaciones: string
  activo: boolean
  created_at: string
  updated_at: string
}

export function ProcesosLista() {
  const { toast } = useToast()
  const [procesos, setProcesos] = useState<Proceso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProcesos = async () => {
      try {
        const response = await fetch("/api/procesos")
        const data = await response.json()

        if (response.ok) {
          setProcesos(data)
        } else {
          setError(data.error || "Error al cargar los procesos")
        }
      } catch (error) {
        setError("Error al conectar con el servidor")
      } finally {
        setLoading(false)
      }
    }

    fetchProcesos()
  }, [])

  const getTipoColor = (tipo: string) => {
    const colors: Record<string, string> = {
      ingreso: "bg-blue-100 text-blue-800",
      desarmado: "bg-purple-100 text-purple-800",
      reparacion: "bg-yellow-100 text-yellow-800",
      empapelado: "bg-green-100 text-green-800",
      pintura: "bg-pink-100 text-pink-800",
      mecanica: "bg-orange-100 text-orange-800",
      armado: "bg-indigo-100 text-indigo-800",
      control_calidad: "bg-teal-100 text-teal-800",
      entrega: "bg-emerald-100 text-emerald-800",
    }

    return colors[tipo] || "bg-gray-100 text-gray-800"
  }

  const formatTiempo = (minutos: number) => {
    const horas = Math.floor(minutos / 60)
    const mins = minutos % 60

    if (horas > 0) {
      return `${horas}h ${mins}m`
    }

    return `${mins}m`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-red-600 flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" /> Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (procesos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Procesos Técnicos</CardTitle>
          <CardDescription>No hay procesos registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <p>No se encontraron procesos técnicos. Haz clic en "Nuevo Proceso" para crear uno.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Procesos Técnicos</CardTitle>
        <CardDescription>Lista de procesos técnicos definidos</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Tiempo</TableHead>
              <TableHead>Orden</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {procesos.map((proceso) => (
              <TableRow key={proceso.id}>
                <TableCell className="font-medium">{proceso.nombre}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getTipoColor(proceso.tipo)}>
                    {proceso.tipo.charAt(0).toUpperCase() + proceso.tipo.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                  {formatTiempo(proceso.tiempo_estimado)}
                </TableCell>
                <TableCell>{proceso.orden}</TableCell>
                <TableCell className="max-w-xs truncate">{proceso.descripcion}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
