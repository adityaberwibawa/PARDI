"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Clock, Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface PrdItem {
  id: string
  project_name: string
  created_at: string
  prd_results: { id: string }[] | null
}

export default function DashboardPage() {
  const [prds, setPrds] = useState<PrdItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
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

  const handleDelete = useCallback(async (prdId: string) => {
    setDeletingId(prdId)
    try {
      const response = await fetch(`/api/prd/${prdId}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete")

      setPrds((prev) => prev.filter((p) => p.prd_results?.[0]?.id !== prdId))
      toast.success("PRD deleted")
    } catch {
      toast.error("Failed to delete PRD")
    } finally {
      setDeletingId(null)
    }
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
          <h1 className="text-2xl font-semibold tracking-tight">My PRDs</h1>
          <p className="text-sm text-muted-foreground">Your generated product requirement documents</p>
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
        <div className="grid gap-3">
          {prds.map((prd) => {
            const resultId = prd.prd_results?.[0]?.id
            return (
              <Card
                key={prd.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => {
                  if (resultId) router.push(`/result/${resultId}`)
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">{prd.project_name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 shrink-0" />
                        {new Date(prd.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      {resultId && (
                        <AlertDialog>
                          <AlertDialogTrigger
                            render={
                              <button
                                className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-destructive hover:bg-accent transition-colors disabled:opacity-50"
                                disabled={deletingId === resultId}
                                onClick={(e: any) => e.stopPropagation()}
                              />
                            }
                          >
                            {deletingId === resultId ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </AlertDialogTrigger>
                          <AlertDialogContent onClick={(e: any) => e.stopPropagation()}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete PRD?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete &quot;{prd.project_name}&quot; and cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(resultId)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}