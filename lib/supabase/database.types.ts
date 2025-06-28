export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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
          id: string
          auth_id: string
          nombre_completo: string | null
          telefono: string | null
          direccion: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          auth_id: string
          nombre_completo?: string | null
          telefono?: string | null
          direccion?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          auth_id?: string
          nombre_completo?: string | null
          telefono?: string | null
          direccion?: string | null
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
          id: string
          user_id: string
          role_id: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          role_id: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          role_id?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      talleres: {
        Row: {
          id: string
          user_id: string | null
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
      [_ in never]: never
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
