// lib/utils.ts — shared helpers
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ProductWithPrice } from '@/lib/supabase/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format KES price: 1800 → "KSh 1,800" */
export function formatPrice(amount: number): string {
  if (amount === 0) return 'Price on request'
  return `KSh ${amount.toLocaleString('en-KE')}`
}

/** Format date: "2026-11-27" → "27 Nov 2026" */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-KE', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

/** Generate a unique ChumaMart reference number */
export function generateRef(): string {
  const year = new Date().getFullYear()
  const rand = Math.floor(Math.random() * 90000) + 10000
  return `CM-${year}-${rand}`
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Build WhatsApp click-to-chat URL */
export function whatsappUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

/** Build a WhatsApp message for a quote list */
export function buildQuoteListMessage(
  lines: { name: string; qty: number; unit: string; unit_price: number }[],
  location: string
): string {
  const rows = lines
    .map(l => `• ${l.qty}× ${l.name} (${l.unit}) @ KSh ${l.unit_price.toLocaleString()} = KSh ${(l.qty * l.unit_price).toLocaleString()}`)
    .join('\n')
  const total = lines.reduce((s, l) => s + l.qty * l.unit_price, 0)
  return (
    `Hello ChumaMart 👋\n\nI'd like a quote for the following:\n\n` +
    `${rows}\n\n` +
    `*Total (ex delivery):* KSh ${total.toLocaleString()}\n` +
    `*Delivery location:* ${location}\n\n` +
    `Please confirm availability and delivery charges. Thank you!`
  )
}

/** Check if a price is stale (> 14 days) */
export function isPriceStale(updatedAt: string, staleDays = 14): boolean {
  const diff = Date.now() - new Date(updatedAt).getTime()
  return diff > staleDays * 24 * 60 * 60 * 1000
}

/** Get the effective price (offer or regular) */
export function effectivePrice(price: { unit_price: number; offer_price: number | null; offer_start: string | null; offer_end: string | null }): number {
  if (!price.offer_price) return price.unit_price
  const now = new Date()
  const start = price.offer_start ? new Date(price.offer_start) : null
  const end = price.offer_end ? new Date(price.offer_end) : null
  if (start && now < start) return price.unit_price
  if (end && now > end) return price.unit_price
  return price.offer_price
}

/** Get tiered price for a quantity */
export function tieredPrice(
  basePrice: number,
  tiers: { min_qty: number; price: number }[],
  qty: number
): number {
  const sorted = [...tiers].sort((a, b) => b.min_qty - a.min_qty)
  for (const tier of sorted) {
    if (qty >= tier.min_qty) return tier.price
  }
  return basePrice
}

/** Normalise a Kenyan phone number to 2547XXXXXXXX / 2541XXXXXXXX */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/[^\d]/g, '')
  if (digits.startsWith('254')) return digits
  if (digits.startsWith('0')) return '254' + digits.slice(1)
  if (digits.length === 9) return '254' + digits
  return digits
}

/** Build a Quote List item from a catalogue product */
export function toQuoteItem(product: ProductWithPrice) {
  return {
    product_id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    size_grade: product.size_grade,
    unit: product.unit,
    unit_price: product.prices ? effectivePrice(product.prices) : 0,
    base_price: product.prices ? effectivePrice(product.prices) : 0,
    tiers: product.prices?.tiers ?? [],
    photo: product.photos?.[0] ?? null,
    category_slug: product.categories?.slug ?? '',
  }
}

/** Stock status label */
export function stockLabel(status: string): { text: string; color: string } {
  switch (status) {
    case 'in_stock':   return { text: 'In Stock',   color: 'text-green-700 bg-green-100' }
    case 'low':        return { text: 'Low Stock',   color: 'text-amber-700 bg-amber-100' }
    case 'on_order':   return { text: 'On Order',    color: 'text-blue-700 bg-blue-100'   }
    case 'out_of_stock': return { text: 'Out of Stock', color: 'text-red-700 bg-red-100' }
    default: return { text: status, color: 'text-gray-700 bg-gray-100' }
  }
}
