import { createClient } from "@/lib/supabase/server"

export async function createMaterialsTables() {
  const supabase = createClient()

  console.log("Iniciando creación de tablas de materiales y procesos...")

  // Crear tabla de suppliers si no existe
  const { error: suppliersError } = await supabase.rpc("execute_sql", {
    sql_query: `
      CREATE TABLE IF NOT EXISTS suppliers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        contact_name TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
  })

  if (suppliersError) {
    console.error("Error al crear tabla suppliers:", suppliersError)
    return { success: false, error: suppliersError.message }
  }

  // Crear tabla de procesos_taller si no existe
  const { error: procesosError } = await supabase.rpc("execute_sql", {
    sql_query: `
      CREATE TABLE IF NOT EXISTS procesos_taller (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre TEXT NOT NULL,
        descripcion TEXT,
        tiempo_estimado INTEGER DEFAULT 0, -- en minutos
        orden INTEGER DEFAULT 0,
        tipo TEXT NOT NULL, -- 'ingreso', 'desarmado', 'reparacion', 'empapelado', 'pintura', 'mecanica', 'armado', etc.
        validaciones TEXT,
        activo BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
  })

  if (procesosError) {
    console.error("Error al crear tabla procesos_taller:", procesosError)
    return { success: false, error: procesosError.message }
  }

  // Crear tabla de materiales
  const { error: materialesError } = await supabase.rpc("execute_sql", {
    sql_query: `
      CREATE TABLE IF NOT EXISTS materiales (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        proceso_id UUID REFERENCES procesos_taller(id),
        nombre TEXT NOT NULL,
        unidad TEXT NOT NULL,
        proveedor_id UUID REFERENCES suppliers(id),
        precio_total DECIMAL(10, 2) DEFAULT 0,
        cantidad DECIMAL(10, 2) DEFAULT 0,
        precio_unitario DECIMAL(10, 2) DEFAULT 0,
        rendimiento_vehiculo DECIMAL(10, 4) DEFAULT 0, -- cantidad usada por vehículo
        rendimiento_hora_reparar DECIMAL(10, 4) DEFAULT 0, -- cantidad usada por hora de reparación
        rendimiento_hora_pintura DECIMAL(10, 4) DEFAULT 0, -- cantidad usada por hora de pintura
        inventario_inicial DECIMAL(10, 2) DEFAULT 0,
        inventario_final DECIMAL(10, 2) DEFAULT 0,
        ajustes DECIMAL(10, 2) DEFAULT 0,
        stock_minimo DECIMAL(10, 2) DEFAULT 0,
        categoria TEXT, -- 'pintura', 'reparacion', 'mecanica', etc.
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
  })

  if (materialesError) {
    console.error("Error al crear tabla materiales:", materialesError)
    return { success: false, error: materialesError.message }
  }

  // Crear tabla de relación entre materiales y órdenes/cotizaciones
  const { error: materialOrdenError } = await supabase.rpc("execute_sql", {
    sql_query: `
      CREATE TABLE IF NOT EXISTS material_orden (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        material_id UUID REFERENCES materiales(id),
        orden_id UUID,
        cantidad DECIMAL(10, 2) DEFAULT 0,
        costo_total DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
  })

  if (materialOrdenError) {
    console.error("Error al crear tabla material_orden:", materialOrdenError)
    return { success: false, error: materialOrdenError.message }
  }

  // Crear tabla de relación entre materiales y cotizaciones
  const { error: materialCotizacionError } = await supabase.rpc("execute_sql", {
    sql_query: `
      CREATE TABLE IF NOT EXISTS material_cotizacion (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        material_id UUID REFERENCES materiales(id),
        cotizacion_id UUID,
        cantidad DECIMAL(10, 2) DEFAULT 0,
        costo_total DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
  })

  if (materialCotizacionError) {
    console.error("Error al crear tabla material_cotizacion:", materialCotizacionError)
    return { success: false, error: materialCotizacionError.message }
  }

  // Crear tabla de paquetes de servicio
  const { error: paquetesError } = await supabase.rpc("execute_sql", {
    sql_query: `
      CREATE TABLE IF NOT EXISTS paquetes_servicio (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre TEXT NOT NULL,
        descripcion TEXT,
        precio_base DECIMAL(10, 2) DEFAULT 0,
        tiempo_estimado INTEGER DEFAULT 0, -- en minutos
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
  })

  if (paquetesError) {
    console.error("Error al crear tabla paquetes_servicio:", paquetesError)
    return { success: false, error: paquetesError.message }
  }

  // Crear tabla de relación entre paquetes y procesos
  const { error: procesosPaqueteError } = await supabase.rpc("execute_sql", {
    sql_query: `
      CREATE TABLE IF NOT EXISTS procesos_paquete (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        paquete_id UUID REFERENCES paquetes_servicio(id),
        proceso_id UUID REFERENCES procesos_taller(id),
        orden INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
  })

  if (procesosPaqueteError) {
    console.error("Error al crear tabla procesos_paquete:", procesosPaqueteError)
    return { success: false, error: procesosPaqueteError.message }
  }

  // Crear índices para mejorar el rendimiento
  const { error: indicesError } = await supabase.rpc("execute_sql", {
    sql_query: `
      CREATE INDEX IF NOT EXISTS idx_materiales_proceso_id ON materiales(proceso_id);
      CREATE INDEX IF NOT EXISTS idx_material_orden_material_id ON material_orden(material_id);
      CREATE INDEX IF NOT EXISTS idx_material_orden_orden_id ON material_orden(orden_id);
      CREATE INDEX IF NOT EXISTS idx_material_cotizacion_material_id ON material_cotizacion(material_id);
      CREATE INDEX IF NOT EXISTS idx_material_cotizacion_cotizacion_id ON material_cotizacion(cotizacion_id);
      CREATE INDEX IF NOT EXISTS idx_procesos_paquete_paquete_id ON procesos_paquete(paquete_id);
      CREATE INDEX IF NOT EXISTS idx_procesos_paquete_proceso_id ON procesos_paquete(proceso_id);
    `,
  })

  if (indicesError) {
    console.error("Error al crear índices:", indicesError)
    return { success: false, error: indicesError.message }
  }

  // Insertar algunos datos de ejemplo para facilitar las pruebas
  const { error: datosEjemploError } = await supabase.rpc("execute_sql", {
    sql_query: `
      -- Insertar proveedor de ejemplo si no existe
      INSERT INTO suppliers (name, contact_name, phone, email)
      SELECT 'Proveedor Demo', 'Contacto Demo', '9999-9999', 'demo@proveedor.com'
      WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Proveedor Demo');

      -- Insertar procesos de ejemplo si no existen
      INSERT INTO procesos_taller (nombre, descripcion, tiempo_estimado, orden, tipo)
      SELECT 'Recepción de Vehículo', 'Proceso inicial de recepción e inspección', 30, 1, 'ingreso'
      WHERE NOT EXISTS (SELECT 1 FROM procesos_taller WHERE nombre = 'Recepción de Vehículo');

      INSERT INTO procesos_taller (nombre, descripcion, tiempo_estimado, orden, tipo)
      SELECT 'Desarmado', 'Desarmado de piezas afectadas', 120, 2, 'desarmado'
      WHERE NOT EXISTS (SELECT 1 FROM procesos_taller WHERE nombre = 'Desarmado');

      INSERT INTO procesos_taller (nombre, descripcion, tiempo_estimado, orden, tipo)
      SELECT 'Reparación de Lámina', 'Reparación de daños en la carrocería', 240, 3, 'reparacion'
      WHERE NOT EXISTS (SELECT 1 FROM procesos_taller WHERE nombre = 'Reparación de Lámina');

      INSERT INTO procesos_taller (nombre, descripcion, tiempo_estimado, orden, tipo)
      SELECT 'Preparación para Pintura', 'Empapelado y preparación de superficies', 90, 4, 'empapelado'
      WHERE NOT EXISTS (SELECT 1 FROM procesos_taller WHERE nombre = 'Preparación para Pintura');

      INSERT INTO procesos_taller (nombre, descripcion, tiempo_estimado, orden, tipo)
      SELECT 'Pintura', 'Aplicación de pintura y acabados', 180, 5, 'pintura'
      WHERE NOT EXISTS (SELECT 1 FROM procesos_taller WHERE nombre = 'Pintura');

      INSERT INTO procesos_taller (nombre, descripcion, tiempo_estimado, orden, tipo)
      SELECT 'Armado', 'Montaje de piezas reparadas', 120, 6, 'armado'
      WHERE NOT EXISTS (SELECT 1 FROM procesos_taller WHERE nombre = 'Armado');

      INSERT INTO procesos_taller (nombre, descripcion, tiempo_estimado, orden, tipo)
      SELECT 'Control de Calidad', 'Verificación final del trabajo', 60, 7, 'control_calidad'
      WHERE NOT EXISTS (SELECT 1 FROM procesos_taller WHERE nombre = 'Control de Calidad');

      INSERT INTO procesos_taller (nombre, descripcion, tiempo_estimado, orden, tipo)
      SELECT 'Entrega', 'Entrega del vehículo al cliente', 30, 8, 'entrega'
      WHERE NOT EXISTS (SELECT 1 FROM procesos_taller WHERE nombre = 'Entrega');
    `,
  })

  if (datosEjemploError) {
    console.error("Error al insertar datos de ejemplo:", datosEjemploError)
    // No retornamos error aquí, ya que los datos de ejemplo no son críticos
  }

  console.log("Tablas de materiales y procesos creadas exitosamente")
  return { success: true }
}
