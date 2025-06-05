import { SupabaseConnectionTest } from "@/components/supabase-connection-test"

export default function TestConnectionPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Prueba de Conexión a Supabase</h1>
      <div className="max-w-md mx-auto">
        <SupabaseConnectionTest />
      </div>
    </div>
  )
}
