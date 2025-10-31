"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Navbar() {
  const { user, loading, logout } = useAuth()

  if (loading) {
    return (
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-semibold">
            CareerCraft
            <span className="sr-only">Home</span>
          </Link>
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        </div>
      </header>
    )
  }

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold">
          CareerCraft
          <span className="sr-only">Home</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/resume">Resume</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/planner">Planner</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/companies">Companies</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/interviews">Interviews</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/roadmaps">Roadmaps</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/bookmarks">Bookmarks</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/jobs">Jobs</Link>
          </Button>
          {/* Auth area */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 ml-2 border-l">
              <Avatar className="h-7 w-7">
                <AvatarFallback>{user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{user.name || user.email}</span>
              <Button variant="secondary" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/auth/signup">Sign up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
