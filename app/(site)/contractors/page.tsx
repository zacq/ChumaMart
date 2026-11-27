// app/(site)/contractors/page.tsx — FR-13
import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Upload, Phone, CheckCircle } from 'lucide-react'
import { SITE } from '@/lib/constants'
import { whatsappUrl } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Contractors & Bulk Buyers | ChumaMart Hardware Nakuru',
  description: 'Bulk building material orders, BOQ processing and trade pricing for contractors and developers in Nakuru. Upload your BOQ and get a full quote.',
}

export default function ContractorsPage() {
  return (
    <div className="container-site py-10">
      <h1 className="text-3xl font-black text-gray-900 mb-2">Contractors & Bulk Buyers</h1>
      <p className="text-gray-500 mb-10 max-w-2xl">
        Building multiple houses? Managing a development project? We handle full BOQ orders and can schedule staged deliveries to match your project timeline.
      </p>

      <div className="grid gap-6 md:grid-cols-3 mb-12">
        {[
          { icon: FileText,  title: 'BOQ Processing',    desc: 'Upload your Bill of Quantities — photo, PDF or Excel. We price every line and return a full quote with a payment link.' },
          { icon: CheckCircle, title: 'Bulk Pricing',    desc: 'Volume discounts on cement, steel and iron sheets. Ask us about bulk tiers for your project size.' },
          { icon: Upload,    title: 'Staged Deliveries', desc: 'Schedule deliveries by phase — foundation, walling, roofing — to match your construction programme.' },
        ].map(item => (
          <div key={item.title} className="card p-6">
            <item.icon className="h-8 w-8 text-brand-600 mb-3" />
            <div className="font-bold text-gray-900 mb-2">{item.title}</div>
            <div className="text-sm text-gray-500">{item.desc}</div>
          </div>
        ))}
      </div>

      <div className="card p-8 text-center bg-brand-50 border-brand-200">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Get a Bulk / BOQ Quote</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Add items to your Quote List and upload your BOQ file, or send us your BOQ directly on WhatsApp.
        </p>
        <div className="flex justify-center flex-wrap gap-3">
          <Link href="/quote-list" className="btn-primary">
            <FileText className="h-5 w-5" /> Open Quote List
          </Link>
          <a
            href={whatsappUrl(SITE.whatsapp, 'Hello ChumaMart! I have a BOQ/bulk order I need a quote for.')}
            target="_blank" rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            Upload BOQ on WhatsApp
          </a>
          <a href={`tel:${SITE.phone.replace(/\s/g,'')}`} className="btn-secondary">
            <Phone className="h-5 w-5" /> Call to Discuss
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-4">Trade account applications with credit terms: Phase 2 — coming soon.</p>
      </div>
    </div>
  )
}
