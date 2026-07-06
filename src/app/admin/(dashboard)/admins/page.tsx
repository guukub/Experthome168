'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, User, AlertCircle, RefreshCw } from 'lucide-react'

interface AdminUser {
  _id: string
  name: string
  email: string
  createdAt: string
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admins')
      const data = await res.json()
      if (data.success) {
        setAdmins(data.data)
      } else {
        setError(data.error || 'Failed to load admins')
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    try {
      const res = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      
      if (data.success) {
        setSuccess('เพิ่มผู้ดูแลระบบสำเร็จ')
        setFormData({ name: '', email: '', password: '' })
        setIsAdding(false)
        fetchAdmins()
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเพิ่มผู้ดูแลระบบ')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('ยืนยันการลบผู้ดูแลระบบคนนี้?')) return
    
    try {
      const res = await fetch(`/api/admins/${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      
      if (data.success) {
        fetchAdmins()
      } else {
        alert(data.error)
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการลบ')
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ผู้ดูแลระบบ</h1>
          <p className="text-gray-500 mt-1">จัดการบัญชีผู้ดูแลระบบ (Admin) ทั้งหมด</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="btn-primary"
        >
          {isAdding ? 'ยกเลิก' : <><Plus size={20} /> เพิ่มผู้ดูแลระบบ</>}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 flex items-center gap-2">
          <AlertCircle size={20} />
          {success}
        </div>
      )}

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-bold mb-4">เพิ่มผู้ดูแลระบบใหม่</h2>
          <form onSubmit={handleAddAdmin} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">ชื่อ-นามสกุล</label>
              <input 
                type="text" 
                required
                className="input" 
                placeholder="เช่น สมชาย ใจดี"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="label">อีเมล</label>
              <input 
                type="email" 
                required
                className="input" 
                placeholder="email@example.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="label">รหัสผ่าน</label>
              <input 
                type="password" 
                required
                className="input" 
                placeholder="••••••••"
                minLength={6}
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="md:col-span-3 flex justify-end mt-2">
              <button type="submit" className="btn-primary">บันทึกข้อมูล</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center text-gray-400">
            <RefreshCw className="animate-spin" size={24} />
          </div>
        ) : admins.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            ไม่มีข้อมูลผู้ดูแลระบบ
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">ชื่อ</th>
                  <th className="px-6 py-4 font-medium">อีเมล</th>
                  <th className="px-6 py-4 font-medium">วันที่เพิ่ม</th>
                  <th className="px-6 py-4 font-medium text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {admins.map(admin => (
                  <tr key={admin._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-forest-50 text-forest-600 flex items-center justify-center">
                          <User size={18} />
                        </div>
                        <span className="font-medium text-gray-900">{admin.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {new Date(admin.createdAt).toLocaleDateString('th-TH')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(admin._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="ลบผู้ดูแล"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
