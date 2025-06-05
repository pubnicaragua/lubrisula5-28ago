"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { UserNav } from "@/components/user-nav"
import { Car, FileText, ShieldCheck, History, Receipt, MessageSquare, Home, BarChart } from "lucide-react"

export function AseguradoraNav() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/aseguradora/dashboard",
      icon: Home,
    },
    {
      title: "Vehículos",
      href: "/aseguradora/vehiculos",
      icon: Car,
    },
    {
      title: "Cotizaciones",
      href: "/aseguradora/cotizaciones",
      icon: FileText,
    },
    {
      title: "Siniestros",
      href: "/aseguradora/siniestros",
      icon: ShieldCheck,
    },
    {
      title: "Reparaciones",
      href: "/aseguradora/reparaciones",
      icon: History,
    },
    {
      title: "Facturación",
      href: "/aseguradora/facturacion",
      icon: Receipt,
    },
    {
      title: "Mensajes",
      href: "/aseguradora/mensajes",
      icon: MessageSquare,
    },
    {
      title: "Reportes",
      href: "/aseguradora/reportes",
      icon: BarChart,
    },
  ]

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/aseguradora/dashboard" className="flex items-center space-x-2">
            <ShieldCheck className="h-6 w-6" />
            <span className="font-bold inline-block">AUTOFLOWX</span>
            <span className="rounded bg-primary px-1.5 py-0.5 text-xs text-white">ASEGURADORA</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center text-sm font-medium text-muted-foreground",
                  pathname === item.href && "text-foreground",
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <UserNav />
        </div>
      </div>
    </header>
  )
}
