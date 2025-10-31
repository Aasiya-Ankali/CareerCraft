"use client"
import { useMemo, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  AlertCircle,
  Download,
  Trash2,
  Plus,
  Loader2,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const DEFAULT_SUGGESTIONS: Record<string, string> = {
  python:
    "Add specific Python projects, certifications, or frameworks (e.g., NumPy, pandas, Flask).",
  javascript:
    "Mention JS frameworks/libraries like React, Node, or Express — highlight project outcomes.",
  react:
    "Include details about React components, hooks, or UI development experience.",
  node:
    "Describe backend APIs, RESTful services, or real-time systems built with Node.js.",
  mongodb:
    "Add points about schema design, aggregation pipelines, or MongoDB Atlas usage.",
  "machine learning":
    "Highlight ML models, frameworks (scikit-learn, TensorFlow), and measurable results.",
  nlp:
    "Describe NLP projects like sentiment analysis, embeddings, or chatbots.",
  "data analysis":
    "Showcase tools like pandas, NumPy, or Power BI used for insights.",
  "project management":
    "Note leadership, tools (Jira, Trello), and project success metrics.",
  sql:
    "Add complex query experience, database design, or performance optimization.",
  aws:
    "Include AWS cloud services used — EC2, S3, Lambda, or RDS.",
  docker:
    "Mention containerization, Dockerfiles, or deployment pipelines.",
  git:
    "Describe version control workflows (GitHub, GitLab, branching strategies).",
  tensorflow:
    "Mention neural network architectures built with TensorFlow or Keras.",
  "data visualization":
    "Highlight libraries or tools used — Matplotlib, Seaborn, Power BI, Tableau.",
  leadership:
    "Add team collaboration, mentoring, or project leadership experience.",
  communication:
    "Mention effective communication with teams, clients, or stakeholders.",
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
    "requirements",
    
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
  const score =
    jobSet.size === 0 ? 0 : Math.round((overlap.length / jobSet.size) * 100)
  return { score, overlap, missing, jobTokens, resumeTokens }
}

interface SavedResume {
  id: string
  name: string
  content: string
  createdAt: string
}

interface SavedJob {
  id: string
  title: string
  description: string
  createdAt: string
}

export default function ResumeAnalyzer() {
  const [jobTitle, setJobTitle] = useState("")
  const [jobDesc, setJobDesc] = useState("")
  const [resume, setResume] = useState("")
  const [busy, setBusy] = useState(false)

  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([])
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [resumeName, setResumeName] = useState("")
  const [jobName, setJobName] = useState("")

  const analysis = useMemo(
    () => computeOverlapScore(resume, jobDesc),
    [resume, jobDesc]
  )

  const handleAnalyze = () => {
    if (!resume.trim() || !jobDesc.trim()) return
    setBusy(true)
    setTimeout(() => setBusy(false), 600)
  }

  const handleSaveResume = () => {
    if (!resume.trim() || !resumeName.trim()) return
    const newResume: SavedResume = {
      id: Date.now().toString(),
      name: resumeName,
      content: resume,
      createdAt: new Date().toLocaleDateString(),
    }
    setSavedResumes([newResume, ...savedResumes])
    setResumeName("")
  }

  const handleSaveJob = () => {
    if (!jobDesc.trim() || !jobName.trim()) return
    const newJob: SavedJob = {
      id: Date.now().toString(),
      title: jobName,
      description: jobDesc,
      createdAt: new Date().toLocaleDateString(),
    }
    setSavedJobs([newJob, ...savedJobs])
    setJobName("")
  }

  const handleLoadResume = (savedResume: SavedResume) => {
    setResume(savedResume.content)
  }

  const handleLoadJob = (savedJob: SavedJob) => {
    setJobTitle(savedJob.title)
    setJobDesc(savedJob.description)
  }

  const handleDeleteResume = (id: string) => {
    setSavedResumes(savedResumes.filter((r) => r.id !== id))
  }

  const handleDeleteJob = (id: string) => {
    setSavedJobs(savedJobs.filter((j) => j.id !== id))
  }

  const suggestions = useMemo(() => {
    return analysis.missing.slice(0, 15).map((kw) => {
      const key = kw.toLowerCase()
      return DEFAULT_SUGGESTIONS[key]
        ? `${kw}: ${DEFAULT_SUGGESTIONS[key]}`
        : `${kw}: Add measurable achievements or experiences demonstrating this skill.`
    })
  }, [analysis.missing])

  const extractedSkills = useMemo(() => {
    const tokens = uniqueMeaningful(tokenize(resume))
    const skillKeywords = [
      "python",
      "javascript",
      "react",
      "node",
      "mongodb",
      "sql",
      "aws",
      "docker",
      "git",
      "typescript",
      "vue",
      "angular",
      "express",
      "django",
      "flask",
      "java",
      "c++",
      "golang",
      "rust",
      "nlp",
      "machine",
      "learning",
      "tensorflow",
    ]
    return tokens.filter((t) => skillKeywords.includes(t.toLowerCase()))
  }, [resume])

  return (
    <div className="space-y-6">
      <Tabs defaultValue="analyzer" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analyzer">Analyzer</TabsTrigger>
          <TabsTrigger value="resumes">Saved Resumes</TabsTrigger>
          <TabsTrigger value="jobs">Saved Jobs</TabsTrigger>
        </TabsList>

        {/* ANALYZER TAB */}
        <TabsContent value="analyzer">
          <Card>
            <CardHeader>
              <CardTitle>Resume Analyzer</CardTitle>
              <CardDescription>
                Paste a job description and your resume to evaluate match
                percentage, missing keywords, and get actionable tips.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Job Title</label>
                  <Input
                    placeholder="e.g., Data Scientist"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                  <label className="text-sm font-medium">
                    Job Description
                  </label>
                  <Textarea
                    className="min-h-40"
                    placeholder="Paste job description here..."
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                  />
                  <Input
                    placeholder="Job name (e.g., ML Engineer Role)"
                    value={jobName}
                    onChange={(e) => setJobName(e.target.value)}
                    className="text-xs"
                  />
                  <Button
                    onClick={handleSaveJob}
                    disabled={!jobDesc.trim() || !jobName.trim()}
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Save Job
                  </Button>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Resume</label>
                  <Textarea
                    className="min-h-64"
                    placeholder="Paste your resume text here..."
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                  />
                  <Input
                    placeholder="Resume name (e.g., Full Stack Resume)"
                    value={resumeName}
                    onChange={(e) => setResumeName(e.target.value)}
                    className="text-xs"
                  />
                  <Button
                    onClick={handleSaveResume}
                    disabled={!resume.trim() || !resumeName.trim()}
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Save Resume
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button onClick={handleAnalyze} disabled={busy}>
                  {busy ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing…
                    </>
                  ) : (
                    "Analyze"
                  )}
                </Button>
                <div className="text-sm text-muted-foreground">
                  {jobTitle ? `Target role: ${jobTitle}` : "Target role not set"}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg border bg-card">
                  <div className="text-sm text-muted-foreground">Match Score</div>
                  <div className="text-3xl font-semibold">
                    {analysis.score}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Based on keyword overlap with job description.
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-card md:col-span-2">
                  <div className="text-sm font-medium mb-2">
                    Missing Keywords
                  </div>
                  {analysis.missing.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No missing keywords detected.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {analysis.missing.slice(0, 20).map((kw) => (
                        <span
                          key={kw}
                          className="text-xs px-2 py-1 rounded-full border bg-muted"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-card">
                <div className="text-sm font-medium mb-2">Detected Skills</div>
                {extractedSkills.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No recognized skills detected in resume.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {extractedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-800 border border-green-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-lg border bg-card">
                <div className="text-sm font-medium mb-2">Improvement Tips</div>
                {suggestions.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No suggestions at this time.
                  </div>
                ) : (
                  <ul className="list-disc pl-6 text-sm leading-relaxed space-y-1">
                    {suggestions.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SAVED RESUMES */}
        <TabsContent value="resumes">
          <Card>
            <CardHeader>
              <CardTitle>Saved Resumes</CardTitle>
              <CardDescription>
                Manage and quickly load your saved resumes for analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedResumes.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No saved resumes yet. Save your first resume from the
                    Analyzer tab.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {savedResumes.map((savedResume) => (
                    <div
                      key={savedResume.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {savedResume.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Saved on {savedResume.createdAt}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleLoadResume(savedResume)}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Load
                        </Button>
                        <Button
                          onClick={() => handleDeleteResume(savedResume.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SAVED JOBS */}
        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Saved Jobs</CardTitle>
              <CardDescription>
                Keep track of job descriptions you want to analyze against.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedJobs.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No saved jobs yet. Save your first job from the Analyzer
                    tab.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {savedJobs.map((savedJob) => (
                    <div
                      key={savedJob.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {savedJob.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Saved on {savedJob.createdAt}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleLoadJob(savedJob)}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Load
                        </Button>
                        <Button
                          onClick={() => handleDeleteJob(savedJob.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
