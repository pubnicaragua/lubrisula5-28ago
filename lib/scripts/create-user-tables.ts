import { getSupabaseServer } from "@/lib/supabase/server"

export async function createUserTables() {
  const supabase = getSupabaseServer()

  // Crear tabla de perfiles de usuario si no existe
  const { error: profilesError } = await supabase.rpc("create_table_if_not_exists", {
    table_name: "user_profiles",
    table_definition: `
      user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'Cliente',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    `,
  })

  if (profilesError) {
    console.error("Error creating user_profiles table:", profilesError)
    throw profilesError
  }

  // Crear tabla de talleres si no existe
  const { error: talleresError } = await supabase.rpc("create_table_if_not_exists", {
    table_name: "talleres",
    table_definition: `
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      nombre TEXT NOT NULL,
      direccion TEXT,
      especialidades TEXT[],
      descripcion TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    `,
  })

  if (talleresError) {
    console.error("Error creating talleres table:", talleresError)
    throw talleresError
  }

  // Crear tabla de aseguradoras si no existe
  const { error: aseguradorasError } = await supabase.rpc("create_table_if_not_exists", {
    table_name: "aseguradoras",
    table_definition: `
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      nombre TEXT NOT NULL,
      direccion TEXT,
      nivel_servicio TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    `,
  })

  if (aseguradorasError) {
    console.error("Error creating aseguradoras table:", aseguradorasError)
    throw aseguradorasError
  }

  // Crear tabla de técnicos si no existe
  const { error: tecnicosError } = await supabase.rpc("create_table_if_not_exists", {
    table_name: "tecnicos",
    table_definition: `
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      especialidad TEXT NOT NULL,
      experiencia TEXT,
      taller_id UUID REFERENCES talleres(id) ON DELETE SET NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    `,
  })

  if (tecnicosError) {
    console.error("Error creating tecnicos table:", tecnicosError)
    throw tecnicosError
  }

  return { success: true }
}
