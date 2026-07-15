"use client"

import { useEffect, useRef, useState, memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useTheme } from "next-themes"

interface Props {
  code: string
}

export const MermaidDiagram = memo(function MermaidDiagram({ code }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { theme } = useTheme()

  useEffect(() => {
    if (!code || !ref.current) return

    let cleanup = false

    const render = async () => {
      try {
        const mermaid = (await import("mermaid")).default
        mermaid.initialize({
          startOnLoad: false,
          theme: theme === "dark" ? "dark" : "neutral",
          themeVariables:
            theme === "dark"
              ? {
                  primaryColor: "#333",
                  primaryTextColor: "#ededed",
                  primaryBorderColor: "#555",
                  lineColor: "#555",
                  secondaryColor: "#1a1a1a",
                  tertiaryColor: "#0a0a0a",
                  fontFamily: "Inter Tight, sans-serif",
                }
              : {
                  primaryColor: "#222",
                  primaryTextColor: "#fff",
                  primaryBorderColor: "#222",
                  lineColor: "#888",
                  secondaryColor: "#f0f0f0",
                  tertiaryColor: "#fff",
                  fontFamily: "Inter Tight, sans-serif",
                },
        })

        if (cleanup) return

        const id = "mermaid-" + Math.random().toString(36).slice(2, 8)
        const { svg } = await mermaid.render(id, code)
        if (ref.current && !cleanup) {
          ref.current.innerHTML = svg
        }
        setLoading(false)
      } catch {
        setError("Mermaid syntax error. Raw diagram code shown below:")
        setLoading(false)
      }
    }

    render()

    return () => {
      cleanup = true
    }
  }, [code, theme])

  if (!code) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No flow diagram was generated for this PRD.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Flow Diagram</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        {error && (
          <div className="space-y-4">
            <div className="text-destructive text-sm p-4 bg-destructive/10 rounded-lg">
              {error}
            </div>
            <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto font-mono whitespace-pre-wrap">{code}</pre>
          </div>
        )}
        <div ref={ref} className="flex justify-center overflow-x-auto" />
      </CardContent>
    </Card>
  )
})