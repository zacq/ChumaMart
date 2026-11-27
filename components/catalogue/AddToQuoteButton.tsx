'use client'
// components/catalogue/AddToQuoteButton.tsx
// Client component — adds a product to the Zustand Quote List
import { useState } from 'react'
import { ShoppingCart, Check, Minus, Plus } from 'lucide-react'
import { useQuoteList } from '@/store/quote-list'
import { cn } from '@/lib/utils'
import type { QuoteItem } from '@/store/quote-list'

interface AddToQuoteButtonProps {
  product: Omit<QuoteItem, 'qty'>
  variant?: 'card' | 'full'   // card = compact, full = product page
}

export default function AddToQuoteButton({ product, variant = 'card' }: AddToQuoteButtonProps) {
  const addItem     = useQuoteList(s => s.addItem)
  const updateQty   = useQuoteList(s => s.updateQty)
  const removeItem  = useQuoteList(s => s.removeItem)
  const getItemQty  = useQuoteList(s => s.getItemQty)

  const [localQty, setLocalQty] = useState(1)
  const [added, setAdded] = useState(false)
  const inListQty = getItemQty(product.product_id)

  function handleAdd() {
    addItem(product, localQty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  if (inListQty > 0) {
    // Show stepper once item is in the list
    return (
      <div className={cn('flex items-center gap-1', variant === 'full' ? 'gap-2' : '')}>
        <button
          onClick={() => inListQty === 1 ? removeItem(product.product_id) : updateQty(product.product_id, inListQty - 1)}
          className="h-9 w-9 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className={cn('text-sm font-semibold text-gray-900 min-w-[2rem] text-center', variant === 'full' && 'text-base')}>
          {inListQty}
        </span>
        <button
          onClick={() => updateQty(product.product_id, inListQty + 1)}
          className="h-9 w-9 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
        <span className={cn('text-xs text-gray-500', variant === 'full' && 'text-sm')}>{product.unit}</span>
        <div className="ml-1 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="h-3 w-3 text-green-600" />
        </div>
      </div>
    )
  }

  if (variant === 'full') {
    return (
      <div className="flex items-center gap-3 flex-wrap">
        {/* Qty stepper before adding */}
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setLocalQty(Math.max(1, localQty - 1))}
            className="px-3 py-2.5 hover:bg-gray-100 transition-colors"
            aria-label="Decrease"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-4 py-2.5 font-semibold text-sm border-x border-gray-300 min-w-[3rem] text-center">{localQty}</span>
          <button
            onClick={() => setLocalQty(localQty + 1)}
            className="px-3 py-2.5 hover:bg-gray-100 transition-colors"
            aria-label="Increase"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={handleAdd}
          className={cn('btn-primary flex-1', added && 'bg-green-600 hover:bg-green-700')}
        >
          {added ? <><Check className="h-5 w-5" /> Added!</> : <><ShoppingCart className="h-5 w-5" /> Add to Quote List</>}
        </button>
      </div>
    )
  }

  // Card variant — compact
  return (
    <button
      onClick={handleAdd}
      className={cn(
        'w-full mt-2 rounded-lg border border-brand-200 py-2 text-xs font-semibold text-brand-700',
        'hover:bg-brand-700 hover:text-white hover:border-brand-700 transition-all flex items-center justify-center gap-1.5',
        added && 'bg-green-600 text-white border-green-600 hover:bg-green-700 hover:border-green-700'
      )}
    >
      {added ? <><Check className="h-3.5 w-3.5" /> Added!</> : <><ShoppingCart className="h-3.5 w-3.5" /> Add to Quote</>}
    </button>
  )
}
