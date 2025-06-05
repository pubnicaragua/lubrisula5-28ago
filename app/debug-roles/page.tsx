import { DebugRoles } from "@/components/auth/debug-roles"

export default function DebugRolesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Depuración de Roles</h1>
      <DebugRoles />
    </div>
  )
}
