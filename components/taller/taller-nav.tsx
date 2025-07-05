"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Car,
  FileText,
  Calendar,
  Users,
  Settings,
  Wrench,
  LayoutGrid,
  UserCog,
  DollarSign,
  Package,
  ServerIcon
} from "lucide-react"

export function TallerNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/taller/dashboard",
      title: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      href: "/taller/ordenes",
      title: "Órdenes",
      icon: <Wrench className="mr-2 h-4 w-4" />,
    },
    {
      href: "/taller/kanban",
      title: "Kanban",
      icon: <LayoutGrid className="mr-2 h-4 w-4" />,
    },
    {
      href: "/taller/vehiculos",
      title: "Vehículos",
      icon: <Car className="mr-2 h-4 w-4" />,
    },
    {
      href: "/taller/cotizaciones",
      title: "Cotizaciones",
      icon: <FileText className="mr-2 h-4 w-4" />,
    },
    {
      href: "/taller/facturas",
      title: "Facturación",
      icon: <DollarSign className="mr-2 h-4 w-4" />,
    },
    {
      href: "/taller/citas",
      title: "Citas",
      icon: <Calendar className="mr-2 h-4 w-4" />,
    },
    {
      href: "/taller/servicios",
      title: "Servicios",
      icon: <ServerIcon className="mr-2 h-4 w-4" />,
    },
    {
      href: "/taller/inventario",
      title: "Inventario",
      icon: <Package className="mr-2 h-4 w-4" />,
    },
    {
      href: "/taller/tecnicos",
      title: "Técnicos",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      href: "/taller/clientes",
      title: "Gestión de Clientes",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      href: "/taller/accesos",
      title: "Gestión de Accesos",
      icon: <UserCog className="mr-2 h-4 w-4" />,
    },
    {
      href: "/taller/configuracion",
      title: "Configuración",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <nav className="flex flex-col space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
