"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Bookmark, ThumbsUp, MessageCircle } from "lucide-react"

interface Experience {
  id: string
  company: string
  role: string
  difficulty: "Easy" | "Medium" | "Hard"
  date: string
  author: string
  content: string
  likes: number
  comments: number
}

const experiences: Experience[] = [
  {
    id: "1",
    company: "Google",
    role: "Software Engineer",
    difficulty: "Hard",
    date: "2024-10-15",
    author: "Alex Chen",
    content:
      "Had 4 rounds of interviews spanning 2 weeks. First two were coding (LeetCode medium/hard) focusing on array manipulation, dynamic programming, and graph algorithms. Key questions included implementing an LRU cache and designing a rate limiter. Third round was system design for a distributed cache system where we discussed CAP theorem tradeoffs, consistency patterns, and failover strategies. Fourth round was behavioral with emphasis on leadership and conflict resolution. They focus heavily on problem-solving approach and clear communication. Prep tip: Practice explaining your thought process clearly while coding, they value communication as much as technical skills. The whole process took about 4-5 weeks from initial contact to offer.",
    likes: 245,
    comments: 18,
  },
  {
    id: "2",
    company: "Meta",
    role: "Data Scientist",
    difficulty: "Hard",
    date: "2024-10-10",
    author: "Sarah Johnson",
    content:
      "3 rounds total over 3 weeks. First round: In-depth SQL (window functions, optimization) and statistics questions (A/B testing, hypothesis testing, Bayesian analysis). Had to analyze a real dataset and present findings. Second round: ML system design for a social media recommendation system - covered feature engineering, model selection, A/B testing framework, and scaling strategies. Final round: behavioral and culture fit, with strong focus on Meta's values and impact-driven culture. They really care about your ability to explain complex concepts simply. Pro tip: Prepare examples of working with ambiguous problems and driving data-driven decisions. Study their tech blog posts - they often ask about their published case studies. Interview process lasted about 5 weeks total.",
    likes: 189,
    comments: 12,
  },
  {
    id: "3",
    company: "Stripe",
    role: "Full Stack Engineer",
    difficulty: "Medium",
    date: "2024-10-05",
    author: "Mike Rodriguez",
    content:
      "2 technical rounds + 1 behavioral spread over 2 weeks. First was a take-home project implementing a simplified payment system API with proper error handling, validation, and tests. Tech stack: Node.js/TypeScript, had 5 days to complete. Second round was a 2-hour live coding session extending the take-home project - added authentication, rate limiting, and monitoring. Focus on code organization, API design, and testing practices. Final round was team fit and technical deep dive into past projects. They value clean code, thorough testing, and API design skills. Very friendly team! Tips: Study their API docs and engineering blog. Strong emphasis on error handling and edge cases. Process took 3 weeks from application to offer.",
    likes: 156,
    comments: 9,
  },
  {
    id: "4",
    company: "OpenAI",
    role: "ML Engineer",
    difficulty: "Hard",
    date: "2024-09-28",
    author: "Emma Wilson",
    content:
      "Intense process with 5 rounds over 3 weeks. Started with a technical screen covering ML fundamentals and coding (Python/PyTorch). Second round was deep dive into transformers architecture, attention mechanisms, and optimization techniques. Third round focused on training at scale - distributed training, mixed precision, gradient accumulation. Fourth round was research discussion - had to present a recent paper and propose improvements. Final round was cross-functional team fit. They ask about your research interests, paper implementation experience, and how you stay updated with the field. Very research-focused. Key prep areas: transformer architecture details, scaling laws, recent LLM papers. Tip: Be ready to discuss limitations of current approaches and potential solutions. Strong focus on practical implementation knowledge, not just theory. Total process: 6 weeks.",
    likes: 312,
    comments: 24,
  },
  {
    id: "5",
    company: "Polygon",
    role: "Smart Contract Developer",
    difficulty: "Medium",
    date: "2024-09-20",
    author: "David Park",
    content:
      "3 rounds over 2 weeks. First round: Solidity coding challenge implementing a yield farming protocol with proper security checks and events. Heavy focus on gas optimization and security best practices. Second round: System design for a decentralized lending protocol - covered liquidity pools, oracle integration, risk parameters, and upgradeability patterns. Final round: Culture fit and technical discussion about Polygon's scaling solutions. They value security awareness, gas optimization skills, and deep understanding of EVM. Great team working on scaling Ethereum! Key prep areas: Study common DeFi vulnerabilities, gas optimization techniques, and Polygon's tech stack. Tips: Understand their scaling solutions (PoS, zkEVM) and latest research. Process took 4 weeks total including final offer negotiation.",
    likes: 198,
    comments: 15,
  },
  {
    id: "6",
    company: "Apple",
    role: "iOS Engineer",
    difficulty: "Hard",
    date: "2024-10-12",
    author: "James Liu",
    content:
      "4 intensive rounds over 3 weeks. First round: Swift fundamentals - deep dive into protocols, generics, concurrency (async/await), and memory management. Second round: iOS architecture - had to refactor a sample app using modern patterns (MVVM, Combine, SwiftUI). Third round: System design focusing on a large-scale media streaming app - covered caching strategies, offline support, and performance optimization. Final round: Behavioral and technical deep dive into past projects. They focus heavily on performance optimization, memory management, and user experience. Very thorough technical assessment with emphasis on real-world problem solving. Key prep areas: Modern Swift features, iOS performance profiling tools, Apple's Human Interface Guidelines. Tips: Study their WWDC sessions, focus on writing testable code. The process is rigorous but well-organized. Total time from first contact to offer: 5 weeks.",
    likes: 267,
    comments: 21,
  },
  {
    id: "7",
    company: "Microsoft",
    role: "Cloud Solutions Architect",
    difficulty: "Medium",
    date: "2024-10-08",
    author: "Lisa Anderson",
    content:
      "3 technical rounds plus behavioral spread over 2 weeks. First round: Deep dive into Azure services architecture - covered networking, security, identity management, and cost optimization. Had to design a multi-region disaster recovery solution. Second round: Real-world case study on migrating a monolithic .NET application to microservices using Azure Kubernetes Service and Azure Functions. Discussed CI/CD pipelines and monitoring strategies. Third round: Architecture design for a global SaaS platform - focus on scalability, compliance, and cost optimization. Final round: Leadership scenarios and customer communication skills. They value business acumen alongside technical skills. Key prep areas: Azure Well-Architected Framework, cost optimization strategies, and latest Azure services. Tips: Study their customer case studies and solution architectures. Total process: 4 weeks including offer negotiation.",
    likes: 178,
    comments: 14,
  },
  {
    id: "8",
    company: "Amazon",
    role: "Backend Engineer",
    difficulty: "Hard",
    date: "2024-10-01",
    author: "Robert Kim",
    content:
      "5 rounds total over 4 weeks. Online assessment: 2 LeetCode-style questions (medium/hard) focusing on optimization. First technical round: System design for a notification service handling millions of users - covered event processing, fan-out strategies, and failure handling. Second round: Coding interview focusing on concurrency and distributed algorithms. Third round: Architecture deep dive - designed a shopping cart service with eventual consistency. Final round: Bar raiser focusing on Amazon's Leadership Principles. Heavy emphasis on scalability and distributed systems design. They dig deep into your experience with high-traffic systems and past technical decisions. Key prep: Study their leadership principles thoroughly - every answer should align with these. Focus on scalability, consistency patterns, and operational excellence. Tips: Always discuss trade-offs and have metrics to back your decisions. Process took 6 weeks total.",
    likes: 334,
    comments: 28,
  },
  {
    id: "9",
    company: "Hugging Face",
    role: "ML Engineer",
    difficulty: "Medium",
    date: "2024-09-25",
    author: "Nina Patel",
    content:
      "3 rounds over 2 weeks. First round: Comprehensive NLP fundamentals - covered tokenization, embeddings, attention mechanisms, and recent transformer variants. Deep dive into their libraries (transformers, datasets, evaluate). Second round: Technical implementation - had to debug and optimize a transformer model, implement custom attention layers, and discuss training efficiency. Take-home project involved building a fine-tuning pipeline with proper evaluation metrics. Final round: Team collaboration and open-source contribution discussion. They deeply care about your understanding of open-source development and community contribution. Key prep areas: Study their libraries' implementation details, recent papers they've implemented, and contribution guidelines. Tips: Show enthusiasm for open source, have examples of your contributions ready. Very collaborative team and great culture fit interview. Process took about 3-4 weeks total.",
    likes: 212,
    comments: 16,
  },
  {
    id: "10",
    company: "Anthropic",
    role: "AI Safety Researcher",
    difficulty: "Hard",
    date: "2024-09-18",
    author: "Dr. Marcus Chen",
    content:
      "Research-focused interview with 4 intensive rounds over 3 weeks. First round: Technical deep dive into AI alignment theory - discussed reward modeling, RLHF, and scalable oversight. Second round: Research presentation on a recent paper in AI safety, followed by rigorous Q&A about methodology and potential improvements. Third round: Practical exercise on interpretability methods - analyzing and explaining model behaviors, proposing novel measurement techniques. Final round: Cross-team collaboration and research direction discussion. They thoroughly assess your understanding of AI safety concerns and ability to work on novel problems. Key areas: Constitutional AI, interpretability methods, scalable oversight, and robustness metrics. Tips: Stay updated with their research blog and technical reports. Very intellectually rigorous process. Bring novel ideas and be ready to defend them. Total time: 5 weeks including final discussions.",
    likes: 289,
    comments: 22,
  },
  {
    id: "11",
    company: "Uniswap",
    role: "Smart Contract Developer",
    difficulty: "Hard",
    date: "2024-09-15",
    author: "Crypto Dev",
    content:
      "3 intense rounds spread over 2 weeks. First round: Deep dive into Solidity and EVM - covered assembly optimization, storage patterns, and proxy patterns. Had to optimize a complex DeFi contract for gas efficiency while maintaining security. Second round: Protocol design and security - analyzed various DeFi exploits, designed secure lending protocols, and discussed oracle solutions. Final round: Live coding and architecture - implemented a simplified AMM with proper security checks and events. Heavy focus on gas optimization, MEV protection, and common vulnerabilities. They extensively test your understanding of AMM mechanics, liquidity pools, and protocol security. Very technical team! Key prep: Study their protocol code, recent DeFi exploits, and gas optimization techniques. Tips: Practice with Hardhat and Foundry, understand their v3 architecture deeply. Process took 3 weeks total.",
    likes: 245,
    comments: 19,
  },
  {
    id: "12",
    company: "Tesla",
    role: "Embedded Systems Engineer",
    difficulty: "Hard",
    date: "2024-09-10",
    author: "Alex Rodriguez",
    content:
      "4 rigorous rounds over 3 weeks. First round: C/C++ fundamentals - deep dive into memory management, real-time programming, and MISRA C guidelines. Heavy focus on embedded systems concepts like interrupts, DMA, and RTOS. Second round: Vehicle software architecture - discussed CAN bus protocols, sensor fusion, and fault tolerance mechanisms. Had to design a safety-critical system with redundancy. Third round: Live coding - implemented a real-time task scheduler with proper priority management and deadlock prevention. Final round: System integration - covered hardware-software interfaces, debugging techniques, and performance optimization. Key prep areas: AUTOSAR standards, functional safety (ISO 26262), and real-time systems design. Tips: Understanding their Autopilot architecture and safety mechanisms is crucial. Very thorough on safety-critical code practices. Total process: 5 weeks.",
    likes: 198,
    comments: 17,
  },
  {
    id: "13",
    company: "Databricks",
    role: "Data Engineer",
    difficulty: "Medium",
    date: "2024-09-05",
    author: "Sarah Lee",
    content:
      "3 comprehensive rounds over 2 weeks. First round: Advanced SQL and data modeling - covered complex window functions, query optimization, and dimensional modeling. Had to design a data warehouse schema for a multi-tenant SaaS application. Second round: Deep dive into Spark architecture - discussed execution plans, memory tuning, and performance optimization. Focused heavily on Delta Lake features and best practices. Take-home project involved building an end-to-end data pipeline using Spark and Delta Lake - had to handle late-arriving data and implement SCD Type 2. Final round: System design for a real-time analytics platform - covered streaming architectures, monitoring, and cost optimization. They value practical experience with big data tools and understanding of performance trade-offs. Very friendly and collaborative process! Key prep: Study their tech blogs, understand Delta Lake internals, and Spark optimization techniques. Process took 4 weeks including project review.",
    likes: 167,
    comments: 11,
  },
  {
    id: "14",
    company: "Aave",
    role: "Protocol Engineer",
    difficulty: "Hard",
    date: "2024-08-28",
    author: "Blockchain Dev",
    content:
      "4 intense rounds over 3 weeks focusing on DeFi expertise. First round: Protocol architecture - deep dive into lending mechanisms, interest rate models, and liquidation strategies. Had to analyze various attack vectors and propose solutions. Second round: Smart contract security - covered reentrancy protection, flash loan defense, and access control patterns. Implemented a secure borrowing function with proper checks. Third round: Economic modeling - discussed risk parameters, optimal utilization rates, and incentive mechanisms. Had to design liquidation incentives that remain effective in volatile markets. Final round: System design and integration - covered oracle implementations, governance mechanisms, and upgrade patterns. Very specialized role requiring deep DeFi knowledge. Key prep: Study their protocol documentation thoroughly, understand their risk management approach, and recent protocol improvements. Tips: Focus on their unique GHO stablecoin mechanism and safety modules. Process took 5 weeks total.",
    likes: 223,
    comments: 18,
  },
  {
    id: "15",
    company: "DeepMind",
    role: "Research Scientist",
    difficulty: "Hard",
    date: "2024-08-20",
    author: "Dr. Priya Sharma",
    content:
      "5 rounds of intense technical and research discussions spread over 4 weeks. First round: Research presentation - had to present a significant paper/project and defend methodological choices. Second round: Technical deep dive into reinforcement learning - covered MARL, offline RL, and sample efficiency improvements. Third round: Neural architecture discussion - focused on attention mechanisms, neural scaling laws, and novel architectures. Fourth round: Practical implementation - discussed large-scale training infrastructure, distributed algorithms, and debugging approaches. Final round: Research vision and collaboration - presented novel research directions and potential breakthrough areas. They thoroughly evaluate your research background, mathematical foundations, and ability to work on cutting-edge problems. Key prep: Study their recent papers, especially in your area of expertise. Be ready to propose novel approaches to existing problems. Tips: Show both theoretical depth and practical implementation skills. Having published research is a big plus. Process took 6 weeks including final research proposal discussion.",
    likes: 301,
    comments: 25,
  },
]

const difficulties = ["All", "Easy", "Medium", "Hard"]

export default function InterviewExperiences() {
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set())

  const filteredExperiences = experiences.filter((exp) => {
    const matchesDifficulty = selectedDifficulty === "All" || exp.difficulty === selectedDifficulty
    const matchesSearch =
      exp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.role.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDifficulty && matchesSearch
  })

  const toggleBookmark = (id: string) => {
    const newBookmarked = new Set(bookmarked)
    if (newBookmarked.has(id)) {
      newBookmarked.delete(id)
    } else {
      newBookmarked.add(id)
    }
    setBookmarked(newBookmarked)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Interview Experiences</h1>
        <p className="text-muted-foreground">Learn from real interview experiences shared by candidates</p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Search</label>
          <Input
            placeholder="Search by company or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Filter by Difficulty</label>
          <div className="flex gap-2 flex-wrap">
            {difficulties.map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? "default" : "outline"}
                onClick={() => setSelectedDifficulty(difficulty)}
                size="sm"
              >
                {difficulty}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Experiences List */}
      <div className="space-y-4">
        {filteredExperiences.map((exp) => (
          <Card key={exp.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{exp.company}</CardTitle>
                    <Badge className={getDifficultyColor(exp.difficulty)}>{exp.difficulty}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{exp.role}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleBookmark(exp.id)}
                  className={bookmarked.has(exp.id) ? "text-yellow-500" : ""}
                >
                  <Bookmark className="h-4 w-4" fill={bookmarked.has(exp.id) ? "currentColor" : "none"} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed">{exp.content}</p>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{exp.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{exp.comments}</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  By {exp.author} • {new Date(exp.date).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExperiences.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No experiences found matching your criteria
          </CardContent>
        </Card>
      )}
    </div>
  )
}
