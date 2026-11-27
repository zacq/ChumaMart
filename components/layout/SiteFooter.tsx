// components/layout/SiteFooter.tsx — FR-3
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'
import { SITE, YARD, MPESA } from '@/lib/constants'
import { whatsappUrl } from '@/lib/utils'

const CATEGORY_LINKS = [
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
  { label: 'Track Order',  href: '/track' },
]

export default function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 pb-20 sm:pb-0">
      <div className="container-site py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand + contact */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-brand-700 flex items-center justify-center">
                <span className="text-white font-black text-lg">C</span>
              </div>
              <div>
                <div className="font-black text-white text-sm">ChumaMart Hardware</div>
                <div className="text-[10px] text-gray-400">Nakuru Industrial Area</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-5">
              Reliable building materials in Nakuru — cement, steel, iron sheets, tanks, paints and more.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <MapPin className="h-4 w-4 text-brand-400 mt-0.5 flex-shrink-0" />
                <a href={YARD.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  {YARD.address}
                  <span className="block text-xs text-gray-500">Plus code: {YARD.plusCode}</span>
                </a>
              </li>
              <li className="flex gap-2">
                <Clock className="h-4 w-4 text-brand-400 mt-0.5 flex-shrink-0" />
                <span>{YARD.hours}</span>
              </li>
              <li className="flex gap-2">
                <Phone className="h-4 w-4 text-brand-400 mt-0.5 flex-shrink-0" />
                <a href={`tel:${SITE.phone.replace(/\s/g,'')}`} className="hover:text-white">{SITE.phone}</a>
              </li>
              <li className="flex gap-2">
                <MessageCircle className="h-4 w-4 text-[#25D366] mt-0.5 flex-shrink-0" />
                <a
                  href={whatsappUrl(SITE.whatsapp, 'Hello ChumaMart!')}
                  target="_blank" rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  WhatsApp us
                </a>
              </li>
              <li className="flex gap-2">
                <Mail className="h-4 w-4 text-brand-400 mt-0.5 flex-shrink-0" />
                <a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-white mb-4">Products</h3>
            <ul className="space-y-2 text-sm">
              {CATEGORY_LINKS.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More links */}
          <div>
            <h3 className="font-semibold text-white mb-4">More</h3>
            <ul className="space-y-2 text-sm">
              {MORE_LINKS.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Delivery & Payment */}
          <div>
            <h3 className="font-semibold text-white mb-4">Delivery & Payment</h3>
            <div className="space-y-3 text-sm">
              <div className="rounded-lg bg-gray-800 p-3">
                <div className="font-semibold text-green-400 mb-1">🚚 Free Delivery</div>
                <p className="text-gray-400">Free delivery within Nakuru town. Same-day or next-day scheduling.</p>
              </div>
              <div className="rounded-lg bg-gray-800 p-3">
                <div className="font-semibold text-gold-400 mb-1">📦 Outside Nakuru</div>
                <p className="text-gray-400">Delivery rate agreed before payment. We serve Naivasha, Molo, Gilgil and beyond.</p>
              </div>
              <div className="rounded-lg bg-gray-800 p-3">
                <div className="font-semibold text-white mb-2">Pay by M-Pesa</div>
                <div className="text-gray-400 text-xs space-y-1">
                  <div>Paybill: <span className="font-mono text-white">{MPESA.paybill}</span></div>
                  <div>Account: <span className="font-mono text-white">{MPESA.account}</span></div>
                  <div className="mt-2 text-[11px]">Or pay online via M-Pesa STK Push at checkout</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container-site py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} ChumaMart Hardware. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
