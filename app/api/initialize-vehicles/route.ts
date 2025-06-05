// Asegurarnos de que la API de inicialización de vehículos cree correctamente las tablas y relaciones

import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function GET() {
  const supabase = getSupabaseServer()

  try {
    // Verificar si la tabla clients existe
    const { error: clientsCheckError } = await supabase.from("clients").select("id").limit(1)

    if (clientsCheckError) {
      // Si la tabla clients no existe, crearla primero
      const createClientsTable = `
        CREATE TABLE IF NOT EXISTS clients (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          company VARCHAR(255),
          phone VARCHAR(50) NOT NULL,
          email VARCHAR(255),
          client_type VARCHAR(50) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
      await supabase.rpc("execute_sql", { sql_query: createClientsTable })

      // Insertar datos de ejemplo en clients
      await supabase.from("clients").insert([
        {
          name: "Juan Pérez",
          phone: "9999-8888",
          email: "juan@example.com",
          client_type: "Particular",
        },
        {
          name: "María López",
          company: "Empresa ABC",
          phone: "8888-7777",
          email: "maria@empresa.com",
          client_type: "Corporativo",
        },
      ])
    }

    // Crear la tabla vehicles si no existe
    const createVehiclesTable = `
      CREATE TABLE IF NOT EXISTS vehicles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        client_id UUID REFERENCES clients(id),
        brand VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        year INTEGER NOT NULL,
        color VARCHAR(50),
        plate VARCHAR(20),
        vin VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    await supabase.rpc("execute_sql", { sql_query: createVehiclesTable })

    // Insertar datos de ejemplo en vehicles si está vacía
    const { data: vehiclesData, error: vehiclesError } = await supabase.from("vehicles").select("id").limit(1)

    if (!vehiclesError && (!vehiclesData || vehiclesData.length === 0)) {
      // Obtener IDs de clientes para referenciar
      const { data: clients } = await supabase.from("clients").select("id").limit(2)

      if (clients && clients.length > 0) {
        await supabase.from("vehicles").insert([
          {
            client_id: clients[0].id,
            brand: "Toyota",
            model: "Corolla",
            year: 2020,
            color: "Blanco",
            plate: "ABC-1234",
            vin: "JTDKN3DU0E1742580",
          },
          {
            client_id: clients.length > 1 ? clients[1].id : clients[0].id,
            brand: "Honda",
            model: "Civic",
            year: 2019,
            color: "Azul",
            plate: "XYZ-5678",
            vin: "JHMFA36266S005280",
          },
          {
            client_id: clients[0].id,
            brand: "Nissan",
            model: "Sentra",
            year: 2021,
            color: "Gris",
            plate: "DEF-9012",
            vin: "JN1AZ4EH8DM430111",
          },
        ])
      }
    }

    return NextResponse.json({
      success: true,
      message: "Tabla de vehículos inicializada correctamente",
    })
  } catch (error) {
    console.error("Error inicializando tabla de vehículos:", error)
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
