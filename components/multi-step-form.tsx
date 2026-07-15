"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Sparkles, Loader2, ArrowLeft, ArrowRight } from "lucide-react"
import { StepBasicInfo } from "./step-basic-info"
import { StepTarget } from "./step-target"
import { StepTechnical } from "./step-technical"
import type { FormData } from "@/lib/types"

const STEPS = ["Basic Info", "Target & Scope", "Technical"]

const initialData: FormData = {
  project_name: "",
  idea_description: "",
  target_user: "",
  platform: "",
  timeline: "",
  features: "",
  tech_stack: "",
  reference_links: "",
  model: "qwen/qwen3-32b",
}

export function MultiStepForm() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<FormData>(initialData)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    import("@/lib/supabase/client").then(async (mod) => {
      const supabase = mod.createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }).catch(() => {})
  }, [])

  const updateData = (partial: Partial<FormData>) => {
    setData((prev) => ({ ...prev, ...partial }))
  }

  const validateStep = (): boolean => {
    switch (step) {
      case 0:
        return data.project_name.trim().length > 0 && data.idea_description.trim().length > 0
      case 1:
        return data.target_user.trim().length > 0
      case 2:
        return data.features.trim().length > 0 && data.tech_stack.trim().length > 0
      default:
        return true
    }
  }

  const nextStep = () => {
    if (!validateStep()) {
      toast.error("Please fill in all required fields")
      return
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const prevStep = () => setStep((s) => Math.max(s - 1, 0))

  const handleSubmit = async () => {
    if (!validateStep()) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!userId) {
      toast.error("Please sign in first")
      router.push("/auth/login")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Generation failed")
      }

      const result = await response.json()
      router.push(`/result/${result.id}`)
    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>{STEPS[step]}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardContent className="pt-6">
          {step === 0 && <StepBasicInfo data={data} updateData={updateData} />}
          {step === 1 && <StepTarget data={data} updateData={updateData} />}
          {step === 2 && <StepTechnical data={data} updateData={updateData} />}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={step === 0}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {step < STEPS.length - 1 ? (
          <Button onClick={nextStep}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate PRD
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
