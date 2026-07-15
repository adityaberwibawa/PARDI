export interface FormData {
  project_name: string
  idea_description: string
  target_user: string
  platform: string
  timeline: string
  features: string
  tech_stack: string
  reference_links: string
  model: string
}

export const AVAILABLE_MODELS = [
  { id: "qwen/qwen3-32b", name: "Qwen 3 32B", speed: "400 t/s", desc: "Best quality PRD" },
  { id: "openai/gpt-oss-120b", name: "GPT-OSS 120B", speed: "500 t/s", desc: "Fast & powerful" },
  { id: "openai/gpt-oss-20b", name: "GPT-OSS 20B", speed: "1000 t/s", desc: "Fastest, cheapest" },
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", speed: "280 t/s", desc: "Good all-rounder" },
] as const

export interface PrdResult {
  id: string
  submission_id: string
  user_id: string
  prd_content: string
  vibe_prompt: string
  mermaid_diagram: string
  status: string
  created_at: string
}

export interface FormSubmission {
  id: string
  user_id: string
  project_name: string
  idea_description: string
  target_user: string
  platform: string
  timeline: string
  features: string
  tech_stack: string
  reference_links: string
  created_at: string
}

export interface Profile {
  id: string
  display_name: string
  avatar_url: string
  created_at: string
}
