import type { Metadata } from "next"
import { Inter_Tight } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { NavBar } from "@/components/nav-bar"
import { ThemeProvider } from "@/components/theme-provider"
import { SkipLink } from "@/components/skip-link"

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "PARDI — AI PRD Generator for Vibe Coders",
    template: "%s · PARDI",
  },
  description: "Generate comprehensive Product Requirement Documents and vibe coding prompts powered by AI. Built for vibe coders.",
  applicationName: "PARDI",
  authors: [{ name: "PARDI Team" }],
  keywords: ["PRD", "product requirements", "vibe coding", "AI", "prompts", "documentation"],
}

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f8f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={interTight.variable}
      suppressHydrationWarning
      style={{ colorScheme: "light dark" }}
    >
      <body className="antialiased min-h-screen bg-background text-foreground font-sans leading-[200%]">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SkipLink />
          <NavBar />
          <main id="main" className="mx-auto px-6 py-10 max-w-5xl">
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
