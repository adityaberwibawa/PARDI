"use client"

import { Suspense, lazy } from "react"

const PrdResult = lazy(() =>
  import("@/components/prd-result").then((m) => ({ default: m.PrdResult }))
)
const MermaidDiagram = lazy(() =>
  import("@/components/mermaid-diagram").then((m) => ({ default: m.MermaidDiagram }))
)
const PromptDisplay = lazy(() =>
  import("@/components/prompt-display").then((m) => ({ default: m.PromptDisplay }))
)

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, FileText, GitBranch, Braces, ArrowLeft } from "lucide-react"
import type { PrdResult as PrdResultType } from "@/lib/types"

export default function ResultPage() {
  const [result, setResult] = useState<PrdResultType | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    import("@/lib/supabase/client").then(async (mod) => {
      const supabase = mod.createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (cancelled) return

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data } = await supabase
        .from("prd_results")
        .select("*")
        .eq("id", params.id)
        .eq("user_id", user.id)
        .single()

      if (cancelled) return

      if (!data) {
        router.push("/dashboard")
        return
      }

      setResult(data)
      setLoading(false)
    }).catch(() => {
      if (!cancelled) setLoading(false)
    })

    return () => { cancelled = true }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!result) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Tabs defaultValue="prd" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="prd">
            <FileText className="h-4 w-4 mr-2" />
            PRD
          </TabsTrigger>
          <TabsTrigger value="diagram">
            <GitBranch className="h-4 w-4 mr-2" />
            Flow
          </TabsTrigger>
          <TabsTrigger value="prompt">
            <Braces className="h-4 w-4 mr-2" />
            Prompt
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prd">
          <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin" />}>
            <PrdResult content={result.prd_content} />
          </Suspense>
        </TabsContent>

        <TabsContent value="diagram">
          <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin" />}>
            <MermaidDiagram code={result.mermaid_diagram} />
          </Suspense>
        </TabsContent>

        <TabsContent value="prompt">
          <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin" />}>
            <PromptDisplay prompt={result.vibe_prompt} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}