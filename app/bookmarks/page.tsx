"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bookmark, Trash2 } from "lucide-react"

interface BookmarkedItem {
  id: string
  type: "company" | "interview" | "roadmap"
  title: string
  subtitle: string
  description: string
  date: string
  metadata?: Record<string, string>
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedItem[]>([
    {
      id: "1",
      type: "company",
      title: "Google",
      subtitle: "Full Stack",
      description: "Search, cloud, and AI technology leader",
      date: "2024-10-20",
      metadata: { location: "Mountain View, CA", employees: "190,000+" },
    },
    {
      id: "2",
      type: "interview",
      title: "Google - Software Engineer",
      subtitle: "Hard",
      description: "Had 4 rounds of interviews. First two were coding...",
      date: "2024-10-15",
      metadata: { author: "Alex Chen", difficulty: "Hard" },
    },
    {
      id: "3",
      type: "roadmap",
      title: "Software Engineer",
      subtitle: "12-18 months",
      description: "Full-stack development career path",
      date: "2024-10-18",
      metadata: { duration: "12-18 months", milestones: "4" },
    },
    {
      id: "4",
      type: "company",
      title: "OpenAI",
      subtitle: "Data Science",
      description: "AI safety and research",
      date: "2024-10-19",
      metadata: { location: "San Francisco, CA", employees: "500+" },
    },
    {
      id: "5",
      type: "interview",
      title: "Meta - Data Scientist",
      subtitle: "Hard",
      description: "3 rounds total. First round: SQL and statistics...",
      date: "2024-10-10",
      metadata: { author: "Sarah Johnson", difficulty: "Hard" },
    },
  ])

  const removeBookmark = (id: string) => {
    setBookmarks(bookmarks.filter((b) => b.id !== id))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "company":
        return "bg-blue-100 text-blue-800"
      case "interview":
        return "bg-purple-100 text-purple-800"
      case "roadmap":
        return "bg-green-100 text-green-800"
      default:
        return ""
    }
  }

  const filterByType = (type: string) => bookmarks.filter((b) => b.type === type)

  const BookmarkCard = ({ item }: { item: BookmarkedItem }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{item.subtitle}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeBookmark(item.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{item.description}</p>

        {item.metadata && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(item.metadata).map(([key, value]) => (
              <Badge key={key} variant="secondary" className="text-xs">
                {key}: {value}
              </Badge>
            ))}
          </div>
        )}

        <div className="text-xs text-muted-foreground pt-2 border-t">
          Bookmarked on {new Date(item.date).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Bookmark className="h-8 w-8" />
            My Bookmarks
          </h1>
          <p className="text-muted-foreground">Total bookmarks: {bookmarks.length}</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All ({bookmarks.length})</TabsTrigger>
            <TabsTrigger value="company">Companies ({filterByType("company").length})</TabsTrigger>
            <TabsTrigger value="interview">Interviews ({filterByType("interview").length})</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmaps ({filterByType("roadmap").length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {bookmarks.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No bookmarks yet. Start bookmarking companies, interviews, and roadmaps!
                </CardContent>
              </Card>
            ) : (
              bookmarks.map((item) => <BookmarkCard key={item.id} item={item} />)
            )}
          </TabsContent>

          <TabsContent value="company" className="space-y-4 mt-6">
            {filterByType("company").length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No bookmarked companies yet
                </CardContent>
              </Card>
            ) : (
              filterByType("company").map((item) => <BookmarkCard key={item.id} item={item} />)
            )}
          </TabsContent>

          <TabsContent value="interview" className="space-y-4 mt-6">
            {filterByType("interview").length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No bookmarked interviews yet
                </CardContent>
              </Card>
            ) : (
              filterByType("interview").map((item) => <BookmarkCard key={item.id} item={item} />)
            )}
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-4 mt-6">
            {filterByType("roadmap").length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">No bookmarked roadmaps yet</CardContent>
              </Card>
            ) : (
              filterByType("roadmap").map((item) => <BookmarkCard key={item.id} item={item} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
