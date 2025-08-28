import { VehiculosPage } from "@/components/vehiculos/vehiculos-page"
import { getSupabaseServer } from "@/lib/supabase/server"

export default async function VehiculosRoute() {
  const supabase = await getSupabaseServer()

  // Verificar si la tabla vehicles existe
  const { data: tableExists, error: tableError } = await supabase.rpc("execute_sql", {
    sql_query: `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'vehicles'
      );
    `,
  })

  const vehiclesTableExists = tableExists && tableExists.length > 0 && tableExists[0].exists

  // Si la tabla existe, obtener los vehículos con información del cliente
  let vehicles = []
  if (vehiclesTableExists) {
    const { data, error } = await supabase
      .from("vehicles")
      .select(`*, client:clients(name)`)
      .order("created_at", { ascending: false })

    if (!error && data) {
      vehicles = data
    }
  }

  // Obtener clientes para el formulario de nuevo vehículo
  let clients = []
  const { data: clientsData, error: clientsError } = await supabase.from("clients").select("id, name")
  if (!clientsError && clientsData) {
    clients = clientsData
  }

  return <VehiculosPage
  // initialVehicles={vehicles}
  //  clients={clients}
  // tableExists={vehiclesTableExists}
  />
}
