\# 🔄 Casos de Uso Detallados - AutoFlowX



\## 📋 Caso de Uso 1: Cliente Solicita Reparación



\### 👤 \*\*Actor Principal:\*\* Cliente

\### 🎯 \*\*Objetivo:\*\* Obtener reparación de vehículo dañado



\#### \*\*Flujo Principal:\*\*



1\. \*\*Acceso Inicial\*\*

&nbsp;  - URL: `/cliente/dashboard`

&nbsp;  - Cliente ve resumen de sus vehículos

&nbsp;  - Identifica vehículo que necesita reparación



2\. \*\*Selección de Vehículo\*\*

&nbsp;  - URL: `/cliente/vehiculos`

&nbsp;  - Cliente selecciona vehículo específico

&nbsp;  - Ve historial de servicios previos



3\. \*\*Solicitud de Cotización\*\*

&nbsp;  - Cliente describe el problema

&nbsp;  - Sistema sugiere talleres cercanos

&nbsp;  - Cliente selecciona talleres para cotizar



4\. \*\*Recepción de Cotizaciones\*\*

&nbsp;  - URL: `/cliente/cotizaciones`

&nbsp;  - Cliente recibe múltiples cotizaciones

&nbsp;  - Compara precios, tiempos y servicios



5\. \*\*Aprobación de Cotización\*\*

&nbsp;  - Cliente selecciona mejor opción

&nbsp;  - Aprueba cotización específica

&nbsp;  - Sistema notifica al taller



6\. \*\*Programación de Cita\*\*

&nbsp;  - URL: `/cliente/citas`

&nbsp;  - Cliente ve disponibilidad del taller

&nbsp;  - Programa cita conveniente



7\. \*\*Seguimiento del Servicio\*\*

&nbsp;  - URL: `/cliente/historial`

&nbsp;  - Cliente monitorea progreso en tiempo real

&nbsp;  - Recibe actualizaciones automáticas



8\. \*\*Finalización\*\*

&nbsp;  - Cliente recibe notificación de finalización

&nbsp;  - Revisa trabajo realizado

&nbsp;  - Recoge vehículo reparado



\#### \*\*Flujos Alternativos:\*\*



\*\*A1: Cliente tiene Seguro\*\*

\- Cliente contacta aseguradora primero

\- Aseguradora asigna taller autorizado

\- Proceso continúa desde paso 6



\*\*A2: Cotización Rechazada\*\*

\- Cliente rechaza todas las cotizaciones

\- Solicita nuevas cotizaciones

\- Proceso reinicia desde paso 3



---



\## 🔧 Caso de Uso 2: Taller Gestiona Orden de Trabajo



\### 👤 \*\*Actor Principal:\*\* Taller

\### 🎯 \*\*Objetivo:\*\* Completar reparación de vehículo eficientemente



\#### \*\*Flujo Principal:\*\*



1\. \*\*Recepción de Solicitud\*\*

&nbsp;  - URL: `/taller/dashboard`

&nbsp;  - Taller recibe notificación de nueva solicitud

&nbsp;  - Ve detalles del vehículo y problema



2\. \*\*Inspección Inicial\*\*

&nbsp;  - URL: `/taller/vehiculos/\[id]/ingreso`

&nbsp;  - Registra ingreso del vehículo

&nbsp;  - Documenta estado inicial con fotos



3\. \*\*Diagnóstico Detallado\*\*

&nbsp;  - URL: `/taller/vehiculos/\[id]/inspeccion-exacta`

&nbsp;  - Realiza inspección técnica completa

&nbsp;  - Identifica todos los trabajos necesarios



4\. \*\*Creación de Cotización\*\*

&nbsp;  - URL: `/taller/cotizaciones`

&nbsp;  - Calcula costos de materiales y mano de obra

&nbsp;  - Envía cotización detallada al cliente



5\. \*\*Aprobación y Planificación\*\*

&nbsp;  - Recibe aprobación del cliente

&nbsp;  - URL: `/taller/ordenes/nueva`

&nbsp;  - Crea orden de trabajo formal



6\. \*\*Asignación de Recursos\*\*

&nbsp;  - URL: `/taller/tecnicos`

&nbsp;  - Asigna técnicos especializados

&nbsp;  - Programa uso de equipos y espacios



7\. \*\*Gestión Visual del Trabajo\*\*

&nbsp;  - URL: `/taller/kanban`

&nbsp;  - Mueve orden por estados: Pendiente → En Proceso → Control Calidad → Completado

&nbsp;  - Actualiza progreso en tiempo real



8\. \*\*Control de Inventario\*\*

&nbsp;  - URL: `/taller/inventario`

&nbsp;  - Registra uso de repuestos

&nbsp;  - Actualiza stock automáticamente



9\. \*\*Finalización y Facturación\*\*

&nbsp;  - URL: `/taller/facturas`

&nbsp;  - Genera factura automática

&nbsp;  - Notifica al cliente para recoger vehículo



\#### \*\*Flujos Alternativos:\*\*



\*\*A1: Problemas Adicionales Encontrados\*\*

\- Durante reparación se encuentran problemas extra

\- Taller contacta cliente para aprobación adicional

\- Se actualiza cotización y orden de trabajo



\*\*A2: Falta de Repuestos\*\*

\- Sistema detecta falta de repuestos

\- Genera orden de compra automática

\- Pausa trabajo hasta recibir materiales



---



\## 🛡️ Caso de Uso 3: Aseguradora Gestiona Siniestro



\### 👤 \*\*Actor Principal:\*\* Aseguradora

\### 🎯 \*\*Objetivo:\*\* Procesar siniestro eficientemente y controlar costos



\#### \*\*Flujo Principal:\*\*



1\. \*\*Recepción de Siniestro\*\*

&nbsp;  - URL: `/aseguradora/dashboard`

&nbsp;  - Cliente reporta siniestro

&nbsp;  - Sistema registra caso automáticamente



2\. \*\*Evaluación Inicial\*\*

&nbsp;  - URL: `/aseguradora/siniestros`

&nbsp;  - Aseguradora revisa detalles del siniestro

&nbsp;  - Determina cobertura de la póliza



3\. \*\*Asignación de Taller\*\*

&nbsp;  - Sistema sugiere talleres autorizados cercanos

&nbsp;  - Aseguradora selecciona taller apropiado

&nbsp;  - Notifica a cliente y taller



4\. \*\*Revisión de Cotización\*\*

&nbsp;  - URL: `/aseguradora/cotizaciones`

&nbsp;  - Recibe cotización detallada del taller

&nbsp;  - Analiza costos vs. valor del vehículo



5\. \*\*Aprobación de Reparación\*\*

&nbsp;  - Aprueba/modifica cotización

&nbsp;  - Establece límites de gasto

&nbsp;  - Autoriza inicio de trabajos



6\. \*\*Seguimiento de Reparación\*\*

&nbsp;  - URL: `/aseguradora/reparaciones`

&nbsp;  - Monitorea progreso en tiempo real

&nbsp;  - Controla adherencia a presupuesto



7\. \*\*Validación y Pago\*\*

&nbsp;  - URL: `/aseguradora/facturacion`

&nbsp;  - Valida factura contra cotización aprobada

&nbsp;  - Procesa pago al taller



\#### \*\*Flujos Alternativos:\*\*



\*\*A1: Pérdida Total\*\*

\- Cotización excede valor del vehículo

\- Aseguradora declara pérdida total

\- Procesa pago de valor asegurado



\*\*A2: Cotización Excesiva\*\*

\- Aseguradora considera cotización muy alta

\- Solicita segunda opinión

\- Negocia precios con taller



---



\## 👑 Caso de Uso 4: Admin Gestiona Sistema



\### 👤 \*\*Actor Principal:\*\* Administrador

\### 🎯 \*\*Objetivo:\*\* Mantener sistema operativo y usuarios satisfechos



\#### \*\*Flujo Principal:\*\*



1\. \*\*Monitoreo Diario\*\*

&nbsp;  - URL: `/admin/dashboard`

&nbsp;  - Revisa métricas del sistema

&nbsp;  - Identifica alertas o problemas



2\. \*\*Gestión de Usuarios\*\*

&nbsp;  - URL: `/admin/usuarios`

&nbsp;  - Revisa nuevos registros

&nbsp;  - Aprueba/rechaza solicitudes de talleres



3\. \*\*Verificación de Talleres\*\*

&nbsp;  - URL: `/admin/solicitudes`

&nbsp;  - Valida documentación legal

&nbsp;  - Verifica certificaciones



4\. \*\*Mantenimiento de Base de Datos\*\*

&nbsp;  - URL: `/admin/database`

&nbsp;  - Monitorea rendimiento

&nbsp;  - Ejecuta tareas de mantenimiento



5\. \*\*Análisis de Reportes\*\*

&nbsp;  - URL: `/reportes`

&nbsp;  - Revisa métricas de negocio

&nbsp;  - Identifica tendencias y oportunidades



6\. \*\*Resolución de Problemas\*\*

&nbsp;  - URL: `/admin/qa-check`

&nbsp;  - Ejecuta verificaciones de calidad

&nbsp;  - Resuelve problemas técnicos



\#### \*\*Flujos Alternativos:\*\*



\*\*A1: Problema Crítico del Sistema\*\*

\- Admin recibe alerta crítica

\- Accede a herramientas de diagnóstico

\- Implementa solución de emergencia



\*\*A2: Solicitud de Soporte\*\*

\- Usuario reporta problema

\- Admin investiga y diagnostica

\- Proporciona solución o escalación



---



\## 🔄 Flujos de Integración Entre Roles



\### 🤝 \*\*Flujo Colaborativo: Reparación con Seguro\*\*



\#### \*\*Participantes:\*\* Cliente, Aseguradora, Taller



1\. \*\*Inicio (Cliente)\*\*

&nbsp;  - Cliente tiene accidente

&nbsp;  - Contacta aseguradora

&nbsp;  - Reporta siniestro



2\. \*\*Evaluación (Aseguradora)\*\*

&nbsp;  - URL: `/aseguradora/siniestros`

&nbsp;  - Registra siniestro

&nbsp;  - Asigna taller autorizado



3\. \*\*Recepción (Taller)\*\*

&nbsp;  - URL: `/taller/dashboard`

&nbsp;  - Recibe asignación de aseguradora

&nbsp;  - Programa inspección



4\. \*\*Inspección (Taller)\*\*

&nbsp;  - URL: `/taller/vehiculos/\[id]/inspeccion-exacta`

&nbsp;  - Realiza inspección detallada

&nbsp;  - Genera cotización



5\. \*\*Aprobación (Aseguradora)\*\*

&nbsp;  - URL: `/aseguradora/cotizaciones`

&nbsp;  - Revisa y aprueba cotización

&nbsp;  - Autoriza reparación



6\. \*\*Ejecución (Taller)\*\*

&nbsp;  - URL: `/taller/kanban`

&nbsp;  - Ejecuta reparación

&nbsp;  - Actualiza progreso



7\. \*\*Seguimiento (Todos)\*\*

&nbsp;  - Cliente: `/cliente/historial`

&nbsp;  - Aseguradora: `/aseguradora/reparaciones`

&nbsp;  - Taller: `/taller/ordenes`



8\. \*\*Finalización (Taller)\*\*

&nbsp;  - URL: `/taller/facturas`

&nbsp;  - Completa reparación

&nbsp;  - Factura a aseguradora



9\. \*\*Pago (Aseguradora)\*\*

&nbsp;  - URL: `/aseguradora/facturacion`

&nbsp;  - Valida y procesa pago

&nbsp;  - Cierra caso



10\. \*\*Entrega (Cliente)\*\*

&nbsp;   - Recibe notificación

&nbsp;   - Recoge vehículo reparado

&nbsp;   - Califica servicio



---



\## 📊 Métricas de Éxito por Caso de Uso



\### 📈 \*\*KPIs por Actor:\*\*



\#### \*\*Cliente:\*\*

\- Tiempo promedio de respuesta a cotizaciones: < 24 horas

\- Satisfacción con servicio: > 4.5/5

\- Tiempo total de reparación: Según cotización ±10%



\#### \*\*Taller:\*\*

\- Utilización de capacidad: > 80%

\- Tiempo de inspección: < 2 horas

\- Precisión de cotizaciones: ±5% del costo real



\#### \*\*Aseguradora:\*\*

\- Tiempo de aprobación: < 48 horas

\- Control de costos: Dentro del presupuesto 95%

\- Satisfacción del cliente: > 4.0/5



\#### \*\*Admin:\*\*

\- Tiempo de resolución de problemas: < 4 horas

\- Disponibilidad del sistema: > 99.5%

\- Tiempo de aprobación de talleres: < 72 horas



---



\## 🚨 Escenarios de Excepción



\### ⚠️ \*\*Manejo de Errores Críticos:\*\*



\#### \*\*Sistema No Disponible:\*\*

1\. Usuario intenta acceder

2\. Sistema detecta falla

3\. Muestra página de mantenimiento

4\. Notifica a administradores

5\. Implementa solución de respaldo



\#### \*\*Datos Inconsistentes:\*\*

1\. Sistema detecta inconsistencia

2\. Bloquea operación afectada

3\. Notifica a administrador

4\. Ejecuta rutina de corrección

5\. Valida integridad restaurada



\#### \*\*Falla de Pago:\*\*

1\. Procesamiento de pago falla

2\. Sistema mantiene estado pendiente

3\. Notifica a partes involucradas

4\. Reintenta procesamiento

5\. Escalación manual si persiste



Esta documentación proporciona una guía completa de todos los flujos y casos de uso del sistema AutoFlowX.



