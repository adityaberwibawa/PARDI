"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, LayoutDashboard, Settings } from "lucide-react"
import { useEffect, useState } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { ThemeToggle } from "./theme-toggle"
import { createClient } from "@/lib/supabase/client"

export function NavBar() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null)
  const router = useRouter()

  useEffect(() => {
    try {
      const client = createClient()
      setSupabase(client)
      client.auth.getUser().then(({ data }) => setUser(data.user))
    } catch {}
  }, [])

  const handleSignOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
    router.push("/")
    router.refresh()
  }

  return (
    <nav
      aria-label="Primary"
      className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
    >
      <div className="mx-auto px-6 max-w-5xl flex h-14 items-center justify-between">
        <Link
          href="/"
          className="font-semibold text-lg tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          PARDI
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                render={<Link href="/dashboard" />}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" aria-hidden="true" />
                My PRDs
              </Button>
              <Button
                variant="ghost"
                size="sm"
                render={<Link href="/settings" />}
              >
                <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              render={<Link href="/auth/login" />}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
