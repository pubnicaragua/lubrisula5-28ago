import SupabaseConnectionChecker from "@/components/supabase-connection-checker"

export default function CheckSupabasePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Verificación de Conexión a Supabase</h1>
      <SupabaseConnectionChecker />
    </div>
  )
}
