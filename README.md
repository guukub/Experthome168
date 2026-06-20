# ตี๋บางบอน — Real Estate Website

> เว็บไซต์อสังหาริมทรัพย์ครบวงจร สำหรับนายหน้า **ตี๋บางบอน**  
> Built with **Next.js 14**, **Tailwind CSS**, and **Supabase**

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS + Sarabun (Thai font) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Language | TypeScript |

---

## 📋 Features

### Public Frontend
- ✅ Hero section with animated stats
- ✅ Featured property listings on home page
- ✅ Full property listing page with search & filter
- ✅ Property detail page with image gallery, specs, map
- ✅ Contact page with form + channel buttons
- ✅ Status badges: พร้อมขาย / จองแล้ว / ขายแล้ว
- ✅ CTA sections: นัดชมทรัพย์ / สอบถาม / ฝากขาย
- ✅ Professional Thai footer
- ✅ Mobile responsive

### Admin Backend
- ✅ Secure login (Supabase Auth)
- ✅ Dashboard with stats
- ✅ Properties CRUD table
- ✅ Inline status change (dropdown)
- ✅ Toggle visible/hidden
- ✅ Toggle featured
- ✅ Delete with confirmation
- ✅ Create/Edit property form
- ✅ Image management
- ✅ Inquiries table with contact buttons

---

## 🚀 Setup Instructions

### 1. Prerequisites
- [Node.js 18+](https://nodejs.org/)
- [Supabase account](https://supabase.com/)

### 2. Clone & Install

```bash
cd /path/to/Web
npm install
```

### 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) → Create new project
2. Go to **SQL Editor** → Paste contents of `supabase/schema.sql` → Run
3. Go to **Storage** → Create bucket named `property-images` → Set to **Public**
4. Go to **Authentication** → **Users** → **Invite user** → Create admin account

### 4. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> Find these in Supabase Dashboard → **Settings** → **API**

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                     ← Home page
│   ├── properties/
│   │   ├── page.tsx                 ← Property listings
│   │   └── [slug]/page.tsx          ← Property detail
│   ├── contact/page.tsx             ← Contact page
│   ├── admin/
│   │   ├── login/page.tsx           ← Admin login
│   │   ├── dashboard/page.tsx       ← Dashboard
│   │   ├── properties/              ← CRUD management
│   │   └── inquiries/page.tsx       ← Inquiries table
│   └── api/
│       └── inquiries/route.ts       ← Contact form API
├── components/
│   ├── public/                      ← Navbar, Footer, PropertyCard, etc.
│   └── admin/                       ← AdminNav, PropertyForm
├── lib/
│   ├── supabase/                    ← client.ts, server.ts
│   ├── utils.ts                     ← Formatters, helpers
│   └── sample-data.ts               ← Demo data (replace with Supabase)
└── types/property.ts                ← TypeScript types
```

---

## 🗄️ Database Schema

### properties
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| title | text | ชื่อทรัพย์ |
| slug | text | URL slug (unique) |
| property_type | text | ประเภท |
| location | text | ทำเล |
| price | numeric | ราคาบาท |
| status | text | พร้อมขาย/จองแล้ว/ขายแล้ว |
| is_featured | boolean | แสดงหน้าแรก |
| is_visible | boolean | แสดงในเว็บ |
| images | text[] | รูปภาพ URLs |

### inquiries
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| name | text | ชื่อผู้ติดต่อ |
| phone | text | เบอร์โทร |
| message | text | ข้อความ |
| property_id | uuid | FK → properties |

---

## 🔌 Connecting Supabase to the App

The app currently runs on **sample data** (`src/lib/sample-data.ts`).

To switch to live Supabase data:

1. Set up `.env.local` with your Supabase credentials
2. In each page/component, replace `sampleProperties` imports with Supabase queries:

```typescript
// Example: fetch properties in a Server Component
import { createClient } from '@/lib/supabase/server'

const supabase = createClient()
const { data: properties } = await supabase
  .from('properties')
  .select('*')
  .eq('is_visible', true)
  .order('created_at', { ascending: false })
```

---

## 👤 Admin Access

1. Go to `/admin/login`
2. Login with your Supabase Auth credentials
3. Manage listings at `/admin/properties`

**Default demo admin (set up via Supabase):**
- Email: `admin@teebangbon.com`
- Password: Set when creating user in Supabase Dashboard

---

## 📞 Contact Customization

Update these files with real contact info:
- `src/components/public/Navbar.tsx` — phone number
- `src/components/public/Footer.tsx` — phone, Line, Facebook, email
- `src/app/properties/[slug]/page.tsx` — contact card

---

## 🌐 Production Deployment

Deploy to [Vercel](https://vercel.com) (recommended for Next.js):

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add environment variables in Vercel Dashboard → Project → Settings → Environment Variables.

---

*สร้างด้วย ❤️ สำหรับ ตี๋บางบอน อสังหาริมทรัพย์*
