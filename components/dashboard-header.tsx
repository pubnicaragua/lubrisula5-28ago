"use client"

import { RoleBasedNav } from "@/components/role-based-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <RoleBasedNav />
      <div className="ml-auto flex items-center gap-4">
        <ModeToggle />
        <UserNav />
      </div>
    </header>
  )
}
