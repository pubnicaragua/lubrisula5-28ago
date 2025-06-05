"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const routes = [
  {
    label: "Dashboard",
    href: "/dashboard",
    active: (path: string) => path === "/dashboard",
  },
  {
    label: "Clientes",
    href: "/clientes",
    active: (path: string) => path.startsWith("/clientes"),
  },
  {
    label: "Vehículos",
    href: "/vehiculos",
    active: (path: string) => path.startsWith("/vehiculos"),
  },
  {
    label: "Órdenes",
    href: "/ordenes",
    active: (path: string) => path.startsWith("/ordenes"),
  },
  {
    label: "Cotizaciones",
    href: "/cotizaciones",
    active: (path: string) => path.startsWith("/cotizaciones"),
  },
  {
    label: "Inventario",
    href: "/inventario",
    active: (path: string) => path.startsWith("/inventario"),
  },
  {
    label: "Kanban",
    href: "/kanban",
    active: (path: string) => path.startsWith("/kanban"),
  },
  {
    label: "Reportes",
    href: "/reportes",
    active: (path: string) => path.startsWith("/reportes"),
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active(pathname) ? "text-primary font-semibold" : "text-muted-foreground",
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
