"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FormData } from "@/lib/types"

interface Props {
  data: FormData
  updateData: (partial: Partial<FormData>) => void
}

export function StepTarget({ data, updateData }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="target_user" className="text-base">
          Target User / Pengguna Target <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="target_user"
          placeholder="Who will use this app? Age, occupation, needs... / Siapa penggunanya? Usia, pekerjaan, kebutuhan..."
          value={data.target_user}
          onChange={(e) => updateData({ target_user: e.target.value })}
          className="min-h-[100px]"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Select
            value={data.platform}
            onValueChange={(v) => updateData({ platform: v ?? "" })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Web">Web</SelectItem>
              <SelectItem value="Mobile (iOS & Android)">Mobile (iOS & Android)</SelectItem>
              <SelectItem value="Desktop">Desktop</SelectItem>
              <SelectItem value="Web + Mobile">Web + Mobile</SelectItem>
              <SelectItem value="All Platforms">All Platforms</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="timeline">Timeline / Jadwal</Label>
          <Select
            value={data.timeline}
            onValueChange={(v) => updateData({ timeline: v ?? "" })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select timeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-2 weeks / 1-2 minggu">1-2 weeks (MVP sprint)</SelectItem>
              <SelectItem value="1 month / 1 bulan">1 month</SelectItem>
              <SelectItem value="3 months / 3 bulan">3 months</SelectItem>
              <SelectItem value="6 months / 6 bulan">6 months</SelectItem>
              <SelectItem value="Flexible / Fleksibel">Flexible / No deadline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
