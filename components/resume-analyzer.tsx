"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const DEFAULT_SUGGESTIONS: Record<string, string> = {
  python: "Consider adding Python projects or certifications.",
  javascript: "Include JS frameworks (React, Node) used and outcomes.",
  react: "Mention React components, state management, or projects.",
  node: "Describe APIs/services built with Node/Express.",
  mongodb: "Highlight schema design or aggregation pipelines.",
  "machine learning": "Add ML projects, models, or competitions.",
  nlp: "Describe text processing, embeddings, or classification work.",
  "project management": "Note responsibilities, tools (Jira), and outcomes.",
}

function tokenize(text: string): string[] {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s+#.]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
}

function uniqueMeaningful(tokens: string[]): string[] {
  const stop = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "to",
    "for",
    "of",
    "with",
    "on",
    "in",
    "at",
    "by",
    "as",
    "is",
    "are",
    "be",
    "this",
    "that",
    "it",
    "we",
    "you",
    "they",
    "i",
    "from",
    "using",
    "use",
    "used",
    "your",
    "our",
    "their",
    "my",
    "over",
    "into",
    "via",
  ])
  const seen = new Set<string>()
  const out: string[] = []
  for (const t of tokens) {
    if (t.length < 3) continue
    if (stop.has(t)) continue
    if (!seen.has(t)) {
      seen.add(t)
      out.push(t)
    }
  }
  return out
}

function computeOverlapScore(resumeText: string, jobText: string) {
  const resumeTokens = uniqueMeaningful(tokenize(resumeText))
  const jobTokens = uniqueMeaningful(tokenize(jobText))

  const resumeSet = new Set(resumeTokens)
  const jobSet = new Set(jobTokens)

  const overlap = jobTokens.filter((t) => resumeSet.has(t))
  const missing = jobTokens.filter((t) => !resumeSet.has(t))

  const score = jobSet.size === 0 ? 0 : Math.round((overlap.length / jobSet.size) * 100)
  return { score, overlap, missing, jobTokens, resumeTokens }
}

export default function ResumeAnalyzer() {
  const [jobTitle, setJobTitle] = useState("")
  const [jobDesc, setJobDesc] = useState("")
  const [resume, setResume] = useState("")
  const [busy, setBusy] = useState(false)

  const analysis = useMemo(() => computeOverlapScore(resume, jobDesc), [resume, jobDesc])

  const handleAnalyze = () => {
    setBusy(true)
    // Simulate async analysis; replace later with backend ML/NLP.
    setTimeout(() => setBusy(false), 400)
  }

  const suggestions = useMemo(() => {
    return analysis.missing.slice(0, 10).map((kw) => {
      const key = kw.toLowerCase()
      return DEFAULT_SUGGESTIONS[key]
        ? `${kw}: ${DEFAULT_SUGGESTIONS[key]}`
        : `${kw}: Add relevant details to showcase this skill/keyword.`
    })
  }, [analysis.missing])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Analyzer</CardTitle>
        <CardDescription>
          Paste a job description and your resume to see a match score, missing keywords, and improvement tips.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-sm">Job Title</label>
            <Input
              placeholder="e.g., Junior NLP Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
            <label className="text-sm">Job Description</label>
            <Textarea
              className="min-h-40"
              placeholder="Paste job description here..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm">Resume</label>
            <Textarea
              className="min-h-64"
              placeholder="Paste your resume text here (support for file upload coming soon)"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />
            {/* Placeholder for future file upload */}
            <div className="text-xs text-muted-foreground">
              PDF/Doc upload and parsing will be added in the backend phase.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleAnalyze} disabled={busy}>
            {busy ? "Analyzing…" : "Analyze"}
          </Button>
          <div className="text-sm text-muted-foreground">
            {jobTitle ? `Target role: ${jobTitle}` : "Target role not set"}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg border bg-card">
            <div className="text-sm text-muted-foreground">Match Score</div>
            <div className="text-3xl font-semibold">{analysis.score}%</div>
            <div className="text-xs text-muted-foreground mt-1">Based on keyword overlap with the job description.</div>
          </div>

          <div className="p-4 rounded-lg border bg-card md:col-span-2">
            <div className="text-sm font-medium mb-2">Missing Keywords</div>
            {analysis.missing.length === 0 ? (
              <div className="text-sm text-muted-foreground">No missing keywords detected.</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {analysis.missing.slice(0, 20).map((kw) => (
                  <span key={kw} className="text-xs px-2 py-1 rounded-full border bg-muted">
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 rounded-lg border bg-card">
          <div className="text-sm font-medium mb-2">Improvement Tips</div>
          {suggestions.length === 0 ? (
            <div className="text-sm text-muted-foreground">No suggestions at this time.</div>
          ) : (
            <ul className="list-disc pl-6 text-sm leading-relaxed">
              {suggestions.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
