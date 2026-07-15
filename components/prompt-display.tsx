"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, Sparkles } from "lucide-react"
import { useState, useCallback, memo } from "react"
import { toast } from "sonner"

interface Props {
  prompt: string
}

export const PromptDisplay = memo(function PromptDisplay({ prompt }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      toast.success("Prompt copied! Paste it into your AI coding assistant.")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy")
    }
  }, [prompt])

  return (
    <Card className="border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between bg-primary/5 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>Vibe Coding Prompt</CardTitle>
        </div>
        <Button variant="default" size="sm" onClick={handleCopy} className="gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy Prompt"}
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="bg-muted rounded-lg p-4 font-mono text-sm whitespace-pre-wrap leading-relaxed">
          {prompt}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Paste this prompt into Cursor, Claude, ChatGPT, or any AI coding assistant to start building your project.
        </p>
      </CardContent>
    </Card>
  )
})