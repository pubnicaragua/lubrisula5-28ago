"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { UserNav } from "@/components/user-nav"
import { Car, FileText, Calendar, History, Receipt, MessageSquare, Home } from "lucide-react"

export function ClienteNav() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/cliente/dashboard",
      icon: Home,
    },
    {
      title: "Mis Vehículos",
      href: "/cliente/vehiculos",
      icon: Car,
    },
    {
      title: "Citas",
      href: "/cliente/citas",
      icon: Calendar,
    },
    {
      title: "Cotizaciones",
      href: "/cliente/cotizaciones",
      icon: FileText,
    },
    {
      title: "Historial",
      href: "/cliente/historial",
      icon: History,
    },
    {
      title: "Facturas",
      href: "/cliente/facturas",
      icon: Receipt,
    },
    {
      title: "Mensajes",
      href: "/cliente/mensajes",
      icon: MessageSquare,
    },
  ]

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/cliente/dashboard" className="flex items-center space-x-2">
            <Car className="h-6 w-6" />
            <span className="font-bold inline-block">AUTOFLOWX</span>
            <span className="rounded bg-primary px-1.5 py-0.5 text-xs text-white">CLIENTE</span>
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
