// Asegurarnos de que la API de inicialización de cotizaciones cree correctamente las tablas y relaciones

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
    }

    // Verificar si la tabla vehicles existe
    const { error: vehiclesCheckError } = await supabase.from("vehicles").select("id").limit(1)

    if (vehiclesCheckError) {
      // Si la tabla vehicles no existe, crearla primero
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
    }

    // Crear la tabla quotations si no existe
    const createQuotationsTable = `
      CREATE TABLE IF NOT EXISTS quotations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        quotation_number VARCHAR(50) NOT NULL,
        client_id UUID REFERENCES clients(id),
        vehicle_id UUID REFERENCES vehicles(id),
        date DATE NOT NULL,
        status VARCHAR(50) NOT NULL,
        total_labor DECIMAL(10, 2) NOT NULL,
        total_materials DECIMAL(10, 2) NOT NULL,
        total_parts DECIMAL(10, 2) NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        repair_hours DECIMAL(10, 2) NOT NULL,
        estimated_days DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    await supabase.rpc("execute_sql", { sql_query: createQuotationsTable })

    // Crear la tabla quotation_parts si no existe
    const createQuotationPartsTable = `
      CREATE TABLE IF NOT EXISTS quotation_parts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        quotation_id UUID REFERENCES quotations(id) ON DELETE CASCADE,
        category VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL,
        operation VARCHAR(10) NOT NULL,
        material_type VARCHAR(10) NOT NULL,
        repair_type VARCHAR(10) NOT NULL,
        repair_hours DECIMAL(10, 2) NOT NULL,
        labor_cost DECIMAL(10, 2) NOT NULL,
        materials_cost DECIMAL(10, 2) NOT NULL,
        parts_cost DECIMAL(10, 2) NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    await supabase.rpc("execute_sql", { sql_query: createQuotationPartsTable })

    // Insertar datos de ejemplo en clients si está vacía
    const { data: clientsData, error: clientsError } = await supabase.from("clients").select("id").limit(1)

    if (!clientsError && (!clientsData || clientsData.length === 0)) {
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
        ])
      }
    }

    // Insertar datos de ejemplo en quotations si está vacía
    const { data: quotationsData, error: quotationsError } = await supabase.from("quotations").select("id").limit(1)

    if (!quotationsError && (!quotationsData || quotationsData.length === 0)) {
      // Obtener IDs de clientes y vehículos para referenciar
      const { data: clients } = await supabase.from("clients").select("id").limit(1)

      const { data: vehicles } = await supabase.from("vehicles").select("id").limit(1)

      if (clients && clients.length > 0 && vehicles && vehicles.length > 0) {
        // Insertar cotización de ejemplo
        const { data: quotation, error: quotationInsertError } = await supabase
          .from("quotations")
          .insert({
            quotation_number: "COT-001",
            client_id: clients[0].id,
            vehicle_id: vehicles[0].id,
            date: new Date().toISOString().split("T")[0],
            status: "Pendiente",
            total_labor: 2500,
            total_materials: 1200,
            total_parts: 3500,
            total: 7200,
            repair_hours: 8.5,
            estimated_days: 3,
          })
          .select("id")
          .single()

        if (!quotationInsertError && quotation) {
          // Insertar partes de cotización de ejemplo
          await supabase.from("quotation_parts").insert([
            {
              quotation_id: quotation.id,
              category: "Carrocería",
              name: "Puerta delantera izquierda",
              quantity: 1,
              operation: "Rep",
              material_type: "HI",
              repair_type: "MM",
              repair_hours: 3.5,
              labor_cost: 1050,
              materials_cost: 500,
              parts_cost: 1500,
              total: 3050,
            },
            {
              quotation_id: quotation.id,
              category: "Pintura",
              name: "Pintura puerta delantera",
              quantity: 1,
              operation: "Cor",
              material_type: "PL",
              repair_type: "OU",
              repair_hours: 2.0,
              labor_cost: 600,
              materials_cost: 400,
              parts_cost: 0,
              total: 1000,
            },
          ])
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Tablas de cotizaciones inicializadas correctamente",
    })
  } catch (error) {
    console.error("Error inicializando tablas de cotizaciones:", error)
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
