import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Obtener datos del cuerpo de la solicitud
    const {
      nombre_taller,
      direccion,
      ciudad,
      estado,
      codigo_postal,
      nombre_contacto,
      telefono,
      email,
      descripcion,
      modulos,
    } = await request.json()

    // Verificar que el usuario existe en Supabase
    const { data: userData, error: userError } = await supabase
      .from("auth.users")
      .select("id")
      .eq("email", email)
      .single()

    if (userError) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Crear registro en la tabla de solicitudes_taller
    const { error: solicitudError } = await supabase.from("solicitudes_taller").insert({
      user_id: userData.id,
      nombre_taller,
      direccion,
      ciudad,
      estado,
      codigo_postal,
      nombre_contacto,
      telefono,
      email,
      descripcion,
      modulos_seleccionados: modulos,
      estado_solicitud: "pendiente",
      fecha_solicitud: new Date().toISOString(),
    })

    if (solicitudError) {
      return NextResponse.json(
        { error: "Error al crear la solicitud", details: solicitudError.message },
        { status: 500 },
      )
    }

    // Enviar notificación al administrador (esto podría ser un email, una notificación en la app, etc.)
    // Aquí podrías implementar el envío de emails usando un servicio como SendGrid, Mailgun, etc.

    return NextResponse.json({
      success: true,
      message: "Solicitud de registro enviada correctamente",
    })
  } catch (error: any) {
    console.error("Error en la API de registro de taller:", error)
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 })
  }
}
