'use client'
// components/layout/SiteHeader.tsx — FR-1
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, Phone, Menu, X, ChevronDown } from 'lucide-react'
import { useQuoteList } from '@/store/quote-list'
import { SITE } from '@/lib/constants'

const NAV_CATEGORIES = [
  { label: 'Cement',           href: '/cement' },
  { label: 'Steel & Wire',     href: '/steel-wire' },
  { label: 'Roofing',          href: '/roofing' },
  { label: 'Water Tanks',      href: '/water-tanks' },
  { label: 'Paints',           href: '/paints' },
  { label: 'Gypsum & Ceiling', href: '/gypsum-ceiling' },
  { label: 'Plumbing & Pipes', href: '/plumbing-pipes' },
  { label: 'Fencing',          href: '/fencing' },
  { label: 'Tools & Hardware', href: '/tools-hardware' },
]

const MORE_LINKS = [
  { label: 'Calculators',  href: '/calculators' },
  { label: 'Delivery',     href: '/delivery' },
  { label: 'Contractors',  href: '/contractors' },
  { label: 'Offers',       href: '/offers' },
  { label: 'About',        href: '/about' },
  { label: 'Contact',      href: '/contact' },
]

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const totalItems = useQuoteList(s => s.totalItems)
  const count = totalItems()
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setMobileOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      {/* Top bar */}
      <div className="container-site">
        <div className="flex items-center gap-3 py-3">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 mr-2">
            <div className="w-9 h-9 rounded-lg bg-brand-700 flex items-center justify-center">
              <span className="text-white font-black text-lg leading-none">C</span>
            </div>
            <div className="hidden xs:block">
              <div className="font-black text-brand-800 text-sm leading-tight">ChumaHardware</div>
              <div className="text-[10px] text-gray-500 leading-tight">Nakuru</div>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Search cement, D12, Kentank 5000L…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-9 pr-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 min-h-[44px]"
              />
            </div>
          </form>

          {/* Desktop actions */}
          <div className="hidden sm:flex items-center gap-2 ml-auto">
            <a
              href={`tel:${SITE.phone.replace(/\s/g,'')}`}
              className="flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-800 px-3 py-2 rounded-lg hover:bg-brand-50 transition-colors min-h-[44px]"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden md:inline">{SITE.phone}</span>
            </a>
            <Link
              href="/quote-list"
              className="relative flex items-center gap-1.5 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 transition-colors min-h-[44px]"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Quote List</span>
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-white">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="sm:hidden ml-auto p-2 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Desktop category nav */}
        <nav className="hidden sm:flex items-center gap-1 pb-2 overflow-x-auto scrollbar-hide">
          {NAV_CATEGORIES.map(cat => (
            <Link
              key={cat.href}
              href={cat.href}
              className="flex-shrink-0 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-brand-700 hover:bg-brand-50 transition-colors whitespace-nowrap"
            >
              {cat.label}
            </Link>
          ))}
          <div className="flex-shrink-0 h-5 w-px bg-gray-200 mx-1" />
          {MORE_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="flex-shrink-0 rounded-md px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200 py-2 px-4 max-h-[80vh] overflow-y-auto">
          {/* Mobile search */}
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search products…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-9 pr-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
            </div>
          </form>

          <div className="font-semibold text-xs uppercase tracking-wider text-gray-400 mb-2">Products</div>
          {NAV_CATEGORIES.map(cat => (
            <Link
              key={cat.href}
              href={cat.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between py-3 border-b border-gray-100 text-gray-800 font-medium hover:text-brand-700"
            >
              {cat.label}
            </Link>
          ))}
          <div className="font-semibold text-xs uppercase tracking-wider text-gray-400 mt-4 mb-2">More</div>
          {MORE_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between py-3 border-b border-gray-100 text-gray-700"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 pb-2 flex gap-3">
            <a
              href={`tel:${SITE.phone.replace(/\s/g,'')}`}
              className="flex-1 btn-secondary text-center"
            >
              <Phone className="h-4 w-4" /> Call
            </a>
            <Link
              href="/quote-list"
              onClick={() => setMobileOpen(false)}
              className="flex-1 btn-primary text-center"
            >
              <ShoppingCart className="h-4 w-4" /> Quote List {count > 0 && `(${count})`}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
