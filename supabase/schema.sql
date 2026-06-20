-- ====================================================
-- ตี๋บางบอน Real Estate — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================
-- Properties Table
-- ====================================================
CREATE TABLE IF NOT EXISTS public.properties (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  property_type TEXT NOT NULL CHECK (property_type IN ('บ้านเดี่ยว', 'ทาวน์เฮ้าส์', 'คอนโด', 'ที่ดิน', 'อาคารพาณิชย์')),
  project_name  TEXT,
  location      TEXT NOT NULL,
  address       TEXT,
  price         NUMERIC(15, 2) NOT NULL,
  status        TEXT NOT NULL DEFAULT 'พร้อมขาย' CHECK (status IN ('พร้อมขาย', 'จองแล้ว', 'ขายแล้ว')),
  land_size     TEXT,
  usable_area   TEXT,
  bedrooms      INTEGER DEFAULT 0,
  bathrooms     INTEGER DEFAULT 0,
  parking       INTEGER DEFAULT 0,
  description   TEXT,
  highlights    TEXT[] DEFAULT '{}',
  is_featured   BOOLEAN NOT NULL DEFAULT FALSE,
  is_visible    BOOLEAN NOT NULL DEFAULT TRUE,
  images        TEXT[] DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================================
-- Inquiries Table
-- ====================================================
CREATE TABLE IF NOT EXISTS public.inquiries (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  message     TEXT,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================
-- Row Level Security (RLS)
-- ====================================================

-- Properties: Public can read visible ones, auth users can do everything
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible properties"
  ON public.properties
  FOR SELECT
  TO anon, authenticated
  USING (is_visible = TRUE);

CREATE POLICY "Authenticated users can manage all properties"
  ON public.properties
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Inquiries: Public can insert, auth users can read all
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit inquiry"
  ON public.inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read inquiries"
  ON public.inquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- ====================================================
-- Indexes
-- ====================================================
CREATE INDEX IF NOT EXISTS idx_properties_slug ON public.properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_is_visible ON public.properties(is_visible);
CREATE INDEX IF NOT EXISTS idx_properties_is_featured ON public.properties(is_featured);
CREATE INDEX IF NOT EXISTS idx_properties_location ON public.properties(location);
CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON public.inquiries(property_id);

-- ====================================================
-- Seed Data (6 Sample Properties)
-- ====================================================
INSERT INTO public.properties (title, slug, property_type, project_name, location, address, price, status, land_size, usable_area, bedrooms, bathrooms, parking, description, highlights, is_featured, is_visible, images) VALUES

('บ้านเดี่ยว 2 ชั้น หมู่บ้านบางบอนพฤกษา',
 'บ้านเดี่ยว-บางบอน-พฤกษา-1',
 'บ้านเดี่ยว', 'บางบอนพฤกษา', 'บางบอน',
 'ซอยบางบอน 3 แขวงบางบอน เขตบางบอน กรุงเทพฯ',
 3500000, 'พร้อมขาย', '50 ตร.ว.', '130 ตร.ม.',
 3, 2, 2,
 'บ้านเดี่ยว 2 ชั้น สวยมาก ทำเลดีเยี่ยม ใกล้ถนนใหญ่และตลาด เหมาะสำหรับครอบครัวที่ต้องการพื้นที่ใช้สอยกว้างขวาง บ้านสภาพดี เจ้าของดูแลรักษาอย่างดี พร้อมเข้าอยู่ได้ทันที',
 ARRAY['บ้านสวยพร้อมอยู่', 'ที่จอดรถ 2 คัน', 'ใกล้ทางด่วน', 'โซนเงียบ ปลอดภัย'],
 TRUE, TRUE,
 ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
       'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80']),

('ทาวน์เฮ้าส์ 3 ชั้น โครงการพุทธบูชาวิลล์',
 'ทาวน์เฮ้าส์-พุทธบูชา-วิลล์-2',
 'ทาวน์เฮ้าส์', 'พุทธบูชาวิลล์', 'พุทธบูชา',
 'ซอยพุทธบูชา 24 แขวงบางมด เขตทุ่งครุ กรุงเทพฯ',
 2200000, 'พร้อมขาย', '20 ตร.ว.', '110 ตร.ม.',
 3, 3, 1,
 'ทาวน์เฮ้าส์ 3 ชั้น สภาพดี ผ่านการปรับปรุงใหม่ ห้องนอนกว้าง ห้องน้ำครบทุกชั้น ทำเลดีใกล้สถานีรถไฟฟ้า BTS',
 ARRAY['ปรับปรุงใหม่ทั้งหลัง', 'ใกล้ BTS', 'ทำเลศักยภาพ', 'ราคาพิเศษ'],
 FALSE, TRUE,
 ARRAY['https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80']),

('บ้านเดี่ยว 2 ชั้น โครงการหนองแขม กรีนวิว',
 'บ้านเดี่ยว-หนองแขม-กรีนวิว-3',
 'บ้านเดี่ยว', 'หนองแขม กรีนวิว', 'หนองแขม',
 'ซอยเพชรเกษม 75 แขวงหนองแขม เขตหนองแขม กรุงเทพฯ',
 4800000, 'จองแล้ว', '65 ตร.ว.', '165 ตร.ม.',
 4, 3, 2,
 'บ้านเดี่ยว 2 ชั้น หมู่บ้านปิดสงบ ปลอดภัย ตั้งอยู่ในซอยส่วนตัว มีรั้วรอบขอบชิด สวนรอบบ้านร่มรื่น',
 ARRAY['ที่ดินขนาดใหญ่', 'สวนรอบบ้าน', 'หมู่บ้านปิด', '4 ห้องนอน'],
 FALSE, TRUE,
 ARRAY['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80']),

('ที่ดินเปล่า ติดถนนใหญ่ บางบอน',
 'ที่ดิน-บางบอน-ติดถนน-4',
 'ที่ดิน', NULL, 'บางบอน',
 'ถนนบางบอน 5 แขวงบางบอน เขตบางบอน กรุงเทพฯ',
 1900000, 'พร้อมขาย', '100 ตร.ว.', NULL,
 0, 0, 0,
 'ที่ดินเปล่าทำเลดีเยี่ยม ติดถนนใหญ่ ไฟฟ้าน้ำประปาพร้อม เหมาะสำหรับสร้างบ้านหรือพัฒนาเชิงพาณิชย์',
 ARRAY['ติดถนนใหญ่', 'ไฟฟ้าน้ำพร้อม', 'โฉนดพร้อมโอน', 'ทำเลดี'],
 TRUE, TRUE,
 ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80']),

('ทาวน์เฮ้าส์ 2 ชั้น บางแค โครงการเอออน',
 'ทาวน์เฮ้าส์-บางแค-เอออน-5',
 'ทาวน์เฮ้าส์', 'เอออน บางแค', 'บางแค',
 'ซอยเพชรเกษม 48 แขวงบางแค เขตบางแค กรุงเทพฯ',
 1800000, 'ขายแล้ว', '18 ตร.ว.', '90 ตร.ม.',
 2, 2, 1,
 'ทาวน์เฮ้าส์ 2 ชั้น สภาพดี ทำเลใกล้ห้างบิ๊กซีบางแค เดินทางสะดวก ห้องนอน 2 ห้อง',
 ARRAY['ใกล้บิ๊กซีบางแค', 'ราคาดี', 'สภาพบ้านดี'],
 FALSE, TRUE,
 ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80']),

('บ้านเดี่ยว 2 ชั้น อ้อมน้อย นครปฐม',
 'บ้านเดี่ยว-อ้อมน้อย-นครปฐม-6',
 'บ้านเดี่ยว', 'อ้อมน้อย เพลส', 'อ้อมน้อย',
 'ซอยเพชรเกษม 116 ตำบลอ้อมน้อย อำเภอกระทุ่มแบน จังหวัดสมุทรสาคร',
 3200000, 'พร้อมขาย', '55 ตร.ว.', '140 ตร.ม.',
 3, 2, 2,
 'บ้านเดี่ยว 2 ชั้น สวยงาม ทำเลดีใกล้กรุงเทพฯ ราคาถูกกว่าในเมือง แต่เดินทางสะดวกผ่านถนนเพชรเกษม',
 ARRAY['ราคาดีกว่าในเมือง', 'ใกล้กรุงเทพฯ', 'บ้านสวย', 'ที่ดินขนาดดี'],
 TRUE, TRUE,
 ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
       'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80']);

-- ====================================================
-- Storage: Create bucket for property images
-- Run this via Supabase Dashboard or API:
-- Dashboard → Storage → New Bucket
-- Name: property-images
-- Public: YES
-- ====================================================
