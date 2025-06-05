import { supabaseClient } from "@/lib/supabase/client"

export async function checkAndCreateRoles() {
  console.log("Verificando roles en la base de datos...")

  const roles = [
    { id: 1, nombre: "Cliente" },
    { id: 2, nombre: "Taller" },
    { id: 3, nombre: "Aseguradora" },
    { id: 4, nombre: "SuperAdmin" },
  ]

  for (const role of roles) {
    // Verificar si el rol existe
    const { data, error } = await supabaseClient.from("roles").select("*").eq("id", role.id).single()

    if (error || !data) {
      // Si no existe, crearlo
      console.log(`Creando rol: ${role.nombre}`)
      const { error: insertError } = await supabaseClient.from("roles").insert(role)

      if (insertError) {
        console.error(`Error al crear rol ${role.nombre}:`, insertError)
      } else {
        console.log(`Rol ${role.nombre} creado exitosamente`)
      }
    } else {
      console.log(`Rol ${role.nombre} ya existe`)
    }
  }
}
