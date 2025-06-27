-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.accesorios_vehiculo (
  id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  accesorio text,
  cantidad integer,
  vehiculo_id uuid DEFAULT gen_random_uuid(),
  CONSTRAINT accesorios_vehiculo_pkey PRIMARY KEY (id),
  CONSTRAINT accesorios_vehiculo_vehiculo_id_fkey FOREIGN KEY (vehiculo_id) REFERENCES public.vehiculos(id)
);
CREATE TABLE public.admision_vehiculo (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  chequeo_id integer,
  servicio_id integer,
  vehiculo_id integer,
  accesorios_id integer,
  pertenencias_id integer,
  CONSTRAINT admision_vehiculo_pkey PRIMARY KEY (id)
);
CREATE TABLE public.aseguradoras (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  nombre text,
  corrreo text,
  telefono text,
  estado_tributario text,
  nivel_tarifa text,
  cliente_id bigint,
  flota_id bigint,
  CONSTRAINT aseguradoras_pkey PRIMARY KEY (id),
  CONSTRAINT aseguradoras_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id),
  CONSTRAINT aseguradoras_flota_id_fkey FOREIGN KEY (flota_id) REFERENCES public.flotas(id)
);
CREATE TABLE public.calendario_configuracion (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL UNIQUE,
  vista_predeterminada text NOT NULL DEFAULT 'semanal'::text CHECK (vista_predeterminada = ANY (ARRAY['diaria'::text, 'semanal'::text, 'mensual'::text])),
  mostrar_fines_semana boolean DEFAULT false,
  hora_inicio_vista time without time zone NOT NULL DEFAULT '07:00:00'::time without time zone,
  hora_fin_vista time without time zone NOT NULL DEFAULT '19:00:00'::time without time zone,
  intervalo_tiempo integer NOT NULL DEFAULT 30,
  color_alta_carga text DEFAULT '#ff4d4f'::text,
  color_carga_normal text DEFAULT '#52c41a'::text,
  color_baja_carga text DEFAULT '#1890ff'::text,
  filtros_predeterminados jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT calendario_configuracion_pkey PRIMARY KEY (id),
  CONSTRAINT calendario_configuracion_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES auth.users(id)
);
CREATE TABLE public.categorias_materiales (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text,
  categoria_padre_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT categorias_materiales_pkey PRIMARY KEY (id),
  CONSTRAINT categorias_materiales_categoria_padre_id_fkey FOREIGN KEY (categoria_padre_id) REFERENCES public.categorias_materiales(id)
);
CREATE TABLE public.categorias_vehiculos (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  nombre text,
  CONSTRAINT categorias_vehiculos_pkey PRIMARY KEY (id)
);
CREATE TABLE public.chequeo_vehiculo (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  nivel_combustible text,
  estado_limpieza text,
  estado_llaves text,
  sistema_electrico boolean,
  sistema_mecánico boolean,
  indicadores text,
  observaciones text,
  vehiculo_id uuid DEFAULT gen_random_uuid(),
  vin text,
  kilometraje text,
  CONSTRAINT chequeo_vehiculo_pkey PRIMARY KEY (id),
  CONSTRAINT chequeo_vehiculo_vehiculo_id_fkey FOREIGN KEY (vehiculo_id) REFERENCES public.vehiculos(id)
);
CREATE TABLE public.citas (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  cliente_id uuid,
  vehiculo_id uuid,
  tecnico_id uuid,
  fecha date NOT NULL,
  hora_inicio time without time zone NOT NULL,
  hora_fin time without time zone NOT NULL,
  tipo_servicio text,
  descripcion text,
  estado text DEFAULT 'programada'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT citas_pkey PRIMARY KEY (id)
);
CREATE TABLE public.citas_servicios (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  duracion time without time zone,
  cliente_id bigint,
  servicio_id bigint,
  tecnico_id integer,
  vehiculo_id uuid,
  CONSTRAINT citas_servicios_pkey PRIMARY KEY (id),
  CONSTRAINT citas_servicios_servicio_id_fkey FOREIGN KEY (servicio_id) REFERENCES public.servicios(id),
  CONSTRAINT citas_servicios_vehiculo_id_fkey FOREIGN KEY (vehiculo_id) REFERENCES public.vehiculos(id),
  CONSTRAINT citas_servicios_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id)
);
CREATE TABLE public.clientes (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  nombre text,
  apellido text,
  correo text,
  telefono text,
  direccion text,
  rtn text,
  regimen_tributario text,
  dias_credito text,
  monto_maximo text,
  forma_pago text,
  flota_id bigint,
  aseguradora_id bigint,
  servicio_id integer,
  CONSTRAINT clientes_pkey PRIMARY KEY (id),
  CONSTRAINT clientes_aseguradora_id_fkey FOREIGN KEY (aseguradora_id) REFERENCES public.aseguradoras(id),
  CONSTRAINT clientes_servicio_id_fkey FOREIGN KEY (servicio_id) REFERENCES public.servicios(id),
  CONSTRAINT clientes_flota_id_fkey FOREIGN KEY (flota_id) REFERENCES public.flotas(id)
);
CREATE TABLE public.clients (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  name text NOT NULL,
  company text,
  phone text,
  email text,
  client_type text DEFAULT 'Individual'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT clients_pkey PRIMARY KEY (id)
);
CREATE TABLE public.conductores (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  nombre text,
  apellido text,
  licencia_url text,
  certificados_url json,
  CONSTRAINT conductores_pkey PRIMARY KEY (id)
);
CREATE TABLE public.departamentos (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  nombre text,
  telefono text,
  descripcion text,
  CONSTRAINT departamentos_pkey PRIMARY KEY (id)
);
CREATE TABLE public.desempeño_conductor (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  observacion text,
  calificacion integer,
  conductor_id bigint,
  CONSTRAINT desempeño_conductor_pkey PRIMARY KEY (id),
  CONSTRAINT desempeño_conductor_conductor_id_fkey FOREIGN KEY (conductor_id) REFERENCES public.conductores(id)
);
CREATE TABLE public.detalles_cotizacion (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  orden_trabajo_id uuid NOT NULL,
  numero_item integer NOT NULL,
  cantidad integer NOT NULL DEFAULT 1,
  parte_id uuid NOT NULL,
  tipo_operacion_id uuid,
  tipo_material_id uuid,
  tipo_reparacion_id uuid,
  horas_reparacion numeric DEFAULT 0,
  horas_cambio numeric DEFAULT 0,
  horas_remocion numeric DEFAULT 0,
  horas_pintura_base numeric DEFAULT 0,
  horas_pintura_metalica numeric DEFAULT 0,
  horas_pintura_bicapa numeric DEFAULT 0,
  horas_pintura_tricapa numeric DEFAULT 0,
  costo_mano_obra numeric DEFAULT 0,
  costo_materiales numeric DEFAULT 0,
  costo_repuestos numeric DEFAULT 0,
  total_item numeric DEFAULT 0,
  notas text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT detalles_cotizacion_pkey PRIMARY KEY (id),
  CONSTRAINT detalles_cotizacion_tipo_operacion_id_fkey FOREIGN KEY (tipo_operacion_id) REFERENCES public.tipos_operacion(id),
  CONSTRAINT detalles_cotizacion_tipo_reparacion_id_fkey FOREIGN KEY (tipo_reparacion_id) REFERENCES public.tipos_reparacion(id),
  CONSTRAINT detalles_cotizacion_orden_trabajo_id_fkey FOREIGN KEY (orden_trabajo_id) REFERENCES public.ordenes_trabajo(id),
  CONSTRAINT detalles_cotizacion_parte_id_fkey FOREIGN KEY (parte_id) REFERENCES public.partes_vehiculo(id),
  CONSTRAINT detalles_cotizacion_tipo_material_id_fkey FOREIGN KEY (tipo_material_id) REFERENCES public.tipos_material(id)
);
CREATE TABLE public.equipo_trabajo (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  nombre text,
  CONSTRAINT equipo_trabajo_pkey PRIMARY KEY (id)
);
CREATE TABLE public.especialidades_taller (
  id integer NOT NULL DEFAULT nextval('especialidades_taller_id_seq'::regclass),
  nombre character varying NOT NULL UNIQUE,
  CONSTRAINT especialidades_taller_pkey PRIMARY KEY (id)
);
CREATE TABLE public.facturas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  cliente_id uuid,
  total numeric NOT NULL,
  fecha_emision timestamp without time zone DEFAULT now(),
  estado character varying CHECK (estado::text = ANY (ARRAY['Pagado'::character varying::text, 'Pendiente'::character varying::text, 'Cancelado'::character varying::text])),
  entidad_bancaria_id bigint,
  metodo_pago_id bigint,
  subtotal real,
  impuesto real,
  descuento integer,
  CONSTRAINT facturas_pkey PRIMARY KEY (id),
  CONSTRAINT facturas_metodo_pago_id_fkey FOREIGN KEY (metodo_pago_id) REFERENCES public.metodo_pago(id),
  CONSTRAINT facturas_entidad_bancaria_id_fkey FOREIGN KEY (entidad_bancaria_id) REFERENCES public.informacion_bancaria(id)
);
CREATE TABLE public.flotas (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  nombre text,
  identificacion_fiscal text,
  estado_operativo text,
  telefono text,
  correo text,
  propietario text,
  contacto_departamento_id bigint,
  metodo_pago_id bigint,
  info_banco_id integer,
  nombre_banco text,
  CONSTRAINT flotas_pkey PRIMARY KEY (id),
  CONSTRAINT flotas_contacto_departamento_id_fkey FOREIGN KEY (contacto_departamento_id) REFERENCES public.departamentos(id),
  CONSTRAINT flotas_metodo_pago_id_fkey FOREIGN KEY (metodo_pago_id) REFERENCES public.metodo_pago(id)
);
CREATE TABLE public.informacion_bancaria (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  entidad_bancaria text,
  moneda_facturacion text,
  direccion_fiscal text,
  porcentaje_mora real,
  CONSTRAINT informacion_bancaria_pkey PRIMARY KEY (id)
);
CREATE TABLE public.inventario (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  producto text,
  proceso text,
  unidad_medida text,
  lugar_compra text,
  precio_unitario real,
  cantidad integer,
  precio_total real,
  rendi_hora_reparar real,
  ren_veh integer,
  costo real,
  costo_total real,
  rendi_hora_pin real,
  cantidad_veh integer,
  cantidad_h_rep integer,
  cantidad_h_pin integer,
  ajuste real,
  inv_inicial text,
  com_1 text,
  com_2 text,
  com_3 text,
  com_4 text,
  inv_final text,
  categoria_id uuid DEFAULT gen_random_uuid(),
  material_pintura boolean,
  material_reparacion boolean,
  proveedor_id uuid,
  vehiculo_id uuid,
  proceso_id bigint,
  taller_id uuid,
  CONSTRAINT inventario_pkey PRIMARY KEY (id),
  CONSTRAINT inventario_taller_id_fkey FOREIGN KEY (taller_id) REFERENCES public.talleres(id),
  CONSTRAINT inventario_proveedor_id_fkey FOREIGN KEY (proveedor_id) REFERENCES public.suppliers(id),
  CONSTRAINT inventario_proceso_id_fkey FOREIGN KEY (proceso_id) REFERENCES public.procesos(id),
  CONSTRAINT inventario_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias_materiales(id),
  CONSTRAINT inventario_vehiculo_id_fkey FOREIGN KEY (vehiculo_id) REFERENCES public.vehiculos(id)
);
CREATE TABLE public.inventario_repuestos (
  id integer NOT NULL DEFAULT nextval('inventario_repuestos_id_seq'::regclass),
  nombre character varying NOT NULL,
  cantidad_disponible integer NOT NULL,
  precio_unitario numeric NOT NULL,
  especialidad_id integer,
  CONSTRAINT inventario_repuestos_pkey PRIMARY KEY (id),
  CONSTRAINT inventario_repuestos_especialidad_id_fkey FOREIGN KEY (especialidad_id) REFERENCES public.especialidades_taller(id)
);
CREATE TABLE public.kanban_cards (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  description text,
  column_id character varying NOT NULL,
  work_order_id uuid,
  vehicle_id uuid,
  client_name character varying NOT NULL,
  priority character varying NOT NULL CHECK (priority::text = ANY (ARRAY['alta'::character varying::text, 'normal'::character varying::text, 'baja'::character varying::text])),
  assignee_id uuid,
  position integer NOT NULL,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT kanban_cards_pkey PRIMARY KEY (id),
  CONSTRAINT kanban_cards_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehiculos(id),
  CONSTRAINT kanban_cards_assignee_id_fkey FOREIGN KEY (assignee_id) REFERENCES auth.users(id),
  CONSTRAINT kanban_cards_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT kanban_cards_work_order_id_fkey FOREIGN KEY (work_order_id) REFERENCES public.ordenes_trabajo(id),
  CONSTRAINT kanban_cards_column_id_fkey FOREIGN KEY (column_id) REFERENCES public.kanban_columns(id)
);
CREATE TABLE public.kanban_columns (
  id character varying NOT NULL,
  title character varying NOT NULL,
  description text,
  color character varying NOT NULL,
  position integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT kanban_columns_pkey PRIMARY KEY (id)
);
CREATE TABLE public.kpis (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  codigo character varying NOT NULL UNIQUE,
  nombre text NOT NULL,
  descripcion text,
  categoria text NOT NULL CHECK (categoria = ANY (ARRAY['financiero'::text, 'operativo'::text, 'productividad'::text, 'satisfaccion'::text])),
  formula text,
  unidad_medida text,
  valor_objetivo numeric,
  valor_minimo numeric,
  valor_maximo numeric,
  color_bajo text DEFAULT '#ff4d4f'::text,
  color_medio text DEFAULT '#faad14'::text,
  color_alto text DEFAULT '#52c41a'::text,
  visible_dashboard boolean DEFAULT true,
  orden_dashboard integer,
  activo boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT kpis_pkey PRIMARY KEY (id)
);
CREATE TABLE public.mantenimiento (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  descripcion text,
  monto text,
  vehiculo_id uuid,
  CONSTRAINT mantenimiento_pkey PRIMARY KEY (id),
  CONSTRAINT mantenimiento_vehiculo_id_fkey FOREIGN KEY (vehiculo_id) REFERENCES public.vehiculos(id)
);
CREATE TABLE public.material_cotizacion (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  material_id uuid,
  cotizacion_id uuid,
  cantidad numeric DEFAULT 0,
  costo_total numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT material_cotizacion_pkey PRIMARY KEY (id),
  CONSTRAINT material_cotizacion_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materiales(id)
);
CREATE TABLE public.material_orden (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  material_id uuid,
  orden_id uuid,
  cantidad numeric DEFAULT 0,
  costo_total numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT material_orden_pkey PRIMARY KEY (id),
  CONSTRAINT material_orden_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materiales(id)
);
CREATE TABLE public.materiales (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  nombre text NOT NULL,
  descripcion text,
  categoria text,
  precio numeric DEFAULT 0,
  stock integer DEFAULT 0,
  unidad text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT materiales_pkey PRIMARY KEY (id)
);
CREATE TABLE public.metodo_pago (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  nombre text,
  CONSTRAINT metodo_pago_pkey PRIMARY KEY (id)
);
CREATE TABLE public.orden_repuestos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  orden_id uuid,
  repuesto_id uuid,
  cantidad integer NOT NULL,
  CONSTRAINT orden_repuestos_pkey PRIMARY KEY (id),
  CONSTRAINT orden_repuestos_orden_id_fkey FOREIGN KEY (orden_id) REFERENCES public.ordenes_trabajo(id),
  CONSTRAINT orden_repuestos_repuesto_id_fkey FOREIGN KEY (repuesto_id) REFERENCES public.repuestos(id)
);
CREATE TABLE public.ordenes_trabajo (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  vehiculo_id uuid,
  cliente_id uuid,
  descripcion text NOT NULL,
  costo numeric,
  estado character varying CHECK (estado::text = ANY (ARRAY['Pendiente'::character varying::text, 'En Proceso'::character varying::text, 'Finalizado'::character varying::text])),
  fecha_creacion timestamp without time zone DEFAULT now(),
  tecnico_id uuid,
  CONSTRAINT ordenes_trabajo_pkey PRIMARY KEY (id),
  CONSTRAINT ordenes_trabajo_vehiculo_id_fkey FOREIGN KEY (vehiculo_id) REFERENCES public.vehiculos(id)
);
CREATE TABLE public.ordenes_trabajo_procesos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  orden_trabajo_id uuid NOT NULL,
  proceso_id integer NOT NULL,
  proceso_pintura_reparacion_id uuid,
  horas numeric NOT NULL,
  costo numeric NOT NULL,
  precio numeric NOT NULL,
  fecha_inicio timestamp with time zone,
  fecha_fin timestamp with time zone,
  estado text NOT NULL DEFAULT 'pendiente'::text CHECK (estado = ANY (ARRAY['pendiente'::text, 'en_progreso'::text, 'completado'::text, 'cancelado'::text])),
  notas text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT ordenes_trabajo_procesos_pkey PRIMARY KEY (id),
  CONSTRAINT ordenes_trabajo_procesos_proceso_id_fkey FOREIGN KEY (proceso_id) REFERENCES public.procesos(id),
  CONSTRAINT ordenes_trabajo_procesos_orden_trabajo_id_fkey FOREIGN KEY (orden_trabajo_id) REFERENCES public.ordenes_trabajo(id),
  CONSTRAINT ordenes_trabajo_procesos_proceso_pintura_reparacion_id_fkey FOREIGN KEY (proceso_pintura_reparacion_id) REFERENCES public.procesos_pintura_reparacion(id)
);
CREATE TABLE public.pagos (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT pagos_pkey PRIMARY KEY (id)
);
CREATE TABLE public.paquetes_servicio (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  nombre text NOT NULL,
  descripcion text,
  precio numeric DEFAULT 0,
  duracion integer DEFAULT 60,
  procesos ARRAY,
  materiales ARRAY,
  activo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT paquetes_servicio_pkey PRIMARY KEY (id)
);
CREATE TABLE public.partes_vehiculo (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  categoria text NOT NULL CHECK (categoria = ANY (ARRAY['Estructural'::text, 'Carroceria'::text, 'Pintura'::text, 'Mecanica'::text, 'Electrica'::text])),
  descripcion text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT partes_vehiculo_pkey PRIMARY KEY (id)
);
CREATE TABLE public.perfil_usuario (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  nombre text,
  apellido text,
  correo text,
  telefono text,
  estado boolean,
  actualizado timestamp with time zone DEFAULT now(),
  auth_id uuid DEFAULT gen_random_uuid(),
  CONSTRAINT perfil_usuario_pkey PRIMARY KEY (id)
);
CREATE TABLE public.pertenencias_vehiculo (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  nombre text,
  vehiculo_id uuid DEFAULT gen_random_uuid(),
  CONSTRAINT pertenencias_vehiculo_pkey PRIMARY KEY (id),
  CONSTRAINT pertenencias_vehiculo_vehiculo_id_fkey FOREIGN KEY (vehiculo_id) REFERENCES public.vehiculos(id)
);
CREATE TABLE public.procesos (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  codigo text,
  tipo text,
  nombre text,
  descripcion text,
  proceso_pintura boolean,
  proceso_reparacion boolean,
  costo_base real,
  precio_venta real,
  porcentaje_margen real,
  CONSTRAINT procesos_pkey PRIMARY KEY (id)
);
CREATE TABLE public.procesos_materiales (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  proceso_id integer NOT NULL,
  inventario_id integer NOT NULL,
  cantidad_por_hora numeric NOT NULL,
  cantidad_por_vehiculo numeric,
  notas text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT procesos_materiales_pkey PRIMARY KEY (id),
  CONSTRAINT procesos_materiales_inventario_id_fkey FOREIGN KEY (inventario_id) REFERENCES public.inventario(id),
  CONSTRAINT procesos_materiales_proceso_id_fkey FOREIGN KEY (proceso_id) REFERENCES public.procesos(id)
);
CREATE TABLE public.procesos_paquete (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  paquete_id uuid,
  proceso_id uuid,
  orden integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT procesos_paquete_pkey PRIMARY KEY (id),
  CONSTRAINT procesos_paquete_proceso_id_fkey FOREIGN KEY (proceso_id) REFERENCES public.procesos_taller(id),
  CONSTRAINT procesos_paquete_paquete_id_fkey FOREIGN KEY (paquete_id) REFERENCES public.paquetes_servicio(id)
);
CREATE TABLE public.procesos_pintura_reparacion (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT procesos_pintura_reparacion_pkey PRIMARY KEY (id)
);
CREATE TABLE public.procesos_taller (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  nombre text NOT NULL,
  descripcion text,
  tiempo_estimado integer DEFAULT 60,
  orden integer DEFAULT 0,
  tipo text,
  validaciones text,
  activo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT procesos_taller_pkey PRIMARY KEY (id)
);
CREATE TABLE public.quotation_parts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  quotation_id uuid,
  category text NOT NULL,
  name text NOT NULL,
  quantity integer NOT NULL,
  operation text NOT NULL,
  material_type text NOT NULL,
  repair_type text NOT NULL,
  repair_hours numeric NOT NULL,
  labor_cost numeric NOT NULL,
  materials_cost numeric NOT NULL,
  parts_cost numeric NOT NULL,
  total numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quotation_parts_pkey PRIMARY KEY (id),
  CONSTRAINT quotation_parts_quotation_id_fkey FOREIGN KEY (quotation_id) REFERENCES public.quotations(id)
);
CREATE TABLE public.quotations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  quotation_number text NOT NULL,
  client_id uuid,
  vehicle_id uuid,
  date date NOT NULL,
  status text NOT NULL,
  total_labor numeric NOT NULL,
  total_materials numeric NOT NULL,
  total_parts numeric NOT NULL,
  total numeric NOT NULL,
  repair_hours numeric NOT NULL,
  estimated_days integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quotations_pkey PRIMARY KEY (id),
  CONSTRAINT quotations_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id),
  CONSTRAINT quotations_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id)
);
CREATE TABLE public.registro_fotografico_vehiculo (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  imagen_url text,
  vehiculo_id uuid,
  chequeo_id bigint,
  descripcion_daños text,
  CONSTRAINT registro_fotografico_vehiculo_pkey PRIMARY KEY (id),
  CONSTRAINT registro_fotografico_vehiculo_vehiculo_id_fkey FOREIGN KEY (vehiculo_id) REFERENCES public.vehiculos(id),
  CONSTRAINT registro_fotografico_vehiculo_chequeo_id_fkey FOREIGN KEY (chequeo_id) REFERENCES public.chequeo_vehiculo(id)
);
CREATE TABLE public.reportes_aseguradoras (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  vehiculo_id uuid,
  aseguradora character varying NOT NULL,
  descripcion_reporte text NOT NULL,
  fecha_reporte timestamp without time zone DEFAULT now(),
  estado character varying CHECK (estado::text = ANY (ARRAY['En Revisión'::character varying::text, 'Aprobado'::character varying::text, 'Rechazado'::character varying::text])),
  CONSTRAINT reportes_aseguradoras_pkey PRIMARY KEY (id),
  CONSTRAINT reportes_aseguradoras_vehiculo_id_fkey FOREIGN KEY (vehiculo_id) REFERENCES public.vehiculos(id)
);
CREATE TABLE public.repuestos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre character varying NOT NULL,
  cantidad integer DEFAULT 0,
  precio numeric,
  descripcion text,
  taller_id uuid,
  CONSTRAINT repuestos_pkey PRIMARY KEY (id),
  CONSTRAINT repuestos_taller_id_fkey FOREIGN KEY (taller_id) REFERENCES public.talleres(id)
);
CREATE TABLE public.roles (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  nombre text UNIQUE,
  descripcion text,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT roles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.roles_usuario (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid DEFAULT gen_random_uuid(),
  rol_id integer,
  CONSTRAINT roles_usuario_pkey PRIMARY KEY (id),
  CONSTRAINT roles_usuario_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT roles_usuario_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id)
);
CREATE TABLE public.servicios (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  nombre text,
  descripcion text,
  precio real,
  tiempo_estimado integer,
  categoria text,
  estado boolean,
  nivel_tarifa text,
  vehiculo_id uuid,
  CONSTRAINT servicios_pkey PRIMARY KEY (id),
  CONSTRAINT servicios_vehiculo_id_fkey FOREIGN KEY (vehiculo_id) REFERENCES public.vehiculos(id)
);
CREATE TABLE public.servicios_realizados (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  orden_id uuid,
  especialidad_id integer,
  tecnico_id uuid,
  descripcion text NOT NULL,
  tiempo_estimado character varying,
  costo numeric,
  fecha_servicio timestamp without time zone DEFAULT now(),
  CONSTRAINT servicios_realizados_pkey PRIMARY KEY (id),
  CONSTRAINT servicios_realizados_orden_id_fkey FOREIGN KEY (orden_id) REFERENCES public.ordenes_trabajo(id),
  CONSTRAINT servicios_realizados_especialidad_id_fkey FOREIGN KEY (especialidad_id) REFERENCES public.especialidades_taller(id)
);
CREATE TABLE public.siniestros (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  descripcion text,
  nivel_daño integer,
  aseguradora_id bigint,
  CONSTRAINT siniestros_pkey PRIMARY KEY (id),
  CONSTRAINT siniestros_aseguradora_id_fkey FOREIGN KEY (aseguradora_id) REFERENCES public.aseguradoras(id)
);
CREATE TABLE public.suppliers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  contact_name character varying,
  email character varying,
  phone character varying,
  address text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT suppliers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.talleres (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre character varying NOT NULL,
  direccion text,
  telefono character varying,
  gerente_id uuid,
  CONSTRAINT talleres_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tecnicos (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  nombre text,
  apellido text,
  telefono text,
  disponible boolean,
  cargo text,
  area text,
  CONSTRAINT tecnicos_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tipos_material (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  codigo character varying NOT NULL UNIQUE,
  nombre text NOT NULL,
  descripcion text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tipos_material_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tipos_operacion (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  codigo character varying NOT NULL UNIQUE,
  nombre text NOT NULL,
  descripcion text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tipos_operacion_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tipos_reparacion (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  codigo character varying NOT NULL UNIQUE,
  nombre text NOT NULL,
  descripcion text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tipos_reparacion_pkey PRIMARY KEY (id)
);
CREATE TABLE public.vehicles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  client_id uuid,
  marca text NOT NULL,
  modelo text NOT NULL,
  ano integer,
  color text,
  placa text,
  vin text,
  kilometraje integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT vehicles_pkey PRIMARY KEY (id),
  CONSTRAINT vehicles_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id)
);
CREATE TABLE public.vehiculos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  placa character varying NOT NULL UNIQUE,
  marca character varying,
  modelo character varying,
  color character varying,
  estado character varying CHECK (estado::text = ANY (ARRAY['Recepción'::character varying::text, 'Inspección'::character varying::text, 'Reparación'::character varying::text, 'Pintura'::character varying::text, 'Listo para entrega'::character varying::text])),
  fecha_ingreso timestamp without time zone DEFAULT now(),
  imagen_url text,
  anio text,
  conductor_id bigint,
  CONSTRAINT vehiculos_pkey PRIMARY KEY (id)
);