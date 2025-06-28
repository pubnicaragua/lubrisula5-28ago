export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      aseguradoras: {
        Row: {
          id: string
          user_id: string | null
          nombre: string | null
          direccion: string | null
          nivel_servicio: string | null
          created_at: string | null
          updated_at: string | null
          cliente_id: string | null
          flota_id: string | null
          corrreo: string | null
          telefono: string | null
          estado_tributario: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          nombre: string | null
          direccion?: string | null
          nivel_servicio?: string | null
          created_at?: string | null
          updated_at?: string | null
          cliente_id?: string | null
          flota_id?: string | null
          corrreo?: string | null
          telefono?: string | null
          estado_tributario?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          nombre?: string | null
          direccion?: string | null
          nivel_servicio?: string | null
          created_at?: string | null
          updated_at?: string | null
          cliente_id?: string | null
          flota_id?: string | null
          corrreo?: string | null
          telefono?: string | null
          estado_tributario?: string | null
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string | null
          name: string
          company: string | null
          phone: string
          email: string | null
          client_type: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          company?: string | null
          phone: string
          email?: string | null
          client_type: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          company?: string | null
          phone?: string
          email?: string | null
          client_type?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      inspecciones_vehiculo: {
        Row: {
          id: string
          vehiculo_id: string
          fecha: string
          datos_inspeccion: Json
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          vehiculo_id: string
          fecha: string
          datos_inspeccion: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          vehiculo_id?: string
          fecha?: string
          datos_inspeccion?: Json
          created_at?: string | null
          updated_at?: string | null
        }
      }
      kanban_cards: {
        Row: {
          id: string
          column_id: string | null
          title: string
          description: string | null
          order_id: string | null
          vehicle_id: string | null
          client_id: string | null
          assigned_to: string | null
          priority: string | null
          due_date: string | null
          position: number
          created_at: string | null
          updated_at: string | null
          client_name: string | null
          created_by: string | null
        }
        Insert: {
          id?: string
          column_id?: string | null
          title: string
          description?: string | null
          order_id?: string | null
          vehicle_id?: string | null
          client_id?: string | null
          assigned_to?: string | null
          priority?: string | null
          due_date?: string | null
          position: number
          created_at?: string | null
          updated_at?: string | null
          client_name?: string | null
          created_by?: string | null
        }
        Update: {
          id?: string
          column_id?: string | null
          title?: string
          description?: string | null
          order_id?: string | null
          vehicle_id?: string | null
          client_id?: string | null
          assigned_to?: string | null
          priority?: string | null
          due_date?: string | null
          position?: number
          created_at?: string | null
          updated_at?: string | null
          client_name?: string | null
          created_by?: string | null
        }
      }
      kanban_columns: {
        Row: {
          id: string
          title: string
          description: string | null
          color: string | null
          position: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          color?: string | null
          position: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          color?: string | null
          position?: number
          created_at?: string | null
          updated_at?: string | null
        }
      }
      materiales: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          precio_unitario: number
          stock: number
          unidad_medida: string
          categoria_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          precio_unitario: number
          stock: number
          unidad_medida: string
          categoria_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          precio_unitario?: number
          stock?: number
          unidad_medida?: string
          categoria_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      miembros_equipo: {
        Row: {
          id: string
          nombre: string
          apellido: string
          cargo: string
          especialidad: string
          telefono: string
          email: string
          fecha_contratacion: string
          estado: string
          horas_trabajadas: number
          ordenes_completadas: number
          salario: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          apellido: string
          cargo: string
          especialidad: string
          telefono: string
          email: string
          fecha_contratacion?: string
          estado: string
          horas_trabajadas?: number
          ordenes_completadas?: number
          salario?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          apellido?: string
          cargo?: string
          especialidad?: string
          telefono?: string
          email?: string
          fecha_contratacion?: string
          estado?: string
          horas_trabajadas?: number
          ordenes_completadas?: number
          salario?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      order_details: {
        Row: any
        Insert: any
        Update: any
      }
      orders: {
        Row: any
        Insert: any
        Update: any
      }
      perfil_usuario: {
        Row: {
          id: string // UUID
          auth_id: string
          nombre: string | null
          apellido: string | null
          correo: string | null // Added
          telefono: string | null
          direccion: string | null
          ciudad: string | null
          estado: boolean | null // Changed to boolean
          codigo_postal: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          auth_id: string
          nombre?: string | null
          apellido?: string | null
          correo?: string | null
          telefono?: string | null
          direccion?: string | null
          ciudad?: string | null
          estado?: boolean | null
          codigo_postal?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          auth_id?: string
          nombre?: string | null
          apellido?: string | null
          correo?: string | null
          telefono?: string | null
          direccion?: string | null
          ciudad?: string | null
          estado?: boolean | null
          codigo_postal?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      quotation_parts: {
        Row: any
        Insert: any
        Update: any
      }
      quotations: {
        Row: any
        Insert: any
        Update: any
      }
      roles: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      roles_usuario: {
        Row: {
          id: string // UUID
          user_id: string
          rol_id: string // UUID
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          rol_id: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          rol_id?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      solicitudes_talleres: {
        Row: {
          id: number
          user_auth_id: string | null
          nombre_taller: string
          direccion: string
          ciudad: string
          estado: string
          codigo_postal: string
          nombre_contacto: string
          telefono: string
          email: string
          descripcion: string | null
          modulos_seleccionados: string[]
          estado_solicitud: "pendiente" | "aprobada" | "rechazada"
          fecha_solicitud: string
          fecha_actualizacion: string | null
        }
        Insert: {
          id?: number
          user_auth_id?: string | null
          nombre_taller: string
          direccion: string
          ciudad: string
          estado: string
          codigo_postal: string
          nombre_contacto: string
          telefono: string
          email: string
          descripcion?: string | null
          modulos_seleccionados?: string[]
          estado_solicitud?: "pendiente" | "aprobada" | "rechazada"
          fecha_solicitud?: string
          fecha_actualizacion?: string | null
        }
        Update: {
          id?: number
          user_auth_id?: string | null
          nombre_taller?: string
          direccion?: string
          ciudad?: string
          estado?: string
          codigo_postal?: string
          nombre_contacto?: string
          telefono?: string
          email?: string
          descripcion?: string | null
          modulos_seleccionados?: string[]
          estado_solicitud?: "pendiente" | "aprobada" | "rechazada"
          fecha_solicitud?: string
          fecha_actualizacion?: string | null
        }
      }
      talleres: {
        Row: {
          id: string
          user_id: string | null // This is the gerente_id
          nombre: string
          direccion: string | null
          telefono: string | null
          email: string | null
          descripcion: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          nombre: string
          direccion?: string | null
          telefono?: string | null
          email?: string | null
          descripcion?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          nombre?: string
          direccion?: string | null
          telefono?: string | null
          email?: string | null
          descripcion?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      vehicles: {
        Row: {
          id: string
          client_id: string | null
          marca: string
          modelo: string
          anio: number
          placa: string
          vin: string | null
          color: string | null
          kilometraje: number | null
          last_service_date: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          client_id?: string | null
          marca: string
          modelo: string
          anio: number
          placa: string
          vin?: string | null
          color?: string | null
          kilometraje?: number | null
          last_service_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          client_id?: string | null
          marca?: string
          modelo?: string
          anio?: number
          placa?: string
          vin?: string | null
          color?: string | null
          kilometraje?: number | null
          last_service_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      users_with_roles: {
        Row: {
          user_auth_id: string | null
          user_email: string | null
          user_created_at: string | null
          perfil_id: string | null
          perfil_nombre: string | null
          perfil_apellido: string | null
          perfil_correo: string | null
          perfil_telefono: string | null
          perfil_direccion: string | null
          perfil_estado: boolean | null
          perfil_actualizado: string | null
          role_id: string | null
          role_name: string | null
          role_description: string | null
        }
      }
      talleres_completos: {
        Row: {
          id: string | null
          nombre: string | null
          direccion: string | null
          telefono: string | null
          email: string | null
          descripcion: string | null
          gerente_id: string | null
          fecha_registro_taller: string | null
          estado_solicitud: "pendiente" | "aprobada" | "rechazada" | null
          solicitud_enviada: string | null // Renamed from fecha_solicitud_original
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
