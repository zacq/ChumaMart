// app/(site)/page.tsx — Home page (FR-5 through FR-7)
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  MessageCircle, Phone, FileText, ArrowRight,
  Truck, CreditCard, CheckCircle, Calculator,
  Star, MapPin, Clock
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDate, effectivePrice } from '@/lib/utils'
import { whatsappUrl } from '@/lib/utils'
import { SITE, YARD } from '@/lib/constants'
import type { ProductWithPrice } from '@/lib/supabase/types'

export const metadata: Metadata = {
  title: 'ChumaMart Hardware – Cement, Steel & Building Materials Prices in Nakuru',
  description:
    'Buy cement, steel bars, iron sheets, water tanks, paints and more from ChumaMart in Nakuru Industrial Area. Free delivery in Nakuru town. Pay by M-Pesa online.',
}

export const revalidate = 3600 // ISR: re-generate every hour

const CATEGORIES = [
  { name: 'Cement',           slug: 'cement',          emoji: '🏗️', desc: 'Bamburi, Simba, Blue Triangle & more' },
  { name: 'Steel & Wire',     slug: 'steel-wire',      emoji: '🔩', desc: 'D-bars, R-bars, binding wire' },
  { name: 'Roofing',          slug: 'roofing',         emoji: '🏠', desc: 'Box profile, corrugated, versatile' },
  { name: 'Water Tanks',      slug: 'water-tanks',     emoji: '💧', desc: 'Kentank 1,000 L – 10,000 L' },
  { name: 'Paints',           slug: 'paints',          emoji: '🎨', desc: 'Crown vinyl, exterior, roof & more' },
  { name: 'Gypsum & Ceiling', slug: 'gypsum-ceiling',  emoji: '🪜', desc: 'Boards, channels, studs & runners' },
  { name: 'Plumbing & Pipes', slug: 'plumbing-pipes',  emoji: '🔧', desc: 'PVC Sch-40, galvanised sleeves' },
  { name: 'Fencing',          slug: 'fencing',         emoji: '🛡️', desc: 'Chain link 4ft – 8ft, 18 m rolls' },
  { name: 'Tools & Hardware', slug: 'tools-hardware',  emoji: '🔨', desc: 'Nails, hinges, tools & fasteners' },
]

const CALCULATORS = [
  { name: 'Concrete Slab', href: '/calculators/concrete', emoji: '🏗️' },
  { name: 'Roofing',       href: '/calculators/roofing',  emoji: '🏠' },
  { name: 'Reinforcement', href: '/calculators/steel',    emoji: '🔩' },
  { name: 'Paint',         href: '/calculators/paint',    emoji: '🎨' },
  { name: 'Water Tank',    href: '/calculators/tank',     emoji: '💧' },
  { name: 'Blockwork',     href: '/calculators/blockwork',emoji: '🧱' },
]

async function getFeaturedProducts(): Promise<ProductWithPrice[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('products')
    .select(`*, prices(*), categories(name, slug)`)
    .eq('featured', true)
    .eq('stock_status', 'in_stock')
    .limit(8)
  return (data as unknown as ProductWithPrice[]) ?? []
}

async function getLatestPriceDate(): Promise<string | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('prices')
    .select('updated_at')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()
  return data?.updated_at ?? null
}

async function getVerifiedReviews() {
  const supabase = createClient()
  const { data } = await supabase
    .from('reviews')
    .select('id, rating, review_text, town, customers(name)')
    .eq('verified', true)
    .order('created_at', { ascending: false })
    .limit(4)
  return (data as unknown as { id: string; rating: number; review_text: string | null; town: string | null; customers: { name: string | null } | null }[]) ?? []
}

export default async function HomePage() {
  const [featured, latestPriceDate, reviews] = await Promise.all([
    getFeaturedProducts(),
    getLatestPriceDate(),
    getVerifiedReviews(),
  ])

  return (
    <>
      {/* ── HERO (FR-5) ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white">
        <div className="container-site py-14 md:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-brand-100 mb-4">
              <MapPin className="h-3.5 w-3.5" /> Nakuru Industrial Area · Open 24 hours
            </div>
            <h1 className="text-3xl font-black sm:text-4xl md:text-5xl leading-tight mb-4">
              Building Materials<br />
              <span className="text-gold-300">at the Right Price</span>
            </h1>
            <p className="text-brand-100 text-lg mb-8">
              Cement, steel, iron sheets, tanks, paints and more — with free delivery in Nakuru town and online M-Pesa payment.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/quote-list" className="btn-gold">
                <FileText className="h-5 w-5" /> Get a Quote
              </Link>
              <a
                href={whatsappUrl(SITE.whatsapp, 'Hello ChumaMart! I need a quote for building materials.')}
                target="_blank" rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <MessageCircle className="h-5 w-5" /> Order on WhatsApp
              </a>
              <a href={`tel:${SITE.phone.replace(/\s/g,'')}`} className="btn-secondary border-white/30 text-white hover:bg-white/10">
                <Phone className="h-5 w-5" /> Call Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── DELIVERY & PAYMENT STRIP (FR-6) ──────────────────────────── */}
      <section className="bg-brand-50 border-y border-brand-100">
        <div className="container-site py-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-brand-800">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-brand-600" />
              <span>Free delivery within Nakuru town</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-brand-600" />
              <span>Agreed delivery rates outside Nakuru</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-brand-600" />
              <span>Pay by M-Pesa online</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY TILES (FR-7) ────────────────────────────────────── */}
      <section className="container-site py-10">
        <h2 className="section-title mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="card p-4 flex flex-col items-center text-center gap-2 hover:border-brand-300 hover:shadow-md transition-all group"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="font-semibold text-sm text-gray-800 group-hover:text-brand-700">{cat.name}</span>
              <span className="text-xs text-gray-500 leading-snug">{cat.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── THIS WEEK'S FEATURED PRICES (FR-7) ──────────────────────── */}
      <section className="bg-gray-50 py-10">
        <div className="container-site">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="section-title">Today's Prices</h2>
            {latestPriceDate && (
              <span className="text-xs text-gray-500">Updated {formatDate(latestPriceDate)}</span>
            )}
          </div>
          {featured.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map(product => (
                <FeaturedProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Products loading…</p>
          )}
          <div className="mt-6 text-center">
            <Link href="/cement" className="btn-secondary">
              See all products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CALCULATORS TEASER (FR-7) ────────────────────────────────── */}
      <section className="container-site py-10">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h2 className="section-title">Material Calculators</h2>
            <p className="text-gray-500 text-sm mt-1">Work out how much you need — estimates added straight to your Quote List.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CALCULATORS.map(c => (
            <Link
              key={c.href}
              href={c.href}
              className="card p-4 flex flex-col items-center text-center gap-2 hover:border-brand-300 hover:shadow-md transition-all group"
            >
              <span className="text-2xl">{c.emoji}</span>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-brand-700">{c.name}</span>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link href="/calculators" className="text-sm text-brand-700 font-medium hover:underline flex items-center justify-center gap-1">
            <Calculator className="h-4 w-4" /> Open all calculators
          </Link>
        </div>
      </section>

      {/* ── HOW IT WORKS (FR-7) ─────────────────────────────────────── */}
      <section className="bg-brand-800 text-white py-12">
        <div className="container-site">
          <h2 className="text-2xl font-bold text-center mb-10">How Ordering Works</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '1', icon: '📋', title: 'Build your Quote List', desc: 'Add items from any page. Add quantities, use calculators, or upload your BOQ.' },
              { step: '2', icon: '💬', title: 'Get a Quote', desc: 'Send your list to us. We price it, add delivery and send you a PDF quote.' },
              { step: '3', icon: '📱', title: 'Pay by M-Pesa', desc: 'Pay in Nakuru town at checkout or via the "Pay this quote" link in your PDF.' },
              { step: '4', icon: '🚚', title: 'We Deliver', desc: 'Free delivery in Nakuru town. Agreed rates outside. Dispatch notice with driver details.' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl mb-3">
                  {item.icon}
                </div>
                <div className="font-bold text-brand-200 text-sm mb-1">Step {item.step}</div>
                <div className="font-semibold text-white mb-2">{item.title}</div>
                <div className="text-brand-200 text-sm">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VERIFIED REVIEWS (FR-4, FR-7) ───────────────────────────── */}
      {reviews.length > 0 && (
      <section className="container-site py-10">
        <h2 className="section-title mb-6">What Our Customers Say</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map(r => (
            <div key={r.id} className="card p-5">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">&ldquo;{r.review_text}&rdquo;</p>
              <div>
                <div className="font-semibold text-sm text-gray-900">{r.customers?.name ?? 'Verified customer'}</div>
                {r.town && (
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />{r.town}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* ── YARD MAP + HOURS (FR-7) ───────────────────────────────────── */}
      <section className="bg-gray-50 py-10">
        <div className="container-site">
          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <div>
              <h2 className="section-title mb-4">Find Us in Nakuru Industrial Area</h2>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-brand-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Yard Address</div>
                    <div className="text-gray-500">{YARD.address}</div>
                    <div className="text-gray-400 text-xs">Plus code: {YARD.plusCode}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock className="h-5 w-5 text-brand-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Opening Hours</div>
                    <div className="text-gray-500">{YARD.hours}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone className="h-5 w-5 text-brand-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Phone / WhatsApp</div>
                    <div className="text-gray-500">{SITE.phone}</div>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <a href={YARD.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <MapPin className="h-4 w-4" /> Get Directions
                </a>
                <a
                  href={whatsappUrl(SITE.whatsapp, 'Hello ChumaMart!')}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-whatsapp"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-video">
              <iframe
                src={YARD.mapsEmbedUrl}
                title="ChumaMart Hardware yard location"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────── */}
      <section className="container-site py-10 text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to order?</h2>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">Add items to your Quote List, pay by M-Pesa or request a quote — all in a few taps.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/cement" className="btn-primary">
            Browse Products <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/quote-list" className="btn-secondary">
            <FileText className="h-4 w-4" /> My Quote List
          </Link>
        </div>
      </section>
    </>
  )
}

// ── Featured product card (server component) ─────────────────────────────────
function FeaturedProductCard({ product }: { product: ProductWithPrice }) {
  const price = product.prices ? effectivePrice(product.prices) : null
  const isOffer = product.prices?.offer_price && price === product.prices.offer_price

  return (
    <Link href={`/${product.categories?.slug ?? ''}/${product.slug}`} className="card p-4 hover:shadow-md transition-shadow group">
      <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
        {product.photos?.[0] ? (
          <Image
            src={product.photos[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">🏗️</div>
        )}
        {isOffer && (
          <div className="absolute top-2 left-2 rounded-full bg-red-500 text-white text-[10px] font-bold px-2 py-0.5">OFFER</div>
        )}
      </div>
      <div className="font-semibold text-sm text-gray-800 group-hover:text-brand-700 leading-snug mb-1">{product.name}</div>
      {product.brand && <div className="text-xs text-gray-400 mb-2">{product.brand}</div>}
      <div className="flex items-baseline justify-between">
        {price !== null && price > 0 ? (
          <div>
            <span className="font-bold text-brand-700">{formatPrice(price)}</span>
            {isOffer && product.prices?.unit_price && (
              <span className="ml-1.5 text-xs line-through text-gray-400">{formatPrice(product.prices.unit_price)}</span>
            )}
          </div>
        ) : (
          <span className="text-xs text-gray-400 italic">Price on request</span>
        )}
      </div>
      <div className="text-xs text-gray-400 mt-0.5">{product.unit}</div>
    </Link>
  )
}
