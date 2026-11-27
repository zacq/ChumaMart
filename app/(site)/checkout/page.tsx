'use client'
// app/(site)/checkout/page.tsx — Checkout (FR-11). Pay-now orders continue to /pay/[token] for M-Pesa.
import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Phone, Truck, CreditCard, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { useQuoteList } from '@/store/quote-list'
import { formatPrice } from '@/lib/utils'
import { ALL_DELIVERY_AREAS, FREE_DELIVERY_MINIMUM } from '@/lib/constants'
import { Button, Input, Select, Textarea } from '@/components/ui'

type Step = 'details' | 'submitting' | 'success'

export default function CheckoutPage() {
  return (
    <Suspense>
      <Checkout />
    </Suspense>
  )
}

function Checkout() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const items = useQuoteList(s => s.items)
  const boqFiles = useQuoteList(s => s.boqFiles)
  const subtotal = useQuoteList(s => s.subtotal)
  const clearList = useQuoteList(s => s.clearList)

  const [step, setStep] = useState<Step>('details')
  const [refNo, setRefNo] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    location: searchParams.get('area') ?? '', deliveryDate: '', siteContact: '', notes: '',
  })

  const selectedArea = ALL_DELIVERY_AREAS.find(a => a.label === form.location)
  const inTown = selectedArea?.inTown ?? false
  const total = subtotal()
  const canPayNow =
    inTown && boqFiles.length === 0 && items.every(i => i.unit_price > 0) &&
    (FREE_DELIVERY_MINIMUM === 0 || total >= FREE_DELIVERY_MINIMUM)
  const isQuoteMode = searchParams.get('type') === 'quote' || !canPayNow

  useEffect(() => {
    if (step === 'details' && items.length === 0 && boqFiles.length === 0) router.push('/quote-list')
  }, [items, boqFiles, router, step])

  function set<K extends keyof typeof form>(field: K, val: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [field]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.phone || !form.location) {
      setError('Please fill in name, phone and delivery location.')
      return
    }
    setError('')
    setStep('submitting')
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.name,
          phone: form.phone,
          email: form.email,
          location: form.location,
          deliveryDate: form.deliveryDate,
          siteContact: form.siteContact,
          notes: form.notes,
          lines: items.map(i => ({ product_id: i.product_id, qty: i.qty })),
          boqFiles,
          mode: isQuoteMode ? 'quote' : 'pay',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Server error')

      clearList()
      if (data.payNow) {
        router.push(`/pay/${data.token}`)
        return
      }
      setRefNo(data.refNo)
      setStep('success')
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.')
      setStep('details')
    }
  }

  if (step === 'success') {
    return (
      <div className="container-site py-16 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-9 w-9 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Quote Request Sent!</h1>
        <p className="text-gray-500 mb-2">Reference: <span className="font-mono font-bold text-gray-900">{refNo}</span></p>
        <p className="text-gray-500 mb-6">We&apos;ll confirm prices, stock and delivery, then send you a quote with a &ldquo;Pay this quote&rdquo; link by SMS within 2 hours.</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Button onClick={() => router.push(`/track?ref=${refNo}`)}>Track Request</Button>
          <Button variant="secondary" onClick={() => router.push('/')}>Back to Home</Button>
        </div>
      </div>
    )
  }

  if (step === 'submitting') {
    return (
      <div className="text-center py-16">
        <Loader2 className="h-12 w-12 text-brand-600 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900">{isQuoteMode ? 'Submitting your request…' : 'Creating your order…'}</h2>
      </div>
    )
  }

  return (
    <div className="container-site py-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isQuoteMode ? 'Request a Quote' : 'Checkout'}</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Your details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
              <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="John Kamau" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone number *</label>
              <Input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0712 345 678" type="tel" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
            <Input value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@email.com" type="email" />
          </div>
        </div>

        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Delivery details</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery location *</label>
            <Select value={form.location} onChange={e => set('location', e.target.value)} required>
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
            {form.location && (
              <div className={`mt-2 text-sm font-medium rounded-lg px-3 py-2 flex items-center gap-2 ${inTown ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                <Truck className="h-4 w-4 flex-shrink-0" />
                {inTown ? 'Free delivery within Nakuru town!' : 'Delivery rate will be agreed and added to your quote before payment.'}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred delivery date</label>
            <Input type="date" value={form.deliveryDate} onChange={e => set('deliveryDate', e.target.value)} min={new Date().toISOString().split('T')[0]} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site contact (name & phone)</label>
            <Input value={form.siteContact} onChange={e => set('siteContact', e.target.value)} placeholder="Name of person at the delivery site" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Site access, special requirements…" rows={3} />
          </div>
          <div className="flex gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-500" />
            Offloading is the buyer&apos;s responsibility unless agreed otherwise. The site must be accessible by a delivery truck.
          </div>
        </div>

        <div className="card p-5">
          <div className="flex justify-between font-bold text-lg mb-1">
            <span>Subtotal</span>
            <span className="text-brand-700">{formatPrice(total)}</span>
          </div>
          <div className="text-sm text-gray-500">
            Delivery: {form.location ? (inTown ? 'Free' : 'To be agreed') : 'Select a location'}
          </div>
          {boqFiles.length > 0 && <div className="text-sm text-gray-500">BOQ attached: {boqFiles.map(f => f.name).join(', ')}</div>}
          {!isQuoteMode && (
            <p className="text-sm text-gray-500 mt-2">Next you&apos;ll pay by M-Pesa — in full, or a deposit.</p>
          )}
        </div>

        <p className="text-xs text-gray-400">
          We use your details only to process this order. See our <a href="/privacy" className="underline">privacy notice</a>.
        </p>

        {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg p-3">{error}</p>}
        <Button type="submit" className="w-full" size="lg">
          {isQuoteMode
            ? <><Phone className="h-5 w-5" /> Send Quote Request</>
            : <><CreditCard className="h-5 w-5" /> Continue to M-Pesa Payment</>}
        </Button>
      </form>
    </div>
  )
}
