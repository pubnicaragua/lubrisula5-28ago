# AutoflowX - Sistema de Gestión para Talleres Automotrices

## Descripción

AutoflowX es una plataforma completa para la gestión de talleres automotrices que permite administrar clientes, vehículos, órdenes de trabajo, cotizaciones, inventario y más.

## Requisitos

- Node.js 18.x o superior
- Cuenta en Supabase

## Configuración para Deploy

### Variables de Entorno

Asegúrate de configurar las siguientes variables de entorno en tu plataforma de deploy (Vercel):

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_clave_service_role_de_supabase
\`\`\`

### Pasos para Deploy en Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno mencionadas arriba
3. Selecciona la configuración de build:
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
4. Deploy!

## Inicialización de la Base de Datos

Después del deploy, visita las siguientes rutas para inicializar la base de datos:

1. `/initialize-all` - Inicializa todas las tablas y funciones necesarias
2. `/admin/set-superadmin` - Configura el primer usuario como superadmin

## Soporte

Para soporte, contacta a nuestro equipo en soporte@autoflowx.com
\`\`\`

Vamos a crear un archivo vercel.json para configurar el deploy en Vercel:
