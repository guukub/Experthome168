import { Property } from '@/types/property'

/**
 * Format a number as Thai Baht currency
 */
export function formatPrice(price: number): string {
  if (price >= 1_000_000) {
    const millions = price / 1_000_000
    return `${millions.toFixed(2)} ล้านบาท`
  }
  if (price >= 10_000) {
    return `${(price / 1000).toFixed(2)}K บาท`
  }
  return price.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' บาท'
}

/**
 * Format raw price number with comma separator and 2 decimal places
 */
export function formatPriceRaw(price: number): string {
  return price.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' บาท'
}

/**
 * Generate a URL-friendly slug from Thai text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-ก-๙]/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Get status badge color classes
 */
export function getStatusColor(status: Property['status']): string {
  switch (status) {
    case 'พร้อมขาย':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 'จองแล้ว':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'ขายแล้ว':
      return 'bg-red-100 text-red-700 border-red-200'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

/**
 * Get status dot color
 */
export function getStatusDotColor(status: Property['status']): string {
  switch (status) {
    case 'พร้อมขาย':
      return 'bg-emerald-500'
    case 'จองแล้ว':
      return 'bg-amber-500'
    case 'ขายแล้ว':
      return 'bg-red-500'
    default:
      return 'bg-gray-400'
  }
}

/**
 * Truncate text to a given length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

/**
 * Format date to Thai locale
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format date string (YYYY-MM-DD or ISO) to DD/MM/YYYY
 */
export function formatDateToDDMMYYYY(dateStr: string): string {
  if (!dateStr) return ''
  const cleanDate = dateStr.split('T')[0]
  const parts = cleanDate.split('-')
  if (parts.length === 3) {
    const [year, month, day] = parts
    if (year.length === 4) {
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
    }
  }
  return dateStr
}

/**
 * Get property type icon label
 */
export function getPropertyTypeIcon(type: string): string {
  switch (type) {
    case 'บ้านเดี่ยว': return '🏠'
    case 'ทาวน์เฮ้าส์': return '🏘️'
    case 'คอนโด': return '🏢'
    case 'ที่ดิน': return '🌿'
    case 'อาคารพาณิชย์': return '🏪'
    default: return '🏠'
  }
}

export const PROPERTY_TYPES = ['บ้านเดี่ยว', 'ทาวน์เฮ้าส์', 'คอนโด', 'ที่ดิน', 'อาคารพาณิชย์']
export const PROPERTY_STATUSES = ['พร้อมขาย', 'จองแล้ว', 'ขายแล้ว']
export const LOCATIONS = ['บางบอน', 'หนองแขม', 'พุทธบูชา', 'บางแค', 'อ้อมน้อย', 'บางขุนเทียน', 'ราษฎร์บูรณะ']
