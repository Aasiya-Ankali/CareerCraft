import { NextResponse } from 'next/server'
import User from '@/models/User'
import { connectToDatabase } from '@/lib/db'

export async function GET(_: Request, { params }: { params: { email: string } }) {
  await connectToDatabase()
  const user = await User.findOne({ email: decodeURIComponent(params.email) })
  return NextResponse.json(user || null)
}

export async function PUT(req: Request, { params }: { params: { email: string } }) {
  await connectToDatabase()
  const body = await req.json()
  const email = decodeURIComponent(params.email)
  const user = await User.findOneAndUpdate({ email }, { $set: body }, { upsert: true, new: true, setDefaultsOnInsert: true })
  return NextResponse.json(user)
}


