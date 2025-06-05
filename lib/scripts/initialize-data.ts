import { supabaseAdmin } from "@/lib/supabase/admin-client"

export async function initializeData() {
  console.log("Inicializando datos en Supabase...")

  try {
    // Verificar y crear roles
    await createRoles()

    // Verificar y crear columnas Kanban
    await createKanbanColumns()

    // Verificar y crear tipos de materiales, operaciones y reparaciones
    await createTiposMaterialesOperacionesReparaciones()

    // Verificar y crear categorías de materiales
    await createCategoriasMateriales()

    // Verificar y crear especialidades de taller
    await createEspecialidadesTaller()

    // Verificar y crear métodos de pago
    await createMetodosPago()

    // Verificar y crear procesos
    await createProcesos()

    console.log("Inicialización de datos completada.")
  } catch (error) {
    console.error("Error durante la inicialización de datos:", error)
  }
}

async function createRoles() {
  const roles = [{ nombre: "Cliente" }, { nombre: "Taller" }, { nombre: "Aseguradora" }, { nombre: "SuperAdmin" }]

  for (const role of roles) {
    const { data, error } = await supabaseAdmin.from("roles").select("id").eq("nombre", role.nombre).single()

    if (error || !data) {
      const { error: insertError } = await supabaseAdmin.from("roles").insert(role)

      if (insertError) {
        console.error(`Error al crear rol ${role.nombre}:`, insertError)
      } else {
        console.log(`Rol ${role.nombre} creado exitosamente.`)
      }
    } else {
      console.log(`Rol ${role.nombre} ya existe.`)
    }
  }
}

async function createKanbanColumns() {
  const columns = [
    { title: "Por Hacer", description: "Tareas pendientes", color: "#1890ff", position: 1 },
    { title: "En Progreso", description: "Tareas en curso", color: "#faad14", position: 2 },
    { title: "En Revisión", description: "Tareas en revisión", color: "#722ed1", position: 3 },
    { title: "Completado", description: "Tareas finalizadas", color: "#52c41a", position: 4 },
  ]

  // Primero verificamos si ya existen columnas
  const { data: existingColumns, error: fetchError } = await supabaseAdmin.from("kanban_columns").select("*")

  if (fetchError) {
    console.error("Error al verificar columnas Kanban existentes:", fetchError)
    return
  }

  // Si no hay columnas, las creamos
  if (!existingColumns || existingColumns.length === 0) {
    const { error: insertError } = await supabaseAdmin.from("kanban_columns").insert(columns)

    if (insertError) {
      console.error("Error al crear columnas Kanban:", insertError)
    } else {
      console.log("Columnas Kanban creadas exitosamente.")
    }
  } else {
    console.log("Las columnas Kanban ya existen. No se realizaron cambios.")
  }
}

async function createTiposMaterialesOperacionesReparaciones() {
  // Tipos de materiales
  const tiposMateriales = [
    { codigo: "HI", nombre: "Hierro", descripcion: "Material de hierro" },
    { codigo: "PL", nombre: "Plástico", descripcion: "Material de plástico" },
    { codigo: "AL", nombre: "Aluminio", descripcion: "Material de aluminio" },
    { codigo: "FV", nombre: "Fibra de Vidrio", descripcion: "Material de fibra de vidrio" },
  ]

  for (const tipo of tiposMateriales) {
    const { data, error } = await supabaseAdmin.from("tipos_material").select("id").eq("codigo", tipo.codigo).single()

    if (error || !data) {
      const { error: insertError } = await supabaseAdmin.from("tipos_material").insert(tipo)

      if (insertError) {
        console.error(`Error al crear tipo de material ${tipo.codigo}:`, insertError)
      } else {
        console.log(`Tipo de material ${tipo.codigo} creado exitosamente.`)
      }
    } else {
      console.log(`Tipo de material ${tipo.codigo} ya existe.`)
    }
  }

  // Tipos de operaciones
  const tiposOperaciones = [
    { codigo: "COR", nombre: "Corte", descripcion: "Operación de corte" },
    { codigo: "REP", nombre: "Reparación", descripcion: "Operación de reparación" },
    { codigo: "CAM", nombre: "Cambio", descripcion: "Operación de cambio" },
    { codigo: "PIN", nombre: "Pintura", descripcion: "Operación de pintura" },
  ]

  for (const tipo of tiposOperaciones) {
    const { data, error } = await supabaseAdmin.from("tipos_operacion").select("id").eq("codigo", tipo.codigo).single()

    if (error || !data) {
      const { error: insertError } = await supabaseAdmin.from("tipos_operacion").insert(tipo)

      if (insertError) {
        console.error(`Error al crear tipo de operación ${tipo.codigo}:`, insertError)
      } else {
        console.log(`Tipo de operación ${tipo.codigo} creado exitosamente.`)
      }
    } else {
      console.log(`Tipo de operación ${tipo.codigo} ya existe.`)
    }
  }

  // Tipos de reparaciones
  const tiposReparaciones = [
    { codigo: "MM", nombre: "Mecánica Menor", descripcion: "Reparación mecánica menor" },
    { codigo: "OU", nombre: "Overhaul", descripcion: "Reparación completa" },
    { codigo: "GN", nombre: "General", descripcion: "Reparación general" },
    { codigo: "ES", nombre: "Estructural", descripcion: "Reparación estructural" },
  ]

  for (const tipo of tiposReparaciones) {
    const { data, error } = await supabaseAdmin.from("tipos_reparacion").select("id").eq("codigo", tipo.codigo).single()

    if (error || !data) {
      const { error: insertError } = await supabaseAdmin.from("tipos_reparacion").insert(tipo)

      if (insertError) {
        console.error(`Error al crear tipo de reparación ${tipo.codigo}:`, insertError)
      } else {
        console.log(`Tipo de reparación ${tipo.codigo} creado exitosamente.`)
      }
    } else {
      console.log(`Tipo de reparación ${tipo.codigo} ya existe.`)
    }
  }
}

async function createCategoriasMateriales() {
  const categorias = [
    { nombre: "Pintura", descripcion: "Materiales de pintura" },
    { nombre: "Carrocería", descripcion: "Materiales para carrocería" },
    { nombre: "Mecánica", descripcion: "Materiales para mecánica" },
    { nombre: "Eléctrica", descripcion: "Materiales eléctricos" },
  ]

  for (const categoria of categorias) {
    const { data, error } = await supabaseAdmin
      .from("categorias_materiales")
      .select("id")
      .eq("nombre", categoria.nombre)
      .single()

    if (error || !data) {
      const { error: insertError } = await supabaseAdmin.from("categorias_materiales").insert(categoria)

      if (insertError) {
        console.error(`Error al crear categoría de material ${categoria.nombre}:`, insertError)
      } else {
        console.log(`Categoría de material ${categoria.nombre} creada exitosamente.`)
      }
    } else {
      console.log(`Categoría de material ${categoria.nombre} ya existe.`)
    }
  }
}

async function createEspecialidadesTaller() {
  const especialidades = [
    { nombre: "Mecánica General" },
    { nombre: "Pintura" },
    { nombre: "Carrocería" },
    { nombre: "Electricidad" },
    { nombre: "Alineación y Balanceo" },
  ]

  for (const especialidad of especialidades) {
    const { data, error } = await supabaseAdmin
      .from("especialidades_taller")
      .select("id")
      .eq("nombre", especialidad.nombre)
      .single()

    if (error || !data) {
      const { error: insertError } = await supabaseAdmin.from("especialidades_taller").insert(especialidad)

      if (insertError) {
        console.error(`Error al crear especialidad de taller ${especialidad.nombre}:`, insertError)
      } else {
        console.log(`Especialidad de taller ${especialidad.nombre} creada exitosamente.`)
      }
    } else {
      console.log(`Especialidad de taller ${especialidad.nombre} ya existe.`)
    }
  }
}

async function createMetodosPago() {
  const metodos = [
    { nombre: "Efectivo" },
    { nombre: "Tarjeta de Crédito" },
    { nombre: "Tarjeta de Débito" },
    { nombre: "Transferencia Bancaria" },
    { nombre: "Cheque" },
  ]

  for (const metodo of metodos) {
    const { data, error } = await supabaseAdmin.from("metodo_pago").select("id").eq("nombre", metodo.nombre).single()

    if (error || !data) {
      const { error: insertError } = await supabaseAdmin.from("metodo_pago").insert(metodo)

      if (insertError) {
        console.error(`Error al crear método de pago ${metodo.nombre}:`, insertError)
      } else {
        console.log(`Método de pago ${metodo.nombre} creado exitosamente.`)
      }
    } else {
      console.log(`Método de pago ${metodo.nombre} ya existe.`)
    }
  }
}

async function createProcesos() {
  const procesos = [
    {
      codigo: "REP-CAR",
      tipo: "Reparación",
      nombre: "Reparación de Carrocería",
      descripcion: "Proceso de reparación de carrocería",
      proceso_pintura: false,
      proceso_reparacion: true,
      costo_base: 500,
      precio_venta: 750,
      porcentaje_margen: 50,
    },
    {
      codigo: "PIN-GEN",
      tipo: "Pintura",
      nombre: "Pintura General",
      descripcion: "Proceso de pintura general",
      proceso_pintura: true,
      proceso_reparacion: false,
      costo_base: 800,
      precio_venta: 1200,
      porcentaje_margen: 50,
    },
    {
      codigo: "MEC-GEN",
      tipo: "Mecánica",
      nombre: "Mecánica General",
      descripcion: "Proceso de mecánica general",
      proceso_pintura: false,
      proceso_reparacion: true,
      costo_base: 600,
      precio_venta: 900,
      porcentaje_margen: 50,
    },
    {
      codigo: "ELEC",
      tipo: "Eléctrica",
      nombre: "Reparación Eléctrica",
      descripcion: "Proceso de reparación eléctrica",
      proceso_pintura: false,
      proceso_reparacion: true,
      costo_base: 400,
      precio_venta: 600,
      porcentaje_margen: 50,
    },
  ]

  for (const proceso of procesos) {
    const { data, error } = await supabaseAdmin.from("procesos").select("id").eq("codigo", proceso.codigo).single()

    if (error || !data) {
      const { error: insertError } = await supabaseAdmin.from("procesos").insert(proceso)

      if (insertError) {
        console.error(`Error al crear proceso ${proceso.codigo}:`, insertError)
      } else {
        console.log(`Proceso ${proceso.codigo} creado exitosamente.`)
      }
    } else {
      console.log(`Proceso ${proceso.codigo} ya existe.`)
    }
  }
}
