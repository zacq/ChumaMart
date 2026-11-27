// app/(site)/calculators/page.tsx — Calculator hub
import Link from 'next/link'
import { ArrowRight, Calculator } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Building Material Calculators | ChumaMart Hardware Nakuru',
  description: 'Calculate how much cement, iron sheets, steel bars, paint or water tank capacity you need. Results added straight to your Quote List.',
}

const CALCS = [
  { slug: 'concrete',  emoji: '🏗️', title: 'Concrete Slab / Foundation', desc: 'Enter slab size and mix ratio to get cement bags, sand and ballast quantities.' },
  { slug: 'blockwork', emoji: '🧱', title: 'Blockwork / Walling',         desc: 'Wall length and height → blocks, cement and sand needed.' },
  { slug: 'roofing',   emoji: '🏠', title: 'Roofing',                     desc: 'Roof dimensions and pitch → iron sheet metres, ridges and nails.' },
  { slug: 'steel',     emoji: '🔩', title: 'Steel Reinforcement',          desc: 'Slab or beam dimensions → D-bars and binding wire.' },
  { slug: 'paint',     emoji: '🎨', title: 'Paint',                       desc: 'Wall area and coats → litres and tin sizes (1L/4L/20L).' },
  { slug: 'tank',      emoji: '💧', title: 'Water Tank Size',             desc: 'Household size and days of storage → recommended tank capacity.' },
]

export default function CalculatorsPage() {
  return (
    <div className="container-site py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Material Calculators</h1>
        <p className="text-gray-500 max-w-2xl">
          Work out how much material you need for your project. All results are estimates — confirm with your engineer or fundi. Add items straight to your Quote List in one tap.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CALCS.map(c => (
          <Link
            key={c.slug}
            href={`/calculators/${c.slug}`}
            className="card p-6 flex flex-col gap-3 hover:border-brand-300 hover:shadow-md transition-all group"
          >
            <span className="text-4xl">{c.emoji}</span>
            <div>
              <div className="font-bold text-gray-900 group-hover:text-brand-700 mb-1 flex items-center gap-2">
                {c.title} <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-sm text-gray-500">{c.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
