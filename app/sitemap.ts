// app/sitemap.ts — Dynamic sitemap (SEO-2)
import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SITE } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient()

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from('products').select('slug, created_at, prices(updated_at), categories(slug)'),
    supabase.from('categories').select('slug, created_at'),
  ])

  const categoryUrls: MetadataRoute.Sitemap = (categories ?? []).map(cat => ({
    url: `${SITE.url}/${cat.slug}`,
    lastModified: cat.created_at,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const productUrls: MetadataRoute.Sitemap = (products ?? []).map((p: any) => ({
    url: `${SITE.url}/${p.categories?.slug}/${p.slug}`,
    lastModified: p.prices?.updated_at ?? p.created_at,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  const staticUrls: MetadataRoute.Sitemap = [
    { url: SITE.url,                   changeFrequency: 'daily',   priority: 1.0 },
    { url: `${SITE.url}/calculators`,  changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/delivery`,     changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE.url}/contractors`,  changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE.url}/offers`,       changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${SITE.url}/about`,        changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE.url}/contact`,      changeFrequency: 'monthly', priority: 0.5 },
  ]

  return [...staticUrls, ...categoryUrls, ...productUrls]
}
