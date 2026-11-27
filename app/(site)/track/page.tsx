// app/(site)/track/page.tsx — Order tracking (FR-16)
'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, Package, CheckCircle, Truck, Clock, XCircle } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { formatPrice, formatDate } from '@/lib/utils'

const STATUS_STEPS = [
  { key: 'quote_requested', label: 'Quote Requested',  icon: Package   },
  { key: 'quote_sent',      label: 'Quote Sent',       icon: Clock     },
  { key: 'paid_deposit',    label: 'Deposit Paid',     icon: CheckCircle },
  { key: 'paid_full',       label: 'Fully Paid',       icon: CheckCircle },
  { key: 'scheduled',       label: 'Scheduled',        icon: Clock     },
  { key: 'dispatched',      label: 'Dispatched',       icon: Truck     },
  { key: 'delivered',       label: 'Delivered',        icon: CheckCircle },
]

interface OrderStatus {
  ref_no: string
  status: string
  updated_at: string
  location_text: string | null
  total: number
  paid: number
  balance: number
  pay_url: string | null
  delivery: {
    delivery_date: string | null
    time_window: string | null
    driver_name: string | null
    driver_phone: string | null
  } | null
}

export default function TrackPage() {
  return (
    <Suspense>
      <TrackForm />
    </Suspense>
  )
}

function TrackForm() {
  const searchParams = useSearchParams()
  const [phone, setPhone] = useState('')
  const [ref, setRef]     = useState(searchParams.get('ref') ?? '')
  const [order, setOrder] = useState<OrderStatus | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setOrder(null); setLoading(true)
    try {
      const res = await fetch(`/api/orders/track?phone=${encodeURIComponent(phone)}&ref=${encodeURIComponent(ref)}`)
      const data = await res.json()
      if (!res.ok || !data.order) {
        setError('Order not found. Check your phone number and reference.')
      } else {
        setOrder(data.order)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const stepIndex = order ? STATUS_STEPS.findIndex(s => s.key === order.status) : -1

  return (
    <div className="container-site py-10 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Track Your Order</h1>
      <p className="text-gray-500 mb-8">Enter your phone number and order reference to check your order status.</p>

      <form onSubmit={handleTrack} className="card p-5 space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
          <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="0712 345 678" type="tel" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order / Quote reference</label>
          <Input value={ref} onChange={e => setRef(e.target.value.toUpperCase())} placeholder="CM-2026-12345" required />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          <Search className="h-5 w-5" /> {loading ? 'Checking…' : 'Track Order'}
        </Button>
      </form>

      {order && (
        <div className="card p-5">
          <div className="flex justify-between items-start mb-5">
            <div>
              <div className="font-mono font-bold text-lg text-gray-900">{order.ref_no}</div>
              {order.location_text && <div className="text-sm text-gray-500 mt-0.5">{order.location_text}</div>}
            </div>
            {order.total > 0 && <div className="font-bold text-brand-700 text-lg">{formatPrice(order.total)}</div>}
          </div>
          {order.total > 0 && (
            <div className="grid grid-cols-2 gap-3 text-sm mb-5">
              <div className="rounded-lg bg-green-50 p-3"><div className="text-gray-500 text-xs">Paid</div><div className="font-semibold text-green-700">KSh {order.paid.toLocaleString('en-KE')}</div></div>
              <div className="rounded-lg bg-amber-50 p-3"><div className="text-gray-500 text-xs">Balance</div><div className="font-semibold text-amber-700">KSh {order.balance.toLocaleString('en-KE')}</div></div>
            </div>
          )}
          {order.pay_url && (
            <Link href={order.pay_url} className="btn-primary w-full mb-5">Pay by M-Pesa</Link>
          )}
          {order.delivery?.delivery_date && (
            <div className="rounded-lg bg-brand-50 p-3 text-sm mb-5">
              <div className="font-semibold text-brand-800">Delivery: {formatDate(order.delivery.delivery_date)} {order.delivery.time_window ?? ''}</div>
              {order.delivery.driver_name && (
                <div className="text-brand-700">Driver: {order.delivery.driver_name} {order.delivery.driver_phone && <a className="underline" href={`tel:${order.delivery.driver_phone}`}>{order.delivery.driver_phone}</a>}</div>
              )}
            </div>
          )}
          {(order.status === 'expired' || order.status === 'cancelled') && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 text-red-700 p-3 text-sm mb-5">
              <XCircle className="h-4 w-4" /> This {order.status === 'expired' ? 'quote has expired — contact us to re-issue it.' : 'order was cancelled.'}
            </div>
          )}
          <div className="space-y-3">
            {STATUS_STEPS.slice(0, 7).map((s, i) => {
              const done = i <= stepIndex
              const active = i === stepIndex
              const Icon = s.icon
              return (
                <div key={s.key} className={`flex items-center gap-3 ${done ? '' : 'opacity-30'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${active ? 'bg-brand-700 text-white' : done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${active ? 'text-brand-700' : 'text-gray-700'}`}>{s.label}</div>
                    {active && <div className="text-xs text-gray-400">Current status</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
