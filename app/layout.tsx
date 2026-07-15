import type { Metadata } from "next"
import { Inter_Tight } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { NavBar } from "@/components/nav-bar"
import { ThemeProvider } from "@/components/theme-provider"

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

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
    <html lang="en" className={interTight.variable} suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background font-sans leading-[200%]">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NavBar />
          <main className="mx-auto px-6 py-10 max-w-5xl">
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
