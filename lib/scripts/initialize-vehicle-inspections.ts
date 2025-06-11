import { createClient } from "@/lib/supabase/admin-client"

export async function initializeVehicleInspections() {
  try {
    const supabase = createClient()

    // Verificar si la tabla ya existe
    const { error: checkError } = await supabase.from("vehicle_inspections").select("id").limit(1)

    if (checkError && checkError.message.includes("does not exist")) {
      // Ejecutar la migración SQL para crear la tabla
      const sql = `
        -- Create vehicle inspections table
        CREATE TABLE IF NOT EXISTS vehicle_inspections (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          interior_items JSONB NOT NULL DEFAULT '[]',
          exterior_items JSONB NOT NULL DEFAULT '[]',
          engine_items JSONB NOT NULL DEFAULT '[]',
          body_items JSONB NOT NULL DEFAULT '[]',
          fuel_level JSONB NOT NULL DEFAULT '{"level": 0}',
          mileage TEXT,
          comments TEXT,
          images TEXT[] DEFAULT '{}',
          client_signature TEXT,
          technician_signature TEXT,
          status TEXT NOT NULL DEFAULT 'draft'
        );
        
        -- Create function to update timestamp if it doesn't exist
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
            CREATE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
              NEW.updated_at = NOW();
              RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
          END IF;
        END
        $$;
        
        -- Create trigger to update timestamp
        DROP TRIGGER IF EXISTS update_vehicle_inspections_updated_at ON vehicle_inspections;
        CREATE TRIGGER update_vehicle_inspections_updated_at
        BEFORE UPDATE ON vehicle_inspections
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
        
        -- Create index for faster lookups
        CREATE INDEX IF NOT EXISTS idx_vehicle_inspections_vehicle_id ON vehicle_inspections(vehicle_id);
      `

      const { error: sqlError } = await supabase.rpc("execute_sql", { sql_query: sql })

      if (sqlError) {
        console.error("Error creating vehicle_inspections table:", sqlError)
        return {
          success: false,
          message: "Error al crear la tabla de inspecciones de vehículos",
          error: sqlError,
        }
      }

      return {
        success: true,
        message: "Tabla de inspecciones de vehículos creada correctamente",
        error: null,
      }
    }

    return {
      success: true,
      message: "La tabla de inspecciones de vehículos ya existe",
      error: null,
    }
  } catch (error) {
    console.error("Error in initializeVehicleInspections:", error)
    return {
      success: false,
      message: "Error al inicializar la tabla de inspecciones de vehículos",
      error,
    }
  }
}
