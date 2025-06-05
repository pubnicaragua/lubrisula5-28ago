"use server"

import { createClient } from "@supabase/supabase-js"

// Función para inicializar la base de datos
export async function initializeDatabase() {
  try {
    // Crear cliente de Supabase con la clave de servicio para tener permisos completos
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    )

    console.log("Iniciando creación de tablas...")

    // Crear tabla de roles
    await supabaseAdmin.rpc("create_roles_table_if_not_exists")

    // Crear tabla de perfiles de usuario
    await supabaseAdmin.rpc("create_perfil_usuario_table_if_not_exists")

    // Crear tabla de roles de usuario
    await supabaseAdmin.rpc("create_roles_usuario_table_if_not_exists")

    // Crear tabla de clientes
    await supabaseAdmin.rpc("create_clients_table_if_not_exists")

    // Crear tabla de vehículos
    await supabaseAdmin.rpc("create_vehicles_table_if_not_exists")

    // Crear tabla de cotizaciones
    await supabaseAdmin.rpc("create_quotations_table_if_not_exists")

    // Crear tabla de partes de cotizaciones
    await supabaseAdmin.rpc("create_quotation_parts_table_if_not_exists")

    // Crear tabla de órdenes
    await supabaseAdmin.rpc("create_orders_table_if_not_exists")

    // Crear tabla de partes de órdenes
    await supabaseAdmin.rpc("create_order_parts_table_if_not_exists")

    // Crear tabla de categorías de inventario
    await supabaseAdmin.rpc("create_inventory_categories_table_if_not_exists")

    // Crear tabla de inventario
    await supabaseAdmin.rpc("create_inventory_table_if_not_exists")

    // Crear tabla de columnas de kanban
    await supabaseAdmin.rpc("create_kanban_columns_table_if_not_exists")

    // Crear tabla de tarjetas de kanban
    await supabaseAdmin.rpc("create_kanban_cards_table_if_not_exists")

    // Crear tabla de facturas
    await supabaseAdmin.rpc("create_invoices_table_if_not_exists")

    // Crear tabla de pagos
    await supabaseAdmin.rpc("create_payments_table_if_not_exists")

    console.log("Tablas creadas exitosamente")

    // Insertar roles básicos si no existen
    await supabaseAdmin.rpc("insert_basic_roles_if_not_exists")

    console.log("Roles básicos insertados")

    return { success: true, message: "Base de datos inicializada correctamente" }
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error)
    return {
      success: false,
      message: "Error al inicializar la base de datos",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
