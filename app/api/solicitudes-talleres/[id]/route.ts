import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin-client"
import type { Database } from "@/lib/supabase/database.types"

type Solicitud = Database["public"]["Tables"]["solicitudes_talleres"]["Row"]
type TallerInsert = Database["public"]["Tables"]["talleres"]["Insert"]
type RolesUsuarioInsert = Database["public"]["Tables"]["roles_usuario"]["Insert"]

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const { estado_solicitud } = await request.json()

  if (!id || !estado_solicitud) {
    return NextResponse.json({ error: "ID de solicitud y estado son requeridos" }, { status: 400 })
  }

  try {
    // 1. Obtener la solicitud actual
    const { data: solicitud, error: fetchError } = await supabaseAdmin
      .from("solicitudes_talleres")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError || !solicitud) {
      console.error("Error fetching solicitud:", fetchError)
      return NextResponse.json({ error: "Solicitud no encontrada o error al obtenerla" }, { status: 404 })
    }

    // 2. Actualizar el estado de la solicitud
    const { error: updateError } = await supabaseAdmin
      .from("solicitudes_talleres")
      .update({ estado_solicitud, fecha_actualizacion: new Date().toISOString() })
      .eq("id", id)

    if (updateError) {
      console.error("Error updating solicitud status:", updateError)
      return NextResponse.json({ error: "Error al actualizar el estado de la solicitud" }, { status: 500 })
    }

    // 3. Si la solicitud es aprobada, crear el taller y asignar el rol
    if (estado_solicitud === "aprobada") {
      // Obtener el ID del rol 'Taller'
      const { data: roleData, error: roleError } = await supabaseAdmin
        .from("roles")
        .select("id")
        .eq("nombre", "Taller")
        .single()

      if (roleError || !roleData) {
        console.error("Error fetching 'Taller' role ID:", roleError)
        return NextResponse.json({ error: "Rol 'Taller' no encontrado" }, { status: 500 })
      }

      const rol_id_taller = roleData.id

      // Insertar en la tabla 'talleres'
      const tallerData: TallerInsert = {
        user_id: solicitud.user_auth_id, // El user_auth_id de la solicitud es el gerente_id
        nombre: solicitud.nombre_taller,
        direccion: solicitud.direccion,
        telefono: solicitud.telefono,
        email: solicitud.email,
        descripcion: solicitud.descripcion,
      }

      const { error: tallerInsertError } = await supabaseAdmin.from("talleres").insert([tallerData])

      if (tallerInsertError) {
        console.error("Error inserting into talleres:", tallerInsertError)
        // Consider reverting solicitud status if workshop creation fails
        return NextResponse.json({ error: "Error al registrar el taller" }, { status: 500 })
      }

      // Asignar el rol 'Taller' al usuario
      const rolesUsuarioData: RolesUsuarioInsert = {
        user_id: solicitud.user_auth_id!,
        rol_id: rol_id_taller,
      }

      const { error: roleAssignError } = await supabaseAdmin.from("roles_usuario").insert([rolesUsuarioData])

      if (roleAssignError) {
        console.error("Error assigning 'Taller' role:", roleAssignError)
        // Consider reverting if this fails
        return NextResponse.json({ error: "Error al asignar el rol de taller al usuario" }, { status: 500 })
      }
    }

    return NextResponse.json({ message: "Estado de solicitud actualizado correctamente" }, { status: 200 })
  } catch (error) {
    console.error("Unhandled error in PATCH /api/solicitudes-talleres/[id]:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
