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
          Nama Proyek / Project Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="project_name"
          placeholder="e.g., E-Commerce App, Task Manager, AI Chatbot"
          value={data.project_name}
          onChange={(e) => updateData({ project_name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="idea_description" className="text-base">
          Deskripsi Ide / Idea Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="idea_description"
          placeholder="Describe your app idea in detail... / Jelaskan ide aplikasi kamu..."
          value={data.idea_description}
          onChange={(e) => updateData({ idea_description: e.target.value })}
          className="min-h-[120px]"
          required
        />
      </div>
    </div>
  )
}
