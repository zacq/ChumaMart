'use client'
// components/catalogue/CategoryFilters.tsx — FR-8
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

interface CategoryFiltersProps {
  filterSchema: Record<string, string[]>   // e.g. {"Brand":["Bamburi","Simba"], "Grade":["32.5R","42.5N"]}
  currentFilters: Record<string, string>
}

export function SortSelect({ value }: { value: string }) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  return (
    <select
      name="sort"
      value={value}
      onChange={e => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('sort', e.target.value)
        router.push(`${pathname}?${params.toString()}`)
      }}
      className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:border-brand-500 focus:outline-none"
    >
      <option value="name">Name</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="popular">Featured first</option>
    </select>
  )
}

export default function CategoryFilters({ filterSchema, currentFilters }: CategoryFiltersProps) {
  const router      = useRouter()
  const pathname    = usePathname()
  const searchParams = useSearchParams()

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (params.get(key) === value) {
        params.delete(key)   // toggle off
      } else {
        params.set(key, value)
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  const clearAll = () => router.push(pathname)

  const hasFilters = Object.keys(filterSchema).some(k => currentFilters[k.toLowerCase()])

  return (
    <div className="sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-sm text-gray-900">Filter</h2>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-brand-700 hover:underline">Clear all</button>
        )}
      </div>
      {Object.entries(filterSchema).map(([label, options]) => {
        const key = label.toLowerCase()
        const active = currentFilters[key]
        return (
          <div key={label} className="mb-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{label}</div>
            <div className="space-y-1.5">
              {options.map(opt => (
                <button
                  key={opt}
                  onClick={() => setFilter(key, opt)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    active === opt
                      ? 'bg-brand-700 text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
