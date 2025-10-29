import { NextResponse } from 'next/server'
import User from '@/models/User'
import { connectToDatabase } from '@/lib/db'

export async function PUT(req: Request, { params }: { params: { email: string } }) {
  await connectToDatabase()
  const { skills } = await req.json()
  const email = decodeURIComponent(params.email)
  const user = await User.findOneAndUpdate(
    { email },
    { $set: { skills: Array.isArray(skills) ? skills : [] } },
    { upsert: true, new: true }
  )
  return NextResponse.json(user)
}


