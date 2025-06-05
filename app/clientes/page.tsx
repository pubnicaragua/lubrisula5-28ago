import { ClientesPage } from "@/components/clientes/clientes-page"
import { createClient } from "@/lib/supabase/server"

export default async function ClientesRoute() {
  const supabase = createClient()

  // Verificar si la tabla clients existe
  const { data: tableExists, error: tableError } = await supabase.rpc("execute_sql", {
    sql_query: `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'clients'
      );
    `,
  })

  const clientsTableExists = tableExists && tableExists.length > 0 && tableExists[0].exists

  // Si la tabla existe, obtener los clientes
  let clients = []
  if (clientsTableExists) {
    const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false })
    if (!error && data) {
      clients = data
    }
  }

  return <ClientesPage initialClients={clients} tableExists={clientsTableExists} />
}
