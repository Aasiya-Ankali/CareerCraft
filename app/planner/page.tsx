"use client"

import PlannerDashboard from "@/components/planner-dashboard"
import RequireAuth from "@/components/require-auth"
import { useAuth } from "@/components/auth-context"

export default function PlannerPage() {
  const { user } = useAuth()
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <RequireAuth />
      </div>
    )
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="sr-only">Smart Daily Planner</h1>
      <PlannerDashboard />
    </div>
  )
}
