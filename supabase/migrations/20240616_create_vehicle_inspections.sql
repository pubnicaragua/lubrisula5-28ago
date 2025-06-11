-- Table: public.vehicle_inspections
CREATE TABLE IF NOT EXISTS public.vehicle_inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    inspection_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    inspector_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    fuel_level TEXT,
    exterior_damage JSONB,
    interior_damage JSONB,
    tire_condition JSONB,
    lights_condition JSONB,
    fluids_condition JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TRIGGER update_vehicle_inspections_updated_at BEFORE UPDATE ON public.vehicle_inspections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS for vehicle_inspections
ALTER TABLE public.vehicle_inspections ENABLE ROW LEVEL SECURITY;

-- Policies for 'vehicle_inspections' (Authenticated users can read, admin/taller can manage)
DROP POLICY IF EXISTS "Allow authenticated users to read vehicle_inspections" ON public.vehicle_inspections;
CREATE POLICY "Allow authenticated users to read vehicle_inspections" ON public.vehicle_inspections FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin and taller to manage vehicle_inspections" ON public.vehicle_inspections;
CREATE POLICY "Allow admin and taller to manage vehicle_inspections" ON public.vehicle_inspections
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')));
