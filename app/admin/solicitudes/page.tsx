import { Heading } from "@/components/ui/heading"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function SolicitudesPage() {
  return (
    <div className="container mx-auto py-10">
      <Heading
        title="Solicitudes de Talleres"
        description="Administra las solicitudes de nuevos talleres para usar el sistema"
      />

      <div className="grid gap-4 mt-6">
        {/* Lista de ejemplo de solicitudes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Taller Mecánico Express
              <Badge variant="outline" className="bg-amber-100">
                Pendiente
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
                <p>+505 8765 4321</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Dirección</p>
                <p>Calle Principal, Managua, Nicaragua</p>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button variant="default">Aprobar</Button>
                <Button variant="outline">Rechazar</Button>
                <Button variant="outline">Ver detalles</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              AutoService Pro
              <Badge variant="outline" className="bg-amber-100">
                Pendiente
              </Badge>
            </CardTitle>
            <CardDescription>Solicitud enviada: 14/05/2023</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>info@autoservicepro.com</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p>+505 2222 1111</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Dirección</p>
                <p>Carretera Norte, Managua, Nicaragua</p>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button variant="default">Aprobar</Button>
                <Button variant="outline">Rechazar</Button>
                <Button variant="outline">Ver detalles</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
