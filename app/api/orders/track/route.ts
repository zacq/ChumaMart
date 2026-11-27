// app/api/orders/track/route.ts — FR-16, PY-4
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { normalizePhone } from '@/lib/utils'
import { orderAmounts, unpayableReason } from '@/lib/orders'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const phone = searchParams.get('phone')
  const ref   = searchParams.get('ref')

  if (!phone || !ref) {
    return NextResponse.json({ error: 'Missing phone or ref' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('phone', normalizePhone(phone))
    .single()
  if (!customer) return NextResponse.json({ order: null })

  const { data: order } = await supabase
    .from('quote_orders')
    .select('id, ref_no, status, updated_at, location_text, total, delivery_charge, deposit_pct, validity_date, pay_link_token')
    .eq('customer_id', customer.id)
    .eq('ref_no', ref.trim().toUpperCase())
    .single()
  if (!order) return NextResponse.json({ order: null })

  const [{ data: payments }, { data: delivery }] = await Promise.all([
    supabase.from('payments').select('amount, status').eq('quote_order_id', order.id),
    supabase.from('deliveries').select('delivery_date, time_window, driver_name, driver_phone, status')
      .eq('quote_order_id', order.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
  ])
  const amounts = orderAmounts(order, payments ?? [])
  const payable = !unpayableReason(order, amounts)

  return NextResponse.json({
    order: {
      ref_no: order.ref_no,
      status: order.status,
      updated_at: order.updated_at,
      location_text: order.location_text,
      total: amounts.grand,
      paid: amounts.paid,
      balance: amounts.balance,
      pay_url: payable ? `/pay/${order.pay_link_token}` : null,
      delivery: delivery ?? null,
    },
  })
}
