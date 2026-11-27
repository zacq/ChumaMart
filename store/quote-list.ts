// store/quote-list.ts
// Zustand store for the Quote List — persisted to localStorage (MO-4)
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { tieredPrice } from '@/lib/utils'
import type { PriceTier } from '@/lib/supabase/types'

export interface QuoteItem {
  product_id: string
  slug: string
  name: string
  brand: string | null
  size_grade: string | null
  unit: string
  unit_price: number          // effective price (offer or regular)
  base_price: number          // regular price (for display)
  tiers: PriceTier[]
  qty: number
  photo: string | null
  category_slug: string
}

export interface BoqFile {
  path: string
  name: string
}

interface QuoteListStore {
  items: QuoteItem[]
  boqFiles: BoqFile[]
  // Actions
  addItem: (item: Omit<QuoteItem, 'qty'>, qty?: number) => void
  updateQty: (product_id: string, qty: number) => void
  removeItem: (product_id: string) => void
  clearList: () => void
  addBoq: (file: BoqFile) => void
  removeBoq: (path: string) => void
  // Computed helpers
  totalItems: () => number
  subtotal: () => number
  getItemQty: (product_id: string) => number
}

export const useQuoteList = create<QuoteListStore>()(
  persist(
    (set, get) => ({
      items: [],
      boqFiles: [],

      addItem: (item, qty = 1) => {
        set(state => {
          const existing = state.items.find(i => i.product_id === item.product_id)
          if (existing) {
            const newQty = existing.qty + qty
            const newPrice = tieredPrice(item.base_price, item.tiers, newQty)
            return {
              items: state.items.map(i =>
                i.product_id === item.product_id
                  ? { ...i, qty: newQty, unit_price: newPrice }
                  : i
              ),
            }
          }
          const unitPrice = tieredPrice(item.base_price, item.tiers, qty)
          return { items: [...state.items, { ...item, qty, unit_price: unitPrice }] }
        })
      },

      updateQty: (product_id, qty) => {
        if (qty < 1) {
          get().removeItem(product_id)
          return
        }
        set(state => ({
          items: state.items.map(i => {
            if (i.product_id !== product_id) return i
            const newPrice = tieredPrice(i.base_price, i.tiers, qty)
            return { ...i, qty, unit_price: newPrice }
          }),
        }))
      },

      removeItem: (product_id) =>
        set(state => ({ items: state.items.filter(i => i.product_id !== product_id) })),

      clearList: () => set({ items: [], boqFiles: [] }),

      addBoq: (file) => set(state => ({ boqFiles: [...state.boqFiles, file] })),

      removeBoq: (path) => set(state => ({ boqFiles: state.boqFiles.filter(f => f.path !== path) })),

      totalItems: () => get().items.reduce((s, i) => s + i.qty, 0),

      subtotal: () =>
        get().items.reduce((s, i) => s + i.qty * i.unit_price, 0),

      getItemQty: (product_id) =>
        get().items.find(i => i.product_id === product_id)?.qty ?? 0,
    }),
    {
      name: 'chumamart-quote-list',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
