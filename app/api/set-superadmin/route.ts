import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Verificar si el usuario está autenticado
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado. Debe iniciar sesión." }, { status: 401 })
    }

    // Obtener el email del cuerpo de la solicitud
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Se requiere un correo electrónico" }, { status: 400 })
    }

    // Buscar el usuario por email
    const { data: userData, error: userError } = await supabase
      .from("auth.users")
      .select("id")
      .eq("email", email)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Actualizar los metadatos del usuario
    const { error: updateError } = await supabase.auth.admin.updateUserById(userData.id, {
      user_metadata: { role: "superadmin" },
    })

    if (updateError) {
      return NextResponse.json(
        { error: "Error al actualizar el rol del usuario", details: updateError.message },
        { status: 500 },
      )
    }

    // Asegurar que el usuario esté vinculado al rol superadmin en la tabla roles_usuario
    const { data: roleData } = await supabase.from("roles").select("id").eq("nombre", "superadmin").single()

    if (roleData) {
      await supabase.from("roles_usuario").upsert({
        user_id: userData.id,
        rol_id: roleData.id,
        created_at: new Date().toISOString(),
      })
    }

    return NextResponse.json({ success: true, message: "Rol actualizado correctamente" })
  } catch (error) {
    console.error("Error en la API:", error)
    return NextResponse.json(
      { error: "Error interno del servidor", details: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}
