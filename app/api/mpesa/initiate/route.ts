// app/api/mpesa/initiate/route.ts — Daraja STK Push (PY-1, PY-2, SE-2)
// The amount is always computed on the server from the order identified by its pay-link token.
import { NextRequest, NextResponse } from 'next/server'
import { stkPush } from '@/lib/daraja/stk-push'
import { createAdminClient } from '@/lib/supabase/server'
import { normalizePhone } from '@/lib/utils'
import { orderAmounts, unpayableReason } from '@/lib/orders'

export async function POST(req: NextRequest) {
  try {
    const { token, phone, option } = await req.json() as { token?: string; phone?: string; option?: 'deposit' | 'full' }

    if (!token || !phone) {
      return NextResponse.json({ error: 'Missing phone or payment link.' }, { status: 400 })
    }
    const msisdn = normalizePhone(phone)
    if (!/^254[17]\d{8}$/.test(msisdn)) {
      return NextResponse.json({ error: 'Enter a valid Safaricom number, e.g. 0712 345 678.' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data: order } = await supabase
      .from('quote_orders')
      .select('id, ref_no, status, validity_date, total, delivery_charge, deposit_pct')
      .eq('pay_link_token', token)
      .single()
    if (!order) return NextResponse.json({ error: 'Payment link not found.' }, { status: 404 })

    const { data: payments } = await supabase
      .from('payments')
      .select('amount, status')
      .eq('quote_order_id', order.id)
    const amounts = orderAmounts(order, payments ?? [])
    const reason = unpayableReason(order, amounts)
    if (reason) return NextResponse.json({ error: reason }, { status: 409 })

    let type: 'deposit' | 'full' | 'balance'
    let amount: number
    if (amounts.paid > 0) {
      type = 'balance'; amount = amounts.balance
    } else if (option === 'deposit' && amounts.deposit > 0 && amounts.deposit < amounts.grand) {
      type = 'deposit'; amount = amounts.deposit
    } else {
      type = 'full'; amount = amounts.grand
    }
    amount = Math.ceil(amount)

    const result = await stkPush({
      phone: msisdn,
      amount,
      accountReference: order.ref_no,
      transactionDesc: `ChumaMart ${order.ref_no}`,
    })

    await supabase.from('payments').insert({
      quote_order_id: order.id,
      amount,
      type,
      mpesa_phone: msisdn,
      checkout_request_id: result.CheckoutRequestID,
      status: 'pending',
    })

    return NextResponse.json({
      success: true,
      amount,
      type,
      checkoutRequestId: result.CheckoutRequestID,
      message: 'M-Pesa prompt sent to your phone.',
    })
  } catch (err: any) {
    console.error('STK Push error:', err)
    return NextResponse.json({ error: 'M-Pesa request failed. Please try again or pay via Paybill.' }, { status: 500 })
  }
}
