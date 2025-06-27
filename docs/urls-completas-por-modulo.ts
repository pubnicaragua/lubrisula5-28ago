// 📋 URLs Completas Organizadas por Módulo - AutoFlowX

export const urlsByModule = {
  // 🏠 PÚBLICAS - Sin autenticación requerida
  public: {
    landing: "/",
    login: "/auth/login",
    register: "/auth/registro",
    tallerRegister: "/auth/registro-taller",
    passwordRecovery: "/auth/recuperar-password",
    passwordUpdate: "/auth/actualizar-password",
    authCallback: "/auth/callback",
    registerConfirmation: "/auth/registro-taller/confirmacion",
  },

  // 🔧 DESARROLLO Y DEBUG
  development: {
    authDebug: "/auth/debug",
    authDiagnostic: "/auth/diagnostico",
    corsCheck: "/auth/cors-check",
    supabaseTest: "/test-supabase",
    connectionTest: "/test-connection",
    envCheck: "/env-check",
    diagnostic: "/diagnostico",
    supabaseCheck: "/check-supabase",
    debugRole: "/debug-role",
    debugRoles: "/debug-roles",
    debugSession: "/debug-session",
    debugSupabaseUrl: "/debug-supabase-url",
    diagnosticClient: "/diagnostico-cliente",
    diagnosticDashboard: "/diagnostico-dashboard",
    diagnosticSupabase: "/diagnostico-supabase",
    diagnosticTaller: "/diagnostico-taller",
    diagnosticTalleres: "/diagnostico-talleres",
    fixApiKey: "/fix-api-key",
    fixUsers: "/fix-users",
    testApi: "/test-api",
  },

  // 👑 SUPERADMIN / ADMIN
  admin: {
    // Dashboard y navegación principal
    dashboard: "/admin/dashboard",
    layout: "/admin/layout",

    // Gestión de usuarios
    users: "/admin/usuarios",
    usersLoading: "/admin/usuarios/loading",
    verifyUsers: "/admin/verificar-usuarios",
    syncRoles: "/admin/sync-roles",
    setSuperadmin: "/admin/set-superadmin",
    setAdmin: "/set-admin",

    // Gestión de entidades
    aseguradoras: "/admin/aseguradoras",
    aseguradorasLoading: "/admin/aseguradoras/loading",
    solicitudes: "/admin/solicitudes",

    // Base de datos y sistema
    database: "/admin/database",
    databaseInitialize: "/admin/database/initialize",
    initializeNewTables: "/admin/initialize-new-tables",
    initializeMaterials: "/admin/initialize-materials",
    initializeRoles: "/admin/initialize-roles",
    qaCheck: "/admin/qa-check",
    testData: "/admin/test-data",
    deployStatus: "/admin/deploy-status",
    verifyDeploy: "/admin/verify-deploy",

    // Configuración avanzada
    superadmin: "/admin/superadmin",
    backlog: "/admin/backlog",

    // Inicialización del sistema
    initializeAll: "/initialize-all",
    initializeDatabase: "/initialize-database",
    initializeDatabaseNew: "/initialize-database-new",
    initializeSystem: "/inicializar-sistema",
    systemInitialization: "/sistema/inicializacion",
  },

  // 🔧 TALLER
  taller: {
    // Dashboard y navegación
    dashboard: "/taller/dashboard",
    layout: "/taller/layout",

    // Gestión de órdenes y trabajo
    ordenes: "/taller/ordenes",
    nuevaOrden: "/taller/ordenes/nueva",
    kanban: "/taller/kanban",
    kanbanPersonalizado: "/taller/kanban-personalizado",

    // Gestión de vehículos
    vehiculos: "/taller/vehiculos",
    vehiculoDetalle: "/taller/vehiculos/[id]",
    vehiculoIngreso: "/taller/vehiculos/[id]/ingreso",
    vehiculoInspeccion: "/taller/vehiculos/[id]/inspeccion",
    vehiculoInspeccionExacta: "/taller/vehiculos/[id]/inspeccion-exacta",

    // Gestión comercial
    cotizaciones: "/taller/cotizaciones",
    cotizacionDetalle: "/taller/cotizaciones/[id]",
    facturas: "/taller/facturas",
    citas: "/taller/citas",

    // Inventario y recursos
    inventario: "/taller/inventario",
    servicios: "/taller/servicios",
    tecnicos: "/taller/tecnicos",

    // Gestión de clientes y accesos
    clientes: "/taller/clientes",
    accesos: "/taller/accesos",

    // Reportes y configuración
    reportes: "/taller/reportes",
    configuracion: "/taller/configuracion",

    // Inicialización específica
    initializeTaller: "/inicializar-taller",
  },

  // 🛡️ ASEGURADORA
  aseguradora: {
    // Dashboard y navegación
    dashboard: "/aseguradora/dashboard",
    layout: "/aseguradora/layout",

    // Gestión comercial
    cotizaciones: "/aseguradora/cotizaciones",
  },

  // 👤 CLIENTE
  cliente: {
    // Dashboard y navegación
    dashboard: "/cliente/dashboard",
    layout: "/cliente/layout",

    // Gestión de vehículos
    vehiculos: "/cliente/vehiculos",

    // Servicios y citas
    citas: "/cliente/citas",
    cotizaciones: "/cliente/cotizaciones",
    historial: "/cliente/historial",

    // Inicialización específica
    initializeCliente: "/inicializar-cliente",
  },

  // 🚗 GESTIÓN GENERAL (Accesible por múltiples roles)
  general: {
    // Vehículos
    vehiculos: "/vehiculos",

    // Clientes
    clientes: "/clientes",

    // Cotizaciones
    cotizaciones: "/cotizaciones",
    cotizacionDetalle: "/cotizaciones/[id]",
    cotizacionEditar: "/cotizaciones/[id]/editar",

    // Órdenes
    ordenes: "/ordenes",

    // Reportes
    reportes: "/reportes",

    // Inventario
    inventario: "/inventario",

    // Repuestos
    repuestos: "/repuestos",

    // Equipo
    equipo: "/equipo",

    // Flotas
    flotas: "/flotas",

    // Talleres
    talleres: "/talleres",
    talleresProcesos: "/talleres/procesos",

    // Kanban general
    kanban: "/kanban",

    // Módulos
    modulos: "/modulos",
  },

  // 🔌 APIs
  api: {
    // Autenticación
    authCheck: "/api/auth/check",
    authCallback: "/api/auth/callback",

    // Verificaciones del sistema
    checkDashboard: "/api/check-dashboard",
    checkSupabaseConnection: "/api/check-supabase-connection",
    checkTables: "/api/check-tables",
    health: "/api/health",
    verifySupabase: "/api/verify-supabase",
    testSupabaseDirect: "/api/test-supabase-direct",

    // Inicialización
    initializeAll: "/api/initialize-all",
    initializeCliente: "/api/initialize-cliente",
    initializeClients: "/api/initialize-clients",
    initializeData: "/api/initialize-data",
    initializeDatabaseNew: "/api/initialize-database-new",
    initializeDatabase: "/api/initialize-database",
    initializeKanban: "/api/initialize-kanban",
    initializeMaterials: "/api/initialize-materials",
    initializeNewTables: "/api/initialize-new-tables",
    initializeQuotations: "/api/initialize-quotations",
    initializeRoles: "/api/initialize-roles",
    initializeTaller: "/api/initialize-taller",
    initializeVehicles: "/api/initialize-vehicles",

    // Gestión de datos
    insertTestData: "/api/insert-test-data",
    materiales: "/api/materiales",
    paquetesServicio: "/api/paquetes-servicio",
    procesos: "/api/procesos",
    procesosById: "/api/procesos/[id]",
    proveedores: "/api/proveedores",

    // Administración
    qaCheck: "/api/qa-check",
    registroTaller: "/api/registro-taller",
    resetApiKey: "/api/reset-api-key",
    setAdminRole: "/api/set-admin-role",
    setSuperadmin: "/api/set-superadmin",
    syncAuthRoles: "/api/sync-auth-roles",
    fixUserRoles: "/api/fix-user-roles",

    // Sistema
    sistemaInicializarDatos: "/api/sistema/inicializar-datos",
    sistemaInicializarEstructura: "/api/sistema/inicializar-estructura",
    sistemaInicializarUsuarios: "/api/sistema/inicializar-usuarios",
    sistemaVerificar: "/api/sistema/verificar",

    // Diagnóstico
    diagnosticoTalleres: "/api/diagnostico-talleres",
  },
}

// 🔐 Configuración de acceso por rol
export const roleAccess = {
  superadmin: {
    fullAccess: true,
    modules: ["admin", "taller", "aseguradora", "cliente", "general", "development"],
  },
  admin: {
    fullAccess: false,
    modules: ["admin", "taller", "aseguradora", "cliente", "general"],
    restrictions: ["development.some", "admin.superadmin"],
  },
  taller: {
    fullAccess: false,
    modules: ["taller", "general.limited"],
    restrictions: ["admin", "aseguradora", "cliente"],
  },
  aseguradora: {
    fullAccess: false,
    modules: ["aseguradora", "general.limited"],
    restrictions: ["admin", "taller", "cliente"],
  },
  cliente: {
    fullAccess: false,
    modules: ["cliente"],
    restrictions: ["admin", "taller", "aseguradora", "general"],
  },
}

// 🚦 Estados de las funcionalidades
export const featureStatus = {
  completed: [
    "auth",
    "admin.users",
    "admin.database",
    "taller.dashboard",
    "taller.ordenes",
    "taller.vehiculos",
    "taller.cotizaciones",
    "cliente.dashboard",
    "cliente.vehiculos",
    "aseguradora.dashboard",
  ],
  inProgress: ["taller.kanbanPersonalizado", "taller.tecnicos", "notifications"],
  pending: ["taller.facturas", "payments", "realTimeChat", "backupSystem"],
  critical: ["localStorage.migration", "taller.tecnicos.database", "taller.facturas.implementation"],
}

// 📊 Métricas del proyecto
export const projectMetrics = {
  totalUrls: 150,
  completedFeatures: 75,
  inProgressFeatures: 8,
  pendingFeatures: 12,
  criticalIssues: 3,
  linesOfCode: 25000,
  estimatedHours: 800,
  actualHours: 600,
  completionPercentage: 75,
}
