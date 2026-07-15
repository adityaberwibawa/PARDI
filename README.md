# PARDI — AI-Powered PRD Generator

Generate comprehensive **Product Requirement Documents** and **Vibe Coding Prompts** powered by AI. Built for vibe coders.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06b6d4)
![Supabase](https://img.shields.io/badge/Supabase-3ecf8e)
![Groq](https://img.shields.io/badge/Groq-Llama3-4ade80)

---

**Live Demo:** [https://pardi.vercel.app](https://pardi.vercel.app)

## Features

- **Multi-step form** — 3 langkah: Basic Info, Target & Scope, Technical
- **AI-generated PRD** — Bilingual (English + Indonesian) via Groq API
- **Mermaid Flow Diagram** — Auto-generated user journey flowchart
- **Vibe Coding Prompt** — Copy-paste ready prompt untuk Cursor/Claude/GPT
- **User Dashboard** — Riwayat semua PRD yang pernah dibuat
- **Supabase Auth** — Login dengan email
- **Dark Theme** — Modern minimalis dengan font Monaco

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | Supabase PostgreSQL + RLS |
| Auth | Supabase Auth (email/password) |
| AI | Groq API (llama3-70b-8192) |
| Diagram | Mermaid.js |
| Icons | Lucide React |
| Deploy | Vercel |

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/adityaberwibawa/PARDI.git
cd PARDI
npm install
```

### 2. Environment Variables

Buat file `.env.local` di root project:

```env
GROQ_API_KEY=gsk_xxx
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
```

| Variable | Dapat dari |
|----------|-----------|
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard > Settings > API (anon public) |

### 3. Database Setup

1. Buka [Supabase Dashboard](https://supabase.com) > SQL Editor
2. Copy isi `supabase/migrations/00001_schema.sql`
3. Paste dan Run

### 4. Auth Settings (Supabase)

1. **Authentication > Providers** — pastikan Email enabled
2. **Authentication > Settings**:
   - `Site URL`: isi URL deployment (misal `https://pardi.vercel.app`)
   - `Redirect URLs`: tambah `https://pardi.vercel.app/auth/callback`

### 5. Run Locally

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Di Vercel, tambah 3 environment variables yang sama (`GROQ_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/auth/login` | Login / Register |
| `/new` | Create new PRD (3-step form) |
| `/dashboard` | PRD history |
| `/result/[id]` | PRD detail + Mermaid diagram + Vibe prompt |

## Project Structure

```
PARDI/
├── app/                    # Next.js App Router pages & API
│   ├── api/generate/       # POST endpoint -> Groq API
│   ├── auth/               # Login + callback
│   ├── dashboard/          # PRD history
│   ├── new/                # Multi-step form
│   └── result/[id]/        # PRD result viewer
├── components/             # React components
│   ├── ui/                 # shadcn/ui primitives
│   └── step-*.tsx          # Form step components
├── lib/                    # Utilities & clients
│   ├── supabase/           # Supabase client (browser/server/proxy)
│   ├── groq.ts             # Groq API wrapper
│   └── prompts.ts          # Prompt templates (bilingual)
├── supabase/migrations/    # Database schema SQL
├── proxy.ts                # Auth proxy (Next.js 16)
└── .env.local              # Environment variables
```

## License

MIT
