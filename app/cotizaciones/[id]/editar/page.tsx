import { NuevaCotizacionForm } from "@/components/cotizaciones/nueva-cotizacion-form"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getQuotationById } from "@/lib/actions/quotations"
import { redirect } from "next/navigation"

interface EditarCotizacionPageProps {
  params: {
    id: string
  }
}

export default async function EditarCotizacionPage({ params }: EditarCotizacionPageProps) {
  // Obtener la cotización desde el servidor
  const { success, data, error } = await getQuotationById(params.id)

  if (!success || !data) {
    redirect("/cotizaciones")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <MainNav />
        <div className="ml-auto flex items-center gap-4">
          <ModeToggle />
          <UserNav />
        </div>
      </header>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Editar Cotización</CardTitle>
            <CardDescription>Modifica los detalles de la cotización #{data.quotation_number}</CardDescription>
          </CardHeader>
          <CardContent>
            <NuevaCotizacionForm cotizacionExistente={data} onSuccess={() => redirect(`/cotizaciones/${params.id}`)} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
