import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  ArrowRight,
  Settings,
  Users,
  BarChart3,
  Calendar,
  FileText,
  Wrench,
  CreditCard,
  Truck,
  PaintBucket,
  PenToolIcon as Tool,
  ShieldCheck,
  Smartphone,
  MessageSquare,
} from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 text-lg font-medium">
            <Link href="/" className="flex items-center gap-2">
              <Wrench className="h-6 w-6 text-primary" />
              <span className="font-bold">AutoFlowX</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#caracteristicas" className="transition-colors hover:text-foreground/80">
              Características
            </Link>
            <Link href="#modulos" className="transition-colors hover:text-foreground/80">
              Módulos
            </Link>
            <Link href="#precios" className="transition-colors hover:text-foreground/80">
              Precios
            </Link>
            <Link href="#testimonios" className="transition-colors hover:text-foreground/80">
              Testimonios
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
            <Link href="/auth/registro-taller">
              <Button>Registrar Taller</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    Sistema de Gestión para Talleres Automotrices
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Optimiza tus operaciones, mejora la experiencia de tus clientes y haz crecer tu negocio con nuestra
                    plataforma integral para talleres.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth/registro-taller">
                    <Button size="lg" className="gap-2">
                      Registra tu taller
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#caracteristicas">
                    <Button size="lg" variant="outline">
                      Conoce más
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  {["Multi-talleres", "Personalizable", "Seguro"].map((feature, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mx-auto lg:mx-0 relative">
                <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-16 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                <div className="relative rounded-lg overflow-hidden shadow-2xl border">
                  <Image
                    src="/auto-repair-shop.png"
                    alt="Dashboard de AutoFlowX"
                    width={600}
                    height={450}
                    className="w-full aspect-[4/3] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32" id="caracteristicas">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Características
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Todo lo que necesitas para gestionar tu taller
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Nuestra plataforma ofrece todas las herramientas que necesitas para optimizar las operaciones de tu
                  taller automotriz.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Gestión de Clientes",
                  description: "Administra toda la información de tus clientes y sus vehículos en un solo lugar.",
                  icon: <Users className="h-10 w-10 text-primary" />,
                },
                {
                  title: "Órdenes de Servicio",
                  description: "Crea y gestiona órdenes de servicio con seguimiento en tiempo real.",
                  icon: <FileText className="h-10 w-10 text-primary" />,
                },
                {
                  title: "Tablero Kanban",
                  description: "Visualiza el flujo de trabajo de tu taller con un tablero Kanban intuitivo.",
                  icon: <BarChart3 className="h-10 w-10 text-primary" />,
                },
                {
                  title: "Inventario",
                  description: "Controla tu inventario de repuestos y materiales con alertas de stock mínimo.",
                  icon: <Settings className="h-10 w-10 text-primary" />,
                },
                {
                  title: "Cotizaciones",
                  description: "Genera cotizaciones profesionales para tus clientes de manera rápida y sencilla.",
                  icon: <FileText className="h-10 w-10 text-primary" />,
                },
                {
                  title: "Reportes",
                  description: "Genera reportes detallados sobre el rendimiento de tu taller.",
                  icon: <BarChart3 className="h-10 w-10 text-primary" />,
                },
              ].map((feature, i) => (
                <Card key={i} className="flex flex-col items-center text-center p-2">
                  <CardContent className="p-6 flex flex-col items-center space-y-4">
                    <div className="rounded-full bg-primary/10 p-4">{feature.icon}</div>
                    <div className="space-y-2">
                      <h3 className="font-bold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Modules Section */}
        <section className="py-16 bg-muted/50" id="modulos">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Módulos Disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Gestión de Clientes",
                  description: "Administra toda la información de tus clientes y sus vehículos en un solo lugar.",
                  icon: <Users className="h-8 w-8 text-primary" />,
                },
                {
                  title: "Órdenes de Servicio",
                  description: "Crea y gestiona órdenes de servicio con seguimiento en tiempo real.",
                  icon: <FileText className="h-8 w-8 text-primary" />,
                },
                {
                  title: "Cotizaciones",
                  description: "Genera cotizaciones profesionales para tus clientes de manera rápida y sencilla.",
                  icon: <FileText className="h-8 w-8 text-primary" />,
                },
                {
                  title: "Inventario",
                  description: "Controla tu inventario de repuestos y materiales con alertas de stock mínimo.",
                  icon: <Settings className="h-8 w-8 text-primary" />,
                },
                {
                  title: "Tablero Kanban",
                  description: "Visualiza el flujo de trabajo de tu taller con un tablero Kanban intuitivo.",
                  icon: <BarChart3 className="h-8 w-8 text-primary" />,
                },
                {
                  title: "Reportes",
                  description: "Genera reportes detallados sobre el rendimiento de tu taller.",
                  icon: <BarChart3 className="h-8 w-8 text-primary" />,
                },
                {
                  title: "Calendario",
                  description: "Programa citas y servicios con un calendario integrado.",
                  icon: <Calendar className="h-8 w-8 text-primary" />,
                },
                {
                  title: "Facturación",
                  description: "Emite facturas electrónicas directamente desde la plataforma.",
                  icon: <CreditCard className="h-8 w-8 text-primary" />,
                },
                {
                  title: "Gestión de Técnicos",
                  description: "Administra tu equipo de técnicos, horarios y asignaciones.",
                  icon: <Users className="h-8 w-8 text-primary" />,
                },
                {
                  title: "Enderezado",
                  description: "Gestiona los procesos específicos de enderezado de carrocería.",
                  icon: <Tool className="h-8 w-8 text-primary" />,
                },
                {
                  title: "Pintura",
                  description: "Controla los procesos y materiales para el área de pintura.",
                  icon: <PaintBucket className="h-8 w-8 text-primary" />,
                },
                {
                  title: "Gestión de Flotas",
                  description: "Administra servicios para flotas de vehículos empresariales.",
                  icon: <Truck className="h-8 w-8 text-primary" />,
                },
                {
                  title: "Seguros y Aseguradoras",
                  description: "Gestiona relaciones con aseguradoras y procesos de reclamación.",
                  icon: <ShieldCheck className="h-8 w-8 text-primary" />,
                },
                {
                  title: "App Móvil",
                  description: "Accede a las funciones principales desde cualquier dispositivo móvil.",
                  icon: <Smartphone className="h-8 w-8 text-primary" />,
                },
                {
                  title: "Comunicación con Clientes",
                  description: "Envía notificaciones automáticas sobre el estado de los servicios.",
                  icon: <MessageSquare className="h-8 w-8 text-primary" />,
                },
              ].map((module, i) => (
                <Card key={i} className="overflow-hidden border-2 hover:border-primary/50 transition-all">
                  <CardContent className="p-6 flex flex-col gap-4">
                    <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center">
                      {module.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{module.title}</h3>
                      <p className="text-muted-foreground mt-2">{module.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="rounded-lg bg-gradient-to-r from-primary/20 to-primary/5 p-8 md:p-12 shadow-lg">
              <div className="grid gap-6 md:grid-cols-2 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">¿Por qué elegir AutoFlowX?</h2>
                  <ul className="space-y-4">
                    {[
                      "Plataforma multi-talleres: gestiona múltiples ubicaciones desde un solo panel",
                      "Personalizable: selecciona solo los módulos que necesitas",
                      "Escalable: crece con tu negocio sin complicaciones",
                      "Seguro: protección de datos y copias de seguridad automáticas",
                      "Soporte técnico incluido en todos los planes",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Link href="/auth/registro-taller">
                      <Button size="lg" className="gap-2">
                        Registra tu taller ahora
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="relative">
                  <div className="aspect-video rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src="/autoflowx-logo.png"
                      alt="Dashboard de AutoFlowX"
                      width={600}
                      height={400}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <Badge className="absolute -top-3 -right-3 text-sm py-1.5 px-3 bg-primary text-primary-foreground">
                    Nuevo
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50" id="precios">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Precios</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Planes adaptados a las necesidades de tu taller
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Elige el plan que mejor se adapte a tu negocio y paga solo por lo que necesitas.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-3 lg:gap-8">
              {[
                {
                  name: "Básico",
                  description: "Ideal para talleres pequeños que están comenzando",
                  price: "$999",
                  features: [
                    "Hasta 2 usuarios",
                    "Gestión de clientes",
                    "Órdenes de servicio",
                    "Cotizaciones básicas",
                    "Soporte por email",
                  ],
                  popular: false,
                },
                {
                  name: "Profesional",
                  description: "Perfecto para talleres en crecimiento",
                  price: "$1,999",
                  features: [
                    "Hasta 5 usuarios",
                    "Todas las características del plan Básico",
                    "Inventario y control de stock",
                    "Tablero Kanban",
                    "Reportes básicos",
                    "Facturación electrónica",
                    "Soporte prioritario",
                  ],
                  popular: true,
                },
                {
                  name: "Empresarial",
                  description: "Para talleres con múltiples ubicaciones",
                  price: "$3,999",
                  features: [
                    "Usuarios ilimitados",
                    "Todas las características del plan Profesional",
                    "Gestión multi-talleres",
                    "Reportes avanzados",
                    "API para integraciones",
                    "Soporte 24/7",
                    "Capacitación personalizada",
                  ],
                  popular: false,
                },
              ].map((plan) => (
                <Card key={plan.name} className={`flex flex-col ${plan.popular ? "border-primary shadow-lg" : ""}`}>
                  {plan.popular && (
                    <div className="bg-primary py-1 text-center text-sm font-medium text-primary-foreground">
                      Más popular
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <p className="text-muted-foreground">{plan.description}</p>
                    <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                      {plan.price}
                      <span className="ml-1 text-lg font-normal text-muted-foreground">/mes</span>
                    </div>
                  </div>
                  <div className="flex-1 p-6 pt-0">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <CheckCircle className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 pt-0">
                    <Link href="/auth/registro-taller" className="w-full">
                      <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                        Comenzar ahora
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32" id="testimonios">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Testimonios</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Lo que dicen nuestros clientes
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Descubre cómo AutoFlowX ha transformado la gestión de talleres automotrices en todo el país.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Carlos Rodríguez",
                  role: "Dueño de Taller Mecánico Express",
                  content:
                    "Desde que implementamos AutoFlowX, hemos aumentado nuestra eficiencia en un 40%. La gestión de citas y órdenes de servicio es mucho más sencilla y nuestros clientes están más satisfechos.",
                  avatar: "CR",
                },
                {
                  name: "Ana Martínez",
                  role: "Gerente de Servicio Automotriz Rápido",
                  content:
                    "El tablero Kanban ha revolucionado la forma en que organizamos nuestro trabajo. Ahora todos los técnicos saben exactamente qué hacer y en qué orden. La comunicación ha mejorado enormemente.",
                  avatar: "AM",
                },
                {
                  name: "Roberto Gómez",
                  role: "Director de Red de Talleres AutoMaster",
                  content:
                    "Administrar 5 talleres solía ser un dolor de cabeza hasta que encontramos AutoFlowX. Ahora puedo ver el rendimiento de cada ubicación en tiempo real y tomar decisiones basadas en datos.",
                  avatar: "RG",
                },
              ].map((testimonial, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {Array(5)
                        .fill(null)
                        .map((_, i) => (
                          <svg
                            key={i}
                            className="h-4 w-4 fill-primary text-primary"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                    </div>
                    <p className="text-muted-foreground">{testimonial.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Listo para transformar tu taller
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Únete a cientos de talleres que ya optimizaron sus operaciones con AutoFlowX
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/auth/registro-taller">
                  <Button size="lg" className="gap-2">
                    Registra tu taller ahora
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contacto">
                  <Button size="lg" variant="outline">
                    Contactar a ventas
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 md:py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-4 max-w-sm">
            <div className="flex items-center gap-2">
              <Wrench className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">AutoFlowX</span>
            </div>
            <p className="text-muted-foreground">
              La solución completa para la gestión de talleres automotrices. Optimiza tus operaciones y mejora la
              experiencia de tus clientes.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h3 className="font-medium">Producto</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#caracteristicas" className="hover:underline">
                    Características
                  </Link>
                </li>
                <li>
                  <Link href="#precios" className="hover:underline">
                    Precios
                  </Link>
                </li>
                <li>
                  <Link href="#testimonios" className="hover:underline">
                    Testimonios
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium">Empresa</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:underline">
                    Sobre nosotros
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:underline">
                    Términos de servicio
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Política de privacidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">© 2024 AutoFlowX. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
