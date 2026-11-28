'use client'
// app/(site)/calculators/[type]/page.tsx — Individual calculators (CL-1 through CL-3)
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ShoppingCart, Share2, AlertCircle } from 'lucide-react'
import {
  calcConcrete, calcRoofing, calcPaint, calcSteel, calcTank, calcBlockwork,
  type ConcreteInput, type RoofingInput, type SteelInput, type BlockworkInput
} from '@/lib/calculators/formulas'
import { useQuoteList } from '@/store/quote-list'
import { createClient } from '@/lib/supabase/client'
import { formatPrice, whatsappUrl, toQuoteItem, effectivePrice } from '@/lib/utils'
import { SITE } from '@/lib/constants'
import { Input, Select } from '@/components/ui'
import type { ProductWithPrice } from '@/lib/supabase/types'

type AddFn = ReturnType<typeof useQuoteList.getState>['addItem']
type Line = { product: ProductWithPrice | undefined; qty: number }

// CL-2: results map to real catalogue products at current prices
function useCategoryProducts(categorySlug: string) {
  const [products, setProducts] = useState<ProductWithPrice[]>([])
  useEffect(() => {
    createClient()
      .from('products')
      .select('*, prices(*), categories!inner(name, slug)')
      .eq('categories.slug', categorySlug)
      .neq('stock_status', 'out_of_stock')
      .order('name')
      .then(({ data }) => setProducts((data as unknown as ProductWithPrice[]) ?? []))
  }, [categorySlug])
  return products
}

function priceOf(p: ProductWithPrice | undefined) {
  return p?.prices ? effectivePrice(p.prices) : 0
}

function ProductPicker({ label, products, value, onChange }: {
  label: string
  products: ProductWithPrice[]
  value: string
  onChange: (slug: string) => void
}) {
  return (
    <Row label={label}>
      <Select value={value} onChange={e => onChange(e.target.value)} disabled={!products.length}>
        {!products.length && <option>Loading…</option>}
        {products.map(p => (
          <option key={p.id} value={p.slug}>
            {p.name} — {priceOf(p) > 0 ? `${formatPrice(priceOf(p))} ${p.unit}` : 'price on request'}
          </option>
        ))}
      </Select>
    </Row>
  )
}

const CALC_CONFIGS: Record<string, { title: string; emoji: string }> = {
  concrete:  { title: 'Concrete Slab / Foundation', emoji: '🏗️' },
  blockwork: { title: 'Blockwork / Walling',         emoji: '🧱' },
  roofing:   { title: 'Roofing',                     emoji: '🏠' },
  steel:     { title: 'Steel Reinforcement',          emoji: '🔩' },
  paint:     { title: 'Paint',                       emoji: '🎨' },
  tank:      { title: 'Water Tank Size',             emoji: '💧' },
}

interface Props { params: { type: string } }

export default function CalculatorPage({ params }: Props) {
  const config = CALC_CONFIGS[params.type]
  if (!config) notFound()

  const addItem = useQuoteList(s => s.addItem)

  return (
    <div className="container-site py-8 max-w-2xl mx-auto">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/calculators" className="hover:text-brand-700">Calculators</Link> / {config.title}
      </nav>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">{config.emoji}</span>
        <h1 className="text-2xl font-black text-gray-900">{config.title} Calculator</h1>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 flex gap-2 text-sm text-amber-800">
        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <span>These are estimates only. Always confirm quantities with your engineer or fundi. Assumptions and wastage allowances are listed with each calculator.</span>
      </div>

      {params.type === 'concrete'  && <ConcreteCalc  addItem={addItem} />}
      {params.type === 'roofing'   && <RoofingCalc   addItem={addItem} />}
      {params.type === 'paint'     && <PaintCalc     addItem={addItem} />}
      {params.type === 'steel'     && <SteelCalc     addItem={addItem} />}
      {params.type === 'tank'      && <TankCalc      />}
      {params.type === 'blockwork' && <BlockworkCalc addItem={addItem} />}
    </div>
  )
}

// ── Concrete Calculator ───────────────────────────────────────────────────────
function ConcreteCalc({ addItem }: { addItem: AddFn }) {
  const [input, setInput] = useState<ConcreteInput>({ lengthM: 5, widthM: 5, thicknessM: 0.15, mix: '1:2:4' })
  const result = calcConcrete(input)
  const cements = useCategoryProducts('cement')
  const [cementSlug, setCementSlug] = useState('bamburi-cement')
  const cement = cements.find(p => p.slug === cementSlug) ?? cements[0]

  return (
    <div className="space-y-6">
      <div className="card p-5 space-y-4">
        <Row label="Length (m)"><Input type="number" value={input.lengthM} min={0.1} step={0.1} onChange={e => setInput(p => ({...p, lengthM: +e.target.value}))} /></Row>
        <Row label="Width (m)"><Input type="number" value={input.widthM} min={0.1} step={0.1} onChange={e => setInput(p => ({...p, widthM: +e.target.value}))} /></Row>
        <Row label="Thickness (m)"><Input type="number" value={input.thicknessM} min={0.05} step={0.05} onChange={e => setInput(p => ({...p, thicknessM: +e.target.value}))} /></Row>
        <Row label="Mix ratio">
          <Select value={input.mix} onChange={e => setInput(p => ({...p, mix: e.target.value as any}))}>
            <option value="1:2:4">1:2:4 (standard slab)</option>
            <option value="1:1.5:3">1:1.5:3 (structural)</option>
            <option value="1:3:6">1:3:6 (blinding/lean)</option>
          </Select>
        </Row>
        <ProductPicker label="Cement brand" products={cements} value={cement?.slug ?? ''} onChange={setCementSlug} />
        <p className="text-xs text-gray-400">Assumes 10% wastage and 0.035 m³ per 50 kg bag.</p>
      </div>
      <ResultCard>
        <ResultRow label="Slab volume" value={`${result.volumeM3} m³`} />
        <ResultRow label="Cement (50 kg bags)" value={`${result.cementBags} bags`} highlight />
        <ResultRow label="Sand" value={`${result.sandM3} m³`} />
        <ResultRow label="Ballast" value={`${result.ballastM3} m³`} />
      </ResultCard>
      <AddToQuoteStrip
        label={`${result.cementBags} bags cement`}
        shareText={`ChumaHardware Calculator: Slab ${input.lengthM}×${input.widthM}×${input.thicknessM}m (${input.mix}) needs ${result.cementBags} cement bags, ${result.sandM3}m³ sand, ${result.ballastM3}m³ ballast.`}
        lines={[{ product: cement, qty: result.cementBags }]}
        addItem={addItem}
      />
    </div>
  )
}

// ── Roofing Calculator ────────────────────────────────────────────────────────
function RoofingCalc({ addItem }: { addItem: AddFn }) {
  const [input, setInput] = useState<RoofingInput>({ lengthM: 10, widthM: 8, pitchDeg: 20, slopes: 2 })
  const result = calcRoofing(input)
  const sheets = useCategoryProducts('roofing')
  const [sheetSlug, setSheetSlug] = useState('box-profile-iron-sheet')
  const sheet = sheets.find(p => p.slug === sheetSlug) ?? sheets[0]

  return (
    <div className="space-y-6">
      <div className="card p-5 space-y-4">
        <Row label="Roof length (m)"><Input type="number" value={input.lengthM} min={1} step={0.5} onChange={e => setInput(p => ({...p, lengthM: +e.target.value}))} /></Row>
        <Row label="Roof width (m)"><Input type="number" value={input.widthM} min={1} step={0.5} onChange={e => setInput(p => ({...p, widthM: +e.target.value}))} /></Row>
        <Row label="Pitch (degrees)"><Input type="number" value={input.pitchDeg} min={5} max={60} step={5} onChange={e => setInput(p => ({...p, pitchDeg: +e.target.value}))} /></Row>
        <Row label="Number of slopes"><Select value={input.slopes} onChange={e => setInput(p => ({...p, slopes: +e.target.value}))}><option value={1}>1 (lean-to)</option><option value={2}>2 (gable)</option><option value={4}>4 (hip)</option></Select></Row>
        <ProductPicker label="Sheet profile" products={sheets} value={sheet?.slug ?? ''} onChange={setSheetSlug} />
        <p className="text-xs text-gray-400">Assumes 10% wastage/overlap; nails at about 0.5 kg per m².</p>
      </div>
      <ResultCard>
        <ResultRow label="Iron sheets (metres)" value={`${result.sheetsMetres} m`} highlight />
        <ResultRow label="Ridge capping" value={`${result.ridgeMetres} m`} />
        <ResultRow label="Roofing nails (kg)" value={`${result.roofingNails} kg`} />
      </ResultCard>
      <AddToQuoteStrip
        label={`${result.sheetsMetres} m iron sheets`}
        shareText={`ChumaHardware: Roof ${input.lengthM}×${input.widthM}m at ${input.pitchDeg}° needs ${result.sheetsMetres}m iron sheets, ${result.ridgeMetres}m ridge, ${result.roofingNails}kg nails.`}
        lines={[{ product: sheet, qty: result.sheetsMetres }]}
        addItem={addItem}
      />
    </div>
  )
}

// ── Paint Calculator ──────────────────────────────────────────────────────────
const PAINT_SIZE_RE = /-(\d+)l$/

function PaintCalc({ addItem }: { addItem: AddFn }) {
  const [wallArea, setWallArea] = useState(50)
  const [coats, setCoats] = useState(2)
  const result = calcPaint({ wallAreaM2: wallArea, coats, coverageM2perL: 8 })
  const paints = useCategoryProducts('paints')

  // Group sizes by paint type, e.g. crown-vinyl-matt → {20: p, 4: p, 1: p}
  const types = new Map<string, { name: string; sizes: { litres: number; product: ProductWithPrice }[] }>()
  for (const p of paints) {
    const m = p.slug.match(PAINT_SIZE_RE)
    if (!m) continue
    const key = p.slug.replace(PAINT_SIZE_RE, '')
    const entry = types.get(key) ?? { name: p.name.replace(/\s*\d+\s*L$/i, ''), sizes: [] }
    entry.sizes.push({ litres: Number(m[1]), product: p })
    types.set(key, entry)
  }
  const [typeKey, setTypeKey] = useState('crown-vinyl-matt')
  const chosen = types.get(typeKey) ?? types.values().next().value

  // Fill the litres with the largest tins available for this paint type
  const lines: Line[] = []
  if (chosen) {
    const sizes = [...chosen.sizes].sort((a, b) => b.litres - a.litres)
    let remaining = result.litres
    for (const s of sizes) {
      const n = Math.floor(remaining / s.litres)
      if (n > 0) { lines.push({ product: s.product, qty: n }); remaining -= n * s.litres }
    }
    if (remaining > 0) {
      const smallest = sizes[sizes.length - 1]
      const existing = lines.find(l => l.product === smallest.product)
      if (existing) existing.qty += 1
      else lines.push({ product: smallest.product, qty: 1 })
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-5 space-y-4">
        <Row label="Wall area (m²)"><Input type="number" value={wallArea} min={1} onChange={e => setWallArea(+e.target.value)} /></Row>
        <Row label="Number of coats"><Select value={coats} onChange={e => setCoats(+e.target.value)}><option value={1}>1 coat</option><option value={2}>2 coats</option><option value={3}>3 coats</option></Select></Row>
        <Row label="Paint type">
          <Select value={typeKey} onChange={e => setTypeKey(e.target.value)} disabled={!types.size}>
            {!types.size && <option>Loading…</option>}
            {[...types.entries()].map(([key, t]) => <option key={key} value={key}>{t.name}</option>)}
          </Select>
        </Row>
        <p className="text-xs text-gray-400">Coverage: ~8 m² per litre (smooth wall, primer not included), 10% wastage.</p>
      </div>
      <ResultCard>
        <ResultRow label="Total paint needed" value={`${result.litres} litres`} highlight />
        {lines.map(l => (
          <ResultRow key={l.product!.id} label={l.product!.name} value={`${l.qty} tin${l.qty > 1 ? 's' : ''}`} />
        ))}
      </ResultCard>
      <AddToQuoteStrip
        label={`${result.litres} L paint`}
        shareText={`ChumaHardware: ${wallArea}m² wall, ${coats} coats → ${result.litres}L paint (${lines.map(l => `${l.qty}× ${l.product!.name}`).join(', ')}).`}
        lines={lines}
        addItem={addItem}
      />
    </div>
  )
}

// ── Steel Calculator ──────────────────────────────────────────────────────────
function SteelCalc({ addItem }: { addItem: AddFn }) {
  const [inp, setInp] = useState<SteelInput>({ slabLengthM: 6, slabWidthM: 4, barSpacingMM: 200, barDiameter: 'D12', barLengthM: 12 })
  const result = calcSteel(inp)
  const steel = useCategoryProducts('steel-wire')
  const bar = steel.find(p => p.slug === `deformed-bar-${inp.barDiameter.toLowerCase()}`)
  const wire = steel.find(p => p.slug === 'binding-wire')

  return (
    <div className="space-y-6">
      <div className="card p-5 space-y-4">
        <Row label="Slab length (m)"><Input type="number" value={inp.slabLengthM} min={0.5} step={0.5} onChange={e => setInp(p => ({...p, slabLengthM: +e.target.value}))} /></Row>
        <Row label="Slab width (m)"><Input type="number" value={inp.slabWidthM} min={0.5} step={0.5} onChange={e => setInp(p => ({...p, slabWidthM: +e.target.value}))} /></Row>
        <Row label="Bar spacing (mm)"><Select value={inp.barSpacingMM} onChange={e => setInp(p => ({...p, barSpacingMM: +e.target.value}))}><option value={150}>150mm</option><option value={200}>200mm</option><option value={250}>250mm</option></Select></Row>
        <Row label="Bar diameter"><Select value={inp.barDiameter} onChange={e => setInp(p => ({...p, barDiameter: e.target.value as any}))}><option>D8</option><option>D10</option><option>D12</option><option>D16</option><option>D20</option></Select></Row>
        <p className="text-xs text-gray-400">Single mesh layer, 12 m bars, 5% wastage, about 1 roll of binding wire per 100 bars.</p>
      </div>
      <ResultCard>
        <ResultRow label="Total bars (12m)" value={`${result.totalBars}`} highlight />
        <ResultRow label="Bars (long way)" value={`${result.barsLongway}`} />
        <ResultRow label="Bars (short way)" value={`${result.barsShortway}`} />
        <ResultRow label="Binding wire rolls" value={`${result.bindingWireRolls}`} />
      </ResultCard>
      <AddToQuoteStrip
        label={`${result.totalBars} bars ${inp.barDiameter}`}
        shareText={`ChumaHardware: ${inp.slabLengthM}×${inp.slabWidthM}m slab @ ${inp.barSpacingMM}mm needs ${result.totalBars} ${inp.barDiameter} bars + ${result.bindingWireRolls} binding wire rolls.`}
        lines={[{ product: bar, qty: result.totalBars }, { product: wire, qty: result.bindingWireRolls }]}
        addItem={addItem}
      />
    </div>
  )
}

// ── Tank Calculator ───────────────────────────────────────────────────────────
function TankCalc() {
  const [hh, setHh] = useState(5)
  const [days, setDays] = useState(3)
  const result = calcTank({ householdSize: hh, storageDays: days, litresPerPersonPerDay: 50 })

  return (
    <div className="space-y-6">
      <div className="card p-5 space-y-4">
        <Row label="Household size (people)"><Input type="number" value={hh} min={1} max={50} onChange={e => setHh(+e.target.value)} /></Row>
        <Row label="Days of storage"><Select value={days} onChange={e => setDays(+e.target.value)}><option value={1}>1 day</option><option value={2}>2 days</option><option value={3}>3 days</option><option value={5}>5 days</option><option value={7}>7 days</option></Select></Row>
        <p className="text-xs text-gray-400">Based on 50 litres per person per day (WHO standard)</p>
      </div>
      <ResultCard>
        <ResultRow label="Water needed" value={`${result.litres} L`} />
        <ResultRow label="Recommended tank" value={`${result.recommendedCapacity.toLocaleString()} L Kentank`} highlight />
      </ResultCard>
      <div className="flex gap-3">
        <Link href={`/water-tanks/kentank-${result.recommendedCapacity}l`} className="btn-primary flex-1">
          <ShoppingCart className="h-5 w-5" /> View Kentank {result.recommendedCapacity.toLocaleString()} L
        </Link>
      </div>
    </div>
  )
}

// ── Blockwork Calculator ──────────────────────────────────────────────────────
function BlockworkCalc({ addItem }: { addItem: AddFn }) {
  const [inp, setInp] = useState<BlockworkInput>({ wallLengthM: 10, wallHeightM: 2.4, blockLengthMM: 400, blockHeightMM: 200, openingsM2: 4, mortarBagsPerM2: 0.5 })
  const result = calcBlockwork(inp)
  const cements = useCategoryProducts('cement')
  const [cementSlug, setCementSlug] = useState('bamburi-cement')
  const cement = cements.find(p => p.slug === cementSlug) ?? cements[0]

  return (
    <div className="space-y-6">
      <div className="card p-5 space-y-4">
        <Row label="Wall length (m)"><Input type="number" value={inp.wallLengthM} min={0.5} step={0.5} onChange={e => setInp(p => ({...p, wallLengthM: +e.target.value}))} /></Row>
        <Row label="Wall height (m)"><Input type="number" value={inp.wallHeightM} min={0.5} step={0.1} onChange={e => setInp(p => ({...p, wallHeightM: +e.target.value}))} /></Row>
        <Row label="Openings area (m²)"><Input type="number" value={inp.openingsM2} min={0} step={0.5} onChange={e => setInp(p => ({...p, openingsM2: +e.target.value}))} /></Row>
        <ProductPicker label="Cement brand" products={cements} value={cement?.slug ?? ''} onChange={setCementSlug} />
        <p className="text-xs text-gray-400">200×400 mm blocks, 0.5 cement bags of mortar per m², 10% wastage. Blocks are quoted separately.</p>
      </div>
      <ResultCard>
        <ResultRow label="Wall area" value={`${result.wallAreaM2} m²`} />
        <ResultRow label="Blocks (200×400mm)" value={`${result.blocks}`} highlight />
        <ResultRow label="Cement bags" value={`${result.cementBags}`} />
        <ResultRow label="Sand" value={`${result.sandM3} m³`} />
      </ResultCard>
      <AddToQuoteStrip
        label={`${result.blocks} blocks + ${result.cementBags} cement bags`}
        shareText={`ChumaHardware: ${inp.wallLengthM}×${inp.wallHeightM}m wall needs ${result.blocks} blocks + ${result.cementBags} cement bags.`}
        lines={[{ product: cement, qty: result.cementBags }]}
        addItem={addItem}
      />
    </div>
  )
}

// ── Shared sub-components ─────────────────────────────────────────────────────
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid sm:grid-cols-[180px_1fr] gap-2 items-center">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  )
}
function ResultCard({ children }: { children: React.ReactNode }) {
  return <div className="card p-5 divide-y divide-gray-100">{children}</div>
}
function ResultRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between py-2.5 text-sm">
      <span className="text-gray-600">{label}</span>
      <span className={highlight ? 'font-bold text-brand-700 text-base' : 'font-semibold'}>{value}</span>
    </div>
  )
}
function AddToQuoteStrip({ label, shareText, lines, addItem }: { label: string; shareText: string; lines: Line[]; addItem: AddFn }) {
  const [added, setAdded] = useState(false)
  const ready = lines.filter(l => l.product && l.qty > 0)
  function handleAdd() {
    ready.forEach(l => addItem(toQuoteItem(l.product!), l.qty))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }
  return (
    <div className="flex gap-3">
      <button onClick={handleAdd} disabled={!ready.length} className={`flex-1 btn-primary disabled:opacity-50 ${added ? 'bg-green-600' : ''}`}>
        <ShoppingCart className="h-5 w-5" /> {added ? 'Added to Quote List!' : `Add ${label} to Quote`}
      </button>
      <a
        href={whatsappUrl(SITE.whatsapp, shareText)}
        target="_blank" rel="noopener noreferrer"
        className="btn-whatsapp px-4"
        title="Share to WhatsApp"
      >
        <Share2 className="h-5 w-5" />
      </a>
    </div>
  )
}
