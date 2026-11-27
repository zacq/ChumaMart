// lib/orders.ts — server-side order/quote logic shared by API routes and admin
import { createAdminClient } from '@/lib/supabase/server'
import { effectivePrice, tieredPrice, formatPrice } from '@/lib/utils'
import { sendSMS } from '@/lib/africas-talking/sms'
import { sendEmail } from '@/lib/resend/email'
import { SITE } from '@/lib/constants'
import type { OrderStatus, Price, QuoteOrder, QuoteOrderLine } from '@/lib/supabase/types'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Re-price lines from the database so the client can't set its own prices */
export async function priceLines(input: { product_id: string; qty: number }[]): Promise<QuoteOrderLine[]> {
  const wanted = input.filter(l => UUID_RE.test(l.product_id) && Number(l.qty) > 0)
  if (!wanted.length) return []
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('products')
    .select('id, name, unit, prices(*)')
    .in('id', wanted.map(l => l.product_id))
  const byId = new Map((data ?? []).map(p => [p.id, p as unknown as { id: string; name: string; unit: string; prices: Price | null }]))

  return wanted.flatMap(l => {
    const p = byId.get(l.product_id)
    if (!p) return []
    const qty = Math.round(Number(l.qty))
    const base = p.prices ? effectivePrice(p.prices) : 0
    const unit_price = p.prices ? tieredPrice(base, p.prices.tiers ?? [], qty) : 0
    return [{ product_id: p.id, name: p.name, unit: p.unit, qty, unit_price, subtotal: qty * unit_price }]
  })
}

export function linesTotal(lines: QuoteOrderLine[]) {
  return lines.reduce((s, l) => s + l.qty * l.unit_price, 0)
}

export interface OrderAmounts {
  subtotal: number
  delivery: number
  grand: number
  paid: number
  deposit: number
  balance: number
}

export function orderAmounts(
  order: Pick<QuoteOrder, 'total' | 'delivery_charge' | 'deposit_pct'>,
  payments: { amount: number; status: string }[]
): OrderAmounts {
  const subtotal = Number(order.total ?? 0)
  const delivery = Number(order.delivery_charge ?? 0)
  const grand = subtotal + delivery
  const paid = payments.filter(p => p.status === 'confirmed').reduce((s, p) => s + Number(p.amount), 0)
  const deposit = Math.ceil((grand * Number(order.deposit_pct ?? 0)) / 100)
  return { subtotal, delivery, grand, paid, deposit, balance: Math.max(0, grand - paid) }
}

const PAYABLE: OrderStatus[] = ['quote_sent', 'paid_deposit', 'scheduled', 'dispatched']

/** Returns a reason the order can't be paid now, or null if it can */
export function unpayableReason(order: Pick<QuoteOrder, 'status' | 'validity_date'>, amounts: OrderAmounts): string | null {
  if (order.status === 'quote_requested') return 'This quote is still being priced. We will send you a payment link shortly.'
  if (order.status === 'expired') return 'This quote has expired. Contact us to re-issue it at current prices.'
  if (order.status === 'cancelled') return 'This order was cancelled.'
  if (!PAYABLE.includes(order.status)) return 'This order is already paid.'
  if (order.status === 'quote_sent' && order.validity_date && order.validity_date < today()) {
    return 'This quote has expired. Contact us to re-issue it at current prices.'
  }
  if (amounts.grand <= 0) return 'This quote has no priced items yet. Contact us to complete it.'
  if (amounts.balance <= 0) return 'This order is fully paid.'
  return null
}

export function today() {
  return new Date().toISOString().slice(0, 10)
}

export function addDays(days: number) {
  return new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10)
}

export function payLink(token: string) {
  return `${SITE.url}/pay/${token}`
}

export function quotePdfLink(token: string) {
  return `${SITE.url}/api/quotes/${token}/pdf`
}

/** Status after a confirmed payment; later fulfilment statuses are never downgraded */
export function statusAfterPayment(current: OrderStatus, amounts: OrderAmounts): OrderStatus {
  if (current !== 'quote_sent' && current !== 'paid_deposit') return current
  return amounts.balance <= 0 ? 'paid_full' : 'paid_deposit'
}

export async function notifyCustomer(
  customerId: string | null,
  msg: { sms: string; subject?: string; email?: string }
) {
  if (!customerId) return
  const supabase = createAdminClient()
  const { data: customer } = await supabase
    .from('customers')
    .select('phone, email, name')
    .eq('id', customerId)
    .single()
  if (!customer) return
  await sendSMS(customer.phone, msg.sms)
  if (customer.email && msg.subject) {
    await sendEmail({ to: customer.email, subject: msg.subject, text: msg.email ?? msg.sms })
  }
}

export function quoteSentMessage(order: Pick<QuoteOrder, 'ref_no' | 'pay_link_token' | 'validity_date'>, amounts: OrderAmounts) {
  const sms =
    `ChumaMart quote ${order.ref_no}: total ${formatPrice(amounts.grand)}` +
    (amounts.delivery > 0 ? ` incl. delivery ${formatPrice(amounts.delivery)}` : '') +
    (amounts.deposit > 0 && amounts.deposit < amounts.grand ? `. Deposit ${formatPrice(amounts.deposit)}` : '') +
    `. Valid to ${order.validity_date}. Pay: ${payLink(order.pay_link_token)}`
  const email =
    `Your quotation ${order.ref_no} from ChumaMart Hardware is ready.\n\n` +
    `Subtotal: ${formatPrice(amounts.subtotal)}\n` +
    `Delivery: ${amounts.delivery > 0 ? formatPrice(amounts.delivery) : 'Free / not applicable'}\n` +
    `Total: ${formatPrice(amounts.grand)}\n` +
    (amounts.deposit > 0 && amounts.deposit < amounts.grand ? `Deposit due: ${formatPrice(amounts.deposit)}\n` : '') +
    `Valid until: ${order.validity_date}\n\n` +
    `Pay this quote by M-Pesa: ${payLink(order.pay_link_token)}\n` +
    `Download PDF: ${quotePdfLink(order.pay_link_token)}\n\n` +
    `Questions? Call or WhatsApp ${SITE.phone}.\n\nChumaMart Hardware`
  return { sms, subject: `Your ChumaMart quotation ${order.ref_no}`, email }
}
