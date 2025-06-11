-- Habilitar RLS para la tabla kanban_columns
ALTER TABLE public.kanban_columns ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios autenticados puedan ver las columnas
DROP POLICY IF EXISTS "Allow authenticated users to view kanban columns" ON public.kanban_columns;
CREATE POLICY "Allow authenticated users to view kanban columns"
ON public.kanban_columns FOR SELECT
TO authenticated
USING (true);

-- Política para que los usuarios con rol 'taller' puedan insertar columnas
DROP POLICY IF EXISTS "Allow 'taller' role to insert kanban columns" ON public.kanban_columns;
CREATE POLICY "Allow 'taller' role to insert kanban columns"
ON public.kanban_columns FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.roles_usuario
    WHERE roles_usuario.user_id = auth.uid()
    AND roles_usuario.role_id = (SELECT id FROM public.roles WHERE nombre = 'taller')
  )
);

-- Política para que los usuarios con rol 'taller' puedan actualizar columnas
DROP POLICY IF EXISTS "Allow 'taller' role to update kanban columns" ON public.kanban_columns;
CREATE POLICY "Allow 'taller' role to update kanban columns"
ON public.kanban_columns FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.roles_usuario
    WHERE roles_usuario.user_id = auth.uid()
    AND roles_usuario.role_id = (SELECT id FROM public.roles WHERE nombre = 'taller')
  )
);

-- Política para que los usuarios con rol 'taller' puedan eliminar columnas
DROP POLICY IF EXISTS "Allow 'taller' role to delete kanban columns" ON public.kanban_columns;
CREATE POLICY "Allow 'taller' role to delete kanban columns"
ON public.kanban_columns FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.roles_usuario
    WHERE roles_usuario.user_id = auth.uid()
    AND roles_usuario.role_id = (SELECT id FROM public.roles WHERE nombre = 'taller')
  )
);

-- Asegúrate de que la tabla 'roles' y 'roles_usuario' existan y tengan RLS habilitado
-- y políticas adecuadas para que las subconsultas de roles funcionen.
-- Si no lo has hecho, ejecuta las migraciones anteriores que definen estas tablas y sus RLS.
