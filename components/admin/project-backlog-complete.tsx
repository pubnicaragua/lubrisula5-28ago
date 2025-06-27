"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Download,
  HardDrive,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  CheckCircle,
  Circle,
  PlayCircle,
  XCircle,
  Pause,
} from "lucide-react"

interface BacklogItem {
  id: string
  title: string
  description: string
  category: string
  priority: "Critical" | "High" | "Medium" | "Low"
  status: "Completed" | "In Progress" | "Pending" | "Blocked"
  estimatedHours: number
  actualHours: number
  assignee: string
  dependencies: string[]
  files: string[]
  linesOfCode: number
  taskType: "Feature" | "Bug" | "Enhancement" | "Refactor" | "Documentation" | "Testing" | "Migration" | "Configuration"
  businessImpact: "High" | "Medium" | "Low"
  technicalRisk: "High" | "Medium" | "Low"
  storageType: "Supabase" | "LocalStorage" | "SessionStorage" | "Memory" | "File" | "API"
  testingRequired: boolean
  documentationRequired: boolean
  tags: string[]
  createdDate: string
  dueDate: string
  completedDate?: string
  notes: string
}

// Datos completos del backlog
const backlogData: BacklogItem[] = [
  // AUTENTICACIÓN Y AUTORIZACIÓN (AUTH)
  {
    id: "AUTH-001",
    title: "Sistema de Autenticación con Supabase",
    description:
      "Implementación completa del sistema de autenticación usando Supabase Auth con manejo de sesiones, roles y permisos. Incluye login, registro, recuperación de contraseña y gestión de roles.",
    category: "Autenticación",
    priority: "Critical",
    status: "Completed",
    estimatedHours: 40,
    actualHours: 45,
    assignee: "Frontend Developer",
    dependencies: ["DB-001", "CONFIG-001"],
    files: [
      "lib/supabase/auth.tsx",
      "components/auth/auth-provider.tsx",
      "components/auth/login-form.tsx",
      "components/auth/register-form.tsx",
      "components/auth/recuperar-password-form.tsx",
      "app/auth/login/page.tsx",
      "app/auth/registro/page.tsx",
      "app/auth/recuperar-password/page.tsx",
    ],
    linesOfCode: 1250,
    taskType: "Feature",
    businessImpact: "High",
    technicalRisk: "Medium",
    storageType: "Supabase",
    testingRequired: true,
    documentationRequired: true,
    tags: ["auth", "security", "supabase", "critical"],
    createdDate: "2024-01-01",
    dueDate: "2024-01-15",
    completedDate: "2024-01-14",
    notes: "Sistema base de autenticación completado. Incluye manejo de roles y redirección automática.",
  },
  {
    id: "AUTH-002",
    title: "Gestión de Roles y Permisos",
    description:
      "Sistema completo de roles (SuperAdmin, Admin, Taller, Aseguradora, Cliente) con permisos granulares y middleware de protección de rutas.",
    category: "Autenticación",
    priority: "Critical",
    status: "Completed",
    estimatedHours: 35,
    actualHours: 38,
    assignee: "Backend Developer",
    dependencies: ["AUTH-001", "DB-002"],
    files: [
      "components/auth/role-guard.tsx",
      "components/auth/route-guard.tsx",
      "components/auth/can.tsx",
      "lib/auth/auth-context.ts",
      "middleware.ts",
    ],
    linesOfCode: 890,
    taskType: "Feature",
    businessImpact: "High",
    technicalRisk: "High",
    storageType: "Supabase",
    testingRequired: true,
    documentationRequired: true,
    tags: ["roles", "permissions", "security", "middleware"],
    createdDate: "2024-01-02",
    dueDate: "2024-01-20",
    completedDate: "2024-01-18",
    notes: "Sistema de roles implementado con RLS policies en Supabase.",
  },
  {
    id: "AUTH-003",
    title: "Registro de Talleres con Aprobación",
    description:
      "Formulario especializado para registro de talleres con proceso de aprobación por administradores y validación de documentos.",
    category: "Autenticación",
    priority: "High",
    status: "Completed",
    estimatedHours: 25,
    actualHours: 28,
    assignee: "Frontend Developer",
    dependencies: ["AUTH-001", "ADMIN-002"],
    files: [
      "components/auth/registro-taller-form.tsx",
      "app/auth/registro-taller/page.tsx",
      "app/auth/registro-taller/confirmacion/page.tsx",
      "app/api/registro-taller/route.ts",
    ],
    linesOfCode: 650,
    taskType: "Feature",
    businessImpact: "High",
    technicalRisk: "Medium",
    storageType: "Supabase",
    testingRequired: true,
    documentationRequired: true,
    tags: ["registro", "talleres", "aprobación", "validación"],
    createdDate: "2024-01-05",
    dueDate: "2024-01-25",
    completedDate: "2024-01-23",
    notes: "Incluye validación de documentos y notificaciones automáticas.",
  },
  {
    id: "AUTH-004",
    title: "Actualización de Contraseñas",
    description: "Sistema para actualización segura de contraseñas con validaciones y confirmación por email.",
    category: "Autenticación",
    priority: "Medium",
    status: "Completed",
    estimatedHours: 15,
    actualHours: 18,
    assignee: "Frontend Developer",
    dependencies: ["AUTH-001"],
    files: ["components/auth/actualizar-password-form.tsx", "app/auth/actualizar-password/page.tsx"],
    linesOfCode: 320,
    taskType: "Feature",
    businessImpact: "Medium",
    technicalRisk: "Low",
    storageType: "Supabase",
    testingRequired: true,
    documentationRequired: false,
    tags: ["password", "security", "validation"],
    createdDate: "2024-01-08",
    dueDate: "2024-01-30",
    completedDate: "2024-01-28",
    notes: "Implementado con validaciones de seguridad estándar.",
  },
  {
    id: "AUTH-005",
    title: "Debug y Diagnóstico de Autenticación",
    description: "Herramientas de debug para diagnosticar problemas de autenticación, roles y sesiones en desarrollo.",
    category: "Autenticación",
    priority: "Low",
    status: "Completed",
    estimatedHours: 12,
    actualHours: 15,
    assignee: "DevOps",
    dependencies: ["AUTH-001"],
    files: [
      "components/auth/auth-debug.tsx",
      "components/auth/debug-roles.tsx",
      "app/auth/debug/page.tsx",
      "app/auth/diagnostico/page.tsx",
      "app/debug-role/page.tsx",
      "app/debug-roles/page.tsx",
      "app/debug-session/page.tsx",
    ],
    linesOfCode: 480,
    taskType: "Documentation",
    businessImpact: "Low",
    technicalRisk: "Low",
    storageType: "Memory",
    testingRequired: false,
    documentationRequired: true,
    tags: ["debug", "diagnostics", "development"],
    createdDate: "2024-01-10",
    dueDate: "2024-02-15",
    completedDate: "2024-02-10",
    notes: "Herramientas útiles para desarrollo y troubleshooting.",
  },

  // ADMINISTRACIÓN (ADMIN)
  {
    id: "ADMIN-001",
    title: "Dashboard de Administración",
    description:
      "Panel principal de administración con métricas, estadísticas y acceso rápido a todas las funciones administrativas.",
    category: "Administración",
    priority: "Critical",
    status: "Completed",
    estimatedHours: 30,
    actualHours: 35,
    assignee: "Frontend Developer",
    dependencies: ["AUTH-002", "DB-001"],
    files: ["components/admin/admin-dashboard.tsx", "app/admin/dashboard/page.tsx", "app/admin/layout.tsx"],
    linesOfCode: 750,
    taskType: "Feature",
    businessImpact: "High",
    technicalRisk: "Medium",
    storageType: "Supabase",
    testingRequired: true,
    documentationRequired: true,
    tags: ["dashboard", "admin", "metrics", "overview"],
    createdDate: "2024-01-03",
    dueDate: "2024-01-18",
    completedDate: "2024-01-16",
    notes: "Dashboard principal con widgets de estadísticas en tiempo real.",
  },
  {
    id: "ADMIN-002",
    title: "Gestión de Solicitudes de Talleres",
    description:
      "Sistema para revisar, aprobar o rechazar solicitudes de registro de talleres con comentarios y notificaciones.",
    category: "Administración",
    priority: "High",
    status: "Completed",
    estimatedHours: 25,
    actualHours: 30,
    assignee: "Backend Developer",
    dependencies: ["AUTH-003", "ADMIN-001"],
    files: ["components/admin/solicitudes-talleres.tsx", "app/admin/solicitudes/page.tsx"],
    linesOfCode: 580,
    taskType: "Feature",
    businessImpact: "High",
    technicalRisk: "Medium",
    storageType: "Supabase",
    testingRequired: true,
    documentationRequired: true,
    tags: ["solicitudes", "aprobación", "talleres", "workflow"],
    createdDate: "2024-01-06",
    dueDate: "2024-01-22",
    completedDate: "2024-01-20",
    notes: "Incluye sistema de notificaciones y comentarios.",
  },
  {
    id: "ADMIN-003",
    title: "Gestión de Usuarios",
    description:
      "CRUD completo para gestión de usuarios con filtros, búsqueda, edición de roles y desactivación de cuentas.",
    category: "Administración",
    priority: "High",
    status: "Completed",
    estimatedHours: 35,
    actualHours: 40,
    assignee: "Full Stack Developer",
    dependencies: ["AUTH-002", "ADMIN-001"],
    files: ["app/admin/usuarios/page.tsx", "app/admin/usuarios/loading.tsx"],
    linesOfCode: 920,
    taskType: "Feature",
    businessImpact: "High",
    technicalRisk: "Medium",
    storageType: "Supabase",
    testingRequired: true,
    documentationRequired: true,
    tags: ["users", "crud", "management", "roles"],
    createdDate: "2024-01-07",
    dueDate: "2024-01-25",
    completedDate: "2024-01-24",
    notes: "Sistema completo de gestión con paginación y filtros avanzados.",
  },

  // TALLERES (TALLER)
  {
    id: "TAL-001",
    title: "Dashboard de Taller",
    description: "Panel principal para talleres con resumen de órdenes, citas, inventario y métricas de rendimiento.",
    category: "Talleres",
    priority: "Critical",
    status: "Completed",
    estimatedHours: 35,
    actualHours: 40,
    assignee: "Frontend Developer",
    dependencies: ["AUTH-002", "ORD-001"],
    files: ["components/taller/taller-dashboard.tsx", "app/taller/dashboard/page.tsx", "app/taller/layout.tsx"],
    linesOfCode: 850,
    taskType: "Feature",
    businessImpact: "High",
    technicalRisk: "Medium",
    storageType: "Supabase",
    testingRequired: true,
    documentationRequired: true,
    tags: ["dashboard", "taller", "metrics", "overview"],
    createdDate: "2024-01-04",
    dueDate: "2024-01-20",
    completedDate: "2024-01-18",
    notes: "Dashboard completo con widgets interactivos y métricas en tiempo real.",
  },
  {
    id: "TAL-002",
    title: "Gestión de Órdenes de Trabajo",
    description:
      "Sistema completo para crear, editar, seguir y completar órdenes de trabajo con estados y asignaciones.",
    category: "Talleres",
    priority: "Critical",
    status: "Completed",
    estimatedHours: 50,
    actualHours: 55,
    assignee: "Full Stack Developer",
    dependencies: ["TAL-001", "VEH-001"],
    files: [
      "components/taller/ordenes-page.tsx",
      "components/taller/nueva-orden-form.tsx",
      "app/taller/ordenes/page.tsx",
      "app/taller/ordenes/nueva/page.tsx",
      "components/ordenes/ordenes-page.tsx",
      "components/ordenes/nueva-orden-form.tsx",
      "components/ordenes/detalle-orden.tsx",
    ],
    linesOfCode: 1450,
    taskType: "Feature",
    businessImpact: "High",
    technicalRisk: "Medium",
    storageType: "Supabase",
    testingRequired: true,
    documentationRequired: true,
    tags: ["ordenes", "workflow", "tracking", "assignments"],
    createdDate: "2024-01-05",
    dueDate: "2024-01-25",
    completedDate: "2024-01-23",
    notes: "Sistema completo con workflow de estados y notificaciones.",
  },
  {
    id: "TAL-003",
    title: "Tablero Kanban Personalizable",
    description: "Tablero Kanban drag-and-drop para gestión visual de órdenes con columnas personalizables y filtros.",
    category: "Talleres",
    priority: "High",
    status: "In Progress",
    estimatedHours: 40,
    actualHours: 25,
    assignee: "Frontend Developer",
    dependencies: ["TAL-002", "KAN-001"],
    files: [
      "components/taller/kanban-board.tsx",
      "components/taller/kanban-personalizado.tsx",
      "components/kanban/kanban-board.tsx",
      "app/taller/kanban-personalizado/page.tsx",
      "app/taller/kanban/page.tsx",
      "lib/actions/kanban.ts",
    ],
    linesOfCode: 1200,
    taskType: "Feature",
    businessImpact: "High",
    technicalRisk: "Medium",
    storageType: "Supabase",
    testingRequired: true,
    documentationRequired: true,
    tags: ["kanban", "drag-drop", "visual", "customizable"],
    createdDate: "2024-01-10",
    dueDate: "2024-02-01",
    notes: "En desarrollo - funcionalidad básica implementada, falta personalización avanzada.",
  },

  // CLIENTES (CLI)
  {
    id: "CLI-001",
    title: "Dashboard de Cliente",
    description:
      "Panel principal para clientes con resumen de vehículos, citas, historial de servicios y cotizaciones.",
    category: "Clientes",
    priority: "High",
    status: "Completed",
    estimatedHours: 25,
    actualHours: 30,
    assignee: "Frontend Developer",
    dependencies: ["AUTH-002"],
    files: ["components/cliente/cliente-dashboard.tsx", "app/cliente/dashboard/page.tsx", "app/cliente/layout.tsx"],
    linesOfCode: 650,
    taskType: "Feature",
    businessImpact: "High",
    technicalRisk: "Low",
    storageType: "Supabase",
    testingRequired: true,
    documentationRequired: true,
    tags: ["dashboard", "cliente", "vehiculos", "servicios"],
    createdDate: "2024-01-06",
    dueDate: "2024-01-22",
    completedDate: "2024-01-20",
    notes: "Dashboard intuitivo con acceso rápido a todas las funciones.",
  },

  // VEHÍCULOS (VEH)
  {
    id: "VEH-001",
    title: "Sistema de Gestión de Vehículos",
    description: "CRUD completo para vehículos con información detallada, documentos y historial de servicios.",
    category: "Vehículos",
    priority: "Critical",
    status: "Completed",
    estimatedHours: 40,
    actualHours: 45,
    assignee: "Full Stack Developer",
    dependencies: ["DB-001"],
    files: [
      "components/vehiculos/vehiculos-page.tsx",
      "components/vehiculos/nuevo-vehiculo-form.tsx",
      "app/vehiculos/page.tsx",
      "lib/actions/vehicles.ts",
    ],
    linesOfCode: 1150,
    taskType: "Feature",
    businessImpact: "High",
    technicalRisk: "Medium",
    storageType: "Supabase",
    testingRequired: true,
    documentationRequired: true,
    tags: ["vehiculos", "crud", "documentos", "historial"],
    createdDate: "2024-01-03",
    dueDate: "2024-01-20",
    completedDate: "2024-01-18",
    notes: "Sistema completo con validaciones y carga de documentos.",
  },

  // COTIZACIONES (COT)
  {
    id: "COT-001",
    title: "Sistema de Cotizaciones",
    description:
      "Sistema completo para crear, enviar, aprobar y gestionar cotizaciones entre talleres, clientes y aseguradoras.",
    category: "Cotizaciones",
    priority: "Critical",
    status: "Completed",
    estimatedHours: 50,
    actualHours: 58,
    assignee: "Full Stack Developer",
    dependencies: ["VEH-001", "CLI-001", "TAL-001"],
    files: [
      "components/cotizaciones/cotizaciones-page.tsx",
      "components/cotizaciones/nueva-cotizacion-form.tsx",
      "components/cotizaciones/detalle-cotizacion.tsx",
      "components/cotizaciones/cotizacion-detalle.tsx",
      "app/cotizaciones/page.tsx",
      "app/cotizaciones/[id]/page.tsx",
      "app/cotizaciones/[id]/editar/page.tsx",
      "lib/actions/quotations.ts",
    ],
    linesOfCode: 1650,
    taskType: "Feature",
    businessImpact: "High",
    technicalRisk: "High",
    storageType: "Supabase",
    testingRequired: true,
    documentationRequired: true,
    tags: ["cotizaciones", "workflow", "aprobaciones", "multi-actor"],
    createdDate: "2024-01-05",
    dueDate: "2024-01-28",
    completedDate: "2024-01-26",
    notes: "Sistema complejo con múltiples actores y estados.",
  },

  // BASE DE DATOS (DB)
  {
    id: "DB-001",
    title: "Estructura de Base de Datos",
    description:
      "Diseño e implementación completa de la estructura de base de datos con todas las tablas y relaciones.",
    category: "Base de Datos",
    priority: "Critical",
    status: "Completed",
    estimatedHours: 60,
    actualHours: 70,
    assignee: "Database Architect",
    dependencies: [],
    files: [
      "supabase/migrations/20240512_create_new_tables.sql",
      "supabase/migrations/20240514_update_roles_usuario.sql",
      "supabase/migrations/20240613_create_core_tables.sql",
      "supabase/migrations/20240614_add_rls_policies.sql",
      "supabase/migrations/20240615_update_kanban_tables.sql",
      "supabase/migrations/20240616_create_vehicle_inspections.sql",
      "supabase/migrations/20240617_add_kanban_rls.sql",
      "supabase/migrations/create_functions.sql",
      "supabase/migrations/create_execute_sql_function.sql",
    ],
    linesOfCode: 2500,
    taskType: "Configuration",
    businessImpact: "High",
    technicalRisk: "High",
    storageType: "Supabase",
    testingRequired: true,
    documentationRequired: true,
    tags: ["database", "schema", "migrations", "structure"],
    createdDate: "2024-01-01",
    dueDate: "2024-01-10",
    completedDate: "2024-01-08",
    notes: "Estructura completa con todas las tablas y relaciones necesarias.",
  },

  // CONFIGURACIÓN (CONFIG)
  {
    id: "CONFIG-001",
    title: "Configuración de Supabase",
    description: "Configuración completa de Supabase con clientes, autenticación y conexiones.",
    category: "Configuración",
    priority: "Critical",
    status: "Completed",
    estimatedHours: 20,
    actualHours: 28,
    assignee: "DevOps Engineer",
    dependencies: [],
    files: [
      "lib/supabase/client.ts",
      "lib/supabase/server.ts",
      "lib/supabase/config.ts",
      "lib/supabase/admin-client.ts",
    ],
    linesOfCode: 650,
    taskType: "Configuration",
    businessImpact: "High",
    technicalRisk: "High",
    storageType: "Supabase",
    testingRequired: true,
    documentationRequired: true,
    tags: ["supabase", "configuration", "clients", "connection"],
    createdDate: "2024-01-01",
    dueDate: "2024-01-08",
    completedDate: "2024-01-06",
    notes: "Configuración base corregida con manejo de errores mejorado.",
  },

  // MIGRACIÓN CRÍTICA (MIG)
  {
    id: "MIG-001",
    title: "Migración de Datos LocalStorage",
    description: "CRÍTICO: Migración de datos almacenados en LocalStorage a Supabase para persistencia.",
    category: "Migración",
    priority: "Critical",
    status: "Pending",
    estimatedHours: 40,
    actualHours: 0,
    assignee: "Data Migration Specialist",
    dependencies: ["DB-001", "TAL-007"],
    files: ["components/taller/tecnicos-page.tsx", "components/taller/facturas-page.tsx"],
    linesOfCode: 0,
    taskType: "Migration",
    businessImpact: "High",
    technicalRisk: "High",
    storageType: "LocalStorage",
    testingRequired: true,
    documentationRequired: true,
    tags: ["migration", "localstorage", "critical", "data-loss-risk"],
    createdDate: "2024-02-01",
    dueDate: "2024-02-28",
    notes: "URGENTE: Datos críticos en LocalStorage requieren migración inmediata a Supabase.",
  },

  // ELEMENTOS TÉCNICOS CRÍTICOS (TEC)
  {
    id: "TEC-001",
    title: "Gestión de Técnicos - Migración DB",
    description: "CRÍTICO: Migrar gestión de técnicos de LocalStorage a Supabase con tablas relacionales.",
    category: "Técnico",
    priority: "Critical",
    status: "Pending",
    estimatedHours: 25,
    actualHours: 0,
    assignee: "Backend Developer",
    dependencies: ["MIG-001", "DB-001"],
    files: ["components/taller/tecnicos-page.tsx", "app/taller/tecnicos/page.tsx"],
    linesOfCode: 450,
    taskType: "Migration",
    businessImpact: "High",
    technicalRisk: "High",
    storageType: "LocalStorage",
    testingRequired: true,
    documentationRequired: true,
    tags: ["tecnicos", "migration", "critical", "database"],
    createdDate: "2024-02-03",
    dueDate: "2024-02-26",
    notes: "CRÍTICO: Datos de técnicos se pierden al cerrar navegador.",
  },

  // KANBAN Y WORKFLOW (KAN)
  {
    id: "KAN-001",
    title: "Sistema Kanban Base",
    description: "Implementación del sistema Kanban con drag-and-drop, estados personalizables y persistencia.",
    category: "Kanban",
    priority: "High",
    status: "In Progress",
    estimatedHours: 35,
    actualHours: 20,
    assignee: "Frontend Developer",
    dependencies: ["TAL-002"],
    files: ["components/kanban/kanban-page.tsx", "app/kanban/page.tsx"],
    linesOfCode: 650,
    taskType: "Feature",
    businessImpact: "High",
    technicalRisk: "Medium",
    storageType: "Supabase",
    testingRequired: true,
    documentationRequired: true,
    tags: ["kanban", "workflow", "drag-drop", "visual"],
    createdDate: "2024-01-23",
    dueDate: "2024-02-08",
    notes: "En desarrollo - funcionalidad básica implementada, falta personalización.",
  },

  // INVENTARIO Y REPUESTOS (REP)
  {
    id: "REP-001",
    title: "Gestión de Repuestos",
    description:
      "Sistema completo para gestión de repuestos con control de stock, proveedores y solicitudes de compra.",
    category: "Repuestos",
    priority: "High",
    status: "Completed",
    estimatedHours: 40,
    actualHours: 48,
    assignee: "Backend Developer",
    dependencies: ["TAL-005"],
    files: [
      "components/repuestos/repuestos-page.tsx",
      "components/repuestos/nuevo-repuesto-form.tsx",
      "components/repuestos/detalle-repuesto.tsx",
      "components/repuestos/solicitud-compra-form.tsx",
      "app/repuestos/page.tsx",
      "lib/actions/repuestos.ts",
    ],
    linesOfCode: 1250,
    taskType: "Feature",
    businessImpact: "High",
    technicalRisk: "Medium",
    storageType: "Supabase",
    testingRequired: true,
    documentationRequired: true,
    tags: ["repuestos", "stock", "proveedores", "compras"],
    createdDate: "2024-01-13",
    dueDate: "2024-02-05",
    completedDate: "2024-02-03",
    notes: "Sistema completo con alertas automáticas de stock bajo.",
  },

  // REPORTES Y ANALYTICS (REP)
  {
    id: "REP-002",
    title: "Sistema de Reportes",
    description: "Generación de reportes avanzados con gráficos, exportación y análisis de datos del negocio.",
    category: "Reportes",
    priority: "Medium",
    status: "Completed",
    estimatedHours: 30,
    actualHours: 38,
    assignee: "Data Analyst",
    dependencies: ["TAL-001", "COT-001"],
    files: ["components/reportes/reportes-page.tsx", "app/reportes/page.tsx"],
    linesOfCode: 850,
    taskType: "Feature",
    businessImpact: "Medium",
    technicalRisk: "Low",
    storageType: "Supabase",
    testingRequired: true,
    documentationRequired: true,
    tags: ["reportes", "analytics", "graficos", "exportacion"],
    createdDate: "2024-01-21",
    dueDate: "2024-02-15",
    completedDate: "2024-02-13",
    notes: "Reportes interactivos con múltiples formatos de exportación.",
  },

  // NAVEGACIÓN Y LAYOUT (NAV)
  {
    id: "NAV-001",
    title: "Sistema de Navegación",
    description: "Implementación completa del sistema de navegación con menús contextuales por rol.",
    category: "Navegación",
    priority: "High",
    status: "Completed",
    estimatedHours: 25,
    actualHours: 30,
    assignee: "Frontend Developer",
    dependencies: ["AUTH-002", "CONFIG-003"],
    files: [
      "components/main-nav.tsx",
      "components/role-based-nav.tsx",
      "components/admin/admin-nav.tsx",
      "components/taller/taller-nav.tsx",
      "components/cliente/cliente-nav.tsx",
      "components/aseguradora/aseguradora-nav.tsx",
      "components/user-nav.tsx",
    ],
    linesOfCode: 850,
    taskType: "Feature",
    businessImpact: "High",
    technicalRisk: "Low",
    storageType: "Memory",
    testingRequired: true,
    documentationRequired: true,
    tags: ["navigation", "menus", "roles", "responsive"],
    createdDate: "2024-01-04",
    dueDate: "2024-01-18",
    completedDate: "2024-01-16",
    notes: "Navegación adaptativa según roles con menús contextuales.",
  },

  // LANDING PAGE Y MARKETING (LAND)
  {
    id: "LAND-001",
    title: "Landing Page Principal",
    description: "Página de aterrizaje principal con información del producto, características y llamadas a la acción.",
    category: "Landing",
    priority: "Medium",
    status: "Completed",
    estimatedHours: 30,
    actualHours: 35,
    assignee: "Marketing Developer",
    dependencies: ["CONFIG-003"],
    files: [
      "app/page.tsx",
      "components/landing/hero-section.tsx",
      "components/landing/feature-section.tsx",
      "components/landing/pricing-section.tsx",
      "components/landing/testimonial-section.tsx",
      "components/landing/cta-section.tsx",
      "components/landing/faq-section.tsx",
      "components/landing/footer.tsx",
      "components/landing/modules-section.tsx",
    ],
    linesOfCode: 1250,
    taskType: "Feature",
    businessImpact: "Medium",
    technicalRisk: "Low",
    storageType: "File",
    testingRequired: true,
    documentationRequired: false,
    tags: ["landing", "marketing", "seo", "conversion"],
    createdDate: "2024-01-27",
    dueDate: "2024-02-20",
    completedDate: "2024-02-18",
    notes: "Landing page optimizada para conversión y SEO.",
  },

  // APIS Y ENDPOINTS (API)
  {
    id: "API-001",
    title: "APIs de Autenticación",
    description: "Endpoints para manejo de autenticación, verificación y callbacks.",
    category: "APIs",
    priority: "Critical",
    status: "Completed",
    estimatedHours: 15,
    actualHours: 20,
    assignee: "Backend Developer",
    dependencies: ["AUTH-001"],
    files: ["app/api/auth/check/route.ts", "app/auth/callback/route.ts"],
    linesOfCode: 280,
    taskType: "Feature",
    businessImpact: "High",
    technicalRisk: "Medium",
    storageType: "Supabase",
    testingRequired: true,
    documentationRequired: true,
    tags: ["api", "auth", "endpoints", "security"],
    createdDate: "2024-01-03",
    dueDate: "2024-01-15",
    completedDate: "2024-01-13",
    notes: "APIs de autenticación con manejo de errores robusto.",
  },

  // TESTING Y QA (TEST)
  {
    id: "TEST-001",
    title: "Páginas de Testing y Debug",
    description: "Páginas especializadas para testing, debug y diagnóstico del sistema.",
    category: "Testing",
    priority: "Low",
    status: "Completed",
    estimatedHours: 25,
    actualHours: 30,
    assignee: "QA Engineer",
    dependencies: ["CONFIG-001"],
    files: [
      "app/test-supabase/page.tsx",
      "app/test-connection/page.tsx",
      "app/test-api/page.tsx",
      "app/check-supabase/page.tsx",
      "app/diagnostico/page.tsx",
      "app/diagnostico-supabase/page.tsx",
      "app/diagnostico-dashboard/page.tsx",
      "app/diagnostico-cliente/page.tsx",
      "app/diagnostico-taller/page.tsx",
      "app/diagnostico-talleres/page.tsx",
      "app/env-check/page.tsx",
      "app/debug-supabase-url/page.tsx",
    ],
    linesOfCode: 980,
    taskType: "Testing",
    businessImpact: "Low",
    technicalRisk: "Low",
    storageType: "Memory",
    testingRequired: false,
    documentationRequired: true,
    tags: ["testing", "debug", "diagnostics", "qa"],
    createdDate: "2024-01-29",
    dueDate: "2024-02-25",
    completedDate: "2024-02-23",
    notes: "Herramientas completas de testing y diagnóstico.",
  },
]

export default function ProjectBacklogComplete() {
  const [filteredData, setFilteredData] = useState<BacklogItem[]>(backlogData)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStorage, setFilterStorage] = useState<string>("all")

  // Aplicar filtros
  const applyFilters = () => {
    let filtered = backlogData

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((item) => item.status === filterStatus)
    }

    if (filterPriority !== "all") {
      filtered = filtered.filter((item) => item.priority === filterPriority)
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((item) => item.category === filterCategory)
    }

    if (filterStorage !== "all") {
      filtered = filtered.filter((item) => item.storageType === filterStorage)
    }

    setFilteredData(filtered)
  }

  // Aplicar filtros cuando cambien
  useState(() => {
    applyFilters()
  }, [searchTerm, filterStatus, filterPriority, filterCategory, filterStorage])

  // Estadísticas
  const stats = {
    total: backlogData.length,
    completed: backlogData.filter((item) => item.status === "Completed").length,
    inProgress: backlogData.filter((item) => item.status === "In Progress").length,
    pending: backlogData.filter((item) => item.status === "Pending").length,
    blocked: backlogData.filter((item) => item.status === "Blocked").length,
    critical: backlogData.filter((item) => item.priority === "Critical").length,
    localStorage: backlogData.filter((item) => item.storageType === "LocalStorage").length,
    estimatedHours: backlogData.reduce((sum, item) => sum + item.estimatedHours, 0),
    actualHours: backlogData.reduce((sum, item) => sum + item.actualHours, 0),
    linesOfCode: backlogData.reduce((sum, item) => sum + item.linesOfCode, 0),
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "In Progress":
        return <PlayCircle className="h-4 w-4 text-blue-600" />
      case "Pending":
        return <Circle className="h-4 w-4 text-yellow-600" />
      case "Blocked":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Pause className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      Completed: "bg-green-100 text-green-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Blocked: "bg-red-100 text-red-800",
    }
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      Critical: "bg-red-100 text-red-800",
      High: "bg-orange-100 text-orange-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Low: "bg-green-100 text-green-800",
    }
    return variants[priority as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  const getStorageBadge = (type: string) => {
    const variants = {
      Supabase: "bg-green-100 text-green-800",
      LocalStorage: "bg-red-100 text-red-800",
      SessionStorage: "bg-orange-100 text-orange-800",
      Memory: "bg-blue-100 text-blue-800",
      File: "bg-purple-100 text-purple-800",
      API: "bg-indigo-100 text-indigo-800",
    }
    return variants[type as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Título",
      "Descripción",
      "Categoría",
      "Prioridad",
      "Estado",
      "Horas Estimadas",
      "Horas Reales",
      "Responsable",
      "Tipo de Almacenamiento",
      "Tipo de Tarea",
      "Impacto de Negocio",
      "Riesgo Técnico",
      "Líneas de Código",
      "Testing Requerido",
      "Documentación Requerida",
      "Fecha de Creación",
      "Fecha de Vencimiento",
      "Fecha de Completado",
      "Notas",
    ]

    const csvContent = [
      headers.join(","),
      ...filteredData.map((item) =>
        [
          item.id,
          `"${item.title}"`,
          `"${item.description}"`,
          item.category,
          item.priority,
          item.status,
          item.estimatedHours,
          item.actualHours,
          item.assignee,
          item.storageType,
          item.taskType,
          item.businessImpact,
          item.technicalRisk,
          item.linesOfCode,
          item.testingRequired ? "Sí" : "No",
          item.documentationRequired ? "Sí" : "No",
          item.createdDate,
          item.dueDate,
          item.completedDate || "",
          `"${item.notes}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `backlog-completo-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Backlog Completo del Proyecto</h1>
          <p className="text-muted-foreground">Sistema de Gestión de Talleres Automotrices - AutoFlowX</p>
        </div>
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Items</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">Completados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
            <div className="text-sm text-muted-foreground">En Progreso</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pendientes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
            <div className="text-sm text-muted-foreground">Críticos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.localStorage}</div>
            <div className="text-sm text-muted-foreground">LocalStorage</div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Desarrollo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-lg font-semibold">{stats.estimatedHours}h estimadas</div>
                <div className="text-sm text-muted-foreground">{stats.actualHours}h reales</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-lg font-semibold">{stats.linesOfCode.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Líneas de código</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-lg font-semibold">{Math.round((stats.completed / stats.total) * 100)}%</div>
                <div className="text-sm text-muted-foreground">Progreso general</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Completed">Completado</SelectItem>
                <SelectItem value="In Progress">En Progreso</SelectItem>
                <SelectItem value="Pending">Pendiente</SelectItem>
                <SelectItem value="Blocked">Bloqueado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las prioridades</SelectItem>
                <SelectItem value="Critical">Crítica</SelectItem>
                <SelectItem value="High">Alta</SelectItem>
                <SelectItem value="Medium">Media</SelectItem>
                <SelectItem value="Low">Baja</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="Autenticación">Autenticación</SelectItem>
                <SelectItem value="Administración">Administración</SelectItem>
                <SelectItem value="Talleres">Talleres</SelectItem>
                <SelectItem value="Clientes">Clientes</SelectItem>
                <SelectItem value="Vehículos">Vehículos</SelectItem>
                <SelectItem value="Cotizaciones">Cotizaciones</SelectItem>
                <SelectItem value="Base de Datos">Base de Datos</SelectItem>
                <SelectItem value="Configuración">Configuración</SelectItem>
                <SelectItem value="Migración">Migración</SelectItem>
                <SelectItem value="Técnico">Técnico</SelectItem>
                <SelectItem value="Kanban">Kanban</SelectItem>
                <SelectItem value="Repuestos">Repuestos</SelectItem>
                <SelectItem value="Reportes">Reportes</SelectItem>
                <SelectItem value="Navegación">Navegación</SelectItem>
                <SelectItem value="Landing">Landing</SelectItem>
                <SelectItem value="APIs">APIs</SelectItem>
                <SelectItem value="Testing">Testing</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStorage} onValueChange={setFilterStorage}>
              <SelectTrigger>
                <SelectValue placeholder="Almacenamiento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="Supabase">Supabase</SelectItem>
                <SelectItem value="LocalStorage">LocalStorage</SelectItem>
                <SelectItem value="SessionStorage">SessionStorage</SelectItem>
                <SelectItem value="Memory">Memory</SelectItem>
                <SelectItem value="File">File</SelectItem>
                <SelectItem value="API">API</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setFilterStatus("all")
                setFilterPriority("all")
                setFilterCategory("all")
                setFilterStorage("all")
              }}
            >
              Limpiar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla Principal */}
      <Card>
        <CardHeader>
          <CardTitle>Backlog Detallado ({filteredData.length} items)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">ID</TableHead>
                  <TableHead className="w-48">Título</TableHead>
                  <TableHead className="w-64">Descripción</TableHead>
                  <TableHead className="w-32">Categoría</TableHead>
                  <TableHead className="w-24">Estado</TableHead>
                  <TableHead className="w-24">Prioridad</TableHead>
                  <TableHead className="w-32">Almacenamiento</TableHead>
                  <TableHead className="w-20">Est. H</TableHead>
                  <TableHead className="w-20">Real H</TableHead>
                  <TableHead className="w-32">Responsable</TableHead>
                  <TableHead className="w-20">LOC</TableHead>
                  <TableHead className="w-24">Tipo</TableHead>
                  <TableHead className="w-24">Impacto</TableHead>
                  <TableHead className="w-20">Riesgo</TableHead>
                  <TableHead className="w-24">Testing</TableHead>
                  <TableHead className="w-64">Notas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">{item.id}</TableCell>
                    <TableCell className="text-xs font-medium">{item.title}</TableCell>
                    <TableCell className="text-xs max-w-64 truncate" title={item.description}>
                      {item.description}
                    </TableCell>
                    <TableCell className="text-xs">{item.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <Badge className={`text-xs ${getStatusBadge(item.status)}`}>{item.status}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${getPriorityBadge(item.priority)}`}>{item.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${getStorageBadge(item.storageType)}`}>{item.storageType}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-right">{item.estimatedHours}h</TableCell>
                    <TableCell className="text-xs text-right">{item.actualHours}h</TableCell>
                    <TableCell className="text-xs">{item.assignee}</TableCell>
                    <TableCell className="text-xs text-right">{item.linesOfCode.toLocaleString()}</TableCell>
                    <TableCell className="text-xs">{item.taskType}</TableCell>
                    <TableCell className="text-xs">{item.businessImpact}</TableCell>
                    <TableCell className="text-xs">{item.technicalRisk}</TableCell>
                    <TableCell className="text-xs">{item.testingRequired ? "Sí" : "No"}</TableCell>
                    <TableCell className="text-xs max-w-64 truncate" title={item.notes}>
                      {item.notes}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Alertas Críticas */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Elementos Críticos que Requieren Atención Inmediata
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {backlogData
              .filter(
                (item) =>
                  item.storageType === "LocalStorage" || (item.priority === "Critical" && item.status !== "Completed"),
              )
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 bg-white rounded border border-red-200"
                >
                  <div>
                    <span className="font-medium text-red-800">{item.id}</span>
                    <span className="ml-2">{item.title}</span>
                    {item.storageType === "LocalStorage" && (
                      <Badge className="ml-2 bg-red-100 text-red-800">MIGRACIÓN URGENTE</Badge>
                    )}
                  </div>
                  <Badge className={getStatusBadge(item.status)}>{item.status}</Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumen por Categoría */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from(new Set(backlogData.map((item) => item.category))).map((category) => {
              const categoryItems = backlogData.filter((item) => item.category === category)
              const completed = categoryItems.filter((item) => item.status === "Completed").length
              const total = categoryItems.length
              const percentage = Math.round((completed / total) * 100)

              return (
                <div key={category} className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-sm">{category}</h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>
                        Completado: {completed}/{total}
                      </span>
                      <span>{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
