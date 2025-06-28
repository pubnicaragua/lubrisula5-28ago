import { supabaseAdmin } from "@/lib/supabase/admin-client"

// Datos mock que tienes localmente
const mockData = {
  // Roles del sistema
  roles: [
    { nombre: "superadmin", descripcion: "Administrador del sistema con acceso completo" },
    { nombre: "admin", descripcion: "Administrador con permisos de gestión" },
    { nombre: "taller", descripcion: "Usuario de taller con acceso a operaciones" },
    { nombre: "cliente", descripcion: "Cliente con acceso limitado" },
    { nombre: "aseguradora", descripcion: "Aseguradora con acceso a cotizaciones" },
  ],

  // Categorías de materiales
  categoriasMateriales: [
    { nombre: "Pintura", descripcion: "Materiales de pintura y acabados" },
    { nombre: "Carrocería", descripcion: "Materiales para reparación de carrocería" },
    { nombre: "Mecánica", descripcion: "Repuestos y materiales mecánicos" },
    { nombre: "Eléctrica", descripcion: "Componentes eléctricos y electrónicos" },
    { nombre: "Neumáticos", descripcion: "Neumáticos y componentes de ruedas" },
    { nombre: "Lubricantes", descripcion: "Aceites y lubricantes" },
  ],

  // Clientes
  clientes: [
    {
      name: "Juan Pérez García",
      phone: "55-1234-5678",
      email: "juan.perez@email.com",
      client_type: "Individual",
    },
    {
      name: "María López Rodríguez",
      phone: "55-2345-6789",
      email: "maria.lopez@email.com",
      client_type: "Individual",
    },
    {
      name: "Carlos Mendoza Silva",
      phone: "55-3456-7890",
      email: "carlos.mendoza@email.com",
      client_type: "Individual",
    },
    {
      name: "Transportes Rápidos",
      company: "Transportes Rápidos S.A. de C.V.",
      phone: "55-4567-8901",
      email: "info@transportesrapidos.com",
      client_type: "Flota",
    },
    {
      name: "Distribuidora Central",
      company: "Distribuidora Central S.A.",
      phone: "55-5678-9012",
      email: "contacto@distribuidoracentral.com",
      client_type: "Empresa",
    },
    {
      name: "Logística Express",
      company: "Logística Express México",
      phone: "55-6789-0123",
      email: "operaciones@logisticaexpress.mx",
      client_type: "Flota",
    },
  ],

  // Talleres
  talleres: [
    {
      nombre: "Taller Mecánico Express",
      direccion: "Av. Insurgentes Sur 1234, Col. Del Valle, CDMX",
      telefono: "55-1111-2222",
      email: "contacto@tallerexpress.com",
      descripcion: "Especialistas en reparaciones rápidas y mantenimiento preventivo",
    },
    {
      nombre: "Auto Pintura Profesional",
      direccion: "Calle Reforma 567, Col. Centro, CDMX",
      telefono: "55-3333-4444",
      email: "info@autopintura.com",
      descripcion: "Expertos en pintura automotriz y reparación de carrocería",
    },
    {
      nombre: "Servicio Eléctrico Automotriz",
      direccion: "Blvd. Manuel Ávila Camacho 890, Col. Polanco, CDMX",
      telefono: "55-5555-6666",
      email: "servicio@electricoauto.com",
      descripcion: "Especialistas en sistemas eléctricos y diagnóstico computarizado",
    },
    {
      nombre: "Taller Integral AutoflowX",
      direccion: "Periférico Sur 2345, Col. San Ángel, CDMX",
      telefono: "55-7777-8888",
      email: "contacto@integralautomotriz.com",
      descripcion: "Servicio completo para todo tipo de vehículos - Taller principal",
    },
  ],

  // Aseguradoras
  aseguradoras: [
    {
      nombre: "Seguros Confianza",
      corrreo: "contacto@segurosconfianza.com",
      telefono: "55-1000-2000",
      estado_tributario: "Contribuyente",
      nivel_tarifa: "Premium",
    },
    {
      nombre: "Aseguradora Protección Total",
      corrreo: "info@protecciontotal.com",
      telefono: "55-3000-4000",
      estado_tributario: "Contribuyente",
      nivel_tarifa: "Estándar",
    },
    {
      nombre: "Seguros Económicos",
      corrreo: "ventas@seguroseconomicos.com",
      telefono: "55-5000-6000",
      estado_tributario: "Pequeño Contribuyente",
      nivel_tarifa: "Básico",
    },
    {
      nombre: "AXA Seguros México",
      corrreo: "mexico@axa.com",
      telefono: "55-7000-8000",
      estado_tributario: "Contribuyente",
      nivel_tarifa: "Premium",
    },
    {
      nombre: "Qualitas Seguros",
      corrreo: "atencion@qualitas.com.mx",
      telefono: "55-9000-1000",
      estado_tributario: "Contribuyente",
      nivel_tarifa: "Estándar",
    },
  ],

  // Vehículos
  vehiculos: [
    {
      marca: "Toyota",
      modelo: "Corolla",
      anio: 2019,
      placa: "ABC-123-D",
      vin: "1NXBR32E84Z123456",
      color: "Blanco",
      kilometraje: 45000,
    },
    {
      marca: "Honda",
      modelo: "Civic",
      anio: 2020,
      placa: "XYZ-789-A",
      vin: "2HGFC2F54LH123456",
      color: "Azul Marino",
      kilometraje: 30000,
    },
    {
      marca: "Nissan",
      modelo: "Sentra",
      anio: 2018,
      placa: "DEF-456-B",
      vin: "3N1AB7AP8JL123456",
      color: "Gris Plata",
      kilometraje: 60000,
    },
    {
      marca: "Volkswagen",
      modelo: "Jetta",
      anio: 2021,
      placa: "GHI-012-C",
      vin: "3VW2K7AJ5LM123456",
      color: "Negro",
      kilometraje: 15000,
    },
    {
      marca: "Ford",
      modelo: "Transit",
      anio: 2021,
      placa: "JKL-345-E",
      vin: "1FTBW3XM6HK123456",
      color: "Blanco",
      kilometraje: 25000,
    },
    {
      marca: "Mercedes-Benz",
      modelo: "Sprinter",
      anio: 2020,
      placa: "MNO-678-F",
      vin: "WD3PE7CC5G5123456",
      color: "Plata",
      kilometraje: 35000,
    },
    {
      marca: "Chevrolet",
      modelo: "Silverado",
      anio: 2019,
      placa: "PQR-901-G",
      vin: "1GCUYDED5K1123456",
      color: "Rojo",
      kilometraje: 50000,
    },
    {
      marca: "RAM",
      modelo: "1500",
      anio: 2022,
      placa: "STU-234-H",
      vin: "1C6SRFFT4NN123456",
      color: "Azul",
      kilometraje: 12000,
    },
  ],

  // Materiales de inventario
  materiales: [
    {
      codigo: "PIN-001",
      nombre: "Pintura Automotriz Roja",
      descripcion: "Pintura acrílica de alta calidad color rojo Ferrari",
      precio_unitario: 350.0,
      stock: 25,
      unidad_medida: "Litro",
      es_material_pintura: true,
    },
    {
      codigo: "PIN-002",
      nombre: "Pintura Automotriz Azul",
      descripcion: "Pintura acrílica de alta calidad color azul marino",
      precio_unitario: 350.0,
      stock: 20,
      unidad_medida: "Litro",
      es_material_pintura: true,
    },
    {
      codigo: "PIN-003",
      nombre: "Pintura Automotriz Blanca",
      descripcion: "Pintura acrílica de alta calidad color blanco perla",
      precio_unitario: 320.0,
      stock: 30,
      unidad_medida: "Litro",
      es_material_pintura: true,
    },
    {
      codigo: "PIN-004",
      nombre: "Barniz Transparente",
      descripcion: "Barniz de acabado brillante UV resistente",
      precio_unitario: 450.0,
      stock: 15,
      unidad_medida: "Litro",
      es_material_pintura: true,
    },
    {
      codigo: "CAR-001",
      nombre: "Lámina de Acero Galvanizado",
      descripcion: "Lámina de acero galvanizado para reparación de carrocería",
      precio_unitario: 280.0,
      stock: 12,
      unidad_medida: "Metro²",
      es_material_pintura: false,
    },
    {
      codigo: "CAR-002",
      nombre: "Masilla para Carrocería",
      descripcion: "Masilla de poliéster para relleno y nivelación",
      precio_unitario: 180.0,
      stock: 40,
      unidad_medida: "Kilogramo",
      es_material_pintura: false,
    },
    {
      codigo: "MEC-001",
      nombre: "Aceite de Motor 5W-30",
      descripcion: "Aceite sintético para motor gasolina",
      precio_unitario: 220.0,
      stock: 50,
      unidad_medida: "Litro",
      es_material_pintura: false,
    },
    {
      codigo: "MEC-002",
      nombre: "Filtro de Aceite",
      descripcion: "Filtro de aceite universal para motores",
      precio_unitario: 85.0,
      stock: 60,
      unidad_medida: "Pieza",
      es_material_pintura: false,
    },
    {
      codigo: "ELE-001",
      nombre: "Cable Eléctrico Automotriz",
      descripcion: "Cable eléctrico calibre 12 para instalaciones automotrices",
      precio_unitario: 25.0,
      stock: 200,
      unidad_medida: "Metro",
      es_material_pintura: false,
    },
    {
      codigo: "NEU-001",
      nombre: "Neumático 185/65R15",
      descripcion: "Neumático radial para automóvil compacto",
      precio_unitario: 1200.0,
      stock: 24,
      unidad_medida: "Pieza",
      es_material_pintura: false,
    },
  ],

  // Miembros del equipo
  miembrosEquipo: [
    {
      nombre: "Roberto",
      apellido: "Martínez López",
      cargo: "Jefe de Taller",
      especialidad: "Mecánica General",
      telefono: "55-1111-1111",
      email: "roberto.martinez@autoflowx.com",
      estado: "Activo",
      horas_trabajadas: 2080,
      ordenes_completadas: 156,
      salario: 18000.0,
    },
    {
      nombre: "Ana",
      apellido: "García Hernández",
      cargo: "Especialista en Pintura",
      especialidad: "Pintura y Carrocería",
      telefono: "55-2222-2222",
      email: "ana.garcia@autoflowx.com",
      estado: "Activo",
      horas_trabajadas: 1950,
      ordenes_completadas: 89,
      salario: 16000.0,
    },
    {
      nombre: "Luis",
      apellido: "Rodríguez Sánchez",
      cargo: "Técnico Eléctrico",
      especialidad: "Sistemas Eléctricos",
      telefono: "55-3333-3333",
      email: "luis.rodriguez@autoflowx.com",
      estado: "Activo",
      horas_trabajadas: 2000,
      ordenes_completadas: 134,
      salario: 17000.0,
    },
    {
      nombre: "Carmen",
      apellido: "Jiménez Torres",
      cargo: "Técnico Mecánico",
      especialidad: "Motor y Transmisión",
      telefono: "55-4444-4444",
      email: "carmen.jimenez@autoflowx.com",
      estado: "Activo",
      horas_trabajadas: 1800,
      ordenes_completadas: 98,
      salario: 15500.0,
    },
    {
      nombre: "Miguel",
      apellido: "Fernández Castro",
      cargo: "Especialista en Frenos",
      especialidad: "Sistemas de Frenos",
      telefono: "55-5555-5555",
      email: "miguel.fernandez@autoflowx.com",
      estado: "Activo",
      horas_trabajadas: 1750,
      ordenes_completadas: 112,
      salario: 16500.0,
    },
  ],

  // Columnas Kanban
  columnasKanban: [
    {
      title: "Por Hacer",
      description: "Trabajos pendientes de iniciar",
      color: "#ef4444",
      position: 1,
    },
    {
      title: "En Progreso",
      description: "Trabajos en desarrollo",
      color: "#f59e0b",
      position: 2,
    },
    {
      title: "En Revisión",
      description: "Trabajos en proceso de revisión",
      color: "#3b82f6",
      position: 3,
    },
    {
      title: "Completado",
      description: "Trabajos finalizados",
      color: "#10b981",
      position: 4,
    },
  ],
}

export async function migrateMockDataToSupabase() {
  console.log("🚀 Iniciando migración de datos mock a Supabase...")

  try {
    // 1. Migrar roles
    await migrateRoles()

    // 2. Migrar categorías de materiales
    await migrateCategoriasMateriales()

    // 3. Migrar clientes
    await migrateClientes()

    // 4. Migrar talleres
    await migrateTalleres()

    // 5. Migrar aseguradoras
    await migrateAseguradoras()

    // 6. Migrar vehículos (después de clientes)
    await migrateVehiculos()

    // 7. Migrar materiales (después de categorías)
    await migrateMateriales()

    // 8. Migrar miembros del equipo
    await migrateMiembrosEquipo()

    // 9. Migrar columnas Kanban
    await migrateColumnasKanban()

    // 10. Crear datos de ejemplo adicionales
    await createSampleData()

    console.log("✅ Migración completada exitosamente!")

    return {
      success: true,
      message: "Todos los datos mock han sido migrados a Supabase correctamente",
    }
  } catch (error) {
    console.error("❌ Error durante la migración:", error)
    throw error
  }
}

async function migrateRoles() {
  console.log("📝 Migrando roles...")

  for (const rol of mockData.roles) {
    const { data: existingRole } = await supabaseAdmin.from("roles").select("id").eq("nombre", rol.nombre).single()

    if (!existingRole) {
      const { error } = await supabaseAdmin.from("roles").insert(rol)

      if (error) {
        console.error(`Error al insertar rol ${rol.nombre}:`, error)
      } else {
        console.log(`✓ Rol ${rol.nombre} insertado`)
      }
    } else {
      console.log(`⚠️ Rol ${rol.nombre} ya existe`)
    }
  }
}

async function migrateCategoriasMateriales() {
  console.log("📦 Migrando categorías de materiales...")

  // Verificar si la tabla existe
  const { data: tables } = await supabaseAdmin
    .from("information_schema.tables")
    .select("table_name")
    .eq("table_name", "categorias_materiales")

  if (!tables || tables.length === 0) {
    console.log("⚠️ Tabla categorias_materiales no existe, creándola...")

    const { error: createError } = await supabaseAdmin.rpc("execute_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS categorias_materiales (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          nombre VARCHAR(100) NOT NULL UNIQUE,
          descripcion TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (createError) {
      console.error("Error creando tabla categorias_materiales:", createError)
      return
    }
  }

  for (const categoria of mockData.categoriasMateriales) {
    const { error } = await supabaseAdmin.from("categorias_materiales").insert(categoria)

    if (error && !error.message.includes("duplicate")) {
      console.error(`Error al insertar categoría ${categoria.nombre}:`, error)
    } else {
      console.log(`✓ Categoría ${categoria.nombre} insertada`)
    }
  }
}

async function migrateClientes() {
  console.log("👥 Migrando clientes...")

  for (const cliente of mockData.clientes) {
    const { data: existingClient } = await supabaseAdmin
      .from("clients")
      .select("id")
      .eq("email", cliente.email)
      .single()

    if (!existingClient) {
      const { error } = await supabaseAdmin.from("clients").insert(cliente)

      if (error) {
        console.error(`Error al insertar cliente ${cliente.name}:`, error)
      } else {
        console.log(`✓ Cliente ${cliente.name} insertado`)
      }
    } else {
      console.log(`⚠️ Cliente ${cliente.name} ya existe`)
    }
  }
}

async function migrateTalleres() {
  console.log("🔧 Migrando talleres...")

  for (const taller of mockData.talleres) {
    const { data: existingTaller } = await supabaseAdmin
      .from("talleres")
      .select("id")
      .eq("email", taller.email)
      .single()

    if (!existingTaller) {
      const { error } = await supabaseAdmin.from("talleres").insert(taller)

      if (error) {
        console.error(`Error al insertar taller ${taller.nombre}:`, error)
      } else {
        console.log(`✓ Taller ${taller.nombre} insertado`)
      }
    } else {
      console.log(`⚠️ Taller ${taller.nombre} ya existe`)
    }
  }
}

async function migrateAseguradoras() {
  console.log("🛡️ Migrando aseguradoras...")

  for (const aseguradora of mockData.aseguradoras) {
    const { data: existingAseguradora } = await supabaseAdmin
      .from("aseguradoras")
      .select("id")
      .eq("corrreo", aseguradora.corrreo)
      .single()

    if (!existingAseguradora) {
      const { error } = await supabaseAdmin.from("aseguradoras").insert(aseguradora)

      if (error) {
        console.error(`Error al insertar aseguradora ${aseguradora.nombre}:`, error)
      } else {
        console.log(`✓ Aseguradora ${aseguradora.nombre} insertada`)
      }
    } else {
      console.log(`⚠️ Aseguradora ${aseguradora.nombre} ya existe`)
    }
  }
}

async function migrateVehiculos() {
  console.log("🚗 Migrando vehículos...")

  // Obtener clientes para asociar vehículos
  const { data: clientes } = await supabaseAdmin.from("clients").select("id, name")

  if (!clientes || clientes.length === 0) {
    console.log("⚠️ No hay clientes para asociar vehículos")
    return
  }

  for (let i = 0; i < mockData.vehiculos.length; i++) {
    const vehiculo = mockData.vehiculos[i]
    const clienteIndex = i % clientes.length // Distribuir vehículos entre clientes

    const vehiculoConCliente = {
      ...vehiculo,
      client_id: clientes[clienteIndex].id,
    }

    const { data: existingVehicle } = await supabaseAdmin
      .from("vehicles")
      .select("id")
      .eq("placa", vehiculo.placa)
      .single()

    if (!existingVehicle) {
      const { error } = await supabaseAdmin.from("vehicles").insert(vehiculoConCliente)

      if (error) {
        console.error(`Error al insertar vehículo ${vehiculo.marca} ${vehiculo.modelo}:`, error)
      } else {
        console.log(`✓ Vehículo ${vehiculo.marca} ${vehiculo.modelo} insertado`)
      }
    } else {
      console.log(`⚠️ Vehículo ${vehiculo.marca} ${vehiculo.modelo} ya existe`)
    }
  }
}

async function migrateMateriales() {
  console.log("🧰 Migrando materiales...")

  // Obtener categorías para asociar materiales
  const { data: categorias } = await supabaseAdmin.from("categorias_materiales").select("id, nombre")

  for (const material of mockData.materiales) {
    // Asignar categoría basada en el código del material
    let categoria_id = null
    if (material.codigo.startsWith("PIN")) {
      categoria_id = categorias?.find((c) => c.nombre === "Pintura")?.id
    } else if (material.codigo.startsWith("CAR")) {
      categoria_id = categorias?.find((c) => c.nombre === "Carrocería")?.id
    } else if (material.codigo.startsWith("MEC")) {
      categoria_id = categorias?.find((c) => c.nombre === "Mecánica")?.id
    } else if (material.codigo.startsWith("ELE")) {
      categoria_id = categorias?.find((c) => c.nombre === "Eléctrica")?.id
    } else if (material.codigo.startsWith("NEU")) {
      categoria_id = categorias?.find((c) => c.nombre === "Neumáticos")?.id
    }

    const materialConCategoria = {
      ...material,
      categoria_id,
    }

    const { data: existingMaterial } = await supabaseAdmin
      .from("materiales")
      .select("id")
      .eq("codigo", material.codigo)
      .single()

    if (!existingMaterial) {
      const { error } = await supabaseAdmin.from("materiales").insert(materialConCategoria)

      if (error) {
        console.error(`Error al insertar material ${material.nombre}:`, error)
      } else {
        console.log(`✓ Material ${material.nombre} insertado`)
      }
    } else {
      console.log(`⚠️ Material ${material.nombre} ya existe`)
    }
  }
}

async function migrateMiembrosEquipo() {
  console.log("👷 Migrando miembros del equipo...")

  for (const miembro of mockData.miembrosEquipo) {
    const { data: existingMember } = await supabaseAdmin
      .from("miembros_equipo")
      .select("id")
      .eq("email", miembro.email)
      .single()

    if (!existingMember) {
      const { error } = await supabaseAdmin.from("miembros_equipo").insert(miembro)

      if (error) {
        console.error(`Error al insertar miembro ${miembro.nombre} ${miembro.apellido}:`, error)
      } else {
        console.log(`✓ Miembro ${miembro.nombre} ${miembro.apellido} insertado`)
      }
    } else {
      console.log(`⚠️ Miembro ${miembro.nombre} ${miembro.apellido} ya existe`)
    }
  }
}

async function migrateColumnasKanban() {
  console.log("📋 Migrando columnas Kanban...")

  for (const columna of mockData.columnasKanban) {
    const { data: existingColumn } = await supabaseAdmin
      .from("kanban_columns")
      .select("id")
      .eq("title", columna.title)
      .single()

    if (!existingColumn) {
      const { error } = await supabaseAdmin.from("kanban_columns").insert(columna)

      if (error) {
        console.error(`Error al insertar columna ${columna.title}:`, error)
      } else {
        console.log(`✓ Columna ${columna.title} insertada`)
      }
    } else {
      console.log(`⚠️ Columna ${columna.title} ya existe`)
    }
  }
}

async function createSampleData() {
  console.log("📊 Creando datos de ejemplo adicionales...")

  // Crear cotizaciones de ejemplo
  await createSampleQuotations()

  // Crear órdenes de ejemplo
  await createSampleOrders()

  // Crear tareas Kanban de ejemplo
  await createSampleKanbanTasks()
}

async function createSampleQuotations() {
  console.log("💰 Creando cotizaciones de ejemplo...")

  const { data: clientes } = await supabaseAdmin.from("clients").select("id").limit(3)
  const { data: vehiculos } = await supabaseAdmin.from("vehicles").select("id").limit(3)

  if (!clientes || !vehiculos) return

  const cotizacionesEjemplo = [
    {
      quotation_number: `COT-${new Date().getFullYear()}-001`,
      client_id: clientes[0]?.id,
      vehicle_id: vehiculos[0]?.id,
      date: new Date().toISOString(),
      status: "Pendiente",
      total_labor: 2500.0,
      total_materials: 1200.0,
      total_parts: 1800.0,
      total: 5500.0,
      repair_hours: 12,
      estimated_days: 3,
    },
    {
      quotation_number: `COT-${new Date().getFullYear()}-002`,
      client_id: clientes[1]?.id,
      vehicle_id: vehiculos[1]?.id,
      date: new Date().toISOString(),
      status: "Aprobada",
      total_labor: 3200.0,
      total_materials: 1800.0,
      total_parts: 2200.0,
      total: 7200.0,
      repair_hours: 16,
      estimated_days: 4,
    },
  ]

  for (const cotizacion of cotizacionesEjemplo) {
    const { error } = await supabaseAdmin.from("quotations").insert(cotizacion)

    if (error && !error.message.includes("duplicate")) {
      console.error(`Error al crear cotización:`, error)
    } else {
      console.log(`✓ Cotización ${cotizacion.quotation_number} creada`)
    }
  }
}

async function createSampleOrders() {
  console.log("📋 Creando órdenes de ejemplo...")

  const { data: clientes } = await supabaseAdmin.from("clients").select("id").limit(2)
  const { data: vehiculos } = await supabaseAdmin.from("vehicles").select("id").limit(2)

  if (!clientes || !vehiculos) return

  const ordenesEjemplo = [
    {
      order_number: `ORD-${new Date().getFullYear()}-001`,
      client_id: clientes[0]?.id,
      vehicle_id: vehiculos[0]?.id,
      date: new Date().toISOString(),
      status: "En Progreso",
      total_labor: 2500.0,
      total_materials: 1200.0,
      total_parts: 1800.0,
      total: 5500.0,
      repair_hours: 12,
      estimated_completion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      notes: "Reparación de carrocería y pintura completa",
    },
  ]

  for (const orden of ordenesEjemplo) {
    const { error } = await supabaseAdmin.from("orders").insert(orden)

    if (error && !error.message.includes("duplicate")) {
      console.error(`Error al crear orden:`, error)
    } else {
      console.log(`✓ Orden ${orden.order_number} creada`)
    }
  }
}

async function createSampleKanbanTasks() {
  console.log("📌 Creando tareas Kanban de ejemplo...")

  const { data: columnas } = await supabaseAdmin.from("kanban_columns").select("id, title")
  const { data: ordenes } = await supabaseAdmin.from("orders").select("id").limit(1)

  if (!columnas || columnas.length === 0) return

  const tareasEjemplo = [
    {
      title: "Reparación de carrocería - Puerta delantera",
      description: "Reparar abolladuras y rayones en puerta delantera izquierda",
      column_id: columnas.find((c) => c.title === "Por Hacer")?.id,
      order_id: ordenes?.[0]?.id,
      priority: "Alta",
      due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      position: 1,
    },
    {
      title: "Aplicación de pintura base",
      description: "Aplicar pintura base en área reparada",
      column_id: columnas.find((c) => c.title === "En Progreso")?.id,
      order_id: ordenes?.[0]?.id,
      priority: "Media",
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      position: 1,
    },
    {
      title: "Revisión de calidad",
      description: "Inspección final de acabados",
      column_id: columnas.find((c) => c.title === "En Revisión")?.id,
      order_id: ordenes?.[0]?.id,
      priority: "Alta",
      due_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      position: 1,
    },
  ]

  for (const tarea of tareasEjemplo) {
    if (tarea.column_id) {
      const { error } = await supabaseAdmin.from("kanban_cards").insert(tarea)

      if (error) {
        console.error(`Error al crear tarea Kanban:`, error)
      } else {
        console.log(`✓ Tarea Kanban "${tarea.title}" creada`)
      }
    }
  }
}
