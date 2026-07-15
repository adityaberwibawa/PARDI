"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface Props {
  content: string
}

export function PrdResult({ content }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      toast.success("Copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy")
    }
  }

  // Simple markdown-like rendering
  const renderContent = (text: string) => {
    const lines = text.split("\n")
    return lines.map((line, i) => {
      if (line.startsWith("```mermaid")) return null
      if (line.startsWith("```") && lines[i-1]?.startsWith("```mermaid")) return null
      if (line.startsWith("```")) return null
      if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-bold mt-6 mb-2">{line.slice(3)}</h2>
      if (line.startsWith("### ")) return <h3 key={i} className="text-lg font-semibold mt-4 mb-1">{line.slice(4)}</h3>
      if (line.startsWith("- ")) return <li key={i} className="ml-4 list-disc text-muted-foreground">{line.slice(2)}</li>
      if (line.trim() === "") return <br key={i} />
      return <p key={i} className="text-muted-foreground leading-relaxed">{line}</p>
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Product Requirement Document</CardTitle>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none dark:prose-invert">
        <div className="space-y-2">
          {renderContent(content)}
        </div>
      </CardContent>
    </Card>
  )
}
