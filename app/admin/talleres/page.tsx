import { Badge } from "@/components/ui/badge"
import { Heading } from "@/components/ui/heading"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseAdmin } from "@/lib/supabase/admin-client"
import { MapPin, Mail, Phone, User, CalendarDays, CheckCircle } from "lucide-react"

export const revalidate = 0 // Ensure data is always fresh

type TallerCompleto = {
  id: string | null
  nombre: string | null
  direccion: string | null
  telefono: string | null
  email: string | null
  descripcion: string | null
  gerente_id: string | null
  fecha_registro_taller: string | null
  estado_solicitud: "pendiente" | "aprobada" | "rechazada" | null
  solicitud_enviada: string | null // Renamed from fecha_solicitud_original
}

export default async function AdminTalleresPage() {
  const { data: talleres, error } = await supabaseAdmin
    .from("talleres_completos") // Usar la nueva vista
    .select("*")
    .order("fecha_registro_taller", { ascending: false })

  if (error) {
    console.error("Error fetching talleres:", error)
    return (
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <Heading
          title="Talleres Registrados"
          description="Gestiona los talleres que han sido aprobados y están activos en la plataforma."
        />
        <p className="text-red-500">Error al cargar los talleres: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <Heading
        title="Talleres Registrados"
        description="Gestiona los talleres que han sido aprobados y están activos en la plataforma."
      />

      <div className="grid gap-4 mt-6">
        {talleres && talleres.length > 0 ? (
          talleres.map((taller: TallerCompleto) => (
            <Card key={taller.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  {taller.nombre}
                  {taller.estado_solicitud === "aprobada" && (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" /> Aprobado
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Registrado: {new Date(taller.fecha_registro_taller || "").toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {taller.direccion && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{taller.direccion}</span>
                  </div>
                )}
                {taller.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{taller.email}</span>
                  </div>
                )}
                {taller.telefono && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{taller.telefono}</span>
                  </div>
                )}
                {taller.gerente_id && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>ID Gerente: {taller.gerente_id}</span>
                  </div>
                )}
                {taller.solicitud_enviada && (
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarDays className="h-4 w-4 text-gray-500" />
                    <span>Solicitud enviada: {new Date(taller.solicitud_enviada).toLocaleDateString()}</span>
                  </div>
                )}
                {taller.descripcion && (
                  <div className="text-sm text-muted-foreground mt-2">
                    <span className="font-medium">Descripción:</span> {taller.descripcion}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">No hay talleres registrados aún.</div>
        )}
      </div>
    </div>
  )
}
