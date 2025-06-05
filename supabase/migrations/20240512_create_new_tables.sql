-- Crear tabla de flotas
CREATE TABLE IF NOT EXISTS flotas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  descripcion TEXT,
  cantidad_vehiculos INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de conductores
CREATE TABLE IF NOT EXISTS conductores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255) NOT NULL,
  flota_id UUID REFERENCES flotas(id) ON DELETE CASCADE,
  licencia VARCHAR(50),
  telefono VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de miembros del equipo
CREATE TABLE IF NOT EXISTS miembros_equipo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255) NOT NULL,
  cargo VARCHAR(100) NOT NULL,
  tipo VARCHAR(50) NOT NULL, -- 'tecnico', 'administrativo', etc.
  email VARCHAR(255),
  telefono VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de horarios
CREATE TABLE IF NOT EXISTS horarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  miembro_id UUID REFERENCES miembros_equipo(id) ON DELETE CASCADE,
  dia VARCHAR(20) NOT NULL, -- 'lunes', 'martes', etc.
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de proveedores
CREATE TABLE IF NOT EXISTS proveedores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  contacto VARCHAR(255),
  telefono VARCHAR(20),
  email VARCHAR(255),
  direccion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de repuestos
CREATE TABLE IF NOT EXISTS repuestos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  codigo VARCHAR(50) NOT NULL,
  descripcion TEXT,
  proveedor_id UUID REFERENCES proveedores(id) ON DELETE SET NULL,
  precio DECIMAL(10, 2) DEFAULT 0,
  stock_actual INTEGER DEFAULT 0,
  stock_minimo INTEGER DEFAULT 0,
  modelo_vehiculo VARCHAR(255),
  tiempo_entrega INTEGER DEFAULT 0, -- en días
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de procesos
CREATE TABLE IF NOT EXISTS procesos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  tiempo_estimado INTEGER DEFAULT 0, -- en minutos
  orden INTEGER DEFAULT 0,
  validaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de paquetes de servicio
CREATE TABLE IF NOT EXISTS paquetes_servicio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio_base DECIMAL(10, 2) DEFAULT 0,
  tiempo_estimado INTEGER DEFAULT 0, -- en minutos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de relación entre procesos y paquetes
CREATE TABLE IF NOT EXISTS procesos_paquete (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proceso_id UUID REFERENCES procesos(id) ON DELETE CASCADE,
  paquete_id UUID REFERENCES paquetes_servicio(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de facturas
CREATE TABLE IF NOT EXISTS facturas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  orden_id UUID REFERENCES ordenes(id) ON DELETE SET NULL,
  numero_factura VARCHAR(50) NOT NULL,
  fecha_emision DATE NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  subtotal DECIMAL(10, 2) DEFAULT 0,
  impuestos DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) DEFAULT 0,
  estado VARCHAR(50) DEFAULT 'pendiente', -- 'pendiente', 'pagada', 'vencida', 'cancelada'
  metodo_pago VARCHAR(50),
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de items de factura
CREATE TABLE IF NOT EXISTS items_factura (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  factura_id UUID REFERENCES facturas(id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  cantidad INTEGER DEFAULT 1,
  precio_unitario DECIMAL(10, 2) DEFAULT 0,
  subtotal DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de citas
CREATE TABLE IF NOT EXISTS citas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  vehiculo_id UUID REFERENCES vehiculos(id) ON DELETE SET NULL,
  miembro_id UUID REFERENCES miembros_equipo(id) ON DELETE SET NULL,
  fecha DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  tipo_servicio VARCHAR(100),
  descripcion TEXT,
  estado VARCHAR(50) DEFAULT 'programada', -- 'programada', 'en_proceso', 'completada', 'cancelada'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Añadir campo facturada a la tabla ordenes si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ordenes' AND column_name = 'facturada'
  ) THEN
    ALTER TABLE ordenes ADD COLUMN facturada BOOLEAN DEFAULT FALSE;
  END IF;
END $$;
