import { StarIcon } from "@radix-ui/react-icons"
import { Avatar, AvatarFallback, Card, CardContent } from "@/components/ui"

export function TestimonialSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="testimonios">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Testimonios</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Lo que dicen nuestros clientes</h2>
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
            {
              name: "Laura Sánchez",
              role: "Administradora de Taller Mecánico del Norte",
              content:
                "La facturación electrónica y la gestión de inventario han sido un cambio radical para nuestro negocio. Hemos reducido errores y ahorramos horas cada semana en tareas administrativas.",
              avatar: "LS",
            },
            {
              name: "Miguel Hernández",
              role: "Propietario de Servicio Automotriz Premium",
              content:
                "El módulo de cotizaciones nos permite responder rápidamente a los clientes con presupuestos profesionales. Hemos aumentado nuestra tasa de conversión en un 25% desde que lo implementamos.",
              avatar: "MH",
            },
            {
              name: "Patricia Flores",
              role: "Gerente de Operaciones en AutoServicio Express",
              content:
                "El soporte técnico de AutoFlowX es excepcional. Siempre están disponibles para resolver cualquier duda y nos han ayudado a personalizar el sistema según nuestras necesidades específicas.",
              avatar: "PF",
            },
          ].map((testimonial, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {Array(5)
                    .fill(null)
                    .map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                </div>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
