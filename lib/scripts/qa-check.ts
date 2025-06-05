import { supabaseAdmin } from "@/lib/supabase/admin-client"

export async function performQACheck() {
  console.log("Realizando verificación de QA del sistema...")
  const results: QAResult[] = []

  try {
    // Verificar tablas principales
    await checkTables(results)

    // Verificar relaciones
    await checkRelations(results)

    // Verificar datos
    await checkData(results)

    // Verificar funcionalidades
    await checkFunctionality(results)

    console.log("Verificación de QA completada.")
    return results
  } catch (error) {
    console.error("Error durante la verificación de QA:", error)
    results.push({
      component: "General",
      status: "error",
      message: `Error general: ${(error as Error).message}`,
    })
    return results
  }
}

interface QAResult {
  component: string
  status: "success" | "warning" | "error"
  message: string
  details?: string
}

async function checkTables(results: QAResult[]) {
  const requiredTables = [
    "roles",
    "clients",
    "vehicles",
    "talleres",
    "aseguradoras",
    "quotations",
    "quotation_parts",
    "orders",
    "order_details",
    "materiales",
    "kanban_columns",
    "kanban_tasks",
  ]

  for (const table of requiredTables) {
    try {
      const { count, error } = await supabaseAdmin.from(table).select("*", { count: "exact", head: true })

      if (error) {
        results.push({
          component: `Tabla: ${table}`,
          status: "error",
          message: `La tabla ${table} no existe o no es accesible`,
          details: error.message,
        })
      } else {
        results.push({
          component: `Tabla: ${table}`,
          status: "success",
          message: `La tabla ${table} existe y contiene ${count} registros`,
        })
      }
    } catch (error) {
      results.push({
        component: `Tabla: ${table}`,
        status: "error",
        message: `Error al verificar la tabla ${table}`,
        details: (error as Error).message,
      })
    }
  }
}

async function checkRelations(results: QAResult[]) {
  const relations = [
    { parent: "clients", child: "vehicles", foreignKey: "client_id" },
    { parent: "quotations", child: "quotation_parts", foreignKey: "quotation_id" },
    { parent: "orders", child: "order_details", foreignKey: "order_id" },
    { parent: "kanban_columns", child: "kanban_tasks", foreignKey: "column_id" },
  ]

  for (const relation of relations) {
    try {
      // Verificar si hay registros en la tabla padre
      const { data: parentData, error: parentError } = await supabaseAdmin.from(relation.parent).select("id").limit(1)

      if (parentError || !parentData || parentData.length === 0) {
        results.push({
          component: `Relación: ${relation.parent} -> ${relation.child}`,
          status: "warning",
          message: `No hay datos en la tabla padre ${relation.parent} para verificar la relación`,
        })
        continue
      }

      // Verificar si hay registros en la tabla hija que referencien a la tabla padre
      const { data: childData, error: childError } = await supabaseAdmin
        .from(relation.child)
        .select(`id, ${relation.foreignKey}`)
        .eq(relation.foreignKey, parentData[0].id)
        .limit(1)

      if (childError) {
        results.push({
          component: `Relación: ${relation.parent} -> ${relation.child}`,
          status: "error",
          message: `Error al verificar la relación entre ${relation.parent} y ${relation.child}`,
          details: childError.message,
        })
      } else if (!childData || childData.length === 0) {
        results.push({
          component: `Relación: ${relation.parent} -> ${relation.child}`,
          status: "warning",
          message: `No se encontraron registros en ${relation.child} relacionados con ${relation.parent}`,
        })
      } else {
        results.push({
          component: `Relación: ${relation.parent} -> ${relation.child}`,
          status: "success",
          message: `La relación entre ${relation.parent} y ${relation.child} funciona correctamente`,
        })
      }
    } catch (error) {
      results.push({
        component: `Relación: ${relation.parent} -> ${relation.child}`,
        status: "error",
        message: `Error al verificar la relación entre ${relation.parent} y ${relation.child}`,
        details: (error as Error).message,
      })
    }
  }
}

async function checkData(results: QAResult[]) {
  // Verificar datos de clientes
  try {
    const { data: clients, error: clientsError } = await supabaseAdmin.from("clients").select("*")

    if (clientsError) {
      results.push({
        component: "Datos: Clientes",
        status: "error",
        message: "Error al obtener datos de clientes",
        details: clientsError.message,
      })
    } else if (!clients || clients.length === 0) {
      results.push({
        component: "Datos: Clientes",
        status: "warning",
        message: "No hay clientes registrados en el sistema",
      })
    } else {
      results.push({
        component: "Datos: Clientes",
        status: "success",
        message: `Hay ${clients.length} clientes registrados en el sistema`,
      })
    }
  } catch (error) {
    results.push({
      component: "Datos: Clientes",
      status: "error",
      message: "Error al verificar datos de clientes",
      details: (error as Error).message,
    })
  }

  // Verificar datos de vehículos
  try {
    const { data: vehicles, error: vehiclesError } = await supabaseAdmin.from("vehicles").select("*")

    if (vehiclesError) {
      results.push({
        component: "Datos: Vehículos",
        status: "error",
        message: "Error al obtener datos de vehículos",
        details: vehiclesError.message,
      })
    } else if (!vehicles || vehicles.length === 0) {
      results.push({
        component: "Datos: Vehículos",
        status: "warning",
        message: "No hay vehículos registrados en el sistema",
      })
    } else {
      results.push({
        component: "Datos: Vehículos",
        status: "success",
        message: `Hay ${vehicles.length} vehículos registrados en el sistema`,
      })
    }
  } catch (error) {
    results.push({
      component: "Datos: Vehículos",
      status: "error",
      message: "Error al verificar datos de vehículos",
      details: (error as Error).message,
    })
  }

  // Verificar datos de talleres
  try {
    const { data: talleres, error: talleresError } = await supabaseAdmin.from("talleres").select("*")

    if (talleresError) {
      results.push({
        component: "Datos: Talleres",
        status: "error",
        message: "Error al obtener datos de talleres",
        details: talleresError.message,
      })
    } else if (!talleres || talleres.length === 0) {
      results.push({
        component: "Datos: Talleres",
        status: "warning",
        message: "No hay talleres registrados en el sistema",
      })
    } else {
      results.push({
        component: "Datos: Talleres",
        status: "success",
        message: `Hay ${talleres.length} talleres registrados en el sistema`,
      })
    }
  } catch (error) {
    results.push({
      component: "Datos: Talleres",
      status: "error",
      message: "Error al verificar datos de talleres",
      details: (error as Error).message,
    })
  }

  // Verificar datos de aseguradoras
  try {
    const { data: aseguradoras, error: aseguradorasError } = await supabaseAdmin.from("aseguradoras").select("*")

    if (aseguradorasError) {
      results.push({
        component: "Datos: Aseguradoras",
        status: "error",
        message: "Error al obtener datos de aseguradoras",
        details: aseguradorasError.message,
      })
    } else if (!aseguradoras || aseguradoras.length === 0) {
      results.push({
        component: "Datos: Aseguradoras",
        status: "warning",
        message: "No hay aseguradoras registradas en el sistema",
      })
    } else {
      results.push({
        component: "Datos: Aseguradoras",
        status: "success",
        message: `Hay ${aseguradoras.length} aseguradoras registradas en el sistema`,
      })
    }
  } catch (error) {
    results.push({
      component: "Datos: Aseguradoras",
      status: "error",
      message: "Error al verificar datos de aseguradoras",
      details: (error as Error).message,
    })
  }
}

async function checkFunctionality(results: QAResult[]) {
  // Verificar funcionalidad de autenticación
  try {
    const { data: authSettings, error: authError } = await supabaseAdmin.auth.admin.listUsers()

    if (authError) {
      results.push({
        component: "Funcionalidad: Autenticación",
        status: "error",
        message: "Error al verificar la funcionalidad de autenticación",
        details: authError.message,
      })
    } else {
      results.push({
        component: "Funcionalidad: Autenticación",
        status: "success",
        message: "La funcionalidad de autenticación está operativa",
      })
    }
  } catch (error) {
    results.push({
      component: "Funcionalidad: Autenticación",
      status: "error",
      message: "Error al verificar la funcionalidad de autenticación",
      details: (error as Error).message,
    })
  }

  // Verificar funcionalidad de roles
  try {
    const { data: roles, error: rolesError } = await supabaseAdmin.from("roles").select("*")

    if (rolesError) {
      results.push({
        component: "Funcionalidad: Roles",
        status: "error",
        message: "Error al verificar la funcionalidad de roles",
        details: rolesError.message,
      })
    } else if (!roles || roles.length === 0) {
      results.push({
        component: "Funcionalidad: Roles",
        status: "warning",
        message: "No hay roles definidos en el sistema",
      })
    } else {
      results.push({
        component: "Funcionalidad: Roles",
        status: "success",
        message: `Hay ${roles.length} roles definidos en el sistema`,
      })
    }
  } catch (error) {
    results.push({
      component: "Funcionalidad: Roles",
      status: "error",
      message: "Error al verificar la funcionalidad de roles",
      details: (error as Error).message,
    })
  }

  // Verificar funcionalidad de Kanban
  try {
    const { data: columns, error: columnsError } = await supabaseAdmin.from("kanban_columns").select("*")

    if (columnsError) {
      results.push({
        component: "Funcionalidad: Kanban",
        status: "error",
        message: "Error al verificar la funcionalidad de Kanban",
        details: columnsError.message,
      })
    } else if (!columns || columns.length === 0) {
      results.push({
        component: "Funcionalidad: Kanban",
        status: "warning",
        message: "No hay columnas Kanban definidas en el sistema",
      })
    } else {
      results.push({
        component: "Funcionalidad: Kanban",
        status: "success",
        message: `Hay ${columns.length} columnas Kanban definidas en el sistema`,
      })
    }
  } catch (error) {
    results.push({
      component: "Funcionalidad: Kanban",
      status: "error",
      message: "Error al verificar la funcionalidad de Kanban",
      details: (error as Error).message,
    })
  }
}
