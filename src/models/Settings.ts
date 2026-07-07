import mongoose from 'mongoose'

const SettingsSchema = new mongoose.Schema({
  phone: { type: String, default: '081-123-4567' },
  lineId: { type: String, default: '@teebangbon' },
  lineUrl: { type: String, default: 'https://line.me/ti/p/~@teebangbon' },
  facebook: { type: String, default: 'facebook.com/teebangbon' },
  facebookUrl: { type: String, default: 'https://facebook.com/teebangbon' },
  logoUrl: { type: String, default: '' },
  portfolioImages: [{ type: String }],
  email: { type: String, default: 'info@teebangbon.com' },
  address: { type: String, default: 'บางบอน กรุงเทพมหานคร และพื้นที่ใกล้เคียง (หนองแขม · พุทธบูชา · บางแค · อ้อมน้อย)' },
  workingHours: { type: String, default: 'เปิดทุกวัน จันทร์–อาทิตย์ 8:00–20:00 น.' },
  heroBgUrl: { type: String, default: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80' },
}, { timestamps: true })

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema)
