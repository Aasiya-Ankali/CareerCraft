"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-semibold text-pretty">
          CareerCraft — Platform for Career Readiness and Productivity
        </h1>
        <p className="max-w-2xl mx-auto text-muted-foreground leading-relaxed">
          Analyze your resume against job descriptions, uncover missing skills with learning resources, and stay on
          track with a smart daily planner featuring a Pomodoro timer and productivity charts.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/resume">Try Resume Analyzer</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/planner">Open Smart Planner</Link>
          </Button>
        </div>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Resume Analyzer</CardTitle>
            <CardDescription>Match score, missing keywords, and skill gap insights</CardDescription>
          </CardHeader>
          <CardContent className="leading-relaxed text-muted-foreground">
            Paste a job description and your resume to get a compatibility score using keyword overlap and receive
            actionable suggestions for improvement.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Smart Daily Planner</CardTitle>
            <CardDescription>Tasks, Pomodoro timer, and progress charts</CardDescription>
          </CardHeader>
          <CardContent className="leading-relaxed text-muted-foreground">
            Plan your day, focus with Pomodoro, and track your progress over time with clear visualizations.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tech Companies</CardTitle>
            <CardDescription>Explore companies by field and specialization</CardDescription>
          </CardHeader>
          <CardContent className="leading-relaxed text-muted-foreground">
            Browse leading tech companies filtered by field like Full Stack, Data Science, and Web3 to find your next
            opportunity.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interview Experiences</CardTitle>
            <CardDescription>Learn from real candidate interviews</CardDescription>
          </CardHeader>
          <CardContent className="leading-relaxed text-muted-foreground">
            Read and bookmark interview experiences from other candidates to prepare better for your own interviews.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Career Roadmaps</CardTitle>
            <CardDescription>Structured learning paths for tech roles</CardDescription>
          </CardHeader>
          <CardContent className="leading-relaxed text-muted-foreground">
            Follow comprehensive roadmaps for roles like SWE, Data Scientist, DevOps Engineer, and Product Manager.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Application Tracker</CardTitle>
            <CardDescription>Track your job search and monitor progress</CardDescription>
          </CardHeader>
          <CardContent className="leading-relaxed text-muted-foreground">
            Track all your job applications, interview dates, salary expectations, and get insights on your job search
            progress with analytics.
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
