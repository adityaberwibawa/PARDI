"use client"

import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FormData } from "@/lib/types"
import { AVAILABLE_MODELS } from "@/lib/types"

interface Props {
  data: FormData
  updateData: (partial: Partial<FormData>) => void
}

export function StepTechnical({ data, updateData }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="features" className="text-base">
          Fitur Utama / Core Features <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="features"
          placeholder="List the main features (one per line):
- User authentication
- Product catalog
- Shopping cart
- Payment integration
- Admin dashboard"
          value={data.features}
          onChange={(e) => updateData({ features: e.target.value })}
          className="min-h-[120px]"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tech_stack" className="text-base">
          Tech Stack <span className="text-destructive">*</span>
        </Label>
        <Input
          id="tech_stack"
          placeholder="e.g., Next.js, Tailwind, PostgreSQL, Prisma"
          value={data.tech_stack}
          onChange={(e) => updateData({ tech_stack: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>AI Model</Label>
        <Select
          value={data.model}
          onValueChange={(v) => updateData({ model: v ?? "qwen/qwen3-32b" })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select AI model" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_MODELS.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name} — {m.speed} ({m.desc})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">Default: Qwen 3 32B (best quality PRD)</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="reference_links">Referensi / Inspiration (optional)</Label>
        <Input
          id="reference_links"
          placeholder="e.g., Figma link, similar apps, design inspiration"
          value={data.reference_links}
          onChange={(e) => updateData({ reference_links: e.target.value })}
        />
      </div>
    </div>
  )
}
