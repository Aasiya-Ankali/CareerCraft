"use client"

import type React from "react"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

type User = {
  id: string
  email: string
  name?: string
}

type AuthContextValue = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const USERS_KEY = "cc_users"
const SESSION_KEY = "cc_session"

function readUsers(): Record<string, { id: string; email: string; name?: string; password: string }> {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeUsers(map: Record<string, { id: string; email: string; name?: string; password: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(map))
}

function readSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

function writeSession(user: User | null) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  else localStorage.removeItem(SESSION_KEY)
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(readSession())
    setLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 300)) // simulate network
    const users = readUsers()
    const u = users[email.toLowerCase()]
    if (!u || u.password !== password) {
      throw new Error("Invalid email or password")
    }
    const sessionUser: User = { id: u.id, email: u.email, name: u.name }
    writeSession(sessionUser)
    setUser(sessionUser)
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 300))
    const key = email.toLowerCase()
    const users = readUsers()
    if (users[key]) throw new Error("An account with this email already exists")
    const id = crypto.randomUUID()
    users[key] = { id, email: key, name: name?.trim() || undefined, password }
    writeUsers(users)
    const sessionUser: User = { id, email: key, name: name?.trim() || undefined }
    writeSession(sessionUser)
    setUser(sessionUser)
  }, [])

  const logout = useCallback(() => {
    writeSession(null)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, signup, logout }),
    [user, loading, login, signup, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
