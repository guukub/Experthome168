import mongoose from 'mongoose'

const SettingsSchema = new mongoose.Schema({
  phone: { type: String, default: '081-123-4567' },
  lineId: { type: String, default: '@teebangbon' },
  lineUrl: { type: String, default: 'https://line.me/ti/p/~@teebangbon' },
  facebook: { type: String, default: 'facebook.com/teebangbon' },
  facebookUrl: { type: String, default: 'https://facebook.com/teebangbon' },
}, { timestamps: true })

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema)
