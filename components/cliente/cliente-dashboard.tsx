"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuth } from "@/lib/supabase/auth"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Car, Calendar, FileText, History, LogOut } from "lucide-react"

export function ClienteDashboard() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard de Cliente</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => router.push("/cliente/citas/nueva")}>Nueva Cita</Button>
          <Button variant="destructive" onClick={handleSignOut} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => router.push("/cliente/vehiculos")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mis Vehículos</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Vehículos registrados</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => router.push("/cliente/citas")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mis Citas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Citas programadas</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => router.push("/cliente/cotizaciones")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cotizaciones</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Cotizaciones pendientes</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => router.push("/cliente/historial")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Historial</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Servicios completados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Próximas Citas</CardTitle>
            <CardDescription>Citas programadas para los próximos días</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { fecha: "15 Mayo, 2024", hora: "10:00 AM", servicio: "Mantenimiento" },
                { fecha: "22 Mayo, 2024", hora: "2:30 PM", servicio: "Revisión" },
              ].map((cita, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{cita.fecha}</p>
                    <p className="text-xs text-muted-foreground">
                      {cita.hora} - {cita.servicio}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <Button variant="outline" size="sm">
                      Ver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Estado de Vehículos</CardTitle>
            <CardDescription>Estado actual de sus vehículos en servicio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { vehiculo: "Toyota Corolla", placa: "ABC-123", estado: "En reparación", progreso: "50%" },
                { vehiculo: "Honda Civic", placa: "XYZ-789", estado: "En pintura", progreso: "75%" },
              ].map((vehiculo, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{vehiculo.vehiculo}</p>
                    <p className="text-xs text-muted-foreground">
                      {vehiculo.placa} - {vehiculo.estado}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {vehiculo.progreso}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ClienteDashboard
