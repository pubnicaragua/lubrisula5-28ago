'use client'
import { Heading } from "@/components/ui/heading"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import TALLER_SERVICES, { TallerSolicitudType } from "@/services/TALLER_SERVICES"
import { useEffect, useState } from "react"
import ButtonAlert from "@/components/ui/ButtonAlert"

export default function SolicitudesPage() {

  const [State_DataTalleres, SetState_DataTalleres] = useState<TallerSolicitudType[]>([])
  const GET_TALLERES = async () => {
    const res = await TALLER_SERVICES.GET_ALL_TALLERES();
    console.log('Solicitudes de Talleres:', res)
    SetState_DataTalleres(res)

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
          State_DataTalleres.map((taller, index) => {
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {taller.nombre_taller}
                    <Badge variant="outline" className="bg-amber-100 text-black">
                      {taller.estado_solicitud}
                    </Badge>
                  </CardTitle>
                  <CardDescription>Solicitud recibida: {taller.fecha_solicitud}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p>{taller.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Telefono</p>
                      <p>{taller.telefono}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dirección</p>
                      <p>{taller.direccion}</p>
                    </div>
                    <div className="flex space-x-2 pt-4">
                      <ButtonAlert
                        LabelButton="Aprobar"
                        Onconfirm={() => console.log('Solicitud aprobada')}
                        title="Aprobar Solicitud de Taller"
                        description="Esta solicitud de taller sera aprobada y el taller podra operar. ¿seguro quedesea continuar?"
                        variantButton="default"
                      />
                      <ButtonAlert
                        LabelButton="Rechazar"
                        Onconfirm={() => console.log('Solicitud rechazada')}
                        title="Rechazar Solicitud de Taller"
                        description="Este solicitud de taller sera rechazada y no podra ser recuperada. ¿seguro quedesea continuar?"
                        variantButton="outline"
                      />

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
