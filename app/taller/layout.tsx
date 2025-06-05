import type React from "react"
import { TallerNav } from "@/components/taller/taller-nav"
import { UserNav } from "@/components/user-nav"
import { Wrench } from "lucide-react"
import Link from "next/link"

export default function TallerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/taller/dashboard" className="flex items-center space-x-2">
              <Wrench className="h-6 w-6" />
              <span className="font-bold inline-block">AUTOFLOWX</span>
              <span className="rounded bg-primary px-1.5 py-0.5 text-xs text-white">TALLER</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <UserNav />
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 lg:block">
          <div className="flex h-full max-h-screen flex-col gap-2 p-4">
            <TallerNav />
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
