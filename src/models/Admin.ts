import mongoose from 'mongoose'

export interface IAdmin {
  _id?: string
  name: string
  email: string
  password?: string // Omitted in most queries
  createdAt: Date
  updatedAt: Date
}

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
})

// Check if the model exists before compiling it
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema)

export default Admin
