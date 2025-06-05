-- Función para ejecutar SQL personalizado
CREATE OR REPLACE FUNCTION public.execute_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- Dar permisos para crear la extensión UUID
CREATE OR REPLACE FUNCTION public.create_uuid_extension()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
END;
$$;
