'use client'
// app/(site)/quote-list/page.tsx — Quote List (QL-1 through QL-5)
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, MessageCircle, Download, FileText, ArrowRight, ShoppingCart, Upload } from 'lucide-react'
import { useQuoteList } from '@/store/quote-list'
import { formatPrice, buildQuoteListMessage, whatsappUrl } from '@/lib/utils'
import { SITE, FREE_DELIVERY_MINIMUM, ALL_DELIVERY_AREAS } from '@/lib/constants'
import { Button, Input, Select } from '@/components/ui'

export default function QuoteListPage() {
  const items    = useQuoteList(s => s.items)
  const updateQty = useQuoteList(s => s.updateQty)
  const removeItem = useQuoteList(s => s.removeItem)
  const clearList  = useQuoteList(s => s.clearList)
  const subtotal   = useQuoteList(s => s.subtotal)
  const boqFiles   = useQuoteList(s => s.boqFiles)

  const [location, setLocation] = useState('')

  const selectedArea = ALL_DELIVERY_AREAS.find(a => a.label === location)
  const inTown = selectedArea?.inTown ?? false
  const total = subtotal()

  const meetsMinimum = FREE_DELIVERY_MINIMUM === 0 || total >= FREE_DELIVERY_MINIMUM

  function downloadList() {
    const rows = items.map(i =>
      `${i.name} | Qty: ${i.qty} ${i.unit} | Unit: KSh ${i.unit_price.toLocaleString()} | Total: KSh ${(i.qty * i.unit_price).toLocaleString()}`
    ).join('\n')
    const text = `ChumaHardware – Quote List\nDate: ${new Date().toLocaleDateString('en-KE')}\n\n${rows}\n\nSubtotal: KSh ${total.toLocaleString()}\nDelivery: ${location ? (inTown ? 'Free (Nakuru town)' : 'To be agreed') : 'TBD'}\n\nTo place your order: ${SITE.phone}`
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'ChumaHardware-Quote-List.txt'; a.click()
    URL.revokeObjectURL(url)
  }

  function sendToWhatsApp() {
    if (!items.length) return
    const msg = buildQuoteListMessage(
      items.map(i => ({ name: i.name, qty: i.qty, unit: i.unit, unit_price: i.unit_price })),
      location || 'Not specified'
    )
    window.open(whatsappUrl(SITE.whatsapp, msg), '_blank', 'noopener,noreferrer')
  }

  if (items.length === 0 && boqFiles.length === 0) {
    return (
      <div className="container-site py-16 text-center">
        <ShoppingCart className="h-16 w-16 text-gray-200 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Quote List is empty</h1>
        <p className="text-gray-500 mb-8">Browse our products and add items to get a quote, or upload your BOQ.</p>
        <div className="flex justify-center gap-3 flex-wrap mb-8">
          <Link href="/cement" className="btn-primary"><ShoppingCart className="h-5 w-5" /> Browse Products</Link>
          <Link href="/calculators" className="btn-secondary">Use a Calculator</Link>
        </div>
        <div className="max-w-md mx-auto text-left"><BoqUploader /></div>
      </div>
    )
  }

  const areaParam = location ? `area=${encodeURIComponent(location)}` : ''

  return (
    <div className="container-site py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Quote List ({items.length} item{items.length === 1 ? '' : 's'})</h1>
        <button onClick={clearList} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
          <Trash2 className="h-4 w-4" /> Clear all
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Items */}
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.product_id} className="card p-4 flex gap-3">
              {/* Photo */}
              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {item.photo ? (
                  <Image src={item.photo} alt={item.name} fill className="object-cover" sizes="64px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/${item.category_slug}/${item.slug}`}
                  className="font-semibold text-sm text-gray-900 hover:text-brand-700 leading-snug block"
                >
                  {item.name}
                </Link>
                {item.size_grade && <div className="text-xs text-gray-400">{item.size_grade}</div>}
                <div className="text-xs text-gray-500">{item.unit}</div>
                <div className="mt-2 flex items-center gap-3">
                  {/* Qty stepper */}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQty(item.product_id, item.qty - 1)}
                      className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-100"
                    >−</button>
                    <span className="px-3 py-1.5 text-sm font-semibold border-x border-gray-200 min-w-[2.5rem] text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.product_id, item.qty + 1)}
                      className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-100"
                    >+</button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="text-red-400 hover:text-red-600 p-1"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <div className="font-bold text-brand-700">{formatPrice(item.qty * item.unit_price)}</div>
                <div className="text-xs text-gray-400">{formatPrice(item.unit_price)} ea.</div>
              </div>
            </div>
          ))}

          <BoqUploader />
        </div>

        {/* Summary + actions */}
        <div className="space-y-4">
          {/* Order summary */}
          <div className="card p-5">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>

            {/* Line totals */}
            <div className="space-y-2 mb-4">
              {items.map(i => (
                <div key={i.product_id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate mr-2">{i.name} ×{i.qty}</span>
                  <span className="font-medium flex-shrink-0">{formatPrice(i.qty * i.unit_price)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 mb-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Subtotal</span>
                <span className="text-brand-700">{formatPrice(total)}</span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">Excl. delivery</div>
            </div>

            {/* Location picker (QL-2) */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Delivery location</label>
              <Select value={location} onChange={e => setLocation(e.target.value)}>
                <option value="">Select area…</option>
                <optgroup label="Nakuru Town (Free Delivery)">
                  {ALL_DELIVERY_AREAS.filter(a => a.inTown).map(a => (
                    <option key={a.label} value={a.label}>{a.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Outside Nakuru (Rate to be agreed)">
                  {ALL_DELIVERY_AREAS.filter(a => !a.inTown).map(a => (
                    <option key={a.label} value={a.label}>{a.label}</option>
                  ))}
                </optgroup>
              </Select>
              {location && (
                <div className={`mt-2 text-sm font-medium rounded-lg px-3 py-2 ${inTown ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                  {inTown
                    ? '✅ Free delivery to your area!'
                    : '📋 Delivery rate will be agreed before payment.'}
                </div>
              )}
            </div>

            {/* Actions (QL-3) */}
            <div className="space-y-3">
              {inTown && meetsMinimum && boqFiles.length === 0 ? (
                <>
                  <Link href={`/checkout?${areaParam}`} className="btn-primary w-full">
                    <ArrowRight className="h-5 w-5" /> Pay by M-Pesa
                  </Link>
                  <Link href={`/checkout?type=quote&${areaParam}`} className="btn-secondary w-full text-sm">
                    <FileText className="h-4 w-4" /> Request a formal quote instead
                  </Link>
                </>
              ) : (
                <Link href={`/checkout?type=quote&${areaParam}`} className="btn-primary w-full">
                  <FileText className="h-5 w-5" /> Request a Quote
                </Link>
              )}
              <button onClick={sendToWhatsApp} className="btn-whatsapp w-full">
                <MessageCircle className="h-5 w-5" /> Send List to WhatsApp
              </button>
              <button onClick={downloadList} className="btn-secondary w-full text-sm">
                <Download className="h-4 w-4" /> Download List
              </button>
            </div>

            {!location && (
              <p className="text-xs text-gray-400 mt-3 text-center">Select your delivery location to see checkout options.</p>
            )}
            {boqFiles.length > 0 && inTown && (
              <p className="text-xs text-gray-400 mt-3 text-center">Lists with a BOQ attached are priced by our team first.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// QL-4: BOQ upload (photo, PDF, Excel) — stored privately and attached to the quote request
function BoqUploader() {
  const boqFiles  = useQuoteList(s => s.boqFiles)
  const addBoq    = useQuoteList(s => s.addBoq)
  const removeBoq = useQuoteList(s => s.removeBoq)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch('/api/boq', { method: 'POST', body })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      addBoq(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="card p-4">
      <label className="block font-semibold text-sm text-gray-700 mb-2">Attach BOQ / Drawing (optional)</label>
      {boqFiles.length > 0 && (
        <ul className="mb-3 space-y-1.5">
          {boqFiles.map(f => (
            <li key={f.path} className="flex items-center justify-between gap-2 text-sm bg-gray-50 rounded-lg px-3 py-2">
              <span className="truncate text-brand-700 font-medium">{f.name}</span>
              <button onClick={() => removeBoq(f.path)} className="text-red-400 hover:text-red-600 p-1" aria-label={`Remove ${f.name}`}>
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
        <input
          type="file"
          accept=".pdf,.xlsx,.xls,.csv,.png,.jpg,.jpeg,.webp,.heic"
          onChange={upload}
          className="hidden"
          id="boq-upload"
          disabled={uploading}
        />
        <label htmlFor="boq-upload" className="cursor-pointer flex flex-col items-center gap-2 text-gray-500 hover:text-brand-700">
          <Upload className="h-6 w-6" />
          <span className="text-sm">{uploading ? 'Uploading…' : 'Photo, PDF or Excel BOQ (max 10 MB)'}</span>
        </label>
      </div>
      {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
    </div>
  )
}
