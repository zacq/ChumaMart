// app/(site)/offers/page.tsx — FR-14
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDate, effectivePrice } from '@/lib/utils'
import type { ProductWithPrice } from '@/lib/supabase/types'

export const metadata: Metadata = {
  title: 'Offers & Price Updates | ChumaHardware Nakuru',
  description: 'Current building material offers and price updates at ChumaHardware Nakuru.',
}

export const revalidate = 3600

export default async function OffersPage() {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data } = await supabase
    .from('products')
    .select(`*, prices(*), categories(name, slug)`)
    .not('prices.offer_price', 'is', null)
    .lte('prices.offer_start', today)
    .gte('prices.offer_end', today)

  const offers = (data as unknown as ProductWithPrice[]) ?? []

  return (
    <div className="container-site py-10">
      <h1 className="text-3xl font-black text-gray-900 mb-2">Offers & Price Updates</h1>
      <p className="text-gray-500 mb-8">Current promotions at ChumaHardware. Prices valid until end date shown.</p>

      {offers.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🏷️</div>
          <div className="font-semibold text-gray-700 mb-1">No active offers right now</div>
          <div className="text-sm text-gray-400">Check back soon or <Link href="/contact" className="text-brand-700 hover:underline">contact us</Link> for bulk pricing.</div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map(p => {
            const offerPrice = effectivePrice(p.prices!)
            return (
              <Link key={p.id} href={`/${p.categories?.slug}/${p.slug}`} className="card overflow-hidden hover:shadow-md transition-shadow group">
                <div className="relative aspect-video bg-gray-100">
                  {p.photos?.[0] && <Image src={p.photos[0]} alt={p.name} fill className="object-cover" sizes="(max-width:640px) 100vw, 33vw" />}
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">OFFER</div>
                </div>
                <div className="p-4">
                  <div className="font-semibold text-gray-900 group-hover:text-brand-700 mb-1">{p.name}</div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xl font-black text-brand-700">{formatPrice(offerPrice)}</span>
                    <span className="text-sm line-through text-gray-400">{formatPrice(p.prices!.unit_price)}</span>
                  </div>
                  <div className="text-xs text-gray-500">{p.unit}</div>
                  {p.prices?.offer_end && (
                    <div className="text-xs text-red-600 mt-1 font-medium">Valid until {formatDate(p.prices.offer_end)}</div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
