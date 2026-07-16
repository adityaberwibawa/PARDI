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
import { createClient } from "@/lib/supabase/client"

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

    async function load() {
      try {
        const supabase = createClient()
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
          setPrds(data ?? [])
          setLoading(false)
        }
      } catch {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [router])

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

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso))

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-[40vh]"
        role="status"
        aria-live="polite"
        aria-label="Loading PRDs"
      >
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Loading PRDs…</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">My PRDs</h1>
          <p className="text-sm text-muted-foreground">Your generated product requirement documents</p>
        </div>
        <Button onClick={() => router.push("/new")} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          New PRD
        </Button>
      </header>

      {prds.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <FileText className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
            <p className="text-muted-foreground">No PRDs yet. Create your first one!</p>
            <Button onClick={() => router.push("/new")}>Create PRD</Button>
          </CardContent>
        </Card>
      ) : (
        <ul aria-label="PRD list" className="grid gap-3">
          {prds.map((prd) => {
            const resultId = prd.prd_results?.[0]?.id
            return (
              <li key={prd.id}>
                <Card
                  className="cursor-pointer hover:bg-accent/50 focus-within:ring-2 focus-within:ring-ring transition-colors"
                  onClick={() => {
                    if (resultId) router.push(`/result/${resultId}`)
                  }}
                  onKeyDown={(e) => {
                    if (resultId && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault()
                      router.push(`/result/${resultId}`)
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open PRD: ${prd.project_name}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{prd.project_name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
                          <time dateTime={prd.created_at}>{formatDate(prd.created_at)}</time>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {resultId && (
                          <AlertDialog>
                            <AlertDialogTrigger
                              render={
                                <button
                                  type="button"
                                  aria-label={`Delete PRD: ${prd.project_name}`}
                                  className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-destructive hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors disabled:opacity-50 disabled:pointer-events-none"
                                  disabled={deletingId === resultId}
                                  onClick={(e) => e.stopPropagation()}
                                  onKeyDown={(e) => e.stopPropagation()}
                                />
                              }
                            >
                              {deletingId === resultId ? (
                                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                              ) : (
                                <Trash2 className="h-4 w-4" aria-hidden="true" />
                              )}
                            </AlertDialogTrigger>
                            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete PRD?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete &ldquo;{prd.project_name}&rdquo; and cannot be undone.
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
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}