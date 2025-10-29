"use client"

import ResumeAnalyzer from "@/components/resume-analyzer"
import RequireAuth from "@/components/require-auth"
import { useAuth } from "@/components/auth-context"

export default function ResumePage() {
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
      <h1 className="sr-only">Resume Analyzer</h1>
      <ResumeAnalyzer />
    </div>
  )
}
