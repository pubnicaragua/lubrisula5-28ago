import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import EnvChecker from "./env-checker"

export const metadata = {
  title: "Diagnóstico de Configuración",
  description: "Herramienta para diagnosticar problemas de configuración",
}

export default function DiagnosticoPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Diagnóstico de Configuración</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Variables de Entorno</CardTitle>
            <CardDescription>
              Verifica si las variables de entorno necesarias están configuradas correctamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Cargando...</div>}>
              <EnvChecker />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
