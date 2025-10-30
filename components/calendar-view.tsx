"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, X, Plus } from "lucide-react"
import { toast } from "sonner"

type Task = {
  id: string
  title: string
  notes?: string
  completed: boolean
  createdAt: number
  completedAt?: number
  priority?: "low" | "medium" | "high"
  deadline?: string | undefined
  group?: string
  estimatedTime?: number
  timeSpent?: number
  isTracking?: boolean
  startTime?: number
  recurrence?: "none" | "daily" | "weekly" | "monthly"
  reminder?: string | undefined
}

interface CalendarViewProps {
  tasks: Task[]
  onAddTask: (
    title: string,
    notes?: string,
    priority?: Task["priority"],
    deadline?: string,
    group?: string,
    estimatedTime?: number,
    recurrence?: Task["recurrence"],
    reminder?: string,
  ) => void
  onToggleTask: (id: string) => void
  onRemoveTask: (id: string) => void
}

function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

function getFirstDayOfMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString()
}

export default function CalendarView({ tasks, onAddTask, onToggleTask, onRemoveTask }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showAddTask, setShowAddTask] = useState(false)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskNotes, setTaskNotes] = useState("")
  const [taskPriority, setTaskPriority] = useState<Task["priority"]>("low")
  const [taskGroup, setTaskGroup] = useState("General")
  const [taskEstimatedTime, setTaskEstimatedTime] = useState("")

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const getTasksForDate = (date: Date): Task[] => {
    return tasks.filter((task) => {
      if (task.deadline) {
        return isSameDay(new Date(task.deadline), date)
      }
      return false
    })
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleAddTaskForDate = () => {
    if (!selectedDate || !taskTitle.trim()) {
      toast.error("Please select a date and enter a task title")
      return
    }

    onAddTask(
      taskTitle.trim(),
      taskNotes.trim() || undefined,
      taskPriority,
      selectedDate.toISOString().slice(0, 10),
      taskGroup.trim() || "General",
      taskEstimatedTime ? Number(taskEstimatedTime) : undefined,
      "none",
      undefined,
    )

    setTaskTitle("")
    setTaskNotes("")
    setTaskPriority("low")
    setTaskGroup("General")
    setTaskEstimatedTime("")
    setShowAddTask(false)
  }

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const calendarDays = []

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Calendar View</CardTitle>
          <CardDescription>Click on a date to add or view tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="sm" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">{monthName}</h2>
            <Button variant="outline" size="sm" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Day Labels */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayLabels.map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((date, idx) => {
              if (!date) {
                return <div key={`empty-${idx}`} className="aspect-square" />
              }

              const dayTasks = getTasksForDate(date)
              const isSelected = selectedDate && isSameDay(date, selectedDate)
              const isToday = isSameDay(date, new Date())
              const completedCount = dayTasks.filter((t) => t.completed).length

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`aspect-square p-2 rounded-lg border-2 transition-all text-left flex flex-col ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : isToday
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                        : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className={`text-sm font-semibold ${isToday ? "text-blue-600 dark:text-blue-400" : ""}`}>
                    {date.getDate()}
                  </div>
                  {dayTasks.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {completedCount}/{dayTasks.length} done
                    </div>
                  )}
                  {dayTasks.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {dayTasks.slice(0, 2).map((task) => (
                        <div
                          key={task.id}
                          className={`w-1.5 h-1.5 rounded-full ${task.completed ? "bg-green-500" : "bg-orange-500"}`}
                        />
                      ))}
                      {dayTasks.length > 2 && (
                        <div className="text-xs text-muted-foreground">+{dayTasks.length - 2}</div>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Tasks */}
      {selectedDate && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>
                {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </CardTitle>
              <CardDescription>
                {getTasksForDate(selectedDate).length} task{getTasksForDate(selectedDate).length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() => {
                setShowAddTask(!showAddTask)
                if (showAddTask) {
                  setTaskTitle("")
                  setTaskNotes("")
                  setTaskPriority("low")
                  setTaskGroup("General")
                  setTaskEstimatedTime("")
                }
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Task Form */}
            {showAddTask && (
              <div className="border rounded-lg p-4 bg-muted/50 space-y-3">
                <Input
                  placeholder="Task title..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTaskForDate()}
                />
                <Textarea
                  placeholder="Notes (optional)..."
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                  className="min-h-20"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    className="border rounded-md px-2 py-1 bg-background text-sm"
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as Task["priority"])}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <Input
                    placeholder="Group/Category"
                    value={taskGroup}
                    onChange={(e) => setTaskGroup(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <Input
                  placeholder="Est. time (min)"
                  type="number"
                  value={taskEstimatedTime}
                  onChange={(e) => setTaskEstimatedTime(e.target.value)}
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddTaskForDate} className="flex-1">
                    Add Task
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowAddTask(false)
                      setTaskTitle("")
                      setTaskNotes("")
                      setTaskPriority("low")
                      setTaskGroup("General")
                      setTaskEstimatedTime("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Tasks List */}
            <div className="space-y-2">
              {getTasksForDate(selectedDate).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No tasks for this date. Add one to get started!
                </p>
              ) : (
                getTasksForDate(selectedDate).map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      task.completed ? "bg-muted/50 opacity-60" : "bg-card"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => onToggleTask(task.id)}
                      className="mt-1 w-4 h-4 rounded cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-medium ${task.completed ? "line-through" : ""}`}>{task.title}</span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            task.priority === "high"
                              ? "bg-red-500 text-white border-red-500"
                              : task.priority === "medium"
                                ? "bg-yellow-500 text-white border-yellow-500"
                                : "bg-gray-500 text-white border-gray-500"
                          }`}
                        >
                          {task.priority || "low"}
                        </Badge>
                      </div>
                      {task.notes && <p className="text-sm text-muted-foreground mt-1">{task.notes}</p>}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-2">
                        {task.group && <span>📁 {task.group}</span>}
                        {task.estimatedTime && <span>⏱️ {task.estimatedTime}m</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveTask(task.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
