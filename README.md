# PARDI — AI-Powered PRD Generator

Generate comprehensive **Product Requirement Documents** and **Vibe Coding Prompts** powered by AI. Built for vibe coders.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06b6d4)
![Supabase](https://img.shields.io/badge/Supabase-3ecf8e)
![Groq](https://img.shields.io/badge/Groq-Llama3-4ade80)

---

## Features

- **Multi-step form** — 3 langkah: Basic Info, Target & Scope, Technical
- **AI-generated PRD** — Bilingual (English + Indonesian) via Groq API
- **Mermaid Flow Diagram** — Auto-generated user journey flowchart
- **Vibe Coding Prompt** — Copy-paste ready prompt untuk Cursor/Claude/GPT
- **User Dashboard** — Riwayat semua PRD yang pernah dibuat
- **Supabase Auth** — Login dengan email
- **Dark Theme** — Modern minimalis dengan font Monaco

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** Supabase (PostgreSQL + RLS)
- **Auth:** Supabase Auth
- **AI:** Groq API (llama3-70b-8192)
- **Diagram:** Mermaid.js
- **Icons:** Lucide React

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/adityaberwibawa/PARDI.git
cd PARDI
npm install
```

### 2. Environment Variables

Buat file `.env.local`:

```env
GROQ_API_KEY=gsk_xxx                       # https://console.groq.com
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co  # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx              # Supabase anon public key
```

### 3. Database

Jalankan SQL di `supabase/migrations/00001_schema.sql` melalui Supabase SQL Editor.

### 4. Run

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Tambahkan 3 environment variables yang sama di dashboard Vercel.

## Routes

| Route              | Description            |
| ------------------ | ---------------------- |
| `/`                | Landing page           |
| `/auth/login`      | Login / Register       |
| `/new`             | Create new PRD (form)  |
| `/dashboard`       | PRD history            |
| `/result/[id]`     | PRD detail + prompt    |

## License

MIT
