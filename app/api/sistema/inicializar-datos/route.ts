import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST() {
  try {
    // Verificar que estamos usando las variables de entorno correctas
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Variables de entorno no configuradas",
        },
        { status: 500 },
      )
    }

    // Crear cliente de Supabase con la clave de servicio
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // SQL para insertar datos de ejemplo
    const sql = `
    -- Insertar cliente de ejemplo
    INSERT INTO clients (name, phone, email, client_type)
    VALUES 
      ('Cliente Demo', '123456789', 'cliente@demo.com', 'Individual'),
      ('Empresa ABC', '987654321', 'contacto@empresaabc.com', 'Empresa'),
      ('Juan Pérez', '555123456', 'juan@example.com', 'Individual')
    ON CONFLICT DO NOTHING;

    -- Obtener IDs de clientes e insertar vehículos
    DO $$
    DECLARE
      cliente_demo_id UUID;
      empresa_abc_id UUID;
      juan_perez_id UUID;
    BEGIN
      SELECT id INTO cliente_demo_id FROM clients WHERE name = 'Cliente Demo' LIMIT 1;
      SELECT id INTO empresa_abc_id FROM clients WHERE name = 'Empresa ABC' LIMIT 1;
      SELECT id INTO juan_perez_id FROM clients WHERE name = 'Juan Pérez' LIMIT 1;
      
      -- Insertar vehículos de ejemplo
      IF cliente_demo_id IS NOT NULL THEN
        INSERT INTO vehicles (client_id, marca, modelo, ano, color, placa)
        VALUES 
          (cliente_demo_id, 'Toyota', 'Corolla', 2020, 'Rojo', 'ABC123'),
          (cliente_demo_id, 'Honda', 'Civic', 2019, 'Azul', 'XYZ789')
        ON CONFLICT DO NOTHING;
      END IF;
      
      IF empresa_abc_id IS NOT NULL THEN
        INSERT INTO vehicles (client_id, marca, modelo, ano, color, placa)
        VALUES 
          (empresa_abc_id, 'Ford', 'Ranger', 2021, 'Blanco', 'DEF456'),
          (empresa_abc_id, 'Chevrolet', 'Silverado', 2022, 'Negro', 'GHI789')
        ON CONFLICT DO NOTHING;
      END IF;
      
      IF juan_perez_id IS NOT NULL THEN
        INSERT INTO vehicles (client_id, marca, modelo, ano, color, placa)
        VALUES 
          (juan_perez_id, 'Nissan', 'Sentra', 2018, 'Gris', 'JKL012')
        ON CONFLICT DO NOTHING;
      END IF;
    END $$;

    -- Insertar materiales de ejemplo
    INSERT INTO materiales (nombre, descripcion, categoria, precio, stock, unidad)
    VALUES 
      ('Pintura Automotriz Roja', 'Pintura de alta calidad', 'Pintura', 150.00, 20, 'Litro'),
      ('Pintura Automotriz Azul', 'Pintura de alta calidad', 'Pintura', 150.00, 15, 'Litro'),
      ('Pintura Automotriz Blanca', 'Pintura de alta calidad', 'Pintura', 140.00, 25, 'Litro'),
      ('Pintura Automotriz Negra', 'Pintura de alta calidad', 'Pintura', 160.00, 18, 'Litro'),
      ('Lija Fina', 'Lija para acabados', 'Herramientas', 5.00, 100, 'Unidad'),
      ('Lija Media', 'Lija para preparación', 'Herramientas', 4.50, 120, 'Unidad'),
      ('Lija Gruesa', 'Lija para desbaste', 'Herramientas', 4.00, 80, 'Unidad'),
      ('Masilla', 'Masilla para reparaciones', 'Reparación', 25.00, 30, 'Kilo'),
      ('Sellador', 'Sellador para juntas', 'Reparación', 18.00, 25, 'Tubo'),
      ('Cinta de Enmascarar', 'Cinta para protección', 'Herramientas', 3.50, 50, 'Rollo'),
      ('Thinner', 'Diluyente para pintura', 'Pintura', 12.00, 40, 'Litro'),
      ('Barniz', 'Barniz transparente', 'Pintura', 85.00, 15, 'Litro')
    ON CONFLICT DO NOTHING;

    -- Insertar talleres de ejemplo
    INSERT INTO talleres (nombre, direccion, especialidades, descripcion)
    VALUES 
      ('Taller Mecánico Express', 'Calle Principal 123', ARRAY['Mecánica General', 'Electricidad'], 'Taller especializado en reparaciones rápidas'),
      ('Auto Pintura Pro', 'Avenida Central 456', ARRAY['Pintura', 'Carrocería'], 'Especialistas en pintura y reparación de carrocería'),
      ('Servicio Integral Automotriz', 'Boulevard Norte 789', ARRAY['Mecánica General', 'Electricidad', 'Pintura', 'Carrocería'], 'Servicio completo para su vehículo')
    ON CONFLICT DO NOTHING;

    -- Insertar aseguradoras de ejemplo
    INSERT INTO aseguradoras (nombre, direccion, nivel_servicio)
    VALUES 
      ('Seguros Confianza', 'Plaza Comercial 123', 'Premium'),
      ('Protección Total', 'Torre Empresarial 456', 'Estándar'),
      ('Aseguradora Rápida', 'Centro Financiero 789', 'Básico')
    ON CONFLICT DO NOTHING;

    -- Obtener IDs para crear cotizaciones
    DO $$
    DECLARE
      cliente_id UUID;
      vehiculo_id UUID;
    BEGIN
      SELECT c.id INTO cliente_id FROM clients c WHERE c.name = 'Cliente Demo' LIMIT 1;
      
      IF cliente_id IS NOT NULL THEN
        SELECT v.id INTO vehiculo_id FROM vehicles v WHERE v.client_id = cliente_id LIMIT 1;
        
        IF vehiculo_id IS NOT NULL THEN
          -- Insertar cotización de ejemplo
          INSERT INTO quotations (client_id, vehicle_id, estado, total, descripcion)
          VALUES (cliente_id, vehiculo_id, 'pendiente', 1500.00, 'Reparación de golpe en puerta delantera y pintura')
          ON CONFLICT DO NOTHING;
          
          -- Obtener ID de la cotización
          DECLARE
            cotizacion_id UUID;
          BEGIN
            SELECT q.id INTO cotizacion_id FROM quotations q 
            WHERE q.client_id = cliente_id AND q.vehicle_id = vehiculo_id
            LIMIT 1;
            
            IF cotizacion_id IS NOT NULL THEN
              -- Insertar partes de cotización
              INSERT INTO quotation_parts (quotation_id, descripcion, cantidad, precio_unitario, subtotal)
              VALUES 
                (cotizacion_id, 'Reparación de abolladuras', 1, 500.00, 500.00),
                (cotizacion_id, 'Pintura de puerta', 1, 800.00, 800.00),
                (cotizacion_id, 'Materiales varios', 1, 200.00, 200.00)
              ON CONFLICT DO NOTHING;
              
              -- Insertar orden de ejemplo
              INSERT INTO orders (quotation_id, client_id, vehicle_id, estado, total, descripcion)
              VALUES (cotizacion_id, cliente_id, vehiculo_id, 'en_progreso', 1500.00, 'Orden generada desde cotización')
              ON CONFLICT DO NOTHING;
              
              -- Obtener ID de la orden
              DECLARE
                orden_id UUID;
              BEGIN
                SELECT o.id INTO orden_id FROM orders o 
                WHERE o.quotation_id = cotizacion_id
                LIMIT 1;
                
                IF orden_id IS NOT NULL THEN
                  -- Insertar detalles de orden
                  INSERT INTO order_details (order_id, descripcion, cantidad, precio_unitario, subtotal, estado)
                  VALUES 
                    (orden_id, 'Reparación de abolladuras', 1, 500.00, 500.00, 'en_progreso'),
                    (orden_id, 'Pintura de puerta', 1, 800.00, 800.00, 'pendiente'),
                    (orden_id, 'Materiales varios', 1, 200.00, 200.00, 'pendiente')
                  ON CONFLICT DO NOTHING;
                END IF;
              END;
            END IF;
          END;
        END IF;
      END IF;
    END $$;

    -- Insertar tarjetas Kanban de ejemplo
    DO $$
    DECLARE
      columna_por_hacer_id UUID;
      columna_en_progreso_id UUID;
      cliente_id UUID;
      vehiculo_id UUID;
    BEGIN
      SELECT id INTO columna_por_hacer_id FROM kanban_columns WHERE title = 'Por Hacer' LIMIT 1;
      SELECT id INTO columna_en_progreso_id FROM kanban_columns WHERE title = 'En Progreso' LIMIT 1;
      SELECT c.id INTO cliente_id FROM clients c WHERE c.name = 'Cliente Demo' LIMIT 1;
      
      IF cliente_id IS NOT NULL THEN
        SELECT v.id INTO vehiculo_id FROM vehicles v WHERE v.client_id = cliente_id LIMIT 1;
      END IF;
      
      IF columna_por_hacer_id IS NOT NULL THEN
        INSERT INTO kanban_cards (column_id, title, description, client_name, vehicle_id, priority, position)
        VALUES 
          (columna_por_hacer_id, 'Revisar frenos', 'Cliente reporta ruido al frenar', 'Cliente Demo', vehiculo_id, 'alta', 0),
          (columna_por_hacer_id, 'Cambio de aceite', 'Mantenimiento preventivo', 'Empresa ABC', NULL, 'normal', 1)
        ON CONFLICT DO NOTHING;
      END IF;
      
      IF columna_en_progreso_id IS NOT NULL THEN
        INSERT INTO kanban_cards (column_id, title, description, client_name, vehicle_id, priority, position)
        VALUES 
          (columna_en_progreso_id, 'Reparación de puerta', 'Reparar abolladuras y pintar', 'Cliente Demo', vehiculo_id, 'normal', 0)
        ON CONFLICT DO NOTHING;
      END IF;
    END $$;
    `

    // Ejecutar el SQL
    const { error } = await supabase.rpc("execute_sql", { sql_query: sql })

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: "Error al ejecutar SQL para datos de ejemplo",
          details: error.message,
        },
        { status: 500 },
      )
    }

    // Contar registros insertados
    const counts = {}
    const tables = [
      "clients",
      "vehicles",
      "materiales",
      "talleres",
      "aseguradoras",
      "quotations",
      "orders",
      "kanban_cards",
    ]

    for (const table of tables) {
      const { count, error: countError } = await supabase.from(table).select("*", { count: "exact", head: true })

      if (!countError) {
        counts[table] = count
      }
    }

    return NextResponse.json({
      success: true,
      message: "Datos de ejemplo insertados correctamente",
      registros: counts,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Error al inicializar datos de ejemplo",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
