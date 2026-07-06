import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Admin from '@/models/Admin'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'กรุณากรอกอีเมลและรหัสผ่าน' }, { status: 400 })
    }

    await connectToDatabase()

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() })

    // If admin not found, check if it's the default demo admin to bootstrap
    if (!admin) {
      if (email === 'admin@teebangbon.com' && password === 'password123') {
        // Create the first default admin
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        await Admin.create({
          name: 'Super Admin',
          email: 'admin@teebangbon.com',
          password: hashedPassword
        })
        
        // Return success and let frontend set cookie
        return NextResponse.json({ success: true, message: 'Default admin initialized' })
      }
      return NextResponse.json({ success: false, error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 })
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' }, { status: 500 })
  }
}
