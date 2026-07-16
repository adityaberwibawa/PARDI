"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MultiStepForm } from "@/components/multi-step-form"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function NewPrdPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    try {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data }) => {
        if (!data.user) router.push("/auth/login")
        else setLoading(false)
      }).catch(() => {
        router.push("/auth/login")
      })
    } catch {
      router.push("/auth/login")
    }
  }, [router])

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-[40vh] gap-2"
        role="status"
        aria-live="polite"
        aria-label="Checking authentication"
      >
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-hidden="true" />
        <span className="text-muted-foreground">Checking authentication…</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-balance">Create New PRD</h1>
        <p className="text-muted-foreground text-pretty">
          Fill in the details below to generate a comprehensive PRD and vibe coding prompt.
        </p>
      </header>
      <MultiStepForm />
    </div>
  )
}
