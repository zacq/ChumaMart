// app/(site)/[category]/[slug]/page.tsx — Product detail page (FR-10)
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Phone, MessageCircle, Truck, CheckCircle, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, effectivePrice, formatDate, stockLabel } from '@/lib/utils'
import { whatsappUrl } from '@/lib/utils'
import { SITE } from '@/lib/constants'
import AddToQuoteButton from '@/components/catalogue/AddToQuoteButton'
import type { ProductWithPrice } from '@/lib/supabase/types'

export const revalidate = 1800

interface Props { params: { category: string; slug: string } }

async function getProduct(slug: string): Promise<ProductWithPrice | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('products')
    .select(`*, prices(*), categories(name, slug)`)
    .eq('slug', slug)
    .single()
  return data as unknown as ProductWithPrice | null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct(params.slug)
  if (!p) return {}
  const price = p.prices ? effectivePrice(p.prices) : null
  return {
    title: `${p.name} Price in Kenya | ChumaHardware Nakuru`,
    description: `Buy ${p.name} from ChumaHardware in Nakuru. ${price ? `Price: ${formatPrice(price)} ${p.unit}.` : ''} Free delivery in Nakuru town. Pay by M-Pesa.`,
    openGraph: {
      images: p.photos?.[0] ? [{ url: p.photos[0], alt: p.name }] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug)
  if (!product) notFound()

  const price = product.prices ? effectivePrice(product.prices) : null
  const isOffer = !!(product.prices?.offer_price && price === product.prices.offer_price)
  const { text: stockText, color: stockColor } = stockLabel(product.stock_status)
  const tiers = (product.prices?.tiers as any) ?? []
  const categorySlug = product.categories?.slug ?? params.category

  const quoteItem = {
    product_id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    size_grade: product.size_grade,
    unit: product.unit,
    unit_price: price ?? 0,
    base_price: price ?? 0,
    tiers,
    photo: product.photos?.[0] ?? null,
    category_slug: categorySlug,
  }

  const waMessage = `Hello ChumaHardware! I'm interested in: ${product.name}${product.size_grade ? ` (${product.size_grade})` : ''}. Please send me a quote.`

  return (
    <div className="container-site py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 flex-wrap">
          <li><Link href="/" className="hover:text-brand-700">Home</Link></li>
          <li>/</li>
          <li><Link href={`/${categorySlug}`} className="hover:text-brand-700">{product.categories?.name}</Link></li>
          <li>/</li>
          <li className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 relative">
            {product.photos?.[0] ? (
              <Image
                src={product.photos[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl text-gray-200">📦</div>
            )}
          </div>
          {/* Thumbnail strip */}
          {product.photos && product.photos.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {product.photos.slice(1).map((ph, i) => (
                <div key={i} className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                  <Image src={ph} alt={`${product.name} ${i+2}`} fill className="object-cover" sizes="64px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {/* Stock badge */}
          <span className={`badge ${stockColor} mb-3`}>{stockText}</span>

          <h1 className="text-2xl font-black text-gray-900 mb-1">{product.name}</h1>
          {product.brand && <div className="text-gray-500 text-sm mb-1">Brand: <span className="font-medium">{product.brand}</span></div>}
          {product.size_grade && <div className="text-gray-500 text-sm mb-3">Size/Grade: <span className="font-medium">{product.size_grade}</span></div>}

          {/* Price */}
          <div className="mb-4">
            {price !== null && price > 0 ? (
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-brand-700">{formatPrice(price)}</span>
                  {isOffer && product.prices?.unit_price && (
                    <span className="text-lg line-through text-gray-400">{formatPrice(product.prices.unit_price)}</span>
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-0.5">{product.unit}</div>
                {product.prices?.updated_at && (
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    Price updated {formatDate(product.prices.updated_at)}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500 italic">Price on request — contact us</div>
            )}
          </div>

          {/* Bulk tiers */}
          {tiers.length > 0 && (
            <div className="bg-brand-50 rounded-lg p-4 mb-4">
              <div className="font-semibold text-sm text-brand-800 mb-2">Bulk Pricing</div>
              <table className="w-full text-sm">
                <thead><tr className="text-xs text-brand-600"><th className="text-left pb-1">Quantity</th><th className="text-right pb-1">Unit Price</th></tr></thead>
                <tbody>
                  <tr><td className="py-0.5">1–{(tiers[0]?.min_qty ?? 50) - 1}</td><td className="text-right font-medium">{formatPrice(product.prices?.unit_price ?? 0)}</td></tr>
                  {tiers.map((t: any, i: number) => (
                    <tr key={i}>
                      <td className="py-0.5">{t.min_qty}{tiers[i+1] ? `–${tiers[i+1].min_qty - 1}` : '+'}</td>
                      <td className="text-right font-medium text-brand-700">{formatPrice(t.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Delivery note */}
          <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-5 flex gap-2 text-sm">
            <Truck className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold text-green-800">Free delivery within Nakuru town.</span>
              <span className="text-green-700"> Delivery rate agreed before payment for areas outside Nakuru town.</span>
            </div>
          </div>

          {/* Add to Quote / Actions */}
          {product.stock_status !== 'out_of_stock' ? (
            <div className="space-y-3">
              <AddToQuoteButton product={quoteItem} variant="full" />
              <div className="flex gap-3">
                <a
                  href={whatsappUrl(SITE.whatsapp, waMessage)}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 btn-whatsapp"
                >
                  <MessageCircle className="h-4 w-4" /> Order on WhatsApp
                </a>
                <a href={`tel:${SITE.phone.replace(/\s/g,'')}`} className="btn-secondary px-4">
                  <Phone className="h-4 w-4" />
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex gap-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>Out of stock — <a href={whatsappUrl(SITE.whatsapp, `Hello! Is ${product.name} back in stock soon?`)} target="_blank" className="underline">ask about availability</a></div>
            </div>
          )}

          {/* Specs */}
          {product.specs && Object.keys(product.specs as object).length > 0 && (
            <div className="mt-6">
              <h2 className="font-semibold text-gray-900 mb-3">Specifications</h2>
              <dl className="divide-y divide-gray-100 rounded-lg border border-gray-100 overflow-hidden">
                {Object.entries(product.specs as Record<string, string>).map(([k, v]) => (
                  <div key={k} className="flex justify-between px-3 py-2 text-sm even:bg-gray-50">
                    <dt className="text-gray-500">{k}</dt>
                    <dd className="font-medium text-gray-900 text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* JSON-LD Product (SEO-2) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
            description: `${product.name} ${product.size_grade ?? ''} ${product.unit}`,
            image: product.photos,
            offers: price && price > 0 ? {
              '@type': 'Offer',
              priceCurrency: 'KES',
              price: price.toFixed(2),
              priceValidUntil: product.prices?.offer_end ?? undefined,
              availability: product.stock_status === 'in_stock'
                ? 'https://schema.org/InStock'
                : product.stock_status === 'out_of_stock'
                ? 'https://schema.org/OutOfStock'
                : 'https://schema.org/LimitedAvailability',
              seller: { '@type': 'Organization', name: 'ChumaHardware' },
            } : undefined,
          }),
        }}
      />
    </div>
  )
}
