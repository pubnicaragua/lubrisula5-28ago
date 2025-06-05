-- Función para crear la tabla de roles si no existe
CREATE OR REPLACE FUNCTION create_roles_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'roles') THEN
    CREATE TABLE public.roles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      nombre VARCHAR(50) NOT NULL UNIQUE,
      descripcion TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Crear índice para búsquedas por nombre
    CREATE INDEX idx_roles_nombre ON public.roles(nombre);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear la tabla de perfiles de usuario si no existe
CREATE OR REPLACE FUNCTION create_perfil_usuario_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'perfil_usuario') THEN
    CREATE TABLE public.perfil_usuario (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
      nombre VARCHAR(100),
      apellido VARCHAR(100),
      telefono VARCHAR(20),
      direccion TEXT,
      ciudad VARCHAR(100),
      estado VARCHAR(100),
      codigo_postal VARCHAR(10),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Crear índices para búsquedas comunes
    CREATE INDEX idx_perfil_usuario_user_id ON public.perfil_usuario(user_id);
    CREATE INDEX idx_perfil_usuario_nombre ON public.perfil_usuario(nombre);
    CREATE INDEX idx_perfil_usuario_apellido ON public.perfil_usuario(apellido);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear la tabla de roles de usuario si no existe
CREATE OR REPLACE FUNCTION create_roles_usuario_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'roles_usuario') THEN
    CREATE TABLE public.roles_usuario (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(user_id, role_id)
    );
    
    -- Crear índices para búsquedas comunes
    CREATE INDEX idx_roles_usuario_user_id ON public.roles_usuario(user_id);
    CREATE INDEX idx_roles_usuario_role_id ON public.roles_usuario(role_id);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear la tabla de clientes si no existe
CREATE OR REPLACE FUNCTION create_clients_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'clients') THEN
    CREATE TABLE public.clients (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      company VARCHAR(255),
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(255),
      client_type VARCHAR(50) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Crear índices para búsquedas comunes
    CREATE INDEX idx_clients_name ON public.clients(name);
    CREATE INDEX idx_clients_email ON public.clients(email);
    CREATE INDEX idx_clients_client_type ON public.clients(client_type);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear la tabla de vehículos si no existe
CREATE OR REPLACE FUNCTION create_vehicles_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'vehicles') THEN
    CREATE TABLE public.vehicles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
      make VARCHAR(100) NOT NULL,
      model VARCHAR(100) NOT NULL,
      year INT NOT NULL,
      color VARCHAR(50),
      vin VARCHAR(50),
      license_plate VARCHAR(20),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Crear índices para búsquedas comunes
    CREATE INDEX idx_vehicles_client_id ON public.vehicles(client_id);
    CREATE INDEX idx_vehicles_make ON public.vehicles(make);
    CREATE INDEX idx_vehicles_model ON public.vehicles(model);
    CREATE INDEX idx_vehicles_year ON public.vehicles(year);
    CREATE INDEX idx_vehicles_vin ON public.vehicles(vin);
    CREATE INDEX idx_vehicles_license_plate ON public.vehicles(license_plate);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear la tabla de cotizaciones si no existe
CREATE OR REPLACE FUNCTION create_quotations_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'quotations') THEN
    CREATE TABLE public.quotations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      quotation_number VARCHAR(50) NOT NULL UNIQUE,
      client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
      vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      status VARCHAR(50) NOT NULL,
      total_labor DECIMAL(12, 2) NOT NULL,
      total_materials DECIMAL(12, 2) NOT NULL,
      total_parts DECIMAL(12, 2) NOT NULL,
      total DECIMAL(12, 2) NOT NULL,
      repair_hours DECIMAL(8, 2) NOT NULL,
      estimated_days INT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Crear índices para búsquedas comunes
    CREATE INDEX idx_quotations_client_id ON public.quotations(client_id);
    CREATE INDEX idx_quotations_vehicle_id ON public.quotations(vehicle_id);
    CREATE INDEX idx_quotations_status ON public.quotations(status);
    CREATE INDEX idx_quotations_date ON public.quotations(date);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear la tabla de partes de cotizaciones si no existe
CREATE OR REPLACE FUNCTION create_quotation_parts_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'quotation_parts') THEN
    CREATE TABLE public.quotation_parts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
      category VARCHAR(50) NOT NULL,
      name VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      operation VARCHAR(10) NOT NULL,
      material_type VARCHAR(10) NOT NULL,
      repair_type VARCHAR(10) NOT NULL,
      repair_hours DECIMAL(8, 2) NOT NULL,
      labor_cost DECIMAL(12, 2) NOT NULL,
      materials_cost DECIMAL(12, 2) NOT NULL,
      parts_cost DECIMAL(12, 2) NOT NULL,
      total DECIMAL(12, 2) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Crear índices para búsquedas comunes
    CREATE INDEX idx_quotation_parts_quotation_id ON public.quotation_parts(quotation_id);
    CREATE INDEX idx_quotation_parts_category ON public.quotation_parts(category);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear la tabla de órdenes si no existe
CREATE OR REPLACE FUNCTION create_orders_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders') THEN
    CREATE TABLE public.orders (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      order_number VARCHAR(50) NOT NULL UNIQUE,
      quotation_id UUID REFERENCES public.quotations(id),
      client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
      vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      status VARCHAR(50) NOT NULL,
      total_labor DECIMAL(12, 2) NOT NULL,
      total_materials DECIMAL(12, 2) NOT NULL,
      total_parts DECIMAL(12, 2) NOT NULL,
      total DECIMAL(12, 2) NOT NULL,
      repair_hours DECIMAL(8, 2) NOT NULL,
      estimated_days INT NOT NULL,
      start_date DATE,
      end_date DATE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Crear índices para búsquedas comunes
    CREATE INDEX idx_orders_quotation_id ON public.orders(quotation_id);
    CREATE INDEX idx_orders_client_id ON public.orders(client_id);
    CREATE INDEX idx_orders_vehicle_id ON public.orders(vehicle_id);
    CREATE INDEX idx_orders_status ON public.orders(status);
    CREATE INDEX idx_orders_date ON public.orders(date);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear la tabla de partes de órdenes si no existe
CREATE OR REPLACE FUNCTION create_order_parts_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'order_parts') THEN
    CREATE TABLE public.order_parts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
      category VARCHAR(50) NOT NULL,
      name VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      operation VARCHAR(10) NOT NULL,
      material_type VARCHAR(10) NOT NULL,
      repair_type VARCHAR(10) NOT NULL,
      repair_hours DECIMAL(8, 2) NOT NULL,
      labor_cost DECIMAL(12, 2) NOT NULL,
      materials_cost DECIMAL(12, 2) NOT NULL,
      parts_cost DECIMAL(12, 2) NOT NULL,
      total DECIMAL(12, 2) NOT NULL,
      status VARCHAR(50) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Crear índices para búsquedas comunes
    CREATE INDEX idx_order_parts_order_id ON public.order_parts(order_id);
    CREATE INDEX idx_order_parts_category ON public.order_parts(category);
    CREATE INDEX idx_order_parts_status ON public.order_parts(status);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear la tabla de categorías de inventario si no existe
CREATE OR REPLACE FUNCTION create_inventory_categories_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'inventory_categories') THEN
    CREATE TABLE public.inventory_categories (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Crear índice para búsquedas por nombre
    CREATE INDEX idx_inventory_categories_name ON public.inventory_categories(name);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear la tabla de inventario si no existe
CREATE OR REPLACE FUNCTION create_inventory_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'inventory') THEN
    CREATE TABLE public.inventory (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      category_id UUID NOT NULL REFERENCES public.inventory_categories(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      sku VARCHAR(50),
      quantity INT NOT NULL DEFAULT 0,
      min_quantity INT NOT NULL DEFAULT 0,
      cost_price DECIMAL(12, 2) NOT NULL,
      selling_price DECIMAL(12, 2) NOT NULL,
      unit VARCHAR(20) NOT NULL,
      location VARCHAR(100),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Crear índices para búsquedas comunes
    CREATE INDEX idx_inventory_category_id ON public.inventory(category_id);
    CREATE INDEX idx_inventory_name ON public.inventory(name);
    CREATE INDEX idx_inventory_sku ON public.inventory(sku);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear la tabla de columnas de kanban si no existe
CREATE OR REPLACE FUNCTION create_kanban_columns_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kanban_columns') THEN
    CREATE TABLE public.kanban_columns (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(100) NOT NULL,
      order_index INT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Crear índice para ordenar columnas
    CREATE INDEX idx_kanban_columns_order_index ON public.kanban_columns(order_index);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear la tabla de tarjetas de kanban si no existe
CREATE OR REPLACE FUNCTION create_kanban_cards_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'kanban_cards') THEN
    CREATE TABLE public.kanban_cards (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      column_id UUID NOT NULL REFERENCES public.kanban_columns(id) ON DELETE CASCADE,
      order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      order_index INT NOT NULL,
      priority VARCHAR(20),
      due_date DATE,
      assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Crear índices para búsquedas comunes
    CREATE INDEX idx_kanban_cards_column_id ON public.kanban_cards(column_id);
    CREATE INDEX idx_kanban_cards_order_id ON public.kanban_cards(order_id);
    CREATE INDEX idx_kanban_cards_order_index ON public.kanban_cards(order_index);
    CREATE INDEX idx_kanban_cards_assigned_to ON public.kanban_cards(assigned_to);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear la tabla de facturas si no existe
CREATE OR REPLACE FUNCTION create_invoices_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'invoices') THEN
    CREATE TABLE public.invoices (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      invoice_number VARCHAR(50) NOT NULL UNIQUE,
      order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
      client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      due_date DATE NOT NULL,
      status VARCHAR(50) NOT NULL,
      subtotal DECIMAL(12, 2) NOT NULL,
      tax_rate DECIMAL(5, 2) NOT NULL,
      tax_amount DECIMAL(12, 2) NOT NULL,
      total DECIMAL(12, 2) NOT NULL,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Crear índices para búsquedas comunes
    CREATE INDEX idx_invoices_order_id ON public.invoices(order_id);
    CREATE INDEX idx_invoices_client_id ON public.invoices(client_id);
    CREATE INDEX idx_invoices_status ON public.invoices(status);
    CREATE INDEX idx_invoices_date ON public.invoices(date);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear la tabla de pagos si no existe
CREATE OR REPLACE FUNCTION create_payments_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'payments') THEN
    CREATE TABLE public.payments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
      amount DECIMAL(12, 2) NOT NULL,
      payment_date DATE NOT NULL,
      payment_method VARCHAR(50) NOT NULL,
      reference_number VARCHAR(100),
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Crear índices para búsquedas comunes
    CREATE INDEX idx_payments_invoice_id ON public.payments(invoice_id);
    CREATE INDEX idx_payments_payment_date ON public.payments(payment_date);
    CREATE INDEX idx_payments_payment_method ON public.payments(payment_method);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para insertar roles básicos si no existen
CREATE OR REPLACE FUNCTION insert_basic_roles_if_not_exists()
RETURNS void AS $$
BEGIN
  -- Insertar rol de Super Administrador si no existe
  IF NOT EXISTS (SELECT FROM public.roles WHERE nombre = 'Super Administrador') THEN
    INSERT INTO public.roles (nombre, descripcion)
    VALUES ('Super Administrador', 'Acceso completo a todas las funcionalidades del sistema');
  END IF;
  
  -- Insertar rol de Admin si no existe
  IF NOT EXISTS (SELECT FROM public.roles WHERE nombre = 'Admin') THEN
    INSERT INTO public.roles (nombre, descripcion)
    VALUES ('Admin', 'Administrador del sistema con acceso a la mayoría de funcionalidades');
  END IF;
  
  -- Insertar rol de Taller si no existe
  IF NOT EXISTS (SELECT FROM public.roles WHERE nombre = 'Taller') THEN
    INSERT INTO public.roles (nombre, descripcion)
    VALUES ('Taller', 'Usuario de taller con acceso a funcionalidades de reparación y mantenimiento');
  END IF;
  
  -- Insertar rol de Aseguradora si no existe
  IF NOT EXISTS (SELECT FROM public.roles WHERE nombre = 'Aseguradora') THEN
    INSERT INTO public.roles (nombre, descripcion)
    VALUES ('Aseguradora', 'Usuario de aseguradora con acceso a cotizaciones y órdenes');
  END IF;
  
  -- Insertar rol de Cliente si no existe
  IF NOT EXISTS (SELECT FROM public.roles WHERE nombre = 'Cliente') THEN
    INSERT INTO public.roles (nombre, descripcion)
    VALUES ('Cliente', 'Cliente con acceso limitado a sus vehículos y órdenes');
  END IF;
  
  -- Insertar rol de Técnico si no existe
  IF NOT EXISTS (SELECT FROM public.roles WHERE nombre = 'Tecnico') THEN
    INSERT INTO public.roles (nombre, descripcion)
    VALUES ('Tecnico', 'Técnico con acceso a órdenes de trabajo asignadas');
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
