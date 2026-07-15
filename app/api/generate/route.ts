import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateWithGroq } from "@/lib/groq"
import { buildPrdPrompt, buildVibePrompt } from "@/lib/prompts"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { project_name, idea_description, target_user, platform, timeline, features, tech_stack, reference_links } = body

    if (!project_name || !idea_description) {
      return NextResponse.json({ error: "Project name and description are required" }, { status: 400 })
    }

    // Save form submission
    const { data: submission, error: submissionError } = await supabase
      .from("form_submissions")
      .insert({
        user_id: user.id,
        project_name,
        idea_description,
        target_user: target_user || "",
        platform: platform || "",
        timeline: timeline || "",
        features: features || "",
        tech_stack: tech_stack || "",
        reference_links: reference_links || "",
      })
      .select()
      .single()

    if (submissionError) throw submissionError

    // Generate PRD from Groq
    const formData = { project_name, idea_description, target_user, platform, timeline, features, tech_stack, reference_links }
    const prdPrompt = buildPrdPrompt(formData)
    const prdContent = await generateWithGroq(prdPrompt)

    // Extract mermaid diagram from PRD content
    const mermaidMatch = prdContent.match(/```mermaid\n([\s\S]*?)```/)
    const mermaidDiagram = mermaidMatch ? mermaidMatch[1].trim() : ""

    // Generate vibe coding prompt
    const vibePrompt = buildVibePrompt(formData, prdContent)

    // Save PRD result
    const { data: result, error: resultError } = await supabase
      .from("prd_results")
      .insert({
        submission_id: submission.id,
        user_id: user.id,
        prd_content: prdContent,
        vibe_prompt: vibePrompt,
        mermaid_diagram: mermaidDiagram,
        status: "completed",
      })
      .select()
      .single()

    if (resultError) throw resultError

    return NextResponse.json({ id: result.id })
  } catch (err: any) {
    console.error("Generate error:", err)
    return NextResponse.json({ error: err.message || "Generation failed" }, { status: 500 })
  }
}
