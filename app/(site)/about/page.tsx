// app/(site)/about/page.tsx — FR-15
import type { Metadata } from 'next'
import { MapPin, Phone, Mail, Award, Users, Truck, Clock } from 'lucide-react'
import Link from 'next/link'
import { SITE, YARD } from '@/lib/constants'
import { whatsappUrl } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'About ChumaMart Hardware | Building Materials Nakuru',
  description: 'ChumaMart Hardware is a trusted building materials supplier based in Nakuru Industrial Area, Kenya. We stock cement, steel, iron sheets, water tanks, paints and more.',
}

const BRANDS = ['Bamburi', 'Simba', 'Blue Triangle', 'Rhino', 'Savannah', 'Rai', 'Crown Paints', 'Kentank']

export default function AboutPage() {
  return (
    <div className="container-site py-10">
      <h1 className="text-3xl font-black text-gray-900 mb-6">About ChumaMart Hardware</h1>

      <div className="grid gap-10 lg:grid-cols-2 mb-12">
        <div className="space-y-5 text-gray-600">
          <p className="text-lg font-medium text-gray-800">
            ChumaMart Hardware is a building materials supplier based in Nakuru Industrial Area, Kenya.
          </p>
          <p>
            We supply cement, reinforcing steel, iron sheets, water tanks, paints, gypsum boards, plumbing fittings, fencing and tools to homeowners, fundis, contractors and developers across Nakuru and the surrounding region.
          </p>
          <p>
            Our yard in Nakuru Industrial Area is stocked with the leading brands. We offer free delivery within Nakuru town and can arrange delivery at an agreed rate to areas outside Nakuru.
          </p>
          <p>
            From version 2 of our website, you can browse all 70+ products with clear prices and units, build a Quote List, pay by M-Pesa online, and track your delivery — all from your phone.
          </p>
        </div>

        {/* Yard photo placeholder */}
        <div className="rounded-xl bg-gray-100 aspect-video flex items-center justify-center border border-gray-200">
          <div className="text-center text-gray-400">
            <div className="text-5xl mb-2">🏗️</div>
            <div className="text-sm">Yard photo coming soon</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { icon: Award,  label: 'Brands stocked', value: '8+' },
          { icon: Users,  label: 'Product lines',  value: '70+' },
          { icon: Truck,  label: 'Free delivery',  value: 'Nakuru town' },
          { icon: Phone,  label: 'Quote turnaround', value: '< 2 hrs' },
        ].map(item => (
          <div key={item.label} className="card p-5 text-center">
            <item.icon className="h-7 w-7 text-brand-600 mx-auto mb-2" />
            <div className="text-xl font-black text-gray-900">{item.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Brands */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Brands We Stock</h2>
        <div className="flex flex-wrap gap-3">
          {BRANDS.map(b => (
            <span key={b} className="rounded-full bg-brand-50 border border-brand-200 text-brand-800 px-4 py-2 text-sm font-medium">
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Find us */}
      <div className="card p-6">
        <h2 className="font-bold text-gray-900 mb-4">Find Us</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div className="flex gap-2">
            <MapPin className="h-5 w-5 text-brand-600 mt-0.5 flex-shrink-0" />
            <div><div className="font-semibold">Address</div><div className="text-gray-500">{YARD.address}</div><div className="text-gray-400 text-xs">Plus code: {YARD.plusCode}</div></div>
          </div>
          <div className="flex gap-2">
            <Clock className="h-5 w-5 text-brand-600 mt-0.5 flex-shrink-0" />
            <div><div className="font-semibold">Hours</div><div className="text-gray-500">{YARD.hours}</div></div>
          </div>
          <div className="flex gap-2">
            <Phone className="h-5 w-5 text-brand-600 mt-0.5 flex-shrink-0" />
            <div><div className="font-semibold">Phone / WhatsApp</div><div className="text-gray-500">{SITE.phone}</div></div>
          </div>
          <div className="flex gap-2">
            <Mail className="h-5 w-5 text-brand-600 mt-0.5 flex-shrink-0" />
            <div><div className="font-semibold">Email</div><div className="text-gray-500">{SITE.email}</div></div>
          </div>
        </div>
        <div className="mt-4 flex gap-3 flex-wrap">
          <a href={YARD.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary"><MapPin className="h-4 w-4" /> Get Directions</a>
          <a href={whatsappUrl(SITE.whatsapp, 'Hello ChumaMart!')} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">WhatsApp Us</a>
          <Link href="/contact" className="btn-secondary">Enquiry Form</Link>
        </div>
      </div>
    </div>
  )
}
