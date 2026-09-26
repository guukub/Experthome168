export interface LandSizeInput {
  rai: string
  ngan: string
  squareWah: string
}

export function formatLandSize(input: LandSizeInput): string {
  const { rai, ngan, squareWah } = input
  if (!/^\d*$/.test(rai) || !/^\d*$/.test(ngan) || !/^(?:\d+(?:\.\d+)?|\.\d+)?$/.test(squareWah)
    || !Number.isFinite(Number(rai)) || Number(ngan) > 3 || Number(squareWah) > 99.9) {
    throw new Error('ขนาดที่ดิน: ไร่ต้องเป็นจำนวนเต็มตั้งแต่ 0 งานต้องเป็น 0–3 และตร.วาต้องเป็น 0–99.9')
  }
  return [
    Number(rai) > 0 ? `${rai.replace(/^0+(?=\d)/, '')} ไร่` : '',
    Number(ngan) > 0 ? `${Number(ngan)} งาน` : '',
    Number(squareWah) > 0 ? `${Number(squareWah)} ตร.วา` : '',
  ].filter(Boolean).join(' ')
}

// Read existing free-text sizes without silently discarding unrecognized values.
export function parseLandSize(value = ''): LandSizeInput | null {
  const text = value.trim().replace(/,/g, '')
  if (!text) return { rai: '', ngan: '', squareWah: '' }
  const number = '(\\d+(?:\\.\\d+)?)'
  const match = text.match(new RegExp(`^(?:${number}\\s*ไร่\\s*)?(?:${number}\\s*งาน\\s*)?(?:${number}\\s*(?:ตร\\.\\s*ว(?:า)?\\.?|ตารางวา)\\s*)?$`))
  let total: number
  if (match) total = Number(match[1] || 0) * 400 + Number(match[2] || 0) * 100 + Number(match[3] || 0)
  else if (/^\d+(?:\.\d+)?$/.test(text)) total = Number(text)
  else return null
  if (!Number.isFinite(total)) return null
  const rai = Math.floor(total / 400)
  const ngan = Math.floor((total - rai * 400) / 100)
  const squareWah = Number((total - rai * 400 - ngan * 100).toFixed(10))
  return { rai: rai ? String(rai) : '', ngan: ngan ? String(ngan) : '', squareWah: squareWah ? String(squareWah) : '' }
}
