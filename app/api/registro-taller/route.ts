import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/database.types"

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get("email"))
  const password = String(formData.get("password"))
  const nombre_taller = String(formData.get("nombre_taller"))
  const direccion = String(formData.get("direccion"))
  const ciudad = String(formData.get("ciudad"))
  const estado = String(formData.get("estado"))
  const codigo_postal = String(formData.get("codigo_postal"))
  const nombre_contacto = String(formData.get("nombre_contacto"))
  const telefono = String(formData.get("telefono"))
  const descripcion = formData.get("descripcion") ? String(formData.get("descripcion")) : null
  const modulos_seleccionados_raw = formData.get("modulos_seleccionados")
  const modulos_seleccionados = modulos_seleccionados_raw ? JSON.parse(String(modulos_seleccionados_raw)) : []

  const supabase = createRouteHandlerClient<Database>({ cookies })

  try {
    // 1. Registrar al usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${requestUrl.origin}/auth/callback`,
      },
    })

    if (authError) {
      console.error("Error during Supabase auth signUp:", authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: "No se pudo crear el usuario de autenticación." }, { status: 500 })
    }

    const user_auth_id = authData.user.id

    // 2. Crear el perfil de usuario en public.perfil_usuario
    const { error: perfilError } = await supabase.from("perfil_usuario").insert({
      auth_id: user_auth_id,
      nombre: nombre_contacto.split(" ")[0] || null,
      apellido: nombre_contacto.split(" ").slice(1).join(" ") || null,
      correo: email,
      telefono: telefono,
      // Puedes añadir más campos del perfil si los tienes en el formulario de registro de taller
    })

    if (perfilError) {
      console.error("Error inserting into perfil_usuario:", perfilError)
      // Consider deleting the auth user if profile creation fails
      return NextResponse.json({ error: "Error al crear el perfil de usuario." }, { status: 500 })
    }

    // 3. Crear la solicitud de taller en public.solicitudes_talleres
    const { error: solicitudError } = await supabase.from("solicitudes_talleres").insert({
      user_auth_id: user_auth_id,
      nombre_taller,
      direccion,
      ciudad,
      estado,
      codigo_postal,
      nombre_contacto,
      telefono,
      email,
      descripcion,
      modulos_seleccionados,
      estado_solicitud: "pendiente", // Estado inicial
    })

    if (solicitudError) {
      console.error("Error inserting into solicitudes_talleres:", solicitudError)
      // Consider deleting the auth user and profile if request creation fails
      return NextResponse.json({ error: "Error al registrar la solicitud del taller." }, { status: 500 })
    }

    return NextResponse.json(
      { message: "Registro de taller exitoso. Por favor, verifica tu correo electrónico." },
      { status: 200 },
    )
  } catch (error) {
    console.error("Unhandled error in /api/registro-taller:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
