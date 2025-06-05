import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export function PricingSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50" id="precios">
      <div className="container px-4 md:px-6">
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
        <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
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
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                  {plan.price}
                  <span className="ml-1 text-lg font-normal text-muted-foreground">/mes</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/auth/registro-taller" className="w-full">
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    Comenzar ahora
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
