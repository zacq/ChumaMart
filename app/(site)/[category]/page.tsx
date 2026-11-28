// app/(site)/[category]/page.tsx — Category listing page (FR-8)
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import ProductCard from '@/components/catalogue/ProductCard'
import CategoryFilters, { SortSelect } from '@/components/catalogue/CategoryFilters'
import type { Category, ProductWithPrice } from '@/lib/supabase/types'

export const revalidate = 1800

interface PageProps {
  params: { category: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

async function getCategory(slug: string): Promise<Category | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()
  return data as Category | null
}

async function getProducts(categoryId: string, filters: Record<string, string>): Promise<ProductWithPrice[]> {
  const supabase = createClient()
  let query = supabase
    .from('products')
    .select(`*, prices(*), categories(name, slug)`)
    .eq('category_id', categoryId)

  // Apply sort
  const sort = filters['sort'] ?? 'name'
  if (sort === 'price_asc')  query = query.order('id') // prices join sorted client-side
  else if (sort === 'popular') query = query.eq('featured', true)

  const { data } = await query
  return (data as unknown as ProductWithPrice[]) ?? []
}

async function getLatestPriceDate(categoryId: string): Promise<string | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('prices')
    .select('updated_at, products!inner(category_id)')
    .eq('products.category_id', categoryId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()
  return (data as any)?.updated_at ?? null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const cat = await getCategory(params.category)
  if (!cat) return {}
  const keywords: Record<string, string> = {
    cement: 'cement price Nakuru, buy cement Nakuru, Bamburi cement price Kenya',
    'steel-wire': 'steel price Nakuru, D12 bar price Kenya, deformed bar Nakuru',
    roofing: 'iron sheets price Nakuru, roofing sheets Kenya, box profile price',
    'water-tanks': 'Kentank price Kenya, water tank Nakuru, 5000L tank price',
    paints: 'Crown paint prices Kenya, paint price Nakuru',
    'gypsum-ceiling': 'gypsum board price Nakuru, ceiling boards Kenya',
    'plumbing-pipes': 'PVC pipe price Nakuru, plumbing materials Kenya',
    fencing: 'chain link fencing price Nakuru, fencing Kenya',
    'tools-hardware': 'hardware shop Nakuru, nails price Kenya',
  }
  return {
    title: `${cat.name} Price in Nakuru | ChumaMart Hardware`,
    description: cat.intro_text ?? `Buy ${cat.name.toLowerCase()} in Nakuru at the best prices. Free delivery in Nakuru town. Pay by M-Pesa.`,
    keywords: keywords[params.category],
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const [cat, ] = await Promise.all([getCategory(params.category)])
  if (!cat) notFound()

  const filters: Record<string, string> = {}
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === 'string') filters[k] = v
  }

  const [products, latestPrice] = await Promise.all([
    getProducts(cat.id, filters),
    getLatestPriceDate(cat.id),
  ])

  return (
    <div className="container-site py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li><a href="/" className="hover:text-brand-700">Home</a></li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{cat.name}</li>
        </ol>
      </nav>

      <div className="flex items-baseline justify-between mb-2">
        <h1 className="text-2xl font-black sm:text-3xl text-gray-900">{cat.name} Prices in Nakuru</h1>
      </div>

      {/* Price freshness (PR-3) */}
      {latestPrice && (
        <div className="text-xs text-gray-500 mb-4 flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
          Prices updated {formatDate(latestPrice)}
        </div>
      )}

      {/* SEO intro text */}
      {cat.intro_text && (
        <p className="text-gray-600 text-sm mb-6 max-w-3xl">{cat.intro_text}</p>
      )}

      <div className="lg:grid lg:grid-cols-[220px_1fr] gap-8">
        {/* Filters sidebar */}
        <aside className="hidden lg:block">
          <CategoryFilters filterSchema={cat.filter_schema} currentFilters={filters} />
        </aside>

        {/* Product grid */}
        <div>
          {/* Sort + count bar */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm text-gray-500">{products.length} products</span>
            <SortSelect value={filters.sort ?? 'name'} />
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">📭</div>
              <div className="font-medium">No products found</div>
              <div className="text-sm mt-1">Try a different filter or <a href="/contact" className="text-brand-700 hover:underline">contact us</a>.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
