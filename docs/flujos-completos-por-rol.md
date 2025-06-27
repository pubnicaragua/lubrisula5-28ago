\# 🔄 Flujos Completos por Rol - AutoFlowX



\## 👑 SUPERADMIN / ADMIN - Flujo Completo



\### 🎯 \*\*Dashboard Principal\*\*

\*\*URL:\*\* `/admin/dashboard`

\*\*Funcionalidades:\*\*

\- Vista general de métricas del sistema

\- Estadísticas de usuarios activos

\- Estado de talleres registrados

\- Alertas del sistema

\- Acceso rápido a funciones críticas



\### 👥 \*\*Gestión de Usuarios\*\*



\#### \*\*Lista de Usuarios\*\*

\*\*URL:\*\* `/admin/usuarios`

\*\*Funcionalidades:\*\*

\- Ver todos los usuarios registrados

\- Filtrar por rol (Admin, Taller, Aseguradora, Cliente)

\- Buscar usuarios por nombre/email

\- Editar roles de usuarios

\- Activar/desactivar cuentas

\- Ver detalles completos del perfil



\#### \*\*Verificación de Usuarios\*\*

\*\*URL:\*\* `/admin/verificar-usuarios`

\*\*Funcionalidades:\*\*

\- Lista de usuarios pendientes de verificación

\- Aprobar/rechazar registros de talleres

\- Verificar documentación subida

\- Enviar notificaciones de estado

\- Historial de verificaciones



\#### \*\*Sincronización de Roles\*\*

\*\*URL:\*\* `/admin/sync-roles`

\*\*Funcionalidades:\*\*

\- Sincronizar roles entre Supabase Auth y tablas de aplicación

\- Resolver conflictos de roles

\- Auditoría de cambios de roles

\- Corrección automática de inconsistencias



\#### \*\*Establecer SuperAdmin\*\*

\*\*URL:\*\* `/admin/set-superadmin`

\*\*Funcionalidades:\*\*

\- Promover usuarios a SuperAdmin

\- Validación de credenciales

\- Log de cambios críticos

\- Confirmación de seguridad



\### 🏢 \*\*Gestión de Entidades\*\*



\#### \*\*Gestión de Aseguradoras\*\*

\*\*URL:\*\* `/admin/aseguradoras`

\*\*Funcionalidades:\*\*

\- CRUD completo de aseguradoras

\- Configurar tarifas especiales

\- Gestionar contratos

\- Ver estadísticas de siniestros

\- Configurar políticas de aprobación



\#### \*\*Solicitudes de Talleres\*\*

\*\*URL:\*\* `/admin/solicitudes`

\*\*Funcionalidades:\*\*

\- Revisar solicitudes de registro de talleres

\- Verificar documentación legal

\- Aprobar/rechazar con comentarios

\- Enviar notificaciones automáticas

\- Seguimiento del proceso de aprobación



\#### \*\*Gestión de Clientes\*\*

\*\*URL:\*\* `/clientes`

\*\*Funcionalidades:\*\*

\- Ver todos los clientes del sistema

\- Editar información de clientes

\- Ver historial de servicios

\- Gestionar vehículos asociados

\- Resolver disputas



\#### \*\*Gestión de Vehículos\*\*

\*\*URL:\*\* `/vehiculos`

\*\*Funcionalidades:\*\*

\- Base de datos completa de vehículos

\- Historial de servicios por vehículo

\- Inspecciones realizadas

\- Documentación asociada

\- Reportes de daños



\#### \*\*Gestión de Cotizaciones\*\*

\*\*URL:\*\* `/cotizaciones`

\*\*Funcionalidades:\*\*

\- Ver todas las cotizaciones del sistema

\- Monitorear tiempos de respuesta

\- Resolver disputas entre partes

\- Análisis de precios del mercado

\- Reportes de conversión



\#### \*\*Gestión de Talleres\*\*

\*\*URL:\*\* `/talleres`

\*\*Funcionalidades:\*\*

\- Directorio completo de talleres

\- Calificaciones y reviews

\- Especialidades y certificaciones

\- Capacidad y disponibilidad

\- Métricas de rendimiento



\### 🗄️ \*\*Base de Datos y Sistema\*\*



\#### \*\*Panel de Base de Datos\*\*

\*\*URL:\*\* `/admin/database`

\*\*Funcionalidades:\*\*

\- Estado general de la base de datos

\- Métricas de rendimiento

\- Espacio utilizado

\- Conexiones activas

\- Logs de errores



\#### \*\*Inicialización de BD\*\*

\*\*URL:\*\* `/admin/database/initialize`

\*\*Funcionalidades:\*\*

\- Crear estructura inicial de tablas

\- Insertar datos maestros

\- Configurar políticas RLS

\- Crear índices optimizados

\- Validar integridad referencial



\#### \*\*Inicializar Nuevas Tablas\*\*

\*\*URL:\*\* `/admin/initialize-new-tables`

\*\*Funcionalidades:\*\*

\- Agregar nuevas tablas al sistema

\- Migrar datos existentes

\- Actualizar relaciones

\- Crear triggers necesarios

\- Validar estructura



\#### \*\*Inicializar Materiales\*\*

\*\*URL:\*\* `/admin/initialize-materials`

\*\*Funcionalidades:\*\*

\- Cargar catálogo de materiales

\- Configurar precios base

\- Establecer proveedores

\- Definir categorías

\- Configurar alertas de stock



\#### \*\*Inicializar Roles\*\*

\*\*URL:\*\* `/admin/initialize-roles`

\*\*Funcionalidades:\*\*

\- Crear roles del sistema

\- Asignar permisos por rol

\- Configurar políticas de acceso

\- Establecer jerarquías

\- Validar configuración



\#### \*\*Verificación de Calidad\*\*

\*\*URL:\*\* `/admin/qa-check`

\*\*Funcionalidades:\*\*

\- Ejecutar tests automatizados

\- Verificar integridad de datos

\- Validar configuraciones

\- Generar reportes de calidad

\- Identificar problemas críticos



\#### \*\*Datos de Prueba\*\*

\*\*URL:\*\* `/admin/test-data`

\*\*Funcionalidades:\*\*

\- Insertar datos de prueba

\- Simular escenarios reales

\- Limpiar datos de testing

\- Configurar ambientes de desarrollo

\- Validar funcionalidades



\### 📊 \*\*Reportes y Monitoreo\*\*



\#### \*\*Reportes Generales\*\*

\*\*URL:\*\* `/reportes`

\*\*Funcionalidades:\*\*

\- Reportes financieros consolidados

\- Métricas de uso del sistema

\- Análisis de tendencias

\- Comparativas por período

\- Exportación a múltiples formatos



\#### \*\*Estado del Despliegue\*\*

\*\*URL:\*\* `/admin/deploy-status`

\*\*Funcionalidades:\*\*

\- Estado actual del deployment

\- Versión en producción

\- Logs de despliegue

\- Rollback automático

\- Notificaciones de errores



\#### \*\*Verificar Despliegue\*\*

\*\*URL:\*\* `/admin/verify-deploy`

\*\*Funcionalidades:\*\*

\- Tests post-deployment

\- Verificación de servicios

\- Validación de configuraciones

\- Health checks automáticos

\- Reportes de disponibilidad



\#### \*\*Backlog del Proyecto\*\*

\*\*URL:\*\* `/admin/backlog`

\*\*Funcionalidades:\*\*

\- Estado del desarrollo

\- Tareas pendientes

\- Métricas de progreso

\- Asignación de recursos

\- Planificación de releases



\### ⚙️ \*\*Configuración Avanzada\*\*



\#### \*\*Panel SuperAdmin\*\*

\*\*URL:\*\* `/admin/superadmin`

\*\*Funcionalidades:\*\*

\- Configuraciones críticas del sistema

\- Gestión de licencias

\- Configuración de integraciones

\- Políticas de seguridad globales

\- Acceso a logs del sistema



---



\## 🔧 TALLER - Flujo Completo



\### 🎯 \*\*Dashboard Principal\*\*

\*\*URL:\*\* `/taller/dashboard`

\*\*Funcionalidades:\*\*

\- Resumen de órdenes activas

\- Citas del día

\- Alertas de inventario

\- Métricas de productividad

\- Notificaciones importantes

\- Acceso rápido a funciones principales



\### 📋 \*\*Gestión de Órdenes y Trabajo\*\*



\#### \*\*Lista de Órdenes\*\*

\*\*URL:\*\* `/taller/ordenes`

\*\*Funcionalidades:\*\*

\- Ver todas las órdenes de trabajo

\- Filtrar por estado (Pendiente, En Proceso, Completada)

\- Buscar por cliente o vehículo

\- Asignar técnicos

\- Actualizar estados

\- Ver detalles completos



\#### \*\*Nueva Orden de Trabajo\*\*

\*\*URL:\*\* `/taller/ordenes/nueva`

\*\*Funcionalidades:\*\*

\- Crear nueva orden paso a paso

\- Seleccionar cliente y vehículo

\- Definir servicios a realizar

\- Asignar técnicos responsables

\- Establecer fechas y prioridades

\- Generar orden automáticamente



\#### \*\*Tablero Kanban\*\*

\*\*URL:\*\* `/taller/kanban`

\*\*Funcionalidades:\*\*

\- Vista visual de órdenes por estado

\- Drag \& drop para cambiar estados

\- Filtros por técnico o tipo de servicio

\- Métricas en tiempo real

\- Alertas de retrasos

\- Configuración de columnas



\#### \*\*Kanban Personalizable\*\*

\*\*URL:\*\* `/taller/kanban-personalizado`

\*\*Funcionalidades:\*\*

\- Crear columnas personalizadas

\- Definir reglas de transición

\- Configurar colores y etiquetas

\- Establecer límites por columna

\- Automatizaciones personalizadas

\- Plantillas de workflow



\### 🚗 \*\*Gestión de Vehículos\*\*



\#### \*\*Lista de Vehículos\*\*

\*\*URL:\*\* `/taller/vehiculos`

\*\*Funcionalidades:\*\*

\- Todos los vehículos en el taller

\- Estado actual de cada vehículo

\- Historial de servicios

\- Documentación asociada

\- Fotos y evidencias

\- Programación de servicios



\#### \*\*Detalle de Vehículo\*\*

\*\*URL:\*\* `/taller/vehiculos/\[id]`

\*\*Funcionalidades:\*\*

\- Información completa del vehículo

\- Historial detallado de servicios

\- Inspecciones realizadas

\- Documentos y fotos

\- Órdenes de trabajo asociadas

\- Comunicación con el cliente



\#### \*\*Hoja de Ingreso\*\*

\*\*URL:\*\* `/taller/vehiculos/\[id]/ingreso`

\*\*Funcionalidades:\*\*

\- Registro de ingreso del vehículo

\- Documentación del estado inicial

\- Fotos del vehículo al ingreso

\- Inventario de objetos personales

\- Nivel de combustible

\- Condiciones especiales



\#### \*\*Inspección Básica\*\*

\*\*URL:\*\* `/taller/vehiculos/\[id]/inspeccion`

\*\*Funcionalidades:\*\*

\- Inspección visual general

\- Checklist de componentes

\- Identificación de daños

\- Recomendaciones de servicio

\- Fotos de evidencia

\- Priorización de reparaciones



\#### \*\*Inspección Detallada\*\*

\*\*URL:\*\* `/taller/vehiculos/\[id]/inspeccion-exacta`

\*\*Funcionalidades:\*\*

\- Inspección técnica exhaustiva

\- Mediciones precisas

\- Diagnóstico con equipos

\- Análisis de componentes

\- Reporte técnico detallado

\- Cotización automática



\### 💰 \*\*Gestión Comercial\*\*



\#### \*\*Gestión de Cotizaciones\*\*

\*\*URL:\*\* `/taller/cotizaciones`

\*\*Funcionalidades:\*\*

\- Lista de todas las cotizaciones

\- Estados: Pendiente, Enviada, Aprobada, Rechazada

\- Seguimiento de respuestas

\- Conversión a órdenes de trabajo

\- Historial de modificaciones

\- Análisis de competitividad



\#### \*\*Detalle de Cotización\*\*

\*\*URL:\*\* `/taller/cotizaciones/\[id]`

\*\*Funcionalidades:\*\*

\- Detalles completos de la cotización

\- Desglose de costos

\- Comunicación con el cliente

\- Modificaciones y versiones

\- Aprobación/rechazo

\- Conversión a orden



\#### \*\*Sistema de Facturación\*\*

\*\*URL:\*\* `/taller/facturas`

\*\*Funcionalidades:\*\*

\- Generar facturas automáticamente

\- Control de pagos

\- Estados: Pendiente, Pagada, Vencida

\- Reportes financieros

\- Integración con contabilidad

\- Recordatorios de pago



\#### \*\*Gestión de Citas\*\*

\*\*URL:\*\* `/taller/citas`

\*\*Funcionalidades:\*\*

\- Calendario de citas

\- Programar nuevas citas

\- Confirmar/cancelar citas

\- Recordatorios automáticos

\- Gestión de disponibilidad

\- Reprogramación automática



\### 📦 \*\*Inventario y Recursos\*\*



\#### \*\*Control de Inventario\*\*

\*\*URL:\*\* `/taller/inventario`

\*\*Funcionalidades:\*\*

\- Stock actual de repuestos

\- Alertas de stock bajo

\- Movimientos de inventario

\- Valorización de stock

\- Proveedores y precios

\- Órdenes de compra



\#### \*\*Catálogo de Servicios\*\*

\*\*URL:\*\* `/taller/servicios`

\*\*Funcionalidades:\*\*

\- Lista de servicios ofrecidos

\- Precios y tiempos estimados

\- Paquetes de servicios

\- Promociones activas

\- Configuración de precios

\- Análisis de rentabilidad



\#### \*\*Gestión de Técnicos\*\*

\*\*URL:\*\* `/taller/tecnicos`

\*\*Funcionalidades:\*\*

\- Lista de técnicos del taller

\- Especialidades y certificaciones

\- Horarios y disponibilidad

\- Asignación de trabajos

\- Métricas de productividad

\- Capacitación y desarrollo



\### 👥 \*\*Gestión de Clientes y Accesos\*\*



\#### \*\*Clientes del Taller\*\*

\*\*URL:\*\* `/taller/clientes`

\*\*Funcionalidades:\*\*

\- Base de datos de clientes

\- Historial de servicios por cliente

\- Comunicación y seguimiento

\- Preferencias del cliente

\- Programas de fidelidad

\- Análisis de valor del cliente



\#### \*\*Control de Accesos\*\*

\*\*URL:\*\* `/taller/accesos`

\*\*Funcionalidades:\*\*

\- Permisos de empleados

\- Roles específicos del taller

\- Control de horarios

\- Acceso a módulos específicos

\- Auditoría de accesos

\- Configuración de seguridad



\### 📊 \*\*Reportes y Configuración\*\*



\#### \*\*Reportes del Taller\*\*

\*\*URL:\*\* `/taller/reportes`

\*\*Funcionalidades:\*\*

\- Reportes de productividad

\- Análisis financiero

\- Métricas de calidad

\- Satisfacción del cliente

\- Rendimiento de técnicos

\- Comparativas históricas



\#### \*\*Configuración del Taller\*\*

\*\*URL:\*\* `/taller/configuracion`

\*\*Funcionalidades:\*\*

\- Información del taller

\- Horarios de operación

\- Configuración de servicios

\- Políticas de trabajo

\- Integraciones externas

\- Personalización de la interfaz



---



\## 🛡️ ASEGURADORA - Flujo Completo



\### 🎯 \*\*Dashboard Principal\*\*

\*\*URL:\*\* `/aseguradora/dashboard`

\*\*Funcionalidades:\*\*

\- Resumen de siniestros activos

\- Estadísticas de reparaciones

\- Talleres afiliados activos

\- Métricas de costos

\- Alertas importantes

\- KPIs principales



\### 🚗 \*\*Gestión de Vehículos y Siniestros\*\*



\#### \*\*Vehículos Asegurados\*\*

\*\*URL:\*\* `/aseguradora/vehiculos`

\*\*Funcionalidades:\*\*

\- Base de datos de vehículos asegurados

\- Historial de siniestros por vehículo

\- Pólizas asociadas

\- Valor asegurado vs. comercial

\- Riesgo por vehículo

\- Renovaciones pendientes



\#### \*\*Gestión de Siniestros\*\*

\*\*URL:\*\* `/aseguradora/siniestros`

\*\*Funcionalidades:\*\*

\- Lista de siniestros reportados

\- Estados: Reportado, En Evaluación, Aprobado, En Reparación, Cerrado

\- Asignación de peritos

\- Documentación del siniestro

\- Fotos y evidencias

\- Comunicación con talleres



\#### \*\*Seguimiento de Reparaciones\*\*

\*\*URL:\*\* `/aseguradora/reparaciones`

\*\*Funcionalidades:\*\*

\- Estado de reparaciones en curso

\- Progreso por taller

\- Control de tiempos

\- Calidad de reparaciones

\- Costos vs. presupuesto

\- Entrega de vehículos



\### 💼 \*\*Gestión Comercial\*\*



\#### \*\*Revisión de Cotizaciones\*\*

\*\*URL:\*\* `/aseguradora/cotizaciones`

\*\*Funcionalidades:\*\*

\- Cotizaciones recibidas de talleres

\- Análisis de precios

\- Comparación entre talleres

\- Aprobación/rechazo con comentarios

\- Negociación de precios

\- Historial de decisiones



\#### \*\*Gestión de Facturación\*\*

\*\*URL:\*\* `/aseguradora/facturacion`

\*\*Funcionalidades:\*\*

\- Facturas recibidas de talleres

\- Validación contra cotizaciones aprobadas

\- Proceso de pago

\- Control de presupuestos

\- Reportes de gastos

\- Auditoría de costos



\### 📞 \*\*Comunicación y Reportes\*\*



\#### \*\*Sistema de Mensajes\*\*

\*\*URL:\*\* `/aseguradora/mensajes`

\*\*Funcionalidades:\*\*

\- Comunicación con talleres

\- Mensajes con clientes

\- Notificaciones automáticas

\- Historial de comunicaciones

\- Templates de mensajes

\- Escalación de problemas



\#### \*\*Reportes de Aseguradora\*\*

\*\*URL:\*\* `/aseguradora/reportes`

\*\*Funcionalidades:\*\*

\- Análisis de siniestralidad

\- Costos por tipo de daño

\- Rendimiento de talleres

\- Tiempos de reparación

\- Satisfacción del cliente

\- Análisis de fraudes



---



\## 👤 CLIENTE - Flujo Completo



\### 🎯 \*\*Dashboard Principal\*\*

\*\*URL:\*\* `/cliente/dashboard`

\*\*Funcionalidades:\*\*

\- Resumen de mis vehículos

\- Próximas citas programadas

\- Estado de servicios en curso

\- Historial reciente

\- Notificaciones importantes

\- Acceso rápido a funciones



\### 🚗 \*\*Mis Vehículos\*\*



\#### \*\*Lista de Vehículos\*\*

\*\*URL:\*\* `/cliente/vehiculos`

\*\*Funcionalidades:\*\*

\- Todos mis vehículos registrados

\- Estado actual de cada vehículo

\- Próximos mantenimientos

\- Documentación del vehículo

\- Historial de servicios

\- Recordatorios automáticos



\### 📅 \*\*Servicios y Citas\*\*



\#### \*\*Mis Citas\*\*

\*\*URL:\*\* `/cliente/citas`

\*\*Funcionalidades:\*\*

\- Citas programadas

\- Historial de citas

\- Programar nueva cita

\- Cancelar/reprogramar citas

\- Recordatorios automáticos

\- Confirmación de asistencia



\#### \*\*Mis Cotizaciones\*\*

\*\*URL:\*\* `/cliente/cotizaciones`

\*\*Funcionalidades:\*\*

\- Cotizaciones recibidas

\- Comparar precios entre talleres

\- Aprobar/rechazar cotizaciones

\- Solicitar modificaciones

\- Historial de cotizaciones

\- Conversión a servicios



\#### \*\*Historial de Servicios\*\*

\*\*URL:\*\* `/cliente/historial`

\*\*Funcionalidades:\*\*

\- Todos los servicios realizados

\- Detalles por servicio

\- Fotos antes/después

\- Garantías vigentes

\- Recomendaciones de mantenimiento

\- Descargar reportes



\### 💳 \*\*Facturación y Mensajes\*\*



\#### \*\*Mis Facturas\*\*

\*\*URL:\*\* `/cliente/facturas`

\*\*Funcionalidades:\*\*

\- Facturas emitidas

\- Estado de pagos

\- Descargar facturas

\- Historial de pagos

\- Métodos de pago

\- Disputas y reclamos



\#### \*\*Mensajes\*\*

\*\*URL:\*\* `/cliente/mensajes`

\*\*Funcionalidades:\*\*

\- Comunicación con talleres

\- Notificaciones del sistema

\- Recordatorios automáticos

\- Soporte técnico

\- Historial de conversaciones

\- Calificaciones y reviews



---



\## 🔄 Flujos de Navegación Detallados



\### 🏁 \*\*Flujo de Registro y Primer Acceso\*\*



\#### \*\*Cliente Nuevo:\*\*

1\. `/` → Landing page

2\. `/auth/registro` → Registro básico

3\. Confirmación por email

4\. `/auth/login` → Primer login

5\. `/cliente/dashboard` → Bienvenida

6\. `/cliente/vehiculos` → Registrar primer vehículo

7\. Buscar talleres cercanos

8\. Programar primera cita



\#### \*\*Taller Nuevo:\*\*

1\. `/` → Landing page

2\. `/auth/registro-taller` → Registro especializado

3\. Subir documentación legal

4\. Esperar aprobación admin

5\. Notificación de aprobación

6\. `/auth/login` → Primer acceso

7\. `/taller/dashboard` → Setup inicial

8\. `/taller/configuracion` → Configurar taller

9\. `/taller/servicios` → Definir servicios

10\. `/taller/tecnicos` → Registrar equipo



\### 🔄 \*\*Flujo Típico de Servicio\*\*



\#### \*\*Desde el Cliente:\*\*

1\. `/cliente/dashboard` → Ver vehículos

2\. `/cliente/vehiculos` → Seleccionar vehículo

3\. Solicitar cotización

4\. `/cliente/cotizaciones` → Revisar ofertas

5\. Aprobar cotización preferida

6\. `/cliente/citas` → Programar cita

7\. Llevar vehículo al taller

8\. `/cliente/historial` → Seguir progreso

9\. Recibir vehículo reparado

10\. `/cliente/facturas` → Revisar factura



\#### \*\*Desde el Taller:\*\*

1\. `/taller/dashboard` → Ver citas del día

2\. `/taller/vehiculos/\[id]/ingreso` → Recibir vehículo

3\. `/taller/vehiculos/\[id]/inspeccion` → Inspeccionar

4\. `/taller/cotizaciones` → Crear cotización

5\. Esperar aprobación del cliente

6\. `/taller/ordenes/nueva` → Crear orden de trabajo

7\. `/taller/kanban` → Gestionar progreso

8\. `/taller/ordenes` → Completar trabajo

9\. `/taller/facturas` → Generar factura

10\. Entregar vehículo al cliente



\### 🛡️ \*\*Flujo con Aseguradora:\*\*



\#### \*\*Siniestro con Seguro:\*\*

1\. Cliente reporta siniestro a aseguradora

2\. `/aseguradora/siniestros` → Registrar siniestro

3\. Asignar perito y taller

4\. `/taller/vehiculos/\[id]/inspeccion-exacta` → Inspección detallada

5\. `/taller/cotizaciones` → Cotización para aseguradora

6\. `/aseguradora/cotizaciones` → Revisar y aprobar

7\. `/taller/ordenes` → Ejecutar reparación

8\. `/aseguradora/reparaciones` → Seguimiento

9\. `/taller/facturas` → Facturar a aseguradora

10\. `/aseguradora/facturacion` → Procesar pago



---



\## 🚨 Elementos Críticos por Implementar



\### ⚠️ \*\*Migraciones Urgentes:\*\*

\- \*\*TAL-007\*\*: Gestión de técnicos (LocalStorage → Supabase)

\- \*\*TAL-008\*\*: Sistema de facturación completo

\- \*\*Notificaciones\*\*: Sistema en tiempo real



\### 🔧 \*\*Funcionalidades Pendientes:\*\*

\- Sistema de pagos integrado

\- Notificaciones push

\- Chat en tiempo real

\- Integración con APIs externas

\- Sistema de backup automático



\### 📊 \*\*Métricas de Completitud:\*\*

\- \*\*Autenticación\*\*: 100% ✅

\- \*\*Administración\*\*: 95% ✅

\- \*\*Talleres\*\*: 85% ⚠️

\- \*\*Clientes\*\*: 90% ✅

\- \*\*Aseguradoras\*\*: 80% ⚠️

\- \*\*APIs\*\*: 90% ✅

\- \*\*Base de Datos\*\*: 95% ✅



Esta documentación proporciona el flujo completo y detallado para cada rol en el sistema AutoFlowX.



