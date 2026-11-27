// lib/constants.ts
// ─────────────────────────────────────────────────────────────────────────────
// Central place for all dummy/placeholder business constants.
// Update from .env.local — these never appear in client JS unless NEXT_PUBLIC_.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE = {
  name: 'ChumaMart Hardware',
  tagline: 'Reliable Building Materials from Nakuru Industrial Area',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://chumamarthardware.com',
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL ?? 'info@chumamarthardware.com',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '254102898707',
  phone: process.env.NEXT_PUBLIC_CALL_NUMBER ?? '0102 898707',
  get phoneIntl() {
    return '+' + this.phone.replace(/[^\d]/g, '').replace(/^0/, '254')
  },
}

// From the Google Business Profile (Chumamart Hardware, plus code P29X+C8 Nakuru)
const YARD_LAT = parseFloat(process.env.NEXT_PUBLIC_YARD_LAT ?? '-0.28144')
const YARD_LNG = parseFloat(process.env.NEXT_PUBLIC_YARD_LNG ?? '36.04831')
export const YARD = {
  address: process.env.NEXT_PUBLIC_YARD_ADDRESS ?? 'Nakuru Industrial Area, Nakuru, Kenya',
  plusCode: 'P29X+C8 Nakuru',
  lat: YARD_LAT,
  lng: YARD_LNG,
  hours: process.env.NEXT_PUBLIC_OPENING_HOURS ?? 'Open 24 hours, 7 days a week',
  open24h: true,
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Chumamart Hardware P29X+C8 Nakuru'),
  mapsEmbedUrl: `https://maps.google.com/maps?q=${YARD_LAT},${YARD_LNG}&z=16&output=embed`,
}

// M-Pesa fallback (OQ-5 dummy)
export const MPESA = {
  paybill: process.env.NEXT_PUBLIC_MPESA_PAYBILL ?? '522533',
  account: process.env.NEXT_PUBLIC_MPESA_ACCOUNT ?? 'ChumaMart',
}

// OQ-1 — Nakuru town free-delivery areas (dummy list — confirm with ChumaMart)
export const NAKURU_TOWN_AREAS: string[] = [
  'Nakuru Town Centre',
  'Milimani',
  'Section 58',
  'Barnabas',
  'Free Area',
  'Flamingo',
  'London',
  'Rhonda',
  'Lanet',
  'Racecourse',
  'Kivumbini',
  'Pipeline',
  'Pangani',
  'Naka',
  'Kapkures',
  'Freehold',
  'Shabab',
  'Bondeni',
  'Nakuru Industrial Area',
  'Mwariki',
  'Kaptembwa',
  'Afraha',
  'Biashara',
  'Westside',
  'Mabatini',
  'Langa Langa',
  'Menengai',
  'Langalanga',
  'Githima',
  'Kaloleni',
]

// All areas including out-of-town
export const ALL_DELIVERY_AREAS: { label: string; inTown: boolean }[] = [
  ...NAKURU_TOWN_AREAS.map(a => ({ label: a, inTown: true })),
  { label: 'Naivasha', inTown: false },
  { label: 'Molo', inTown: false },
  { label: 'Gilgil', inTown: false },
  { label: 'Eldama Ravine', inTown: false },
  { label: 'Njoro', inTown: false },
  { label: 'Rongai', inTown: false },
  { label: 'Mau Narok', inTown: false },
  { label: 'Subukia', inTown: false },
  { label: 'Bahati', inTown: false },
  { label: 'Kabazi', inTown: false },
  { label: 'Other (outside Nakuru)', inTown: false },
]

// OQ-2 — minimum free-delivery order (dummy: 0 = no minimum; update when confirmed)
export const FREE_DELIVERY_MINIMUM = 0

// OQ-3 — default deposit % for large orders
export const DEFAULT_DEPOSIT_PCT = 50

export const QUOTE_VALIDITY_DAYS = 7
export const PRICE_STALE_DAYS = 14
