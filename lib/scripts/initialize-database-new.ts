import { createClient } from "@supabase/supabase-js"

// Crear cliente de Supabase con las nuevas credenciales
const supabaseUrl = process.env.SUPABASE_URL || "https://wcyvgqbtaimkguaslhom.supabase.co"
const supabaseKey =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjeXZncWJ0YWlta2d1YXNsaG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNzQ5MjMsImV4cCI6MjA2Mjc1MDkyM30.fJAXPGUKaXyK1BgNHJx_M-MM7pswqusZtSK2Ji2KQZQ"
const supabase = createClient(supabaseUrl, supabaseKey)

export async function initializeDatabase() {
  try {
    console.log("Iniciando la inicialización de la base de datos...")

    // Verificar la conexión a Supabase
    const { data: connectionTest, error: connectionError } = await supabase.from("roles").select("*").limit(1)

    if (connectionError) {
      throw new Error(`Error al conectar con Supabase: ${connectionError.message}`)
    }

    console.log("Conexión a Supabase establecida correctamente")

    // Aquí puedes agregar código para crear tablas, insertar datos iniciales, etc.
    // Por ejemplo:

    // 1. Crear roles básicos si no existen
    const { error: rolesError } = await supabase
      .from("roles")
      .upsert([{ nombre: "admin" }, { nombre: "taller" }, { nombre: "aseguradora" }, { nombre: "cliente" }], {
        onConflict: "nombre",
      })

    if (rolesError) {
      console.error("Error al crear roles:", rolesError)
    } else {
      console.log("Roles creados o actualizados correctamente")
    }

    // 2. Crear columnas Kanban iniciales si no existen
    const { error: kanbanColumnsError } = await supabase.from("kanban_columns").upsert(
      [
        {
          id: "recepcion",
          title: "Recepción",
          description: "Vehículos en proceso de recepción",
          color: "#1890ff",
          position: 1,
        },
        {
          id: "diagnostico",
          title: "Diagnóstico",
          description: "Vehículos en proceso de diagnóstico",
          color: "#faad14",
          position: 2,
        },
        {
          id: "reparacion",
          title: "Reparación",
          description: "Vehículos en proceso de reparación",
          color: "#722ed1",
          position: 3,
        },
        {
          id: "pintura",
          title: "Pintura",
          description: "Vehículos en proceso de pintura",
          color: "#eb2f96",
          position: 4,
        },
        {
          id: "control_calidad",
          title: "Control de Calidad",
          description: "Vehículos en control de calidad",
          color: "#52c41a",
          position: 5,
        },
        {
          id: "entrega",
          title: "Listo para Entrega",
          description: "Vehículos listos para entrega",
          color: "#13c2c2",
          position: 6,
        },
      ],
      { onConflict: "id" },
    )

    if (kanbanColumnsError) {
      console.error("Error al crear columnas Kanban:", kanbanColumnsError)
    } else {
      console.log("Columnas Kanban creadas o actualizadas correctamente")
    }

    // Crear la tabla quotations
    const createQuotationsTable = `
CREATE TABLE IF NOT EXISTS quotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_number VARCHAR(50) NOT NULL,
  client_id UUID REFERENCES clients(id),
  vehicle_id UUID REFERENCES vehicles(id),
  date DATE NOT NULL,
  status VARCHAR(50) NOT NULL,
  total_labor DECIMAL(10, 2) NOT NULL,
  total_materials DECIMAL(10, 2) NOT NULL,
  total_parts DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  repair_hours DECIMAL(10, 2) NOT NULL,
  estimated_days DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`

    // Crear la tabla quotation_parts
    const createQuotationPartsTable = `
CREATE TABLE IF NOT EXISTS quotation_parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_id UUID REFERENCES quotations(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  operation VARCHAR(10) NOT NULL,
  material_type VARCHAR(10) NOT NULL,
  repair_type VARCHAR(10) NOT NULL,
  repair_hours DECIMAL(10, 2) NOT NULL,
  labor_cost DECIMAL(10, 2) NOT NULL,
  materials_cost DECIMAL(10, 2) NOT NULL,
  parts_cost DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`

    return { success: true, message: "Base de datos inicializada correctamente" }
  } catch (error: any) {
    console.error("Error al inicializar la base de datos:", error)
    return { success: false, message: error.message }
  }
}
