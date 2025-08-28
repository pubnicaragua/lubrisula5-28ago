import { CotizacionesPage } from "@/components/cotizaciones/cotizaciones-page"
import { getSupabaseServer } from "@/lib/supabase/server"

export default async function CotizacionesRoute() {
  const supabase = getSupabaseServer()

  // Verificar si las tablas necesarias existen
  const { data: tablesExist, error: tablesError } = await (await supabase).rpc("execute_sql", {
    sql_query: `
      SELECT 
        EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quotations') AS quotations_exists,
        EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clients') AS clients_exists,
        EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'vehicles') AS vehicles_exists,
        EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quotation_parts') AS quotation_parts_exists
      ;
    `,
  })

  const allTablesExist =
    tablesExist &&
    tablesExist.length > 0 &&
    tablesExist[0].quotations_exists &&
    tablesExist[0].clients_exists &&
    tablesExist[0].vehicles_exists &&
    tablesExist[0].quotation_parts_exists

  // Si todas las tablas existen, obtener las cotizaciones
  let cotizaciones = []
  if (allTablesExist) {
    const { data, error } = await (await supabase)
      .from("quotations")
      .select(`*, client:clients(name), vehicle:vehicles(make, model, year)`)
      .order("created_at", { ascending: false })

    if (!error && data) {
      cotizaciones = data
    }
  }

  return <CotizacionesPage initialCotizaciones={cotizaciones} tablesExist={allTablesExist} />
}
