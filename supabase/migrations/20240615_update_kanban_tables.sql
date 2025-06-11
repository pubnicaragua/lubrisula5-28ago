-- Ensure kanban_columns table exists and has correct structure
CREATE TABLE IF NOT EXISTS kanban_columns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  color TEXT,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure kanban_cards table exists and has correct structure
CREATE TABLE IF NOT EXISTS kanban_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  column_id UUID REFERENCES kanban_columns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_id UUID,
  vehicle_id UUID,
  client_id UUID,
  assigned_to UUID,
  priority TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  client_name TEXT, -- Added based on KanbanBoard.tsx usage
  created_by UUID -- Added based on KanbanBoard.tsx usage
);

-- Add updated_at trigger to kanban tables
CREATE TRIGGER update_kanban_columns_updated_at
BEFORE UPDATE ON kanban_columns
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kanban_cards_updated_at
BEFORE UPDATE ON kanban_cards
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS for kanban tables
ALTER TABLE public.kanban_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_cards ENABLE ROW LEVEL SECURITY;

-- Policies for 'kanban_columns' and 'kanban_cards' (Authenticated users can read, admin/taller can manage)
DROP POLICY IF EXISTS "Allow authenticated users to read kanban_columns" ON public.kanban_columns;
CREATE POLICY "Allow authenticated users to read kanban_columns" ON public.kanban_columns FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin and taller to manage kanban_columns" ON public.kanban_columns;
CREATE POLICY "Allow admin and taller to manage kanban_columns" ON public.kanban_columns
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')));

DROP POLICY IF EXISTS "Allow authenticated users to read kanban_cards" ON public.kanban_cards;
CREATE POLICY "Allow authenticated users to read kanban_cards" ON public.kanban_cards FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin and taller to manage kanban_cards" ON public.kanban_cards;
CREATE POLICY "Allow admin and taller to manage kanban_cards" ON public.kanban_cards
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')));
