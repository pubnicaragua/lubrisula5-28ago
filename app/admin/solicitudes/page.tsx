'use client'
import { Heading } from "@/components/ui/heading"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import TALLER_SERVICES, { TallerSolicitudType } from "@/services/TALLER_SERVICES.SERVICE"
import { useEffect, useState } from "react"
import ButtonAlert from "@/components/ui/ButtonAlert"
import { Toast } from "@radix-ui/react-toast";
export default function SolicitudesPage() {

  const [State_DataTalleres, SetState_DataTalleres] = useState<TallerSolicitudType[]>([])
  const [State_Toast, SetState_Toast] = useState<boolean>(false)
  const GET_TALLERES = async () => {
    const res = await TALLER_SERVICES.GET_ALL_TALLERES();
    SetState_DataTalleres(res)
  }
  const APROBAR_SOLICITUD = async (id: number) => {
    await TALLER_SERVICES.APROBAR_SOLICITUD(id)
    SetState_DataTalleres(prev => prev.map(taller => taller.id === id ? { ...taller, estado: 'aprobada' } : taller))
  };
  const RECHAZAR_SOLICITUD = async (id: number) => {
    await TALLER_SERVICES.RECHAZAR_SOLICITUD(id)
    SetState_DataTalleres(prev => prev.map(taller => taller.id === id ? { ...taller, estado: 'rechazada' } : taller))
  }
  const FN_RENDER_ESTADO = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <Badge variant="outline" className="bg-yellow-300 text-black">Pendiente</Badge>
      case 'aprobada':
        return <Badge variant="outline" className="bg-green-300 text-black">Aprobada</Badge>
      case 'rechazada':
        return <Badge variant="outline" className="bg-red-300 text-black">Rechazada</Badge>
      default:
        return <Badge variant="outline" className="bg-gray-300 text-black">Desconocido</Badge>
    }
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
                    {FN_RENDER_ESTADO(taller.estado)}
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
                        Onconfirm={() => APROBAR_SOLICITUD(taller.id)}
                        title="Aprobar Solicitud de Taller✅"
                        description="Esta solicitud de taller sera aprobada y el taller podra operar. ¿seguro quedesea continuar?"
                        variantButton="default"
                      />
                      <ButtonAlert
                        LabelButton="Rechazar"
                        Onconfirm={() => RECHAZAR_SOLICITUD(taller.id)}
                        title="Rechazar Solicitud de Taller❌"
                        description="Este solicitud de taller sera rechazada y no podra ser recuperada. ¿seguro quedesea continuar?"
                        variantButton="outline"
                      />

                      {/* <Button variant="outline">Ver detalles</Button> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        }

      </div>
      <Toast open={State_Toast} onOpenChange={(set) => SetState_Toast(set)}>
        <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg">
          <div>
            <h3 className="text-lg font-semibold">Notificación</h3>
            <p className="text-sm text-gray-500">Solicitud aprobada exitosamente.</p>
          </div>
          <Button variant="secondary" onClick={() => console.log('Cerrar notificación')}>Cerrar</Button>
        </div>
      </Toast>
    </div>
  )
}
