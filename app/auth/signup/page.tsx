"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-context"

export default function SignupPage() {
  const { signup } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)

  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Join CareerCraft in seconds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button
            disabled={busy}
            onClick={async () => {
              setBusy(true)
              try {
                if (!email || !password) throw new Error("Please fill all required fields")
                await signup(name, email, password)
                toast({ title: "Account created", description: "Welcome to CareerCraft!" })
                router.push("/")
              } catch (err: any) {
                toast({
                  title: "Signup failed",
                  description: err?.message ?? "Please try again",
                  variant: "destructive",
                })
              } finally {
                setBusy(false)
              }
            }}
          >
            {busy ? "Creating…" : "Create account"}
          </Button>
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link className="underline underline-offset-4" href="/auth/login">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
