import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function ConfirmacionRegistroPage() {
  return (
    <div className="container mx-auto py-20">
      <div className="flex flex-col items-center justify-center space-y-8 text-center max-w-3xl mx-auto">
        <CheckCircle className="h-24 w-24 text-green-500" />

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">¡Solicitud Enviada con Éxito!</h1>
          <p className="text-xl text-gray-500">Gracias por registrar tu taller en AutoFlowX</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border text-left w-full">
          <h2 className="text-xl font-semibold mb-4">Próximos pasos:</h2>
          <ol className="list-decimal pl-5 space-y-3">
            <li>
              <span className="font-medium">Revisión de solicitud:</span> Nuestro equipo revisará tu solicitud en un
              plazo de 24-48 horas hábiles.
            </li>
            <li>
              <span className="font-medium">Correo de confirmación:</span> Recibirás un correo electrónico con los
              detalles de tu cuenta y los siguientes pasos.
            </li>
            <li>
              <span className="font-medium">Configuración inicial:</span> Una vez aprobada tu solicitud, podrás acceder
              al sistema y configurar tu taller.
            </li>
            <li>
              <span className="font-medium">Capacitación:</span> Te ofreceremos una sesión de capacitación gratuita para
              que puedas aprovechar al máximo la plataforma.
            </li>
          </ol>
        </div>

        <p className="text-gray-500">
          Si tienes alguna pregunta, no dudes en contactarnos a{" "}
          <a href="mailto:soporte@autoflowx.com" className="text-blue-600 hover:underline">
            soporte@autoflowx.com
          </a>
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href="/">Volver al Inicio</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/login">Iniciar Sesión</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
