"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, PlusCircle, Truck, Users, DollarSign } from "lucide-react"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/input", label: "Input", icon: PlusCircle },
  { href: "/daily-income", label: "Daily Income", icon: DollarSign },
  { href: "/fleet", label: "Fleet", icon: Truck },
  { href: "/clients", label: "Clients", icon: Users },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top header */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-center border-b border-border bg-background px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Truck className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">TransportPro</span>
        </div>
      </header>

      {/* Main content */}
      <main className="px-4 py-4">{children}</main>

      {/* Bottom navigation - fixed at bottom for easy thumb access */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-background">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors min-w-[80px]",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className={cn("h-6 w-6", isActive && "text-primary")} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
