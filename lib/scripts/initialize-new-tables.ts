import { createClient } from "@/lib/supabase/server"
import fs from "fs"
import path from "path"

export async function initializeNewTables() {
  const supabase = createClient()

  try {
    // Leer el archivo SQL
    const sqlFilePath = path.join(process.cwd(), "supabase/migrations/20240512_create_new_tables.sql")
    const sqlContent = fs.readFileSync(sqlFilePath, "utf8")

    // Ejecutar el SQL
    const { error } = await supabase.rpc("execute_sql", { sql_query: sqlContent })

    if (error) {
      console.error("Error executing SQL:", error)
      return { success: false, error: error.message }
    }

    return { success: true, message: "Nuevas tablas creadas correctamente" }
  } catch (error) {
    console.error("Error initializing new tables:", error)
    return { success: false, error: (error as Error).message }
  }
}
