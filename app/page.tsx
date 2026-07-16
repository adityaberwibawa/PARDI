"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles, FileText, Braces, GitBranch } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    try {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data }) => setUser(data.user))
    } catch {}
  }, [])

  return (
    <div className="flex flex-col items-center text-center space-y-12 py-12">
      <header className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
          PARDI
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl text-pretty">
          Generate comprehensive Product Requirement Documents and vibe coding prompts
          powered by AI. Built for <span className="font-semibold text-foreground">vibe coders</span>.
        </p>
      </header>

      <section
        aria-label="Key features"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl"
      >
        <article className="flex flex-col items-center gap-3 p-6 rounded-lg border bg-card">
          <FileText className="h-10 w-10 text-primary" aria-hidden="true" />
          <h2 className="font-semibold">PRD Document</h2>
          <p className="text-sm text-muted-foreground">Bilingual PRD with executive summary, features, and timeline</p>
        </article>
        <article className="flex flex-col items-center gap-3 p-6 rounded-lg border bg-card">
          <GitBranch className="h-10 w-10 text-primary" aria-hidden="true" />
          <h2 className="font-semibold">Flow Diagram</h2>
          <p className="text-sm text-muted-foreground">Auto-generated Mermaid flowchart for user journey</p>
        </article>
        <article className="flex flex-col items-center gap-3 p-6 rounded-lg border bg-card">
          <Braces className="h-10 w-10 text-primary" aria-hidden="true" />
          <h2 className="font-semibold">Vibe Prompt</h2>
          <p className="text-sm text-muted-foreground">Copy-paste ready prompt for Cursor, Claude, or GPT</p>
        </article>
      </section>

      <Button
        size="lg"
        onClick={() => router.push(user ? "/new" : "/auth/login")}
        className="gap-2"
      >
        <Sparkles className="h-5 w-5" aria-hidden="true" />
        {user ? "Create New PRD" : "Get Started — Sign In"}
      </Button>

      <p className="text-sm text-muted-foreground max-w-xl">
        Answer 3 simple questions about your project idea, and let AI handle the rest.
        Get a production-ready PRD & vibe coding prompt in seconds.
      </p>
    </div>
  )
}
