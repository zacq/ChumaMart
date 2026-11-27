// components/catalogue/ProductCard.tsx — FR-9
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui'
import { formatPrice, effectivePrice, stockLabel } from '@/lib/utils'
import AddToQuoteButton from './AddToQuoteButton'
import type { ProductWithPrice } from '@/lib/supabase/types'

interface ProductCardProps {
  product: ProductWithPrice
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = product.prices ? effectivePrice(product.prices) : null
  const { text: stockText, color: stockColor } = stockLabel(product.stock_status)
  const isOffer = !!(product.prices?.offer_price && price === product.prices.offer_price)
  const categorySlug = product.categories?.slug ?? ''

  const quoteItem = {
    product_id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    size_grade: product.size_grade,
    unit: product.unit,
    unit_price: price ?? 0,
    base_price: price ?? 0,
    tiers: (product.prices?.tiers as any) ?? [],
    photo: product.photos?.[0] ?? null,
    category_slug: categorySlug,
  }

  return (
    <div className="card flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      {/* Photo */}
      <Link href={`/${categorySlug}/${product.slug}`} className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {product.photos?.[0] ? (
          <Image
            src={product.photos[0]}
            alt={product.name}
            fill
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            className="object-cover hover:scale-105 transition-transform"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-200">📦</div>
        )}
        {isOffer && (
          <div className="absolute top-2 left-2 rounded-full bg-red-500 text-white text-[10px] font-bold px-2 py-0.5">OFFER</div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`badge text-[10px] ${stockColor}`}>{stockText}</span>
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3">
        <Link href={`/${categorySlug}/${product.slug}`} className="group">
          <div className="font-semibold text-sm text-gray-900 group-hover:text-brand-700 leading-snug mb-0.5">
            {product.name}
          </div>
          {product.brand && <div className="text-xs text-gray-400">{product.brand}</div>}
          {product.size_grade && <div className="text-xs text-gray-400">{product.size_grade}</div>}
        </Link>

        <div className="mt-auto pt-3 border-t border-gray-100">
          {price !== null && price > 0 ? (
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-brand-700 text-base">{formatPrice(price)}</span>
              {isOffer && product.prices?.unit_price && (
                <span className="text-xs line-through text-gray-400">{formatPrice(product.prices.unit_price)}</span>
              )}
            </div>
          ) : (
            <span className="text-xs text-gray-400 italic">Price on request</span>
          )}
          <div className="text-[11px] text-gray-400 mb-2">{product.unit}</div>

          {product.stock_status !== 'out_of_stock' && (
            <AddToQuoteButton product={quoteItem} variant="card" />
          )}
        </div>
      </div>
    </div>
  )
}
