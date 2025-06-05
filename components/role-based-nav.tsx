"use client"

import { useAuth } from "@/lib/supabase/auth"
import { MainNav } from "@/components/main-nav"
import { ClienteNav } from "@/components/cliente/cliente-nav"
import { TallerNav } from "@/components/taller/taller-nav"
import { AseguradoraNav } from "@/components/aseguradora/aseguradora-nav"
import { AdminNav } from "@/components/admin/admin-nav"

export function RoleBasedNav() {
  const { userRole } = useAuth()

  switch (userRole) {
    case "Cliente":
      return <ClienteNav />
    case "Taller":
      return <TallerNav />
    case "Aseguradora":
      return <AseguradoraNav />
    case "Super Administrador":
      return <AdminNav />
    default:
      return <MainNav />
  }
}
