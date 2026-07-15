export interface FormData {
  project_name: string
  idea_description: string
  target_user: string
  platform: string
  timeline: string
  features: string
  tech_stack: string
  reference_links: string
}

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
