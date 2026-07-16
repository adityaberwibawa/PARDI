"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { FormData } from "@/lib/types"

interface Props {
  data: FormData
  updateData: (partial: Partial<FormData>) => void
}

export function StepBasicInfo({ data, updateData }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="project_name" className="text-base">
          Nama Proyek / Project Name <span className="text-destructive" aria-hidden="true">*</span>
        </Label>
        <Input
          id="project_name"
          name="project_name"
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder="e.g., E-Commerce App, Task Manager, AI Chatbot…"
          value={data.project_name}
          onChange={(e) => updateData({ project_name: e.target.value })}
          maxLength={100}
          aria-required="true"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="idea_description" className="text-base">
          Deskripsi Ide / Idea Description <span className="text-destructive" aria-hidden="true">*</span>
        </Label>
        <Textarea
          id="idea_description"
          name="idea_description"
          autoComplete="off"
          placeholder="Describe your app idea in detail… / Jelaskan ide aplikasi kamu…"
          value={data.idea_description}
          onChange={(e) => updateData({ idea_description: e.target.value })}
          className="min-h-[120px]"
          maxLength={2000}
          aria-required="true"
          required
        />
        <p className="text-xs text-muted-foreground">
          {data.idea_description.length}/2000
        </p>
      </div>
    </div>
  )
}
