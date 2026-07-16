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
          Fitur Utama / Core Features <span className="text-destructive" aria-hidden="true">*</span>
        </Label>
        <Textarea
          id="features"
          name="features"
          autoComplete="off"
          placeholder={`List the main features (one per line):\n- User authentication\n- Product catalog\n- Shopping cart\n- Payment integration\n- Admin dashboard`}
          value={data.features}
          onChange={(e) => updateData({ features: e.target.value })}
          className="min-h-[120px]"
          maxLength={2000}
          aria-required="true"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tech_stack" className="text-base">
          Tech Stack <span className="text-destructive" aria-hidden="true">*</span>
        </Label>
        <Input
          id="tech_stack"
          name="tech_stack"
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder="e.g., Next.js, Tailwind, PostgreSQL, Prisma…"
          value={data.tech_stack}
          onChange={(e) => updateData({ tech_stack: e.target.value })}
          maxLength={200}
          aria-required="true"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="model">AI Model</Label>
        <Select
          value={data.model}
          onValueChange={(v) => updateData({ model: v ?? "qwen/qwen3-32b" })}
        >
          <SelectTrigger id="model" aria-label="AI model">
            <SelectValue placeholder="Select AI model…" />
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
          name="reference_links"
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder="e.g., Figma link, similar apps, design inspiration…"
          value={data.reference_links}
          onChange={(e) => updateData({ reference_links: e.target.value })}
          maxLength={500}
        />
      </div>
    </div>
  )
}
