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
import { Trash2, Plus, Calendar, DollarSign, Building2, Briefcase } from "lucide-react"

interface JobApplication {
  id: string
  company: string
  position: string
  status: "Applied" | "Interview" | "Offer" | "Rejected"
  appliedDate: string
  interviewDate?: string
  salary?: number
  notes: string
  field: string
}

export default function JobTracker() {
  const [applications, setApplications] = useState<JobApplication[]>([
    {
      id: "1",
      company: "Google",
      position: "Senior Software Engineer",
      status: "Interview",
      appliedDate: "2025-10-15",
      interviewDate: "2025-11-05",
      salary: 250000,
      notes: "First round passed, waiting for second round",
      field: "Full Stack",
    },
    {
      id: "2",
      company: "Meta",
      position: "Data Scientist",
      status: "Applied",
      appliedDate: "2025-10-20",
      salary: 280000,
      notes: "Applied through referral",
      field: "Data Science",
    },
    {
      id: "3",
      company: "OpenAI",
      position: "ML Engineer",
      status: "Interview",
      appliedDate: "2025-10-10",
      interviewDate: "2025-11-08",
      salary: 300000,
      notes: "Technical interview scheduled",
      field: "AI/ML",
    },
    {
      id: "4",
      company: "Stripe",
      position: "Backend Engineer",
      status: "Offer",
      appliedDate: "2025-09-25",
      salary: 270000,
      notes: "Offer received, negotiating",
      field: "Full Stack",
    },
    {
      id: "5",
      company: "Amazon",
      position: "DevOps Engineer",
      status: "Rejected",
      appliedDate: "2025-10-01",
      notes: "Not selected after initial screening",
      field: "DevOps",
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    status: "Applied" as const,
    appliedDate: new Date().toISOString().split("T")[0],
    interviewDate: "",
    salary: "",
    notes: "",
    field: "",
  })

  const handleAddApplication = () => {
    if (formData.company && formData.position) {
      const newApp: JobApplication = {
        id: Date.now().toString(),
        company: formData.company,
        position: formData.position,
        status: formData.status,
        appliedDate: formData.appliedDate,
        interviewDate: formData.interviewDate || undefined,
        salary: formData.salary ? Number.parseInt(formData.salary) : undefined,
        notes: formData.notes,
        field: formData.field,
      }
      setApplications([...applications, newApp])
      setFormData({
        company: "",
        position: "",
        status: "Applied",
        appliedDate: new Date().toISOString().split("T")[0],
        interviewDate: "",
        salary: "",
        notes: "",
        field: "",
      })
      setShowForm(false)
    }
  }

  const handleDeleteApplication = (id: string) => {
    setApplications(applications.filter((app) => app.id !== id))
  }

  const statusColors = {
    Applied: "bg-blue-100 text-blue-800",
    Interview: "bg-yellow-100 text-yellow-800",
    Offer: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  }

  const statusStats = {
    Applied: applications.filter((a) => a.status === "Applied").length,
    Interview: applications.filter((a) => a.status === "Interview").length,
    Offer: applications.filter((a) => a.status === "Offer").length,
    Rejected: applications.filter((a) => a.status === "Rejected").length,
  }

  const conversionRate =
    applications.length > 0 ? ((statusStats.Interview / applications.length) * 100).toFixed(1) : "0"

  const averageSalary =
    applications.filter((a) => a.salary).length > 0
      ? Math.round(
          applications.filter((a) => a.salary).reduce((sum, a) => sum + (a.salary || 0), 0) /
            applications.filter((a) => a.salary).length,
        )
      : 0

  const chartData = [
    { name: "Applied", value: statusStats.Applied },
    { name: "Interview", value: statusStats.Interview },
    { name: "Offer", value: statusStats.Offer },
    { name: "Rejected", value: statusStats.Rejected },
  ]

  const timelineData = applications
    .sort((a, b) => new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime())
    .map((app, idx) => ({
      date: new Date(app.appliedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      applications: idx + 1,
    }))

  const COLORS = ["#3b82f6", "#eab308", "#22c55e", "#ef4444"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Application Tracker</h1>
          <p className="text-muted-foreground mt-1">Track your job search journey and monitor progress</p>
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
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
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
              <Input
                placeholder="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Interview Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusStats.Offer}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Applications List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {applications.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No applications yet. Start tracking your job search!
              </CardContent>
            </Card>
          ) : (
            applications.map((app) => (
              <Card key={app.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{app.position}</h3>
                        <Badge className={statusColors[app.status]}>{app.status}</Badge>
                        {app.field && <Badge variant="outline">{app.field}</Badge>}
                      </div>
                      <div className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
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
                      {app.notes && <p className="mt-3 text-sm">{app.notes}</p>}
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
                <CardTitle>Application Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
