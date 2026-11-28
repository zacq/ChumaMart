// app/(site)/search/page.tsx — Full-text search results
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/catalogue/ProductCard'
import type { ProductWithPrice } from '@/lib/supabase/types'

export const metadata: Metadata = { title: 'Search | ChumaHardware' }

interface Props { searchParams: { q?: string } }

export default async function SearchPage({ searchParams }: Props) {
  const q = searchParams.q?.trim() ?? ''
  let products: ProductWithPrice[] = []

  if (q.length >= 2) {
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select(`*, prices(*), categories(name, slug)`)
      .textSearch('search_text', q, { type: 'websearch', config: 'english' })
      .limit(40)
    products = (data as unknown as ProductWithPrice[]) ?? []
  }

  return (
    <div className="container-site py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        {q ? `Search results for "${q}"` : 'Search'}
      </h1>
      {q && <p className="text-gray-500 text-sm mb-6">{products.length} product{products.length !== 1 ? 's' : ''} found</p>}

      {!q && (
        <p className="text-gray-500 py-8">Enter a search term to find products.</p>
      )}

      {q && products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🔍</div>
          <div className="font-semibold text-gray-700 mb-1">No results for &quot;{q}&quot;</div>
          <div className="text-sm text-gray-400">Try a different search term, or <a href="/contact" className="text-brand-700 hover:underline">contact us</a> and we&apos;ll source it for you.</div>
        </div>
      )}

      {products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
