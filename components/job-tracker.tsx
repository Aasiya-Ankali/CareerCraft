"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Trash2, Plus, Calendar, DollarSign, Building2, Briefcase, Tag } from "lucide-react"

interface JobApplication {
  id: string
  company: string
  position: string
  type: "Job" | "Internship"
  tags: ("Applied" | "Rejected" | "On Campus" | "Referral")[]
  appliedDate: string
  interviewDate?: string
  salary?: number
  description: string
  field: string
}

export default function JobTracker() {
  const [applications, setApplications] = useState<JobApplication[]>([
    {
      id: "1",
      company: "Google",
      position: "Senior Software Engineer",
      type: "Job",
      tags: ["Applied", "Referral"],
      appliedDate: "2025-10-15",
      interviewDate: "2025-11-05",
      salary: 250000,
      description: "First round passed, waiting for second round. Strong team fit.",
      field: "Full Stack",
    },
    {
      id: "2",
      company: "Meta",
      position: "Data Scientist Internship",
      type: "Internship",
      tags: ["Applied"],
      appliedDate: "2025-10-20",
      salary: 80000,
      description: "Applied through career portal. Interested in ML infrastructure.",
      field: "Data Science",
    },
    {
      id: "3",
      company: "OpenAI",
      position: "ML Engineer",
      type: "Job",
      tags: ["Applied", "On Campus"],
      appliedDate: "2025-10-10",
      interviewDate: "2025-11-08",
      salary: 300000,
      description: "Technical interview scheduled. Very excited about this opportunity.",
      field: "AI/ML",
    },
    {
      id: "4",
      company: "Stripe",
      position: "Backend Engineer",
      type: "Job",
      tags: ["Applied", "Referral"],
      appliedDate: "2025-09-25",
      salary: 270000,
      description: "Offer received, currently negotiating compensation package.",
      field: "Full Stack",
    },
    {
      id: "5",
      company: "Amazon",
      position: "DevOps Engineer Internship",
      type: "Internship",
      tags: ["Rejected"],
      appliedDate: "2025-10-01",
      description: "Not selected after initial screening. Needs more cloud experience.",
      field: "DevOps",
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    type: "Job" as "Job" | "Internship",
    tags: [] as ("Applied" | "Rejected" | "On Campus" | "Referral")[],
    appliedDate: new Date().toISOString().split("T")[0],
    interviewDate: "",
    salary: "",
    description: "",
    field: "",
  })

  const [filterType, setFilterType] = useState<"All" | "Job" | "Internship">("All")
  const [filterTag, setFilterTag] = useState<string>("All")

  const handleAddApplication = () => {
    if (formData.company && formData.position && formData.tags.length > 0) {
      const newApp: JobApplication = {
        id: Date.now().toString(),
        company: formData.company,
        position: formData.position,
        type: formData.type,
        tags: formData.tags,
        appliedDate: formData.appliedDate,
        interviewDate: formData.interviewDate || undefined,
        salary: formData.salary ? Number.parseInt(formData.salary) : undefined,
        description: formData.description,
        field: formData.field,
      }
      setApplications([...applications, newApp])
      setFormData({
        company: "",
        position: "",
        type: "Job",
        tags: [],
        appliedDate: new Date().toISOString().split("T")[0],
        interviewDate: "",
        salary: "",
        description: "",
        field: "",
      })
      setShowForm(false)
    }
  }

  const handleDeleteApplication = (id: string) => {
    setApplications(applications.filter((app) => app.id !== id))
  }

  const toggleTag = (tag: "Applied" | "Rejected" | "On Campus" | "Referral") => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }))
  }

  const tagColors: Record<string, string> = {
    Applied: "bg-blue-100 text-blue-800",
    Rejected: "bg-red-100 text-red-800",
    "On Campus": "bg-purple-100 text-purple-800",
    Referral: "bg-green-100 text-green-800",
  }

  const typeColors = {
    Job: "bg-slate-100 text-slate-800",
    Internship: "bg-orange-100 text-orange-800",
  }

  const filteredApplications = applications.filter((app) => {
    const typeMatch = filterType === "All" || app.type === filterType
    const tagMatch = filterTag === "All" || app.tags.includes(filterTag as any)
    return typeMatch && tagMatch
  })

  const statusStats = {
    Applied: applications.filter((a) => a.tags.includes("Applied")).length,
    Rejected: applications.filter((a) => a.tags.includes("Rejected")).length,
    OnCampus: applications.filter((a) => a.tags.includes("On Campus")).length,
    Referral: applications.filter((a) => a.tags.includes("Referral")).length,
  }

  const typeStats = {
    Jobs: applications.filter((a) => a.type === "Job").length,
    Internships: applications.filter((a) => a.type === "Internship").length,
  }

  const averageSalary =
    applications.filter((a) => a.salary).length > 0
      ? Math.round(
          applications.filter((a) => a.salary).reduce((sum, a) => sum + (a.salary || 0), 0) /
            applications.filter((a) => a.salary).length,
        )
      : 0

  const tagChartData = [
    { name: "Applied", value: statusStats.Applied },
    { name: "Rejected", value: statusStats.Rejected },
    { name: "On Campus", value: statusStats.OnCampus },
    { name: "Referral", value: statusStats.Referral },
  ]

  const typeChartData = [
    { name: "Jobs", value: typeStats.Jobs },
    { name: "Internships", value: typeStats.Internships },
  ]

  const timelineData = applications
    .sort((a, b) => new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime())
    .map((app, idx) => ({
      date: new Date(app.appliedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      applications: idx + 1,
    }))

  const COLORS = ["#3b82f6", "#ef4444", "#a855f7", "#22c55e"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job & Internship Tracker</h1>
          <p className="text-muted-foreground mt-1">Track your applications and monitor your job search progress</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Application
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Application</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Company name"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
              <Input
                placeholder="Position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
              <Input
                placeholder="Field (e.g., Full Stack, Data Science)"
                value={formData.field}
                onChange={(e) => setFormData({ ...formData, field: e.target.value })}
              />
              <select
                className="px-3 py-2 border rounded-md"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as "Job" | "Internship" })}
              >
                <option>Job</option>
                <option>Internship</option>
              </select>
              <Input
                type="date"
                value={formData.appliedDate}
                onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
              />
              <Input
                type="date"
                placeholder="Interview date"
                value={formData.interviewDate}
                onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Expected salary"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Application Tags</label>
              <div className="flex flex-wrap gap-2">
                {(["Applied", "Rejected", "On Campus", "Referral"] as const).map((tag) => (
                  <Button
                    key={tag}
                    variant={formData.tags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleTag(tag)}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                placeholder="Add notes about this application..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm min-h-20"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddApplication}>Save Application</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{typeStats.Jobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Internships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{typeStats.Internships}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(averageSalary / 1000).toFixed(0)}K</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Applications List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div>
              <label className="text-sm font-medium">Filter by Type:</label>
              <select
                className="px-3 py-1 border rounded-md text-sm ml-2"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
              >
                <option>All</option>
                <option>Job</option>
                <option>Internship</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Filter by Tag:</label>
              <select
                className="px-3 py-1 border rounded-md text-sm ml-2"
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
              >
                <option>All</option>
                <option>Applied</option>
                <option>Rejected</option>
                <option>On Campus</option>
                <option>Referral</option>
              </select>
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No applications found. Start tracking your job search!
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((app) => (
              <Card key={app.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold">{app.position}</h3>
                        <Badge className={typeColors[app.type]}>{app.type}</Badge>
                        {app.field && <Badge variant="outline">{app.field}</Badge>}
                      </div>

                      <div className="flex gap-2 mb-3 flex-wrap">
                        {app.tags.map((tag) => (
                          <Badge key={tag} className={tagColors[tag]} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          {app.company}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Applied: {new Date(app.appliedDate).toLocaleDateString()}
                        </div>
                        {app.interviewDate && (
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Interview: {new Date(app.interviewDate).toLocaleDateString()}
                          </div>
                        )}
                        {app.salary && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />${app.salary.toLocaleString()}
                          </div>
                        )}
                      </div>

                      {app.description && (
                        <div className="bg-muted p-3 rounded-md text-sm mt-2 mb-2">{app.description}</div>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteApplication(app.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Tags Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tagChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {tagChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job vs Internship</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={typeChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
