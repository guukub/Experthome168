import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Admin from '@/models/Admin'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    await connectToDatabase()
    // Fetch all admins but exclude passwords
    const admins = await Admin.find({}).select('-password').sort({ createdAt: -1 })
    
    return NextResponse.json({ success: true, data: admins })
  } catch (error: any) {
    console.error('Error fetching admins:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch admins' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 })
    }

    await connectToDatabase()

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() })
    if (existingAdmin) {
      return NextResponse.json({ success: false, error: 'อีเมลนี้ถูกใช้งานแล้ว' }, { status: 400 })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create admin
    const newAdmin = await Admin.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    })

    // Remove password from response
    const adminResponse = newAdmin.toObject()
    delete adminResponse.password

    return NextResponse.json({ success: true, data: adminResponse })
  } catch (error: any) {
    console.error('Error creating admin:', error)
    return NextResponse.json({ success: false, error: 'Failed to create admin' }, { status: 500 })
  }
}
