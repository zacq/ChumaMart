// app/(site)/delivery/page.tsx — FR-12
import type { Metadata } from 'next'
import { Truck, CheckCircle, AlertCircle, MapPin } from 'lucide-react'
import { NAKURU_TOWN_AREAS, YARD, MPESA } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Delivery & Transport | ChumaHardware Nakuru',
  description: 'Free delivery within Nakuru town. Agreed delivery rates outside Nakuru. ChumaHardware delivers cement, steel, iron sheets and building materials across the region.',
}

export default function DeliveryPage() {
  return (
    <div className="container-site py-10">
      <h1 className="text-3xl font-black text-gray-900 mb-2">Delivery & Transport</h1>
      <p className="text-gray-500 mb-10 max-w-2xl">
        We deliver building materials from our yard in Nakuru Industrial Area. Delivery within Nakuru town is free. For areas outside Nakuru town, we agree a rate before you pay.
      </p>

      <div className="grid gap-6 md:grid-cols-2 mb-10">
        {/* Free delivery */}
        <div className="card p-6 border-green-200 bg-green-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-green-900">Free Delivery — Nakuru Town</h2>
          </div>
          <ul className="space-y-2 text-sm text-green-800 mb-4">
            <li className="flex gap-2"><CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" /> No delivery charge for in-town areas</li>
            <li className="flex gap-2"><CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" /> Same-day or next-day delivery</li>
            <li className="flex gap-2"><CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" /> Driver name and phone sent on dispatch</li>
            <li className="flex gap-2"><AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" /> Site must be accessible by delivery truck</li>
          </ul>
          <div className="font-semibold text-sm text-green-900 mb-2">Free delivery areas include:</div>
          <div className="flex flex-wrap gap-1.5">
            {NAKURU_TOWN_AREAS.slice(0, 20).map(a => (
              <span key={a} className="text-xs bg-white text-green-800 border border-green-200 rounded-full px-2.5 py-1">{a}</span>
            ))}
            <span className="text-xs text-green-600 italic self-center">…and more</span>
          </div>
        </div>

        {/* Outside Nakuru */}
        <div className="card p-6 border-amber-200 bg-amber-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-amber-900">Outside Nakuru Town</h2>
          </div>
          <p className="text-sm text-amber-800 mb-4">
            For deliveries outside Nakuru town (Naivasha, Molo, Gilgil, Eldama Ravine and other areas), we agree a rate based on distance, load size and vehicle before you pay.
          </p>
          <ul className="space-y-2 text-sm text-amber-800 mb-4">
            <li className="flex gap-2"><CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" /> Rate agreed and shown on your quote</li>
            <li className="flex gap-2"><CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" /> Rate is locked into your payment link — no surprises</li>
            <li className="flex gap-2"><CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" /> We serve Naivasha, Molo, Gilgil, Eldama Ravine, Njoro and beyond</li>
          </ul>
          <p className="text-xs text-amber-700">
            To get a quote including your delivery rate: add items to your Quote List, select your location and submit a quote request. We&apos;ll respond within 2 hours.
          </p>
        </div>
      </div>

      {/* Collection */}
      <div className="card p-6 mb-10">
        <div className="flex items-center gap-3 mb-3">
          <MapPin className="h-6 w-6 text-brand-600" />
          <h2 className="text-lg font-bold text-gray-900">Collect from Our Yard</h2>
        </div>
        <p className="text-sm text-gray-600 mb-2">You are welcome to collect from our yard in Nakuru Industrial Area at no delivery charge.</p>
        <div className="text-sm text-gray-700">
          <strong>Address:</strong> {YARD.address}<br />
          <strong>Plus code:</strong> {YARD.plusCode}<br />
          <strong>Hours:</strong> {YARD.hours}
        </div>
        <a href={YARD.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm text-brand-700 font-medium hover:underline">
          <MapPin className="h-4 w-4" /> Get directions on Google Maps
        </a>
      </div>

      {/* Offloading terms */}
      <div className="card p-6">
        <h2 className="font-bold text-gray-900 mb-3">Offloading & Site Access</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex gap-2"><AlertCircle className="h-4 w-4 mt-0.5 text-amber-500 flex-shrink-0" /> Offloading is the responsibility of the buyer unless agreed otherwise.</li>
          <li className="flex gap-2"><AlertCircle className="h-4 w-4 mt-0.5 text-amber-500 flex-shrink-0" /> The delivery site must be accessible by a standard delivery truck.</li>
          <li className="flex gap-2"><AlertCircle className="h-4 w-4 mt-0.5 text-amber-500 flex-shrink-0" /> A site contact (name and phone) is required for all deliveries.</li>
          <li className="flex gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" /> You will receive the driver&apos;s name and phone number when your order is dispatched.</li>
        </ul>
      </div>
    </div>
  )
}
