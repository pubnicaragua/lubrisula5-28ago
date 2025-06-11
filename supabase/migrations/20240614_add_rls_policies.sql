-- Enable Row Level Security for all relevant tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfil_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talleres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materiales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.miembros_equipo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items_factura ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repuestos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procesos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paquetes_servicio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procesos_paquete ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conductores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipos_material ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipos_operacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipos_reparacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias_materiales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.especialidades_taller ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metodo_pago ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_inspections ENABLE ROW LEVEL SECURITY;


-- Policies for 'roles' and 'roles_usuario' (Admin access only for modification, read for all authenticated)
DROP POLICY IF EXISTS "Allow read access for all authenticated users to roles" ON public.roles;
CREATE POLICY "Allow read access for all authenticated users to roles" ON public.roles FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin to manage roles" ON public.roles;
CREATE POLICY "Allow admin to manage roles" ON public.roles
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND r.nombre = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND r.nombre = 'admin'));

DROP POLICY IF EXISTS "Allow read access for all authenticated users to roles_usuario" ON public.roles_usuario;
CREATE POLICY "Allow read access for all authenticated users to roles_usuario" ON public.roles_usuario FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin to manage roles_usuario" ON public.roles_usuario;
CREATE POLICY "Allow admin to manage roles_usuario" ON public.roles_usuario
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND r.nombre = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND r.nombre = 'admin'));


-- Policies for 'perfil_usuario' (Users can read their own profile, admin can manage all)
DROP POLICY IF EXISTS "Allow authenticated users to read their own perfil_usuario" ON public.perfil_usuario;
CREATE POLICY "Allow authenticated users to read their own perfil_usuario" ON public.perfil_usuario FOR SELECT USING (auth.uid() = auth_id);

DROP POLICY IF EXISTS "Allow authenticated users to update their own perfil_usuario" ON public.perfil_usuario;
CREATE POLICY "Allow authenticated users to update their own perfil_usuario" ON public.perfil_usuario FOR UPDATE USING (auth.uid() = auth_id) WITH CHECK (auth.uid() = auth_id);

DROP POLICY IF EXISTS "Allow admin to manage all perfil_usuario" ON public.perfil_usuario;
CREATE POLICY "Allow admin to manage all perfil_usuario" ON public.perfil_usuario
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND r.nombre = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND r.nombre = 'admin'));


-- Policies for 'clients' (Authenticated users can read, admin/taller can manage)
DROP POLICY IF EXISTS "Allow authenticated users to read clients" ON public.clients;
CREATE POLICY "Allow authenticated users to read clients" ON public.clients FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin and taller to manage clients" ON public.clients;
CREATE POLICY "Allow admin and taller to manage clients" ON public.clients
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')));


-- Policies for 'vehicles' (Authenticated users can read, admin/taller can manage)
DROP POLICY IF EXISTS "Allow authenticated users to read vehicles" ON public.vehicles;
CREATE POLICY "Allow authenticated users to read vehicles" ON public.vehicles FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin and taller to manage vehicles" ON public.vehicles;
CREATE POLICY "Allow admin and taller to manage vehicles" ON public.vehicles
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')));


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


-- Policies for 'talleres' (Authenticated users can read, admin can manage)
DROP POLICY IF EXISTS "Allow authenticated users to read talleres" ON public.talleres;
CREATE POLICY "Allow authenticated users to read talleres" ON public.talleres FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin to manage talleres" ON public.talleres;
CREATE POLICY "Allow admin to manage talleres" ON public.talleres
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND r.nombre = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND r.nombre = 'admin'));


-- Policies for 'materiales' (Authenticated users can read, admin/taller can manage)
DROP POLICY IF EXISTS "Allow authenticated users to read materiales" ON public.materiales;
CREATE POLICY "Allow authenticated users to read materiales" ON public.materiales FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin and taller to manage materiales" ON public.materiales;
CREATE POLICY "Allow admin and taller to manage materiales" ON public.materiales
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')));


-- Policies for 'ordenes' (Authenticated users can read, admin/taller can manage)
DROP POLICY IF EXISTS "Allow authenticated users to read ordenes" ON public.ordenes;
CREATE POLICY "Allow authenticated users to read ordenes" ON public.ordenes FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin and taller to manage ordenes" ON public.ordenes;
CREATE POLICY "Allow admin and taller to manage ordenes" ON public.ordenes
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')));


-- Policies for 'miembros_equipo' (Authenticated users can read, admin/taller can manage)
DROP POLICY IF EXISTS "Allow authenticated users to read miembros_equipo" ON public.miembros_equipo;
CREATE POLICY "Allow authenticated users to read miembros_equipo" ON public.miembros_equipo FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin and taller to manage miembros_equipo" ON public.miembros_equipo;
CREATE POLICY "Allow admin and taller to manage miembros_equipo" ON public.miembros_equipo
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')));


-- Policies for 'facturas' (Authenticated users can read, admin/taller can manage)
DROP POLICY IF EXISTS "Allow authenticated users to read facturas" ON public.facturas;
CREATE POLICY "Allow authenticated users to read facturas" ON public.facturas FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin and taller to manage facturas" ON public.facturas;
CREATE POLICY "Allow admin and taller to manage facturas" ON public.facturas
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')));


-- Policies for 'items_factura' (Authenticated users can read, admin/taller can manage)
DROP POLICY IF EXISTS "Allow authenticated users to read items_factura" ON public.items_factura;
CREATE POLICY "Allow authenticated users to read items_factura" ON public.items_factura FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin and taller to manage items_factura" ON public.items_factura;
CREATE POLICY "Allow admin and taller to manage items_factura" ON public.items_factura
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')));


-- Policies for 'citas' (Authenticated users can read, admin/taller can manage)
DROP POLICY IF EXISTS "Allow authenticated users to read citas" ON public.citas;
CREATE POLICY "Allow authenticated users to read citas" ON public.citas FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin and taller to manage citas" ON public.citas;
CREATE POLICY "Allow admin and taller to manage citas" ON public.citas
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')));


-- Policies for 'proveedores' (Authenticated users can read, admin/taller can manage)
DROP POLICY IF EXISTS "Allow authenticated users to read proveedores" ON public.proveedores;
CREATE POLICY "Allow authenticated users to read proveedores" ON public.proveedores FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin and taller to manage proveedores" ON public.proveedores;
CREATE POLICY "Allow admin and taller to manage proveedores" ON public.proveedores
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')));


-- Policies for 'repuestos' (Authenticated users can read, admin/taller can manage)
DROP POLICY IF EXISTS "Allow authenticated users to read repuestos" ON public.repuestos;
CREATE POLICY "Allow authenticated users to read repuestos" ON public.repuestos FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin and taller to manage repuestos" ON public.repuestos;
CREATE POLICY "Allow admin and taller to manage repuestos" ON public.repuestos
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')));


-- Policies for 'procesos' (Authenticated users can read, admin/taller can manage)
DROP POLICY IF EXISTS "Allow authenticated users to read procesos" ON public.procesos;
CREATE POLICY "Allow authenticated users to read procesos" ON public.procesos FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin and taller to manage procesos" ON public.procesos;
CREATE POLICY "Allow admin and taller to manage procesos" ON public.procesos
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')));


-- Policies for 'paquetes_servicio' (Authenticated users can read, admin/taller can manage)
DROP POLICY IF EXISTS "Allow authenticated users to read paquetes_servicio" ON public.paquetes_servicio;
CREATE POLICY "Allow authenticated users to read paquetes_servicio" ON public.paquetes_servicio FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin and taller to manage paquetes_servicio" ON public.paquetes_servicio;
CREATE POLICY "Allow admin and taller to manage paquetes_servicio" ON public.paquetes_servicio
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')));


-- Policies for 'procesos_paquete' (Authenticated users can read, admin/taller can manage)
DROP POLICY IF EXISTS "Allow authenticated users to read procesos_paquete" ON public.procesos_paquete;
CREATE POLICY "Allow authenticated users to read procesos_paquete" ON public.procesos_paquete FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin and taller to manage procesos_paquete" ON public.procesos_paquete;
CREATE POLICY "Allow admin and taller to manage procesos_paquete" ON public.procesos_paquete
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')));


-- Policies for 'flotas' (Authenticated users can read, admin/taller can manage)
DROP POLICY IF EXISTS "Allow authenticated users to read flotas" ON public.flotas;
CREATE POLICY "Allow authenticated users to read flotas" ON public.flotas FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin and taller to manage flotas" ON public.flotas;
CREATE POLICY "Allow admin and taller to manage flotas" ON public.flotas
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')));


-- Policies for 'conductores' (Authenticated users can read, admin/taller can manage)
DROP POLICY IF EXISTS "Allow authenticated users to read conductores" ON public.conductores;
CREATE POLICY "Allow authenticated users to read conductores" ON public.conductores FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin and taller to manage conductores" ON public.conductores;
CREATE POLICY "Allow admin and taller to manage conductores" ON public.conductores
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')));


-- Policies for 'horarios' (Authenticated users can read, admin/taller can manage)
DROP POLICY IF EXISTS "Allow authenticated users to read horarios" ON public.horarios;
CREATE POLICY "Allow authenticated users to read horarios" ON public.horarios FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin and taller to manage horarios" ON public.horarios;
CREATE POLICY "Allow admin and taller to manage horarios" ON public.horarios
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')));


-- Policies for 'tipos_material', 'tipos_operacion', 'tipos_reparacion', 'categorias_materiales', 'especialidades_taller', 'metodo_pago' (Read for all authenticated, admin/taller can manage)
-- These are lookup tables, so broader read access is fine.
DROP POLICY IF EXISTS "Allow authenticated users to read lookup tables" ON public.tipos_material;
CREATE POLICY "Allow authenticated users to read lookup tables" ON public.tipos_material FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Allow admin and taller to manage tipos_material" ON public.tipos_material;
CREATE POLICY "Allow admin and taller to manage tipos_material" ON public.tipos_material
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')));

DROP POLICY IF EXISTS "Allow authenticated users to read tipos_operacion" ON public.tipos_operacion;
CREATE POLICY "Allow authenticated users to read tipos_operacion" ON public.tipos_operacion FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Allow admin and taller to manage tipos_operacion" ON public.tipos_operacion;
CREATE POLICY "Allow admin and taller to manage tipos_operacion" ON public.tipos_operacion
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')));

DROP POLICY IF EXISTS "Allow authenticated users to read tipos_reparacion" ON public.tipos_reparacion;
CREATE POLICY "Allow authenticated users to read tipos_reparacion" ON public.tipos_reparacion FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Allow admin and taller to manage tipos_reparacion" ON public.tipos_reparacion;
CREATE POLICY "Allow admin and taller to manage tipos_reparacion" ON public.tipos_reparacion
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')));

DROP POLICY IF EXISTS "Allow authenticated users to read categorias_materiales" ON public.categorias_materiales;
CREATE POLICY "Allow authenticated users to read categorias_materiales" ON public.categorias_materiales FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Allow admin and taller to manage categorias_materiales" ON public.categorias_materiales;
CREATE POLICY "Allow admin and taller to manage categorias_materiales" ON public.categorias_materiales
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')));

DROP POLICY IF EXISTS "Allow authenticated users to read especialidades_taller" ON public.especialidades_taller;
CREATE POLICY "Allow authenticated users to read especialidades_taller" ON public.especialidades_taller FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Allow admin and taller to manage especialidades_taller" ON public.especialidades_taller;
CREATE POLICY "Allow admin and taller to manage especialidades_taller" ON public.especialidades_taller
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')));

DROP POLICY IF EXISTS "Allow authenticated users to read metodo_pago" ON public.metodo_pago;
CREATE POLICY "Allow authenticated users to read metodo_pago" ON public.metodo_pago FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Allow admin and taller to manage metodo_pago" ON public.metodo_pago;
CREATE POLICY "Allow admin and taller to manage metodo_pago" ON public.metodo_pago
FOR ALL USING (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')))
WITH CHECK (EXISTS (SELECT 1 FROM public.roles_usuario ru JOIN public.roles r ON ru.role_id = r.id WHERE ru.user_id = auth.uid() AND (r.nombre = 'admin' OR r.nombre = 'taller')));
