"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Clock, Loader2 } from "lucide-react"

interface PrdItem {
  id: string
  project_name: string
  created_at: string
  prd_results: { id: string }[] | null
}

export default function DashboardPage() {
  const [prds, setPrds] = useState<PrdItem[]>([])
  const [loading, setLoading] = useState(true)
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
        .from("form_submissions")
        .select("id, project_name, created_at, prd_results(id)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (!cancelled) {
        setPrds(data || [])
        setLoading(false)
      }
    }).catch(() => {
      if (!cancelled) setLoading(false)
    })

    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My PRDs</h1>
          <p className="text-muted-foreground">Your generated product requirement documents</p>
        </div>
        <Button onClick={() => router.push("/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New PRD
        </Button>
      </div>

      {prds.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No PRDs yet. Create your first one!</p>
            <Button onClick={() => router.push("/new")}>Create PRD</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {prds.map((prd) => (
            <Card
              key={prd.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => {
                const resultId = prd.prd_results?.[0]?.id
                if (resultId) router.push(`/result/${resultId}`)
              }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{prd.project_name}</CardTitle>
                  <Badge variant={prd.prd_results && prd.prd_results.length > 0 ? "default" : "secondary"}>
                    {prd.prd_results && prd.prd_results.length > 0 ? "Completed" : "No results"}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  {new Date(prd.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
