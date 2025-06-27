"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Database, HardDrive, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react"

interface BacklogItem {
  id: string
  modulo: string
  funcionalidad: string
  descripcion: string
  estado: "Completado" | "En Progreso" | "Pendiente" | "Bloqueado" | "No Iniciado"
  tipoAlmacenamiento: "Supabase" | "LocalStorage" | "Mixto" | "No Aplica"
  prioridad: "Alta" | "Media" | "Baja"
  estimacion: string
  dependencias: string
  notas: string
  responsable: string
  fechaEstimada: string
}

const backlogData: BacklogItem[] = [
  // AUTENTICACIÓN Y USUARIOS
  {
    id: "AUTH-001",
    modulo: "Autenticación",
    funcionalidad: "Login de usuarios",
    descripcion: "Sistema de login con email/password usando Supabase Auth",
    estado: "Completado",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Alta",
    estimacion: "2 días",
    dependencias: "Configuración Supabase",
    notas: "Implementado y funcionando",
    responsable: "Desarrollador",
    fechaEstimada: "Completado",
  },
  {
    id: "AUTH-002",
    modulo: "Autenticación",
    funcionalidad: "Registro de usuarios",
    descripcion: "Registro de nuevos usuarios con validación de email",
    estado: "Completado",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Alta",
    estimacion: "2 días",
    dependencias: "AUTH-001",
    notas: "Implementado y funcionando",
    responsable: "Desarrollador",
    fechaEstimada: "Completado",
  },
  {
    id: "AUTH-003",
    modulo: "Autenticación",
    funcionalidad: "Recuperación de contraseña",
    descripcion: "Sistema de reset de password por email",
    estado: "Completado",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Media",
    estimacion: "1 día",
    dependencias: "AUTH-001",
    notas: "Implementado y funcionando",
    responsable: "Desarrollador",
    fechaEstimada: "Completado",
  },
  {
    id: "AUTH-004",
    modulo: "Autenticación",
    funcionalidad: "Sistema de roles",
    descripcion: "Gestión de roles: superadmin, admin, taller, aseguradora, cliente",
    estado: "En Progreso",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Alta",
    estimacion: "3 días",
    dependencias: "AUTH-001, DB-001",
    notas: "Tablas creadas, falta sincronización completa",
    responsable: "Desarrollador",
    fechaEstimada: "2 días",
  },
  {
    id: "AUTH-005",
    modulo: "Autenticación",
    funcionalidad: "Middleware de autenticación",
    descripcion: "Protección de rutas según roles de usuario",
    estado: "En Progreso",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Alta",
    estimacion: "2 días",
    dependencias: "AUTH-004",
    notas: "Implementado parcialmente, necesita refinamiento",
    responsable: "Desarrollador",
    fechaEstimada: "3 días",
  },

  // BASE DE DATOS
  {
    id: "DB-001",
    modulo: "Base de Datos",
    funcionalidad: "Inicialización de tablas",
    descripcion: "Creación de todas las tablas necesarias en Supabase",
    estado: "En Progreso",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Alta",
    estimacion: "3 días",
    dependencias: "Configuración Supabase",
    notas: "Algunas tablas creadas, faltan columnas y políticas RLS",
    responsable: "Desarrollador",
    fechaEstimada: "2 días",
  },
  {
    id: "DB-002",
    modulo: "Base de Datos",
    funcionalidad: "Políticas RLS",
    descripcion: "Configuración de Row Level Security para todas las tablas",
    estado: "Pendiente",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Alta",
    estimacion: "2 días",
    dependencias: "DB-001",
    notas: "Necesario para seguridad de datos",
    responsable: "Desarrollador",
    fechaEstimada: "4 días",
  },
  {
    id: "DB-003",
    modulo: "Base de Datos",
    funcionalidad: "Migraciones",
    descripcion: "Scripts de migración para actualizaciones de esquema",
    estado: "Pendiente",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Media",
    estimacion: "1 día",
    dependencias: "DB-001",
    notas: "Para mantenimiento futuro",
    responsable: "Desarrollador",
    fechaEstimada: "5 días",
  },

  // CLIENTES
  {
    id: "CLI-001",
    modulo: "Clientes",
    funcionalidad: "CRUD de clientes",
    descripcion: "Crear, leer, actualizar y eliminar clientes",
    estado: "Completado",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Alta",
    estimacion: "3 días",
    dependencias: "DB-001, AUTH-001",
    notas: "Implementado y funcionando",
    responsable: "Desarrollador",
    fechaEstimada: "Completado",
  },
  {
    id: "CLI-002",
    modulo: "Clientes",
    funcionalidad: "Búsqueda y filtros",
    descripcion: "Sistema de búsqueda por nombre, teléfono, email",
    estado: "Completado",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Media",
    estimacion: "1 día",
    dependencias: "CLI-001",
    notas: "Implementado y funcionando",
    responsable: "Desarrollador",
    fechaEstimada: "Completado",
  },
  {
    id: "CLI-003",
    modulo: "Clientes",
    funcionalidad: "Historial de servicios",
    descripcion: "Ver historial completo de servicios por cliente",
    estado: "Pendiente",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Media",
    estimacion: "2 días",
    dependencias: "CLI-001, ORD-001",
    notas: "Requiere integración con órdenes",
    responsable: "Desarrollador",
    fechaEstimada: "7 días",
  },

  // VEHÍCULOS
  {
    id: "VEH-001",
    modulo: "Vehículos",
    funcionalidad: "CRUD de vehículos",
    descripcion: "Gestión completa de vehículos por cliente",
    estado: "Completado",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Alta",
    estimacion: "3 días",
    dependencias: "CLI-001, DB-001",
    notas: "Implementado y funcionando",
    responsable: "Desarrollador",
    fechaEstimada: "Completado",
  },
  {
    id: "VEH-002",
    modulo: "Vehículos",
    funcionalidad: "Hoja de ingreso",
    descripcion: "Formulario de ingreso de vehículo al taller",
    estado: "Completado",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Alta",
    estimacion: "2 días",
    dependencias: "VEH-001",
    notas: "Implementado con diagrama de vehículo",
    responsable: "Desarrollador",
    fechaEstimada: "Completado",
  },
  {
    id: "VEH-003",
    modulo: "Vehículos",
    funcionalidad: "Inspección detallada",
    descripcion: "Sistema de inspección con fotos y comentarios",
    estado: "Completado",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Alta",
    estimacion: "3 días",
    dependencias: "VEH-002",
    notas: "Implementado con múltiples vistas",
    responsable: "Desarrollador",
    fechaEstimada: "Completado",
  },
  {
    id: "VEH-004",
    modulo: "Vehículos",
    funcionalidad: "Historial de mantenimiento",
    descripcion: "Registro histórico de todos los servicios",
    estado: "Pendiente",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Media",
    estimacion: "2 días",
    dependencias: "VEH-001, ORD-001",
    notas: "Requiere integración con órdenes",
    responsable: "Desarrollador",
    fechaEstimada: "8 días",
  },

  // COTIZACIONES
  {
    id: "COT-001",
    modulo: "Cotizaciones",
    funcionalidad: "CRUD de cotizaciones",
    descripcion: "Sistema completo de gestión de cotizaciones",
    estado: "Completado",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Alta",
    estimacion: "4 días",
    dependencias: "CLI-001, VEH-001, DB-001",
    notas: "Implementado recientemente",
    responsable: "Desarrollador",
    fechaEstimada: "Completado",
  },
  {
    id: "COT-002",
    modulo: "Cotizaciones",
    funcionalidad: "Formulario de nueva cotización",
    descripcion: "Formulario completo para crear cotizaciones",
    estado: "Completado",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Alta",
    estimacion: "3 días",
    dependencias: "COT-001",
    notas: "Implementado recientemente",
    responsable: "Desarrollador",
    fechaEstimada: "Completado",
  },
  {
    id: "COT-003",
    modulo: "Cotizaciones",
    funcionalidad: "Aprobación/Rechazo",
    descripcion: "Sistema de cambio de estados de cotización",
    estado: "Completado",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Alta",
    estimacion: "2 días",
    dependencias: "COT-001",
    notas: "Implementado recientemente",
    responsable: "Desarrollador",
    fechaEstimada: "Completado",
  },
  {
    id: "COT-004",
    modulo: "Cotizaciones",
    funcionalidad: "Exportar a PDF",
    descripcion: "Generar PDF de cotizaciones para envío",
    estado: "Pendiente",
    tipoAlmacenamiento: "No Aplica",
    prioridad: "Media",
    estimacion: "2 días",
    dependencias: "COT-001",
    notas: "Funcionalidad de impresión básica implementada",
    responsable: "Desarrollador",
    fechaEstimada: "6 días",
  },
  {
    id: "COT-005",
    modulo: "Cotizaciones",
    funcionalidad: "Envío por email",
    descripcion: "Sistema de envío automático de cotizaciones",
    estado: "Pendiente",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Media",
    estimacion: "2 días",
    dependencias: "COT-004",
    notas: "Requiere configuración de email",
    responsable: "Desarrollador",
    fechaEstimada: "8 días",
  },

  // ÓRDENES DE TRABAJO
  {
    id: "ORD-001",
    modulo: "Órdenes",
    funcionalidad: "CRUD de órdenes",
    descripcion: "Sistema de gestión de órdenes de trabajo",
    estado: "En Progreso",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Alta",
    estimacion: "4 días",
    dependencias: "COT-001, DB-001",
    notas: "Estructura básica implementada",
    responsable: "Desarrollador",
    fechaEstimada: "5 días",
  },
  {
    id: "ORD-002",
    modulo: "Órdenes",
    funcionalidad: "Conversión desde cotización",
    descripcion: "Convertir cotizaciones aprobadas en órdenes",
    estado: "Pendiente",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Alta",
    estimacion: "2 días",
    dependencias: "ORD-001, COT-003",
    notas: "Lógica básica implementada",
    responsable: "Desarrollador",
    fechaEstimada: "7 días",
  },
  {
    id: "ORD-003",
    modulo: "Órdenes",
    funcionalidad: "Seguimiento de progreso",
    descripcion: "Sistema de tracking del progreso de reparación",
    estado: "Pendiente",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Alta",
    estimacion: "3 días",
    dependencias: "ORD-001, KAN-001",
    notas: "Integrar con Kanban",
    responsable: "Desarrollador",
    fechaEstimada: "10 días",
  },

  // KANBAN
  {
    id: "KAN-001",
    modulo: "Kanban",
    funcionalidad: "Tablero básico",
    descripcion: "Tablero Kanban para gestión visual de trabajos",
    estado: "Completado",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Alta",
    estimacion: "3 días",
    dependencias: "DB-001",
    notas: "Implementado y funcionando",
    responsable: "Desarrollador",
    fechaEstimada: "Completado",
  },
  {
    id: "KAN-002",
    modulo: "Kanban",
    funcionalidad: "Drag & Drop",
    descripcion: "Funcionalidad de arrastrar y soltar tarjetas",
    estado: "Completado",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Media",
    estimacion: "2 días",
    dependencias: "KAN-001",
    notas: "Implementado con react-beautiful-dnd",
    responsable: "Desarrollador",
    fechaEstimada: "Completado",
  },
  {
    id: "KAN-003",
    modulo: "Kanban",
    funcionalidad: "Personalización de columnas",
    descripcion: "Permitir crear/editar/eliminar columnas",
    estado: "Pendiente",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Baja",
    estimacion: "2 días",
    dependencias: "KAN-001",
    notas: "Funcionalidad avanzada",
    responsable: "Desarrollador",
    fechaEstimada: "15 días",
  },

  // INVENTARIO
  {
    id: "INV-001",
    modulo: "Inventario",
    funcionalidad: "CRUD de materiales",
    descripcion: "Gestión de materiales y repuestos",
    estado: "En Progreso",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Media",
    estimacion: "3 días",
    dependencias: "DB-001",
    notas: "Estructura básica implementada",
    responsable: "Desarrollador",
    fechaEstimada: "6 días",
  },
  {
    id: "INV-002",
    modulo: "Inventario",
    funcionalidad: "Control de stock",
    descripcion: "Sistema de alertas por stock bajo",
    estado: "Pendiente",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Media",
    estimacion: "2 días",
    dependencias: "INV-001",
    notas: "Requiere sistema de notificaciones",
    responsable: "Desarrollador",
    fechaEstimada: "8 días",
  },
  {
    id: "INV-003",
    modulo: "Inventario",
    funcionalidad: "Movimientos de inventario",
    descripcion: "Registro de entradas y salidas de materiales",
    estado: "Pendiente",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Media",
    estimacion: "3 días",
    dependencias: "INV-001",
    notas: "Para trazabilidad completa",
    responsable: "Desarrollador",
    fechaEstimada: "9 días",
  },

  // FACTURACIÓN
  {
    id: "FAC-001",
    modulo: "Facturación",
    funcionalidad: "Generación de facturas",
    descripcion: "Sistema de facturación desde órdenes completadas",
    estado: "Pendiente",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Alta",
    estimacion: "4 días",
    dependencias: "ORD-001, DB-001",
    notas: "Crítico para operación",
    responsable: "Desarrollador",
    fechaEstimada: "12 días",
  },
  {
    id: "FAC-002",
    modulo: "Facturación",
    funcionalidad: "Control de pagos",
    descripcion: "Registro y seguimiento de pagos",
    estado: "Pendiente",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Alta",
    estimacion: "3 días",
    dependencias: "FAC-001",
    notas: "Para control financiero",
    responsable: "Desarrollador",
    fechaEstimada: "15 días",
  },

  // REPORTES
  {
    id: "REP-001",
    modulo: "Reportes",
    funcionalidad: "Dashboard principal",
    descripcion: "Dashboard con métricas clave del taller",
    estado: "En Progreso",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Media",
    estimacion: "3 días",
    dependencias: "Múltiples módulos",
    notas: "Estructura básica implementada",
    responsable: "Desarrollador",
    fechaEstimada: "8 días",
  },
  {
    id: "REP-002",
    modulo: "Reportes",
    funcionalidad: "Reportes financieros",
    descripcion: "Reportes de ingresos, gastos y rentabilidad",
    estado: "Pendiente",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Media",
    estimacion: "4 días",
    dependencias: "FAC-001, FAC-002",
    notas: "Para análisis de negocio",
    responsable: "Desarrollador",
    fechaEstimada: "20 días",
  },

  // EQUIPO/TÉCNICOS
  {
    id: "TEC-001",
    modulo: "Técnicos",
    funcionalidad: "CRUD de técnicos",
    descripcion: "Gestión de personal técnico",
    estado: "En Progreso",
    tipoAlmacenamiento: "LocalStorage",
    prioridad: "Media",
    estimacion: "2 días",
    dependencias: "DB-001",
    notas: "Actualmente usa localStorage, migrar a Supabase",
    responsable: "Desarrollador",
    fechaEstimada: "4 días",
  },
  {
    id: "TEC-002",
    modulo: "Técnicos",
    funcionalidad: "Asignación de trabajos",
    descripcion: "Sistema de asignación de órdenes a técnicos",
    estado: "Pendiente",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Media",
    estimacion: "2 días",
    dependencias: "TEC-001, ORD-001",
    notas: "Para optimizar carga de trabajo",
    responsable: "Desarrollador",
    fechaEstimada: "12 días",
  },

  // CONFIGURACIÓN
  {
    id: "CFG-001",
    modulo: "Configuración",
    funcionalidad: "Configuración del taller",
    descripcion: "Datos básicos del taller (nombre, dirección, etc.)",
    estado: "Pendiente",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Baja",
    estimacion: "1 día",
    dependencias: "DB-001",
    notas: "Para personalización",
    responsable: "Desarrollador",
    fechaEstimada: "10 días",
  },
  {
    id: "CFG-002",
    modulo: "Configuración",
    funcionalidad: "Configuración de precios",
    descripcion: "Tarifas de mano de obra y materiales",
    estado: "Pendiente",
    tipoAlmacenamiento: "Supabase",
    prioridad: "Media",
    estimacion: "2 días",
    dependencias: "CFG-001",
    notas: "Para cálculos automáticos",
    responsable: "Desarrollador",
    fechaEstimada: "12 días",
  },
]

export function ProjectBacklog() {
  const [selectedTab, setSelectedTab] = useState("resumen")

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case "Completado":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "En Progreso":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "Pendiente":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "Bloqueado":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (estado: string) => {
    const variants: Record<string, any> = {
      Completado: "default",
      "En Progreso": "secondary",
      Pendiente: "outline",
      Bloqueado: "destructive",
      "No Iniciado": "outline",
    }
    return <Badge variant={variants[estado] || "outline"}>{estado}</Badge>
  }

  const getPriorityBadge = (prioridad: string) => {
    const colors: Record<string, string> = {
      Alta: "bg-red-100 text-red-800",
      Media: "bg-yellow-100 text-yellow-800",
      Baja: "bg-green-100 text-green-800",
    }
    return <Badge className={colors[prioridad]}>{prioridad}</Badge>
  }

  const getStorageBadge = (tipo: string) => {
    const icons: Record<string, any> = {
      Supabase: <Database className="h-3 w-3 mr-1" />,
      LocalStorage: <HardDrive className="h-3 w-3 mr-1" />,
      Mixto: <AlertTriangle className="h-3 w-3 mr-1" />,
      "No Aplica": null,
    }
    const colors: Record<string, string> = {
      Supabase: "bg-green-100 text-green-800",
      LocalStorage: "bg-orange-100 text-orange-800",
      Mixto: "bg-yellow-100 text-yellow-800",
      "No Aplica": "bg-gray-100 text-gray-800",
    }
    return (
      <Badge className={colors[tipo]}>
        {icons[tipo]}
        {tipo}
      </Badge>
    )
  }

  const stats = {
    total: backlogData.length,
    completado: backlogData.filter((item) => item.estado === "Completado").length,
    enProgreso: backlogData.filter((item) => item.estado === "En Progreso").length,
    pendiente: backlogData.filter((item) => item.estado === "Pendiente").length,
    bloqueado: backlogData.filter((item) => item.estado === "Bloqueado").length,
    supabase: backlogData.filter((item) => item.tipoAlmacenamiento === "Supabase").length,
    localStorage: backlogData.filter((item) => item.tipoAlmacenamiento === "LocalStorage").length,
    prioridadAlta: backlogData.filter((item) => item.prioridad === "Alta").length,
  }

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Módulo",
      "Funcionalidad",
      "Descripción",
      "Estado",
      "Tipo Almacenamiento",
      "Prioridad",
      "Estimación",
      "Dependencias",
      "Notas",
      "Responsable",
      "Fecha Estimada",
    ]

    const csvContent = [
      headers.join(","),
      ...backlogData.map((item) =>
        [
          item.id,
          `"${item.modulo}"`,
          `"${item.funcionalidad}"`,
          `"${item.descripcion}"`,
          item.estado,
          item.tipoAlmacenamiento,
          item.prioridad,
          `"${item.estimacion}"`,
          `"${item.dependencias}"`,
          `"${item.notas}"`,
          item.responsable,
          item.fechaEstimada,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "taller-automotriz-backlog.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Backlog del Proyecto - Taller Automotriz</h1>
        <Button onClick={exportToCSV}>
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Items</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.completado}</div>
            <div className="text-sm text-muted-foreground">Completados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.enProgreso}</div>
            <div className="text-sm text-muted-foreground">En Progreso</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendiente}</div>
            <div className="text-sm text-muted-foreground">Pendientes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.supabase}</div>
            <div className="text-sm text-muted-foreground">Supabase</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.localStorage}</div>
            <div className="text-sm text-muted-foreground">LocalStorage</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.prioridadAlta}</div>
            <div className="text-sm text-muted-foreground">Prioridad Alta</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{Math.round((stats.completado / stats.total) * 100)}%</div>
            <div className="text-sm text-muted-foreground">Progreso</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
          <TabsTrigger value="localStorage">LocalStorage</TabsTrigger>
          <TabsTrigger value="prioridad">Alta Prioridad</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen">
          <Card>
            <CardHeader>
              <CardTitle>Resumen por Módulo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from(new Set(backlogData.map((item) => item.modulo))).map((modulo) => {
                  const items = backlogData.filter((item) => item.modulo === modulo)
                  const completados = items.filter((item) => item.estado === "Completado").length
                  const total = items.length
                  const progreso = Math.round((completados / total) * 100)

                  return (
                    <div key={modulo} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{modulo}</h3>
                        <p className="text-sm text-muted-foreground">
                          {completados}/{total} completados ({progreso}%)
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {items.some((item) => item.tipoAlmacenamiento === "LocalStorage") && (
                          <Badge className="bg-orange-100 text-orange-800">
                            <HardDrive className="h-3 w-3 mr-1" />
                            LocalStorage
                          </Badge>
                        )}
                        {items.some((item) => item.prioridad === "Alta") && (
                          <Badge className="bg-red-100 text-red-800">Alta Prioridad</Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="todos">
          <Card>
            <CardHeader>
              <CardTitle>Backlog Completo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Módulo</TableHead>
                      <TableHead>Funcionalidad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Almacenamiento</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Estimación</TableHead>
                      <TableHead>Fecha Est.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backlogData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">{item.id}</TableCell>
                        <TableCell>{item.modulo}</TableCell>
                        <TableCell>{item.funcionalidad}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(item.estado)}
                            {getStatusBadge(item.estado)}
                          </div>
                        </TableCell>
                        <TableCell>{getStorageBadge(item.tipoAlmacenamiento)}</TableCell>
                        <TableCell>{getPriorityBadge(item.prioridad)}</TableCell>
                        <TableCell>{item.estimacion}</TableCell>
                        <TableCell>{item.fechaEstimada}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pendientes">
          <Card>
            <CardHeader>
              <CardTitle>Items Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Módulo</TableHead>
                      <TableHead>Funcionalidad</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Dependencias</TableHead>
                      <TableHead>Estimación</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backlogData
                      .filter((item) => item.estado === "Pendiente")
                      .map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-sm">{item.id}</TableCell>
                          <TableCell>{item.modulo}</TableCell>
                          <TableCell>{item.funcionalidad}</TableCell>
                          <TableCell className="max-w-xs truncate">{item.descripcion}</TableCell>
                          <TableCell>{getPriorityBadge(item.prioridad)}</TableCell>
                          <TableCell className="max-w-xs truncate">{item.dependencias}</TableCell>
                          <TableCell>{item.estimacion}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localStorage">
          <Card>
            <CardHeader>
              <CardTitle>Items que usan LocalStorage</CardTitle>
              <div className="text-sm text-muted-foreground">
                Estos items necesitan ser migrados a Supabase para persistencia adecuada
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Módulo</TableHead>
                      <TableHead>Funcionalidad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Notas</TableHead>
                      <TableHead>Estimación Migración</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backlogData
                      .filter((item) => item.tipoAlmacenamiento === "LocalStorage")
                      .map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-sm">{item.id}</TableCell>
                          <TableCell>{item.modulo}</TableCell>
                          <TableCell>{item.funcionalidad}</TableCell>
                          <TableCell>{getStatusBadge(item.estado)}</TableCell>
                          <TableCell className="max-w-xs">{item.notas}</TableCell>
                          <TableCell>{item.estimacion}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prioridad">
          <Card>
            <CardHeader>
              <CardTitle>Items de Alta Prioridad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Módulo</TableHead>
                      <TableHead>Funcionalidad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Dependencias</TableHead>
                      <TableHead>Fecha Estimada</TableHead>
                      <TableHead>Notas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backlogData
                      .filter((item) => item.prioridad === "Alta")
                      .sort((a, b) => {
                        const estadoOrder = { Bloqueado: 0, "En Progreso": 1, Pendiente: 2, Completado: 3 }
                        return (
                          (estadoOrder[a.estado as keyof typeof estadoOrder] || 4) -
                          (estadoOrder[b.estado as keyof typeof estadoOrder] || 4)
                        )
                      })
                      .map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-sm">{item.id}</TableCell>
                          <TableCell>{item.modulo}</TableCell>
                          <TableCell>{item.funcionalidad}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(item.estado)}
                              {getStatusBadge(item.estado)}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{item.dependencias}</TableCell>
                          <TableCell>{item.fechaEstimada}</TableCell>
                          <TableCell className="max-w-xs truncate">{item.notas}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
