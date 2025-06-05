import { supabaseAdmin } from "@/lib/supabase/admin-client"

export async function insertTestData() {
  console.log("Insertando datos de prueba en Supabase...")

  try {
    // Insertar clientes de prueba
    await insertClientes()

    // Insertar vehículos de prueba
    await insertVehiculos()

    // Insertar talleres de prueba
    await insertTalleres()

    // Insertar aseguradoras de prueba
    await insertAseguradoras()

    // Insertar cotizaciones de prueba
    await insertCotizaciones()

    // Insertar órdenes de prueba
    await insertOrdenes()

    // Insertar materiales de inventario de prueba
    await insertMateriales()

    // Insertar tareas de Kanban de prueba
    await insertKanbanTasks()

    console.log("Datos de prueba insertados correctamente.")
  } catch (error) {
    console.error("Error al insertar datos de prueba:", error)
  }
}

async function insertClientes() {
  const clientes = [
    {
      name: "Juan Pérez",
      phone: "55123456",
      email: "juan.perez@example.com",
      client_type: "Individual",
    },
    {
      name: "María López",
      phone: "55789012",
      email: "maria.lopez@example.com",
      client_type: "Individual",
    },
    {
      name: "Transportes Rápidos",
      company: "Transportes Rápidos S.A.",
      phone: "55345678",
      email: "info@transportesrapidos.com",
      client_type: "Flota",
    },
    {
      name: "Distribuidora Central",
      company: "Distribuidora Central S.A.",
      phone: "55901234",
      email: "contacto@distribuidoracentral.com",
      client_type: "Empresa",
    },
    {
      name: "Seguros Confianza",
      company: "Seguros Confianza S.A.",
      phone: "55567890",
      email: "info@segurosconfianza.com",
      client_type: "Aseguradora",
    },
  ]

  // Verificar si ya existen clientes
  const { data: existingClients } = await supabaseAdmin.from("clients").select("*").limit(1)

  if (existingClients && existingClients.length > 0) {
    console.log("Ya existen clientes en la base de datos. Omitiendo inserción.")
    return
  }

  for (const cliente of clientes) {
    const { error } = await supabaseAdmin.from("clients").insert(cliente)
    if (error) {
      console.error(`Error al insertar cliente ${cliente.name}:`, error)
    } else {
      console.log(`Cliente ${cliente.name} insertado correctamente.`)
    }
  }
}

async function insertVehiculos() {
  // Obtener IDs de clientes
  const { data: clientes } = await supabaseAdmin.from("clients").select("id, name")

  if (!clientes || clientes.length === 0) {
    console.log("No hay clientes para asociar vehículos. Omitiendo inserción de vehículos.")
    return
  }

  // Verificar si ya existen vehículos
  const { data: existingVehicles } = await supabaseAdmin.from("vehicles").select("*").limit(1)

  if (existingVehicles && existingVehicles.length > 0) {
    console.log("Ya existen vehículos en la base de datos. Omitiendo inserción.")
    return
  }

  const vehiculos = [
    {
      client_id: clientes[0].id,
      make: "Toyota",
      model: "Corolla",
      year: 2019,
      color: "Blanco",
      vin: "1NXBR32E84Z123456",
      license_plate: "ABC123",
      mileage: 45000,
    },
    {
      client_id: clientes[0].id,
      make: "Honda",
      model: "Civic",
      year: 2020,
      color: "Azul",
      vin: "2HGFC2F54LH123456",
      license_plate: "XYZ789",
      mileage: 30000,
    },
    {
      client_id: clientes[1].id,
      make: "Nissan",
      model: "Sentra",
      year: 2018,
      color: "Gris",
      vin: "3N1AB7AP8JL123456",
      license_plate: "DEF456",
      mileage: 60000,
    },
    {
      client_id: clientes[2].id,
      make: "Ford",
      model: "Transit",
      year: 2021,
      color: "Blanco",
      vin: "1FTBW3XM6HK123456",
      license_plate: "GHI789",
      mileage: 25000,
    },
    {
      client_id: clientes[2].id,
      make: "Mercedes-Benz",
      model: "Sprinter",
      year: 2020,
      color: "Plata",
      vin: "WD3PE7CC5G5123456",
      license_plate: "JKL012",
      mileage: 35000,
    },
    {
      client_id: clientes[3].id,
      make: "Chevrolet",
      model: "Silverado",
      year: 2019,
      color: "Rojo",
      vin: "1GCUYDED5K1123456",
      license_plate: "MNO345",
      mileage: 50000,
    },
  ]

  for (const vehiculo of vehiculos) {
    const { error } = await supabaseAdmin.from("vehicles").insert(vehiculo)
    if (error) {
      console.error(`Error al insertar vehículo ${vehiculo.make} ${vehiculo.model}:`, error)
    } else {
      console.log(`Vehículo ${vehiculo.make} ${vehiculo.model} insertado correctamente.`)
    }
  }
}

async function insertTalleres() {
  // Verificar si ya existen talleres
  const { data: existingTalleres } = await supabaseAdmin.from("talleres").select("*").limit(1)

  if (existingTalleres && existingTalleres.length > 0) {
    console.log("Ya existen talleres en la base de datos. Omitiendo inserción.")
    return
  }

  const talleres = [
    {
      nombre: "Taller Mecánico Express",
      direccion: "Calle Principal 123, Ciudad",
      telefono: "55123456",
      email: "contacto@tallerexpress.com",
      especialidades: ["mecanica", "frenos", "suspension"],
      estado: "Activo",
      descripcion: "Taller especializado en reparaciones rápidas y mantenimiento preventivo.",
    },
    {
      nombre: "Auto Pintura Profesional",
      direccion: "Avenida Central 456, Ciudad",
      telefono: "55789012",
      email: "info@autopintura.com",
      especialidades: ["pintura", "carroceria"],
      estado: "Activo",
      descripcion: "Especialistas en pintura automotriz y reparación de carrocería.",
    },
    {
      nombre: "Servicio Eléctrico Automotriz",
      direccion: "Boulevard Norte 789, Ciudad",
      telefono: "55345678",
      email: "servicio@electricoauto.com",
      especialidades: ["electrica", "diagnostico"],
      estado: "Activo",
      descripcion: "Expertos en sistemas eléctricos y diagnóstico computarizado.",
    },
    {
      nombre: "Taller Integral Automotriz",
      direccion: "Calzada Sur 012, Ciudad",
      telefono: "55901234",
      email: "contacto@integralautomotriz.com",
      especialidades: ["mecanica", "pintura", "carroceria", "electrica", "aire", "frenos", "suspension"],
      estado: "Activo",
      descripcion: "Servicio completo para todo tipo de vehículos.",
    },
  ]

  for (const taller of talleres) {
    const { error } = await supabaseAdmin.from("talleres").insert(taller)
    if (error) {
      console.error(`Error al insertar taller ${taller.nombre}:`, error)
    } else {
      console.log(`Taller ${taller.nombre} insertado correctamente.`)
    }
  }
}

async function insertAseguradoras() {
  // Verificar si ya existen aseguradoras
  const { data: existingAseguradoras } = await supabaseAdmin.from("aseguradoras").select("*").limit(1)

  if (existingAseguradoras && existingAseguradoras.length > 0) {
    console.log("Ya existen aseguradoras en la base de datos. Omitiendo inserción.")
    return
  }

  const aseguradoras = [
    {
      nombre: "Seguros Confianza",
      corrreo: "contacto@segurosconfianza.com",
      telefono: "55123456",
      estado_tributario: "Contribuyente",
      nivel_tarifa: "Premium",
    },
    {
      nombre: "Aseguradora Protección Total",
      corrreo: "info@protecciontotal.com",
      telefono: "55789012",
      estado_tributario: "Contribuyente",
      nivel_tarifa: "Estándar",
    },
    {
      nombre: "Seguros Económicos",
      corrreo: "ventas@seguroseconomicos.com",
      telefono: "55345678",
      estado_tributario: "Pequeño Contribuyente",
      nivel_tarifa: "Básico",
    },
    {
      nombre: "Aseguradora Premium",
      corrreo: "premium@aseguradorapremium.com",
      telefono: "55901234",
      estado_tributario: "Contribuyente",
      nivel_tarifa: "Premium",
    },
  ]

  for (const aseguradora of aseguradoras) {
    const { error } = await supabaseAdmin.from("aseguradoras").insert(aseguradora)
    if (error) {
      console.error(`Error al insertar aseguradora ${aseguradora.nombre}:`, error)
    } else {
      console.log(`Aseguradora ${aseguradora.nombre} insertada correctamente.`)
    }
  }
}

async function insertCotizaciones() {
  // Obtener IDs de clientes y vehículos
  const { data: clientes } = await supabaseAdmin.from("clients").select("id")
  const { data: vehiculos } = await supabaseAdmin.from("vehicles").select("id, client_id")

  if (!clientes || clientes.length === 0 || !vehiculos || vehiculos.length === 0) {
    console.log("No hay clientes o vehículos para asociar cotizaciones. Omitiendo inserción.")
    return
  }

  // Verificar si ya existen cotizaciones
  const { data: existingCotizaciones } = await supabaseAdmin.from("quotations").select("*").limit(1)

  if (existingCotizaciones && existingCotizaciones.length > 0) {
    console.log("Ya existen cotizaciones en la base de datos. Omitiendo inserción.")
    return
  }

  // Crear cotizaciones
  const cotizaciones = [
    {
      quotation_number: "COT-2023-001",
      client_id: clientes[0].id,
      vehicle_id: vehiculos[0].id,
      date: new Date().toISOString(),
      status: "Pendiente",
      total_labor: 1500,
      total_materials: 800,
      total_parts: 1200,
      total: 3500,
      repair_hours: 8,
      estimated_days: 2,
    },
    {
      quotation_number: "COT-2023-002",
      client_id: clientes[1].id,
      vehicle_id: vehiculos[2].id,
      date: new Date().toISOString(),
      status: "Aprobada",
      total_labor: 2000,
      total_materials: 1200,
      total_parts: 1800,
      total: 5000,
      repair_hours: 12,
      estimated_days: 3,
    },
    {
      quotation_number: "COT-2023-003",
      client_id: clientes[2].id,
      vehicle_id: vehiculos[3].id,
      date: new Date().toISOString(),
      status: "Rechazada",
      total_labor: 3000,
      total_materials: 1500,
      total_parts: 2500,
      total: 7000,
      repair_hours: 16,
      estimated_days: 4,
    },
  ]

  for (const cotizacion of cotizaciones) {
    const { data, error } = await supabaseAdmin.from("quotations").insert(cotizacion).select()

    if (error) {
      console.error(`Error al insertar cotización ${cotizacion.quotation_number}:`, error)
      continue
    }

    console.log(`Cotización ${cotizacion.quotation_number} insertada correctamente.`)

    // Insertar partes de la cotización
    const partesCotizacion = [
      {
        quotation_id: data[0].id,
        category: "Carrocería",
        name: "Puerta delantera",
        quantity: 1,
        operation: "Rep",
        material_type: "HI",
        repair_type: "GN",
        repair_hours: 3,
        labor_cost: 600,
        materials_cost: 300,
        parts_cost: 500,
        total: 1400,
      },
      {
        quotation_id: data[0].id,
        category: "Pintura",
        name: "Pintura general",
        quantity: 1,
        operation: "Cam",
        material_type: "PL",
        repair_type: "MM",
        repair_hours: 5,
        labor_cost: 900,
        materials_cost: 500,
        parts_cost: 700,
        total: 2100,
      },
    ]

    for (const parte of partesCotizacion) {
      const { error: parteError } = await supabaseAdmin.from("quotation_parts").insert(parte)
      if (parteError) {
        console.error(`Error al insertar parte de cotización:`, parteError)
      }
    }
  }
}

async function insertOrdenes() {
  // Obtener IDs de clientes, vehículos y cotizaciones
  const { data: clientes } = await supabaseAdmin.from("clients").select("id")
  const { data: vehiculos } = await supabaseAdmin.from("vehicles").select("id, client_id")
  const { data: cotizaciones } = await supabaseAdmin
    .from("quotations")
    .select("id, client_id, vehicle_id")
    .eq("status", "Aprobada")

  if (!clientes || clientes.length === 0 || !vehiculos || vehiculos.length === 0) {
    console.log("No hay clientes o vehículos para asociar órdenes. Omitiendo inserción.")
    return
  }

  // Verificar si ya existen órdenes
  const { data: existingOrdenes } = await supabaseAdmin.from("orders").select("*").limit(1)

  if (existingOrdenes && existingOrdenes.length > 0) {
    console.log("Ya existen órdenes en la base de datos. Omitiendo inserción.")
    return
  }

  // Crear órdenes
  const ordenes = [
    {
      order_number: "ORD-2023-001",
      client_id: clientes[0].id,
      vehicle_id: vehiculos[0].id,
      quotation_id: cotizaciones && cotizaciones.length > 0 ? cotizaciones[0].id : null,
      date: new Date().toISOString(),
      status: "En Progreso",
      total_labor: 1500,
      total_materials: 800,
      total_parts: 1200,
      total: 3500,
      repair_hours: 8,
      estimated_completion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 días después
      notes: "Cliente solicita revisión adicional del sistema eléctrico.",
    },
    {
      order_number: "ORD-2023-002",
      client_id: clientes[1].id,
      vehicle_id: vehiculos[2].id,
      quotation_id: null,
      date: new Date().toISOString(),
      status: "Completada",
      total_labor: 2000,
      total_materials: 1200,
      total_parts: 1800,
      total: 5000,
      repair_hours: 12,
      estimated_completion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 día antes (ya completada)
      completion_date: new Date().toISOString(),
      notes: "Trabajo completado satisfactoriamente. Cliente conforme con el servicio.",
    },
  ]

  for (const orden of ordenes) {
    const { data, error } = await supabaseAdmin.from("orders").insert(orden).select()

    if (error) {
      console.error(`Error al insertar orden ${orden.order_number}:`, error)
      continue
    }

    console.log(`Orden ${orden.order_number} insertada correctamente.`)

    // Insertar detalles de la orden
    const detallesOrden = [
      {
        order_id: data[0].id,
        category: "Carrocería",
        name: "Reparación de puerta delantera",
        quantity: 1,
        operation: "Rep",
        material_type: "HI",
        repair_type: "GN",
        repair_hours: 3,
        labor_cost: 600,
        materials_cost: 300,
        parts_cost: 500,
        total: 1400,
        status: "Completado",
      },
      {
        order_id: data[0].id,
        category: "Pintura",
        name: "Pintura general",
        quantity: 1,
        operation: "Cam",
        material_type: "PL",
        repair_type: "MM",
        repair_hours: 5,
        labor_cost: 900,
        materials_cost: 500,
        parts_cost: 700,
        total: 2100,
        status: "En Progreso",
      },
    ]

    for (const detalle of detallesOrden) {
      const { error: detalleError } = await supabaseAdmin.from("order_details").insert(detalle)
      if (detalleError) {
        console.error(`Error al insertar detalle de orden:`, detalleError)
      }
    }
  }
}

async function insertMateriales() {
  // Verificar si ya existen materiales
  const { data: existingMateriales } = await supabaseAdmin.from("materiales").select("*").limit(1)

  if (existingMateriales && existingMateriales.length > 0) {
    console.log("Ya existen materiales en la base de datos. Omitiendo inserción.")
    return
  }

  // Obtener categorías de materiales
  const { data: categorias } = await supabaseAdmin.from("categorias_materiales").select("id, nombre")

  if (!categorias || categorias.length === 0) {
    console.log("No hay categorías de materiales. Omitiendo inserción de materiales.")
    return
  }

  const categoriaPintura = categorias.find((cat) => cat.nombre === "Pintura")
  const categoriaCarroceria = categorias.find((cat) => cat.nombre === "Carrocería")
  const categoriaMecanica = categorias.find((cat) => cat.nombre === "Mecánica")
  const categoriaElectrica = categorias.find((cat) => cat.nombre === "Eléctrica")

  const materiales = [
    {
      codigo: "PIN-001",
      nombre: "Pintura Automotriz Roja",
      descripcion: "Pintura acrílica de alta calidad color rojo",
      categoria_id: categoriaPintura?.id,
      tipo_material: "PL",
      unidad_medida: "Litro",
      costo_unitario: 250,
      precio_venta: 375,
      stock_actual: 20,
      stock_minimo: 5,
      ubicacion: "Estante A-1",
      es_material_pintura: true,
    },
    {
      codigo: "PIN-002",
      nombre: "Pintura Automotriz Azul",
      descripcion: "Pintura acrílica de alta calidad color azul",
      categoria_id: categoriaPintura?.id,
      tipo_material: "PL",
      unidad_medida: "Litro",
      costo_unitario: 250,
      precio_venta: 375,
      stock_actual: 15,
      stock_minimo: 5,
      ubicacion: "Estante A-2",
      es_material_pintura: true,
    },
    {
      codigo: "PIN-003",
      nombre: "Barniz Transparente",
      descripcion: "Barniz de acabado brillante",
      categoria_id: categoriaPintura?.id,
      tipo_material: "PL",
      unidad_medida: "Litro",
      costo_unitario: 300,
      precio_venta: 450,
      stock_actual: 10,
      stock_minimo: 3,
      ubicacion: "Estante A-3",
      es_material_pintura: true,
    },
    {
      codigo: "CAR-001",
      nombre: "Lámina de Acero",
      descripcion: "Lámina de acero para reparación de carrocería",
      categoria_id: categoriaCarroceria?.id,
      tipo_material: "HI",
      unidad_medida: "Metro",
      costo_unitario: 180,
      precio_venta: 270,
      stock_actual: 8,
      stock_minimo: 2,
      ubicacion: "Estante B-1",
      es_material_pintura: false,
    },
    {
      codigo: "CAR-002",
      nombre: "Masilla para Carrocería",
      descripcion: "Masilla para relleno y nivelación",
      categoria_id: categoriaCarroceria?.id,
      tipo_material: "PL",
      unidad_medida: "Kilogramo",
      costo_unitario: 120,
      precio_venta: 180,
      stock_actual: 25,
      stock_minimo: 5,
      ubicacion: "Estante B-2",
      es_material_pintura: false,
    },
    {
      codigo: "MEC-001",
      nombre: "Aceite de Motor",
      descripcion: "Aceite sintético para motor",
      categoria_id: categoriaMecanica?.id,
      tipo_material: "PL",
      unidad_medida: "Litro",
      costo_unitario: 150,
      precio_venta: 225,
      stock_actual: 30,
      stock_minimo: 10,
      ubicacion: "Estante C-1",
      es_material_pintura: false,
    },
    {
      codigo: "ELE-001",
      nombre: "Cable Eléctrico",
      descripcion: "Cable para instalaciones eléctricas",
      categoria_id: categoriaElectrica?.id,
      tipo_material: "PL",
      unidad_medida: "Metro",
      costo_unitario: 15,
      precio_venta: 22.5,
      stock_actual: 100,
      stock_minimo: 20,
      ubicacion: "Estante D-1",
      es_material_pintura: false,
    },
  ]

  for (const material of materiales) {
    const { error } = await supabaseAdmin.from("materiales").insert(material)
    if (error) {
      console.error(`Error al insertar material ${material.nombre}:`, error)
    } else {
      console.log(`Material ${material.nombre} insertado correctamente.`)
    }
  }
}

async function insertKanbanTasks() {
  // Obtener columnas Kanban
  const { data: columns } = await supabaseAdmin.from("kanban_columns").select("id, title")

  if (!columns || columns.length === 0) {
    console.log("No hay columnas Kanban. Omitiendo inserción de tareas.")
    return
  }

  // Verificar si ya existen tareas
  const { data: existingTasks } = await supabaseAdmin.from("kanban_tasks").select("*").limit(1)

  if (existingTasks && existingTasks.length > 0) {
    console.log("Ya existen tareas Kanban en la base de datos. Omitiendo inserción.")
    return
  }

  // Obtener órdenes
  const { data: orders } = await supabaseAdmin.from("orders").select("id, order_number")

  // Crear tareas Kanban
  const tasks = [
    {
      title: "Reparación de carrocería",
      description: "Reparar abolladuras en la puerta delantera izquierda",
      column_id: columns[0].id, // Por Hacer
      order_id: orders && orders.length > 0 ? orders[0].id : null,
      priority: "Alta",
      assigned_to: null,
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 días después
    },
    {
      title: "Pintura general",
      description: "Aplicar pintura y barniz en todo el vehículo",
      column_id: columns[1].id, // En Progreso
      order_id: orders && orders.length > 0 ? orders[0].id : null,
      priority: "Media",
      assigned_to: null,
      due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 días después
    },
    {
      title: "Cambio de aceite",
      description: "Realizar cambio de aceite y filtro",
      column_id: columns[2].id, // En Revisión
      order_id: orders && orders.length > 1 ? orders[1].id : null,
      priority: "Baja",
      assigned_to: null,
      due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 día después
    },
    {
      title: "Alineación y balanceo",
      description: "Realizar alineación y balanceo de ruedas",
      column_id: columns[3].id, // Completado
      order_id: orders && orders.length > 1 ? orders[1].id : null,
      priority: "Media",
      assigned_to: null,
      due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 día antes (ya completada)
      completed_at: new Date().toISOString(),
    },
  ]

  for (const task of tasks) {
    const { error } = await supabaseAdmin.from("kanban_tasks").insert(task)
    if (error) {
      console.error(`Error al insertar tarea Kanban ${task.title}:`, error)
    } else {
      console.log(`Tarea Kanban ${task.title} insertada correctamente.`)
    }
  }
}
