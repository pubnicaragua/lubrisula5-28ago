"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Save } from "lucide-react"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface MiembroEquipo {
  id: number
  nombre: string
  cargo: string
  especialidad: string
  telefono: string
  email: string
  fechaContratacion: string
  estado: "Activo" | "Inactivo" | "De Vacaciones" | "Permiso"
  horasTrabajadas: number
  ordenesCompletadas: number
}

interface HorariosMiembroProps {
  miembro: MiembroEquipo
}

export function HorariosMiembro({ miembro }: HorariosMiembroProps) {
  const [semana, setSemana] = useState("actual")

  // Datos de ejemplo para horarios
  const horarios = {
    lunes: { entrada: "08:00", salida: "17:00", estado: "Trabajando" },
    martes: { entrada: "08:00", salida: "17:00", estado: "Trabajando" },
    miercoles: { entrada: "08:00", salida: "17:00", estado: "Trabajando" },
    jueves: { entrada: "08:00", salida: "17:00", estado: "Trabajando" },
    viernes: { entrada: "08:00", salida: "13:00", estado: "Medio Día" },
    sabado: { entrada: "N/A", salida: "N/A", estado: "Descanso" },
    domingo: { entrada: "N/A", salida: "N/A", estado: "Descanso" },
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Trabajando":
        return <Badge className="bg-green-500 hover:bg-green-600">{estado}</Badge>
      case "Descanso":
        return <Badge className="bg-gray-500 hover:bg-gray-600">{estado}</Badge>
      case "Medio Día":
        return <Badge className="bg-blue-500 hover:bg-blue-600">{estado}</Badge>
      case "Permiso":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">{estado}</Badge>
      default:
        return <Badge>{estado}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Horarios de {miembro.nombre}</h2>
        <div className="flex space-x-2">
          <Select value={semana} onValueChange={setSemana}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar semana" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="anterior">Semana Anterior</SelectItem>
              <SelectItem value="actual">Semana Actual</SelectItem>
              <SelectItem value="proxima">Próxima Semana</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm">
            <Calendar className="mr-2 h-4 w-4" /> Ver Calendario
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Horario Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {Object.entries(horarios).map(([dia, horario], index) => (
              <Card key={index} className="p-2">
                <CardHeader className="p-2 pb-0">
                  <CardTitle className="text-sm font-medium text-center capitalize">{dia}</CardTitle>
                </CardHeader>
                <CardContent className="p-2 text-center">
                  <div className="space-y-2">
                    <div>{getEstadoBadge(horario.estado)}</div>
                    {horario.entrada !== "N/A" && (
                      <>
                        <div className="text-xs text-muted-foreground">Entrada</div>
                        <div className="text-sm font-medium">{horario.entrada}</div>
                        <div className="text-xs text-muted-foreground">Salida</div>
                        <div className="text-sm font-medium">{horario.salida}</div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Asignar Horario Especial</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <input
                type="date"
                id="fecha"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select defaultValue="Trabajando">
                <SelectTrigger id="estado">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Trabajando">Trabajando</SelectItem>
                  <SelectItem value="Descanso">Descanso</SelectItem>
                  <SelectItem value="Medio Día">Medio Día</SelectItem>
                  <SelectItem value="Permiso">Permiso</SelectItem>
                  <SelectItem value="Vacaciones">Vacaciones</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Save className="mr-2 h-4 w-4" /> Guardar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Horas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Horas Trabajadas (Mes Actual)</div>
                <div className="text-2xl font-bold">{miembro.horasTrabajadas} horas</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Horas Extra</div>
                <div className="text-2xl font-bold">8 horas</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Días Trabajados</div>
                <div className="text-2xl font-bold">20 días</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Próximo Descanso</div>
                <div className="text-2xl font-bold">2023-04-22</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
