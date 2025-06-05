import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminNav } from "@/components/admin/admin-nav"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  const { data: user } = await supabase
    .from('roles_usuario')
    .select('rol(nombre)')
    .eq('user_id', session.user.id)
    .single()

  const rol = user?.rol?.nombre

  if (rol !== 'admin' && rol !== 'superadmin') {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center font-semibold">
            <h2 className="text-lg font-semibold">Taller Automotriz - Panel Admin</h2>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <AdminNav />
          </div>
          <div className="col-span-12 lg:col-span-9 space-y-4">{children}</div>
        </div>
      </div>
    </div>
  )
}