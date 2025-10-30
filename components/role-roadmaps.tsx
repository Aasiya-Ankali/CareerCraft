"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle } from "lucide-react"

interface Milestone {
  id: string
  title: string
  description: string
  duration: string
  skills: string[]
  resources: string[]
}

interface Roadmap {
  id: string
  role: string
  description: string
  duration: string
  milestones: Milestone[]
}

const roadmaps: Roadmap[] = [
  {
    id: "1",
    role: "Software Engineer",
    description: "Full-stack development career path",
    duration: "12-18 months",
    milestones: [
      {
        id: "m1",
        title: "Fundamentals",
        description: "Master core programming concepts and data structures",
        duration: "2-3 months",
        skills: ["Data Structures", "Algorithms", "OOP", "Design Patterns"],
        resources: ["LeetCode", "GeeksforGeeks", "System Design Primer"],
      },
      {
        id: "m2",
        title: "Web Development",
        description: "Learn frontend and backend technologies",
        duration: "3-4 months",
        skills: ["React/Vue", "Node.js", "Databases", "REST APIs"],
        resources: ["freeCodeCamp", "Udemy", "MDN Docs"],
      },
      {
        id: "m3",
        title: "System Design",
        description: "Understand scalable architecture and distributed systems",
        duration: "2-3 months",
        skills: ["Microservices", "Caching", "Load Balancing", "Message Queues"],
        resources: ["System Design Interview", "Designing Data-Intensive Applications"],
      },
      {
        id: "m4",
        title: "Interview Preparation",
        description: "Practice coding and system design interviews",
        duration: "2-3 months",
        skills: ["Problem Solving", "Communication", "Time Management"],
        resources: ["LeetCode Premium", "Mock Interviews", "Interview.io"],
      },
    ],
  },
  {
    id: "2",
    role: "Data Scientist",
    description: "Machine learning and data analysis career path",
    duration: "12-16 months",
    milestones: [
      {
        id: "m1",
        title: "Math & Statistics",
        description: "Build strong foundation in mathematics and statistics",
        duration: "2-3 months",
        skills: ["Linear Algebra", "Probability", "Statistics", "Calculus"],
        resources: ["3Blue1Brown", "StatQuest", "Khan Academy"],
      },
      {
        id: "m2",
        title: "Python & Data Manipulation",
        description: "Learn Python and data manipulation libraries",
        duration: "2-3 months",
        skills: ["Python", "Pandas", "NumPy", "SQL"],
        resources: ["DataCamp", "Kaggle", "Real Python"],
      },
      {
        id: "m3",
        title: "Machine Learning",
        description: "Master ML algorithms and techniques",
        duration: "3-4 months",
        skills: ["Supervised Learning", "Unsupervised Learning", "Deep Learning", "NLP"],
        resources: ["Andrew Ng's ML Course", "Fast.ai", "Coursera"],
      },
      {
        id: "m4",
        title: "Projects & Portfolio",
        description: "Build real-world projects and showcase your work",
        duration: "3-4 months",
        skills: ["End-to-end ML", "Model Deployment", "Communication"],
        resources: ["Kaggle Competitions", "GitHub", "Medium"],
      },
    ],
  },
  {
    id: "3",
    role: "DevOps Engineer",
    description: "Infrastructure and deployment career path",
    duration: "10-14 months",
    milestones: [
      {
        id: "m1",
        title: "Linux & Networking",
        description: "Master Linux systems and networking fundamentals",
        duration: "2-3 months",
        skills: ["Linux", "Bash", "Networking", "Security"],
        resources: ["Linux Academy", "TryHackMe", "Networking Fundamentals"],
      },
      {
        id: "m2",
        title: "Containerization",
        description: "Learn Docker and container orchestration",
        duration: "2-3 months",
        skills: ["Docker", "Kubernetes", "Container Registry"],
        resources: ["Docker Docs", "Kubernetes.io", "Linux Academy"],
      },
      {
        id: "m3",
        title: "Cloud Platforms",
        description: "Master AWS, GCP, or Azure",
        duration: "3-4 months",
        skills: ["EC2", "S3", "RDS", "Lambda", "CloudFormation"],
        resources: ["AWS Training", "A Cloud Guru", "Linux Academy"],
      },
      {
        id: "m4",
        title: "CI/CD & Monitoring",
        description: "Implement automation and monitoring solutions",
        duration: "2-3 months",
        skills: ["Jenkins", "GitLab CI", "Prometheus", "ELK Stack"],
        resources: ["Jenkins Docs", "Prometheus Docs", "Udemy"],
      },
    ],
  },
  {
    id: "4",
    role: "Product Manager",
    description: "Product management career path",
    duration: "8-12 months",
    milestones: [
      {
        id: "m1",
        title: "Product Fundamentals",
        description: "Understand product management principles",
        duration: "1-2 months",
        skills: ["Product Strategy", "User Research", "Market Analysis"],
        resources: ["Inspired by Marty Cagan", "Cracking the PM Interview"],
      },
      {
        id: "m2",
        title: "Analytics & Metrics",
        description: "Learn data-driven decision making",
        duration: "2-3 months",
        skills: ["SQL", "Analytics", "A/B Testing", "Metrics"],
        resources: ["Amplitude", "Mixpanel", "Analytics Courses"],
      },
      {
        id: "m3",
        title: "Design & UX",
        description: "Collaborate with design and understand UX",
        duration: "2-3 months",
        skills: ["Design Thinking", "Wireframing", "User Testing"],
        resources: ["Design of Everyday Things", "Nielsen Norman Group"],
      },
      {
        id: "m4",
        title: "Leadership & Communication",
        description: "Develop leadership and stakeholder management",
        duration: "2-3 months",
        skills: ["Communication", "Negotiation", "Leadership"],
        resources: ["Radical Candor", "Crucial Conversations"],
      },
    ],
  },
  {
    id: "5",
    role: "Cloud Architect",
    description: "Cloud infrastructure and architecture career path",
    duration: "14-18 months",
    milestones: [
      {
        id: "m1",
        title: "Cloud Fundamentals",
        description: "Understand cloud computing concepts and services",
        duration: "2-3 months",
        skills: ["Cloud Concepts", "Networking", "Security", "Compliance"],
        resources: ["AWS Fundamentals", "Azure Basics", "Cloud Computing Concepts"],
      },
      {
        id: "m2",
        title: "AWS Deep Dive",
        description: "Master AWS services and architecture",
        duration: "3-4 months",
        skills: ["EC2", "S3", "RDS", "VPC", "IAM", "CloudFormation"],
        resources: ["AWS Solutions Architect", "A Cloud Guru", "Linux Academy"],
      },
      {
        id: "m3",
        title: "Multi-Cloud & Hybrid",
        description: "Learn Azure, GCP, and hybrid architectures",
        duration: "3-4 months",
        skills: ["Azure Services", "GCP Services", "Hybrid Cloud", "Migration"],
        resources: ["Azure Architect", "GCP Professional", "Cloud Migration Guides"],
      },
      {
        id: "m4",
        title: "Advanced Architecture",
        description: "Design enterprise-scale solutions",
        duration: "3-4 months",
        skills: ["Disaster Recovery", "High Availability", "Cost Optimization", "Security"],
        resources: ["AWS Well-Architected Framework", "Case Studies", "Architecture Patterns"],
      },
    ],
  },
  {
    id: "6",
    role: "Frontend Engineer",
    description: "Modern web frontend development career path",
    duration: "10-14 months",
    milestones: [
      {
        id: "m1",
        title: "Web Fundamentals",
        description: "Master HTML, CSS, and JavaScript basics",
        duration: "2-3 months",
        skills: ["HTML5", "CSS3", "JavaScript ES6+", "DOM"],
        resources: ["MDN Web Docs", "freeCodeCamp", "JavaScript.info"],
      },
      {
        id: "m2",
        title: "React Mastery",
        description: "Deep dive into React and component architecture",
        duration: "3-4 months",
        skills: ["React Hooks", "State Management", "Performance", "Testing"],
        resources: ["React Docs", "Epic React", "React Query"],
      },
      {
        id: "m3",
        title: "Advanced Tooling",
        description: "Learn build tools and development workflows",
        duration: "2-3 months",
        skills: ["Webpack", "Vite", "TypeScript", "Testing Libraries"],
        resources: ["Webpack Docs", "Vite Guide", "TypeScript Handbook"],
      },
      {
        id: "m4",
        title: "Performance & UX",
        description: "Optimize performance and user experience",
        duration: "2-3 months",
        skills: ["Web Performance", "Accessibility", "SEO", "UX Design"],
        resources: ["Web.dev", "Lighthouse", "A11y Project"],
      },
    ],
  },
  {
    id: "7",
    role: "Security Engineer",
    description: "Cybersecurity and application security career path",
    duration: "12-16 months",
    milestones: [
      {
        id: "m1",
        title: "Security Fundamentals",
        description: "Learn core security concepts and principles",
        duration: "2-3 months",
        skills: ["Cryptography", "Authentication", "Authorization", "Networking"],
        resources: ["Security+ Course", "OWASP Top 10", "Cybrary"],
      },
      {
        id: "m2",
        title: "Application Security",
        description: "Master secure coding and vulnerability assessment",
        duration: "3-4 months",
        skills: ["OWASP", "Penetration Testing", "Code Review", "Vulnerability Analysis"],
        resources: ["OWASP Testing Guide", "HackTheBox", "TryHackMe"],
      },
      {
        id: "m3",
        title: "Infrastructure Security",
        description: "Secure cloud and network infrastructure",
        duration: "3-4 months",
        skills: ["Cloud Security", "Network Security", "IAM", "Compliance"],
        resources: ["AWS Security", "Azure Security", "Cloud Security Alliance"],
      },
      {
        id: "m4",
        title: "Advanced Topics",
        description: "Incident response and security architecture",
        duration: "2-3 months",
        skills: ["Incident Response", "Threat Modeling", "Security Architecture"],
        resources: ["SANS Courses", "Security Architecture Patterns", "Case Studies"],
      },
    ],
  },
]

export default function RoleRoadmaps() {
  const [selectedRoadmap, setSelectedRoadmap] = useState<string | null>(null)
  const [completedMilestones, setCompletedMilestones] = useState<Set<string>>(new Set())

  const toggleMilestone = (milestoneId: string) => {
    const newCompleted = new Set(completedMilestones)
    if (newCompleted.has(milestoneId)) {
      newCompleted.delete(milestoneId)
    } else {
      newCompleted.add(milestoneId)
    }
    setCompletedMilestones(newCompleted)
  }

  const currentRoadmap = roadmaps.find((r) => r.id === selectedRoadmap)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Career Roadmaps</h1>
        <p className="text-muted-foreground">Structured learning paths for different tech roles</p>
      </div>

      {!selectedRoadmap ? (
        <div className="grid md:grid-cols-2 gap-4">
          {roadmaps.map((roadmap) => (
            <Card
              key={roadmap.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedRoadmap(roadmap.id)}
            >
              <CardHeader>
                <CardTitle>{roadmap.role}</CardTitle>
                <CardDescription>{roadmap.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Duration: {roadmap.duration}</p>
                  <p className="text-sm text-muted-foreground">Milestones: {roadmap.milestones.length}</p>
                  <Button className="w-full mt-4">View Roadmap</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <Button variant="outline" onClick={() => setSelectedRoadmap(null)}>
            ← Back to Roadmaps
          </Button>

          {currentRoadmap && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">{currentRoadmap.role}</h2>
                <p className="text-muted-foreground mt-1">{currentRoadmap.description}</p>
                <p className="text-sm text-muted-foreground mt-2">Total Duration: {currentRoadmap.duration}</p>
              </div>

              <div className="space-y-4">
                {currentRoadmap.milestones.map((milestone, index) => (
                  <Card key={milestone.id} className={completedMilestones.has(milestone.id) ? "opacity-60" : ""}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <button onClick={() => toggleMilestone(milestone.id)} className="mt-1 flex-shrink-0">
                          {completedMilestones.has(milestone.id) ? (
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-muted-foreground">Phase {index + 1}</span>
                            <CardTitle className="text-lg">{milestone.title}</CardTitle>
                          </div>
                          <CardDescription className="mt-1">{milestone.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Duration: {milestone.duration}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Skills to Learn:</p>
                        <div className="flex flex-wrap gap-2">
                          {milestone.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Recommended Resources:</p>
                        <ul className="space-y-1">
                          {milestone.resources.map((resource) => (
                            <li key={resource} className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className="text-blue-500">•</span>
                              {resource}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
