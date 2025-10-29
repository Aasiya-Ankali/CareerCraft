import { NextResponse } from 'next/server'
import User from '@/models/User'
import { connectToDatabase } from '@/lib/db'
import { promises as fs } from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request, { params }: { params: { email: string } }) {
  await connectToDatabase()
  const email = decodeURIComponent(params.email)

  const form = await req.formData()
  const file = form.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'file required' }, { status: 400 })
  if (file.type !== 'application/pdf') return NextResponse.json({ error: 'PDF only' }, { status: 400 })

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  await fs.mkdir(uploadsDir, { recursive: true })
  const safeEmail = email.replace(/[^a-zA-Z0-9_.-]/g, '_')
  const filename = `${safeEmail}-${Date.now()}.pdf`
  const filePath = path.join(uploadsDir, filename)
  await fs.writeFile(filePath, buffer)

  const resumePath = `/uploads/${filename}`
  const user = await User.findOneAndUpdate({ email }, { $set: { resumePath } }, { upsert: true, new: true })
  return NextResponse.json(user)
}


