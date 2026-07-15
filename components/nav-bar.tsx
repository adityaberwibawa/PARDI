"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import { useEffect, useState } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { ThemeToggle } from "./theme-toggle"

export function NavBar() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [supabase, setSupabase] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    import("@/lib/supabase/client").then((mod) => {
      const client = mod.createClient()
      setSupabase(client)
      client.auth.getUser().then(({ data }: any) => setUser(data.user))
    }).catch(() => {})
  }, [])

  const handleSignOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
    router.push("/")
  }

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="mx-auto px-6 max-w-5xl flex h-14 items-center justify-between">
        <a href="/" className="font-semibold text-lg tracking-tight">
          PARDI
        </a>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
                <User className="h-4 w-4 mr-2" />
                My PRDs
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button variant="default" size="sm" onClick={() => router.push("/auth/login")}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
