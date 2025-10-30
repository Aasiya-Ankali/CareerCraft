"use client"

import { RequireAuth } from "@/components/require-auth"
import JobTracker from "@/components/job-tracker"

export default function JobsPage() {
  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-8">
        <JobTracker />
      </div>
    </RequireAuth>
  )
}
