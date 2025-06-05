import CorsChecker from "@/components/cors-checker"

export const metadata = {
  title: "Verificación de CORS",
  description: "Herramienta para verificar la configuración de CORS con Supabase",
}

export default function CorsCheckPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Verificación de CORS</h1>
      <p className="text-gray-600 mb-6">
        Esta herramienta te ayuda a verificar si la configuración de CORS entre tu aplicación y Supabase está
        correctamente configurada.
      </p>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <CorsChecker />
      </div>
    </div>
  )
}
