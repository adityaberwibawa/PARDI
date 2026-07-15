"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MultiStepForm } from "@/components/multi-step-form"

export default function NewPrdPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    import("@/lib/supabase/client").then(async (mod) => {
      const supabase = mod.createClient()
      const { data } = await supabase.auth.getUser()
      if (!data.user) router.push("/auth/login")
      else setLoading(false)
    }).catch(() => {
      router.push("/auth/login")
    })
  }, [])

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Checking authentication...</div>
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create New PRD</h1>
        <p className="text-muted-foreground">
          Fill in the details below to generate a comprehensive PRD and vibe coding prompt.
        </p>
      </div>
      <MultiStepForm />
    </div>
  )
}
