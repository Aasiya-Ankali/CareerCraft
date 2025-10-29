"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

type Task = {
  id: string
  title: string
  notes?: string
  completed: boolean
  createdAt: number
  completedAt?: number
  priority?: 'low' | 'medium' | 'high'
  deadline?: string | undefined
  group?: string
}

const STORAGE_KEY = "cc_tasks"

function loadTasks(): Task[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Task[]) : []
  } catch {
    return []
  }
}

function saveTasks(tasks: Task[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  try {
    window.dispatchEvent(new CustomEvent("cc_tasks_updated"))
  } catch {}
}

function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    setTasks(loadTasks())
  }, [])
  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = (title: string, notes?: string, priority: Task['priority'] = 'low', deadline?: string, group: string = 'General') => {
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title, notes, completed: false, createdAt: Date.now(), priority, deadline, group },
    ])
  }
  const updateTask = (id: string, payload: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...payload } : t)))
  }
  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : undefined } : t,
      ),
    )
  }
  const removeTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id))

  return { tasks, addTask, updateTask, toggleTask, removeTask }
}

function PomodoroTimer() {
  const [focusMin, setFocusMin] = useState<number>(() => Number(localStorage.getItem('cc_pomo_focus') || 25))
  const [shortBreakMin, setShortBreakMin] = useState<number>(() => Number(localStorage.getItem('cc_pomo_short') || 5))
  const [longBreakMin, setLongBreakMin] = useState<number>(() => Number(localStorage.getItem('cc_pomo_long') || 15))
  const [sessionsUntilLong, setSessionsUntilLong] = useState<number>(() => Number(localStorage.getItem('cc_pomo_until_long') || 4))
  const [seconds, setSeconds] = useState<number>(() => Number(localStorage.getItem('cc_pomo_seconds') || focusMin * 60))
  const [running, setRunning] = useState<boolean>(() => localStorage.getItem('cc_pomo_running') === '1')
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>(() => (localStorage.getItem('cc_pomo_mode') as any) || 'focus')
  const [completedSessions, setCompletedSessions] = useState<number>(() => Number(localStorage.getItem('cc_pomo_sessions') || 0))

  // persist settings
  useEffect(() => { localStorage.setItem('cc_pomo_focus', String(focusMin)) }, [focusMin])
  useEffect(() => { localStorage.setItem('cc_pomo_short', String(shortBreakMin)) }, [shortBreakMin])
  useEffect(() => { localStorage.setItem('cc_pomo_long', String(longBreakMin)) }, [longBreakMin])
  useEffect(() => { localStorage.setItem('cc_pomo_until_long', String(sessionsUntilLong)) }, [sessionsUntilLong])
  useEffect(() => { localStorage.setItem('cc_pomo_seconds', String(seconds)) }, [seconds])
  useEffect(() => { localStorage.setItem('cc_pomo_running', running ? '1' : '0') }, [running])
  useEffect(() => { localStorage.setItem('cc_pomo_mode', mode) }, [mode])
  useEffect(() => { localStorage.setItem('cc_pomo_sessions', String(completedSessions)) }, [completedSessions])

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [running])

  useEffect(() => {
    if (seconds > 0) return
    if (mode === 'focus') {
      const nextIsLong = (completedSessions + 1) % sessionsUntilLong === 0
      setCompletedSessions((c) => c + 1)
      setMode(nextIsLong ? 'long' : 'short')
      setSeconds((nextIsLong ? longBreakMin : shortBreakMin) * 60)
    } else {
      setMode('focus')
      setSeconds(focusMin * 60)
    }
    // optional notification
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(mode === 'focus' ? 'Break time!' : 'Focus time!')
      }
    }
  }, [seconds])

  const resetTo = (newMode: 'focus' | 'short' | 'long') => {
    setRunning(false)
    setMode(newMode)
    setSeconds((newMode === 'focus' ? focusMin : newMode === 'short' ? shortBreakMin : longBreakMin) * 60)
  }

  const minutesPart = Math.floor(seconds / 60).toString().padStart(2, '0')
  const secondsPart = String(seconds % 60).padStart(2, '0')
  const total = (mode === 'focus' ? focusMin : mode === 'short' ? shortBreakMin : longBreakMin) * 60
  const progress = 1 - seconds / total

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pomodoro</CardTitle>
        <CardDescription>
          {mode === 'focus' ? 'Focus' : mode === 'short' ? 'Short break' : 'Long break'} • Sessions: {completedSessions}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-5xl font-semibold text-center tabular-nums">{minutesPart}:{secondsPart}</div>
        <div className="w-full h-2 rounded bg-muted"><div className="h-2 rounded" style={{ width: `${progress * 100}%`, background: 'var(--color-chart-1)' }} /></div>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Button onClick={() => setRunning((r) => !r)}>{running ? 'Pause' : 'Start'}</Button>
          <Button variant="secondary" onClick={() => resetTo(mode)}>Reset</Button>
          <Button variant="secondary" onClick={() => resetTo('focus')}>Focus</Button>
          <Button variant="secondary" onClick={() => resetTo('short')}>Short</Button>
          <Button variant="secondary" onClick={() => resetTo('long')}>Long</Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <label className="text-sm flex items-center gap-2">Focus (min)
            <input className="border rounded px-2 py-1 bg-background w-full" type="number" min={1} max={120} value={focusMin} onChange={(e) => setFocusMin(Math.max(1, Number(e.target.value)||25))} />
          </label>
          <label className="text-sm flex items-center gap-2">Short break (min)
            <input className="border rounded px-2 py-1 bg-background w-full" type="number" min={1} max={60} value={shortBreakMin} onChange={(e) => setShortBreakMin(Math.max(1, Number(e.target.value)||5))} />
          </label>
          <label className="text-sm flex items-center gap-2">Long break (min)
            <input className="border rounded px-2 py-1 bg-background w-full" type="number" min={1} max={60} value={longBreakMin} onChange={(e) => setLongBreakMin(Math.max(1, Number(e.target.value)||15))} />
          </label>
          <label className="text-sm flex items-center gap-2">Sessions per long break
            <input className="border rounded px-2 py-1 bg-background w-full" type="number" min={1} max={12} value={sessionsUntilLong} onChange={(e) => setSessionsUntilLong(Math.max(1, Number(e.target.value)||4))} />
          </label>
        </div>
        <div className="text-xs text-muted-foreground text-center">
          Tip: Allow notifications to get alerts when a session ends.
        </div>
      </CardContent>
    </Card>
  )
}

function TaskList() {
  const { tasks, addTask, updateTask, toggleTask, removeTask } = useTasks()
  const [title, setTitle] = useState("")
  const [notes, setNotes] = useState("")
  const [priority, setPriority] = useState<Task['priority']>('low')
  const [deadline, setDeadline] = useState<string | undefined>(undefined)
  const [group, setGroup] = useState<string>('General')
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState("created-desc")
  const [groupFilter, setGroupFilter] = useState<string>('All')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editNotes, setEditNotes] = useState("")
  const [editPriority, setEditPriority] = useState<Task['priority']>('low')
  const [editDeadline, setEditDeadline] = useState<string | undefined>(undefined)
  const [editGroup, setEditGroup] = useState<string>('General')

  const planned = tasks.length
  const done = tasks.filter((t) => t.completed).length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
        <CardDescription>Plan and complete your day</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-3">
          <Input placeholder="Add a task..." value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Optional notes..." value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <select
            className="border rounded-md px-2 py-1 bg-background"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Task['priority'])}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            className="border rounded-md px-2 py-1 bg-background"
            type="date"
            value={deadline || ''}
            onChange={(e) => setDeadline(e.target.value || undefined)}
          />
          <Input placeholder="Group (e.g., General)" value={group} onChange={(e) => setGroup(e.target.value)} />
          <Button
            onClick={() => {
              if (!title.trim()) return
              addTask(title.trim(), notes.trim() || undefined, priority, deadline, group.trim() || 'General')
              setTitle("")
              setNotes("")
              setPriority('low')
              setDeadline(undefined)
              setGroup('General')
            }}
          >
            Add Task
          </Button>
          <div className="text-sm text-muted-foreground self-center">
            {done}/{planned} completed
          </div>
          <div className="ml-auto flex gap-2 items-center">
            <Input placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
            <select
              className="border rounded-md px-2 py-1 bg-background"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="created-desc">Newest</option>
              <option value="created-asc">Oldest</option>
              <option value="priority-desc">Priority</option>
              <option value="deadline-asc">Nearest deadline</option>
            </select>
            <select
              className="border rounded-md px-2 py-1 bg-background"
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
            >
              <option value="All">All groups</option>
              {Array.from(new Set(tasks.map((t) => t.group || 'General'))).map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        <ul className="space-y-2">
          {tasks.length === 0 ? (
            <li className="text-sm text-muted-foreground">No tasks yet. Add your first task above.</li>
          ) : (
            tasks
              .filter((t) => {
                if (!query.trim()) return true
                const q = query.toLowerCase()
                return (t.title || '').toLowerCase().includes(q) || (t.notes || '').toLowerCase().includes(q)
              })
              .filter((t) => (groupFilter === 'All' ? true : (t.group || 'General') === groupFilter))
              .sort((a, b) => {
                switch (sort) {
                  case 'priority-desc':
                    return (
                      ['high', 'medium', 'low'].indexOf(a.priority || 'low') -
                      ['high', 'medium', 'low'].indexOf(b.priority || 'low')
                    )
                  case 'deadline-asc':
                    return new Date(a.deadline || '2100-01-01').getTime() - new Date(b.deadline || '2100-01-01').getTime()
                  case 'created-asc':
                    return a.createdAt - b.createdAt
                  default:
                    return b.createdAt - a.createdAt
                }
              })
              .map((t) => (
              <li key={t.id} className="flex items-start gap-3 rounded-md border p-3 bg-card">
                <Checkbox checked={t.completed} onCheckedChange={() => toggleTask(t.id)} />
                <div className="flex-1">
                  {editingId === t.id ? (
                    <div className="grid md:grid-cols-5 gap-2">
                      <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                      <Input placeholder="Notes" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} />
                      <select
                        className="border rounded-md px-2 py-1 bg-background"
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value as Task['priority'])}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      <input
                        className="border rounded-md px-2 py-1 bg-background"
                        type="date"
                        value={editDeadline || ''}
                        onChange={(e) => setEditDeadline(e.target.value || undefined)}
                      />
                      <Input placeholder="Group" value={editGroup} onChange={(e) => setEditGroup(e.target.value)} />
                    </div>
                  ) : (
                    <>
                      <div className="font-medium">{t.title}</div>
                      {t.notes ? (
                        <div className="text-sm text-muted-foreground leading-relaxed">{t.notes}</div>
                      ) : null}
                      <div className="text-xs text-muted-foreground mt-1">
                        <span className="mr-3">Priority: {t.priority || 'low'}</span>
                        {t.deadline ? <span className="mr-3">Due: {t.deadline}</span> : null}
                        <span>Group: {t.group || 'General'}</span>
                      </div>
                    </>
                  )}
                </div>
                {editingId === t.id ? (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        updateTask(t.id, {
                          title: editTitle,
                          notes: editNotes,
                          priority: editPriority,
                          deadline: editDeadline,
                          group: editGroup || 'General',
                        })
                        setEditingId(null)
                      }}
                    >
                      💾 Save
                    </Button>
                    <Button variant="secondary" onClick={() => setEditingId(null)}>
                      ✖️ Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setEditingId(t.id)
                        setEditTitle(t.title || '')
                        setEditNotes(t.notes || '')
                        setEditPriority(t.priority || 'low')
                        setEditDeadline(t.deadline)
                        setEditGroup(t.group || 'General')
                      }}
                    >
                      ✏️ Edit
                    </Button>
                    <Button variant="ghost" onClick={() => removeTask(t.id)}>
                      🗑️ Remove
                    </Button>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      </CardContent>
    </Card>
  )
}

function groupByDay(tasks: Task[]) {
  const map = new Map<string, { date: string; planned: number; completed: number }>()
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    map.set(key, { date: key, planned: 0, completed: 0 })
  }
  for (const t of tasks) {
    const createdKey = new Date(t.createdAt).toISOString().slice(0, 10)
    if (map.has(createdKey)) {
      map.get(createdKey)!.planned += 1
    }
    if (t.completedAt) {
      const completedKey = new Date(t.completedAt).toISOString().slice(0, 10)
      if (map.has(completedKey)) {
        map.get(completedKey)!.completed += 1
      }
    }
  }
  return Array.from(map.values())
}

function ProductivityChart() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    setTasks(loadTasks())
    const onStorage = () => setTasks(loadTasks())
    const onLocal = () => setTasks(loadTasks())
    window.addEventListener("storage", onStorage)
    window.addEventListener("cc_tasks_updated", onLocal as EventListener)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("cc_tasks_updated", onLocal as EventListener)
    }
  }, [])

  const data = useMemo(() => groupByDay(tasks), [tasks])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productivity</CardTitle>
        <CardDescription>Planned vs. completed (last 7 days)</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="planned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-chart-3)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-chart-3)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="completed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="4 4" />
            <XAxis dataKey="date" tick={{ fill: "var(--color-muted-foreground)" }} />
            <YAxis tick={{ fill: "var(--color-muted-foreground)" }} />
            <Tooltip
              contentStyle={{
                background: "var(--color-popover)",
                color: "var(--color-popover-foreground)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
              }}
            />
            <Area
              type="monotone"
              dataKey="planned"
              stroke="var(--color-chart-3)"
              fill="url(#planned)"
              strokeWidth={2}
              name="Planned"
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke="var(--color-chart-1)"
              fill="url(#completed)"
              strokeWidth={2}
              name="Completed"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default function PlannerDashboard() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <TaskList />
        <ProductivityChart />
      </div>
      <div className="space-y-6">
        <PomodoroTimer />
      </div>
    </div>
  )
}
