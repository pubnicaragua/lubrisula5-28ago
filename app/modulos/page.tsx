"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import {
  Users,
  FileText,
  DollarSign,
  Wrench,
  BarChart3,
  PieChart,
  Calendar,
  CreditCard,
  User,
  PaintBucket,
  PenToolIcon as Tool,
  Truck,
  Shield,
  MessageSquare,
  Settings,
} from "lucide-react"

export default function ModulosPage() {
  const router = useRouter()
  const [selectedModules, setSelectedModules] = useState<string[]>(["gestion-clientes", "ordenes-servicio"])
  const [isLoading, setIsLoading] = useState(false)

  const modules = [
    {
      id: "gestion-clientes",
      title: "Gestión de Clientes",
      description: "Administra toda la información de tus clientes y sus vehículos.",
      icon: <Users className="h-10 w-10 text-primary" />,
    },
    {
      id: "ordenes-servicio",
      title: "Órdenes de Servicio",
      description: "Crea y gestiona órdenes de servicio con seguimiento en tiempo real.",
      icon: <FileText className="h-10 w-10 text-primary" />,
    },
    {
      id: "cotizaciones",
      title: "Cotizaciones",
      description: "Genera cotizaciones profesionales para tus clientes.",
      icon: <DollarSign className="h-10 w-10 text-primary" />,
    },
    {
      id: "inventario",
      title: "Inventario",
      description: "Controla tu inventario de repuestos y materiales.",
      icon: <Wrench className="h-10 w-10 text-primary" />,
    },
    {
      id: "kanban",
      title: "Tablero Kanban",
      description: "Visualiza el flujo de trabajo de tu taller.",
      icon: <BarChart3 className="h-10 w-10 text-primary" />,
    },
    {
      id: "reportes",
      title: "Reportes",
      description: "Genera reportes detallados sobre el rendimiento de tu taller.",
      icon: <PieChart className="h-10 w-10 text-primary" />,
    },
    {
      id: "calendario",
      title: "Calendario",
      description: "Programa citas y servicios con un calendario integrado.",
      icon: <Calendar className="h-10 w-10 text-primary" />,
    },
    {
      id: "facturacion",
      title: "Facturación",
      description: "Emite facturas electrónicas directamente desde la plataforma.",
      icon: <CreditCard className="h-10 w-10 text-primary" />,
    },
    {
      id: "tecnicos",
      title: "Gestión de Técnicos",
      description: "Administra tu equipo de técnicos, horarios y asignaciones.",
      icon: <User className="h-10 w-10 text-primary" />,
    },
    {
      id: "enderezado",
      title: "Enderezado",
      description: "Gestiona los procesos específicos de enderezado de carrocería.",
      icon: <Tool className="h-10 w-10 text-primary" />,
    },
    {
      id: "pintura",
      title: "Pintura",
      description: "Controla los procesos y materiales para el área de pintura.",
      icon: <PaintBucket className="h-10 w-10 text-primary" />,
    },
    {
      id: "flotas",
      title: "Gestión de Flotas",
      description: "Administra servicios para flotas de vehículos empresariales.",
      icon: <Truck className="h-10 w-10 text-primary" />,
    },
    {
      id: "seguros",
      title: "Seguros y Aseguradoras",
      description: "Gestiona relaciones con aseguradoras y procesos de reclamación.",
      icon: <Shield className="h-10 w-10 text-primary" />,
    },
    {
      id: "comunicacion",
      title: "Comunicación con Clientes",
      description: "Envía notificaciones automáticas sobre el estado de los servicios.",
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
    },
    {
      id: "configuracion",
      title: "Configuración",
      description: "Personaliza la plataforma según las necesidades de tu taller.",
      icon: <Settings className="h-10 w-10 text-primary" />,
    },
  ]

  const handleToggleModule = (moduleId: string) => {
    setSelectedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }

  const handleContinue = async () => {
    if (selectedModules.length === 0) {
      toast({
        title: "Selecciona al menos un módulo",
        description: "Debes seleccionar al menos un módulo para continuar",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulamos una petición a la API
    setTimeout(() => {
      toast({
        title: "Módulos activados correctamente",
        description: `Has activado ${selectedModules.length} módulos para tu taller`,
      })
      setIsLoading(false)
      router.push("/taller/dashboard")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Selecciona los módulos que deseas activar</h1>
          <p className="text-muted-foreground mb-8">
            Puedes seleccionar los módulos que necesitas ahora y agregar más en el futuro.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {modules.map((module) => (
              <Card
                key={module.id}
                className={`p-6 cursor-pointer transition-all hover:border-primary ${
                  selectedModules.includes(module.id) ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => handleToggleModule(module.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-3 flex-shrink-0">{module.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{module.title}</h3>
                      <Checkbox
                        checked={selectedModules.includes(module.id)}
                        onCheckedChange={() => handleToggleModule(module.id)}
                        className="h-5 w-5"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{selectedModules.length} módulos seleccionados</p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => router.back()}>
                Atrás
              </Button>
              <Button onClick={handleContinue} disabled={isLoading}>
                {isLoading ? "Activando módulos..." : "Continuar"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
