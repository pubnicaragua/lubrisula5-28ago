-- Asegurarse de que la tabla roles existe
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Asegurarse de que la tabla roles_usuario existe con la estructura correcta
CREATE TABLE IF NOT EXISTS roles_usuario (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  role_id UUID NOT NULL REFERENCES roles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- Insertar roles básicos si no existen
INSERT INTO roles (nombre, descripcion)
VALUES 
  ('superadmin', 'Acceso completo a todas las funcionalidades del sistema'),
  ('admin', 'Administrador del sistema con acceso a la mayoría de funcionalidades'),
  ('taller', 'Usuario de taller con acceso a funcionalidades de reparación y mantenimiento'),
  ('aseguradora', 'Usuario de aseguradora con acceso a cotizaciones y seguimiento'),
  ('cliente', 'Cliente con acceso limitado a sus vehículos y cotizaciones')
ON CONFLICT (nombre) DO NOTHING;

-- Crear función para actualizar el timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar updated_at en roles
DROP TRIGGER IF EXISTS update_roles_updated_at ON roles;
CREATE TRIGGER update_roles_updated_at
BEFORE UPDATE ON roles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Crear trigger para actualizar updated_at en roles_usuario
DROP TRIGGER IF EXISTS update_roles_usuario_updated_at ON roles_usuario;
CREATE TRIGGER update_roles_usuario_updated_at
BEFORE UPDATE ON roles_usuario
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_roles_usuario_user_id ON roles_usuario(user_id);
CREATE INDEX IF NOT EXISTS idx_roles_usuario_role_id ON roles_usuario(role_id);
