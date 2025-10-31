"use client"

import type React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sign in required</CardTitle>
          <CardDescription>Log in to access this feature.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/auth/login">Go to Login</Link>
          </Button>
          <span className="ml-3 text-sm text-muted-foreground">
            New here?{" "}
            <Link href="/auth/signup" className="underline underline-offset-4">
              Create an account
            </Link>
          </span>
        </CardContent>
      </Card>
    )
  }

  return <>{children}</>
}

export default RequireAuth
