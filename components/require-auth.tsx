"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function RequireAuth() {
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
