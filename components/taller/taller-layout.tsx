"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import {
  LayoutDashboard,
  Car,
  Users,
  ClipboardList,
  Settings,
  BarChart3,
  Package,
  Calendar,
  Menu,
  X,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/lib/supabase/auth" // Cambia esta línea para usar el hook correcto
import { useToast } from "@/hooks/use-toast"

interface TallerLayoutProps {
  children: React.ReactNode
}

export function TallerLayout({ children }: TallerLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { signOut } = useAuth() // Añade esta línea para obtener la función signOut del contexto
  const { toast } = useToast()

  // Cerrar el menú móvil cuando cambia la ruta
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleSignOut = async () => {
    try {
      await signOut() // Usa la función signOut del contexto de autenticación
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      })
      // La redirección la manejará el AuthProvider
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión",
        variant: "destructive",
      })
    }
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/taller/dashboard", // Asegurarse de que esta ruta sea correcta
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Órdenes",
      href: "/taller/ordenes",
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      title: "Kanban",
      href: "/kanban",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Clientes",
      href: "/clientes",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Vehículos",
      href: "/vehiculos",
      icon: <Car className="h-5 w-5" />,
    },
    {
      title: "Inventario",
      href: "/inventario",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Citas",
      href: "/taller/citas",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Configuración",
      href: "/taller/configuracion",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        <div className="flex items-center gap-2">
          <Link href="/taller/dashboard" className="flex items-center gap-2">
            <Image src="/autoflowx-logo.png" alt="AUTOFLOWX" width={40} height={40} className="h-8 w-auto" />
            <span className="hidden font-bold text-xl md:inline-block">AUTOFLOWX</span>
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <ModeToggle />
          <UserNav />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar para escritorio */}
        <aside className="hidden border-r bg-background md:block md:w-64">
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-2 text-sm font-medium">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent ${
                      pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="mt-auto p-4">
              <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </aside>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-background md:hidden">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b px-4 py-2">
                <div className="flex items-center gap-2">
                  <Image src="/autoflowx-logo.png" alt="AUTOFLOWX" width={40} height={40} className="h-8 w-auto" />
                  <span className="font-bold text-xl">AUTOFLOWX</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex-1 overflow-auto py-4">
                <nav className="grid gap-1 px-2">
                  {navItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-base transition-all hover:bg-accent ${
                        pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="mt-auto p-4">
                <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">{children}</main>
      </div>
    </div>
  )
}
