"use client"

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} CareerCraft — Empowering students with AI-driven career and productivity tools.
      </div>
    </footer>
  )
}
