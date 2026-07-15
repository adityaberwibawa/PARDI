import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { NavBar } from "@/components/nav-bar"

export const metadata: Metadata = {
  title: "PARDI",
  description: "AI-powered PRD generator for vibe coders",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-background font-sans">
        <NavBar />
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}
