'use client'
// components/layout/StickyMobileBar.tsx
// Sticky bottom bar: WhatsApp · Call · Quote List (FR-2, MO-2)
import Link from 'next/link'
import { Phone, MessageCircle, ShoppingCart } from 'lucide-react'
import { useQuoteList } from '@/store/quote-list'
import { SITE } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import { whatsappUrl } from '@/lib/utils'

export default function StickyMobileBar() {
  const totalItems = useQuoteList(s => s.totalItems)
  const subtotal   = useQuoteList(s => s.subtotal)
  const count = totalItems()
  const total = subtotal()

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 sm:hidden bg-white border-t border-gray-200 shadow-lg"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-3 divide-x divide-gray-200">
        {/* WhatsApp */}
        <a
          href={whatsappUrl(SITE.whatsapp, 'Hello ChumaMart! I need a quote.')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-3 gap-0.5 text-[#25D366] hover:bg-green-50 transition-colors min-h-[56px]"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs font-medium text-gray-700">WhatsApp</span>
        </a>

        {/* Call */}
        <a
          href={`tel:${SITE.phone.replace(/\s/g, '')}`}
          className="flex flex-col items-center justify-center py-3 gap-0.5 text-brand-700 hover:bg-brand-50 transition-colors min-h-[56px]"
          aria-label="Call ChumaMart"
        >
          <Phone className="h-5 w-5" />
          <span className="text-xs font-medium text-gray-700">Call</span>
        </a>

        {/* Quote List */}
        <Link
          href="/quote-list"
          className="relative flex flex-col items-center justify-center py-3 gap-0.5 text-brand-700 hover:bg-brand-50 transition-colors min-h-[56px]"
          aria-label={`Quote list: ${count} items`}
        >
          <div className="relative">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-white">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </div>
          <span className="text-xs font-medium text-gray-700">
            {count > 0 ? formatPrice(total) : 'Quote List'}
          </span>
        </Link>
      </div>
    </div>
  )
}
