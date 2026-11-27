// app/api/mpesa/callback/route.ts — Daraja callback handler (SE-2)
// Set MPESA_CALLBACK_SECRET and append ?secret=<value> to MPESA_CALLBACK_URL so only Safaricom's call is accepted.
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { orderAmounts, statusAfterPayment, notifyCustomer } from '@/lib/orders'
import { formatPrice } from '@/lib/utils'
import { SITE } from '@/lib/constants'

const ACCEPTED = { ResultCode: 0, ResultDesc: 'Accepted' }

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.MPESA_CALLBACK_SECRET
    if (secret && req.nextUrl.searchParams.get('secret') !== secret) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const callback = body?.Body?.stkCallback
    if (!callback) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Invalid payload' })
    }

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callback
    const supabase = createAdminClient()

    const { data: payment } = await supabase
      .from('payments')
      .select('*')
      .eq('checkout_request_id', CheckoutRequestID)
      .single()

    if (!payment) {
      console.error('No payment found for CheckoutRequestID:', CheckoutRequestID)
      return NextResponse.json(ACCEPTED)
    }
    if (payment.status !== 'pending') return NextResponse.json(ACCEPTED)

    if (ResultCode !== 0) {
      await supabase.from('payments').update({ status: 'failed' }).eq('id', payment.id)
      console.log(`M-Pesa payment failed: ${ResultDesc}`)
      return NextResponse.json(ACCEPTED)
    }

    const items: { Name: string; Value: string | number }[] = CallbackMetadata?.Item ?? []
    const get = (name: string) => items.find(i => i.Name === name)?.Value
    const mpesaReceipt = String(get('MpesaReceiptNumber') ?? '')
    const amount = Number(get('Amount') ?? payment.amount)

    await supabase.from('payments').update({
      status: 'confirmed',
      amount,
      mpesa_receipt: mpesaReceipt,
      mpesa_phone: String(get('PhoneNumber') ?? payment.mpesa_phone ?? ''),
      paid_at: new Date().toISOString(),
    }).eq('id', payment.id)

    const { data: order } = await supabase
      .from('quote_orders')
      .select('*')
      .eq('id', payment.quote_order_id)
      .single()
    if (!order) return NextResponse.json(ACCEPTED)

    const { data: payments } = await supabase
      .from('payments')
      .select('amount, status')
      .eq('quote_order_id', order.id)
    const amounts = orderAmounts(order, payments ?? [])
    const newStatus = statusAfterPayment(order.status, amounts)
    if (newStatus !== order.status) {
      await supabase.from('quote_orders').update({ status: newStatus }).eq('id', order.id)
    }

    const sms =
      `ChumaMart receipt: ${order.ref_no}\nPaid ${formatPrice(amount)} (M-Pesa ${mpesaReceipt})` +
      (amounts.balance > 0 ? `\nBalance: ${formatPrice(amounts.balance)}` : '\nFully paid') +
      `\nTrack: ${SITE.url}/track?ref=${order.ref_no}\nWe'll confirm your delivery date shortly.`
    await notifyCustomer(order.customer_id, { sms, subject: `Payment received – ${order.ref_no}` })

    return NextResponse.json(ACCEPTED)
  } catch (err) {
    console.error('M-Pesa callback error:', err)
    return NextResponse.json(ACCEPTED)
  }
}
