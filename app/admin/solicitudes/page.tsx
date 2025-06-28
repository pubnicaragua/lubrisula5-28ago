'use client'
import { Heading } from "@/components/ui/heading"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import TALLER_SERVICES, { TallerType } from "@/services/TALLER_SERVICES"
import { useEffect, useState } from "react"

export default function SolicitudesPage() {

  const [State_DataTalleres, SetState_DataTalleres] = useState<TallerType[]>([])
  const GET_TALLERES = async () => {
    const res = await TALLER_SERVICES.GET_ALL_TALLERES()
    console.log(res)
    SetState_DataTalleres(res)
    console.log(res)
  }
  useEffect(() => {
    GET_TALLERES()
  }, [])
  return (
    <div className="container mx-auto h-full overflow-auto">
      <Heading
        title="Solicitudes de Talleres"
        description="Administra las solicitudes de nuevos talleres para usar el sistema"
      />

      <div className="grid gap-4 mt-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        {
          State_DataTalleres.map(taller => {
            return (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {taller.nombre}
                    <Badge variant="outline" className="bg-amber-100">
                      pendiente
                    </Badge>
                  </CardTitle>
                  <CardDescription>Solicitud enviada: 12/05/2023</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p>taller.express@ejemplo.com</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <p>{taller.telefono}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dirección</p>
                      <p>{taller.direccion}</p>
                    </div>
                    <div className="flex space-x-2 pt-4">
                      <Button variant="default" onClick={()=>alert('aprobar')}>Aprobar</Button>
                      <Button variant="outline">Rechazar</Button>
                      <Button variant="outline">Ver detalles</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        }

      </div>
    </div>
  )
}
