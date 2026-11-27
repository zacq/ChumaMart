// app/(site)/pay/[token]/page.tsx — "Pay this quote" (QT-4, PY-1 to PY-3)
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FileDown, Truck } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/server'
import { orderAmounts, unpayableReason } from '@/lib/orders'
import { formatDate } from '@/lib/utils'
import { MPESA } from '@/lib/constants'
import PayForm from './PayForm'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Pay your quote', robots: { index: false, follow: false } }

const UUID_RE = /^[0-9a-f-]{36}$/i

function ksh(n: number) {
  return `KSh ${n.toLocaleString('en-KE')}`
}

export default async function PayPage({ params }: { params: { token: string } }) {
  if (!UUID_RE.test(params.token)) notFound()
  const supabase = createAdminClient()
  const { data: order } = await supabase
    .from('quote_orders')
    .select('*, customers(name, phone)')
    .eq('pay_link_token', params.token)
    .single()
  if (!order) notFound()

  const { data: payments } = await supabase
    .from('payments')
    .select('amount, status')
    .eq('quote_order_id', order.id)
  const amounts = orderAmounts(order, payments ?? [])
  const reason = unpayableReason(order, amounts)
  const customer = (order as unknown as { customers: { name: string | null; phone: string } | null }).customers

  return (
    <div className="container-site py-8 max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pay for {order.ref_no}</h1>
        {customer?.name && <p className="text-gray-500 text-sm">For {customer.name}</p>}
      </div>

      <div className="card p-5">
        <div className="space-y-2 text-sm mb-4">
          {order.lines.map((l, i) => (
            <div key={i} className="flex justify-between gap-3">
              <span className="text-gray-700">{l.qty} × {l.name} <span className="text-gray-400">({l.unit})</span></span>
              <span className="font-medium flex-shrink-0">{ksh(l.qty * l.unit_price)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 pt-3 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{ksh(amounts.subtotal)}</span></div>
          <div className="flex justify-between">
            <span className="text-gray-500 flex items-center gap-1"><Truck className="h-4 w-4" /> Delivery to {order.location_text}</span>
            <span>{amounts.delivery > 0 ? ksh(amounts.delivery) : order.in_nakuru_town ? 'Free' : '—'}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-1"><span>Total</span><span className="text-brand-700">{ksh(amounts.grand)}</span></div>
          {amounts.paid > 0 && (
            <>
              <div className="flex justify-between text-green-700"><span>Paid</span><span>{ksh(amounts.paid)}</span></div>
              <div className="flex justify-between font-semibold"><span>Balance</span><span>{ksh(amounts.balance)}</span></div>
            </>
          )}
          {order.validity_date && order.status === 'quote_sent' && (
            <div className="text-xs text-gray-400 pt-1">Valid until {formatDate(order.validity_date)}. Prices and delivery rate are locked until then.</div>
          )}
        </div>
        <a href={`/api/quotes/${order.pay_link_token}/pdf`} className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-700 font-medium hover:underline">
          <FileDown className="h-4 w-4" /> Download quotation (PDF)
        </a>
      </div>

      {reason ? (
        <div className="card p-5 text-sm text-gray-700">{reason}</div>
      ) : (
        <PayForm
          token={order.pay_link_token}
          defaultPhone={customer?.phone ? '0' + customer.phone.slice(3) : ''}
          grand={amounts.grand}
          balance={amounts.balance}
          deposit={amounts.paid === 0 && amounts.deposit > 0 && amounts.deposit < amounts.grand ? amounts.deposit : null}
          depositPct={order.deposit_pct}
        />
      )}

      <div className="card p-5 text-sm text-gray-600">
        <div className="font-semibold text-gray-900 mb-1">Prefer to pay via Paybill?</div>
        Business number <span className="font-mono font-semibold">{MPESA.paybill}</span>, account number <span className="font-mono font-semibold">{order.ref_no}</span>.
        We confirm Paybill payments manually.
      </div>

      <div className="text-xs text-gray-400">
        Offloading is the buyer&apos;s responsibility unless agreed otherwise. The delivery site must be accessible by truck, and a site contact is needed on the day.
      </div>
    </div>
  )
}
