import { DatabaseStatus } from "@/components/admin/database-status"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function DatabasePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Administración de Base de Datos</h2>
      </div>

      <Alert variant="warning" className="bg-amber-50 border-amber-300 mb-6">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>¡IMPORTANTE!</strong> Si estás viendo errores del tipo &quot;relation does not exist&quot;, es
          necesario inicializar la base de datos primero.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        <DatabaseStatus />

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>Herramientas de Base de Datos</CardTitle>
            </div>
            <CardDescription>Utilidades adicionales para la gestión de la base de datos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/admin/test-data">
                <Button variant="outline" className="w-full">
                  Insertar Datos de Prueba
                </Button>
              </Link>
              <Link href="/admin/qa-check">
                <Button variant="outline" className="w-full">
                  Verificación QA
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
