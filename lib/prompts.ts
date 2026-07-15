import { FormData } from "./types"

function section(title: string, body: string): string {
  return `## ${title}\n\n${body}\n\n`
}

export function buildPrdPrompt(data: FormData): string {
  const sections = [
    "=== PROJECT INFORMATION ===",
    "",
    "Project Name: " + data.project_name,
    "Description: " + data.idea_description,
    "Target Users: " + data.target_user,
    "Platform: " + data.platform,
    "Timeline: " + data.timeline,
    "Features: " + data.features,
    "Tech Stack: " + data.tech_stack,
    "reference_links: " + data.reference_links,
    "",
    "=== OUTPUT REQUIREMENTS ===",
    "",
    "Generate the response in the following structure. EVERY section MUST be bilingual (English first, then Indonesian).",
    "",
    "1. Executive Summary / Ringkasan Eksekutif",
    "   - Brief overview of the project (2-3 paragraphs in EN, then 2-3 paragraphs in ID)",
    "",
    "2. Target Users / Pengguna Target",
    "   - User personas and demographics (EN + ID)",
    "",
    "3. Features and Requirements / Fitur dan Kebutuhan",
    "   - Core features list with priority (MVP vs future)",
    "   - Each feature with description in EN and ID",
    "",
    "4. Tech Stack / Tumpukan Teknologi",
    "   - Recommended technologies with brief reasoning (EN + ID)",
    "",
    "5. User Flow / Alur Pengguna",
    "   - Generate a MERMAID flowchart diagram code (wrapped in ```mermaid ... ```)",
    "   - The flowchart should show the complete user journey from entry to exit",
    "   - Use flowchart TD format with clear nodes and arrows",
    "",
    "6. Timeline / Jadwal Pengerjaan",
    "   - Suggested timeline based on: " + data.timeline,
    "",
    "7. Vibe Coding Prompt / Prompt untuk Vibe Coding",
    "   - A detailed, copy-paste ready prompt for vibe coding (using Cursor, Claude, GPT, etc.)",
    "   - This prompt should instruct the AI assistant to build the project step by step",
    "   - Include: project setup instructions, architecture overview, component tree, data flow, route design",
    "   - Make it actionable and detailed enough for a vibe coder to start building immediately",
    "   - Write the vibe coding prompt in English only (it is for AI coding assistants)",
    "",
    "IMPORTANT FORMATTING RULES:",
    "- Use proper Markdown headings (##, ###)",
    "- Keep the mermaid code block separate and valid",
    "- Make the vibe coding prompt section extremely practical and copy-paste ready",
    "- Total length: comprehensive but focused (1000-2000 words)",
  ]

  return sections.join("\n")
}

export function buildVibePrompt(data: FormData, prdContent: string): string {
  const lines = [
    "You are an expert full-stack developer. Build the following project based on this PRD:",
    "",
    "PROJECT: " + data.project_name,
    "TECH STACK: " + data.tech_stack,
    "PLATFORM: " + data.platform,
    "",
    "KEY FEATURES:",
    data.features,
    "",
    "PRD REFERENCE:",
    prdContent.substring(0, 3000),
    "",
    "Please generate:",
    "1. Complete project structure",
    "2. All necessary files with full implementation",
    "3. Setup and run instructions",
    "4. Database schema if applicable",
    "5. API endpoints documentation",
    "",
    "Make it production-ready with error handling, loading states, and responsive design.",
  ]

  return lines.join("\n")
}
