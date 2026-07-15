"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface Props {
  code: string
}

export function MermaidDiagram({ code }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!code || !ref.current) return

    let mermaid: any
    let cleanup = false

    const render = async () => {
      try {
        mermaid = await import("mermaid")
        mermaid.default.initialize({
          startOnLoad: false,
          theme: "dark",
          themeVariables: {
            primaryColor: "#3b82f6",
            primaryTextColor: "#fff",
            primaryBorderColor: "#60a5fa",
            lineColor: "#64748b",
            secondaryColor: "#1e293b",
            tertiaryColor: "#0f172a",
          },
        })

        if (cleanup) return

        const { svg } = await mermaid.default.render("mermaid-svg", code)
        if (ref.current && !cleanup) {
          ref.current.innerHTML = svg
        }
        setLoading(false)
      } catch (err: any) {
        setError("Mermaid syntax error. Raw diagram code shown below:")
        setLoading(false)
      }
    }

    render()

    return () => {
      cleanup = true
    }
  }, [code])

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
}
