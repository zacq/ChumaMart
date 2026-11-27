// app/api/pay/[token]/route.ts — payment status for the pay page (polled after STK Push)
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { orderAmounts } from '@/lib/orders'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: { token: string } }) {
  const supabase = createAdminClient()
  const { data: order } = await supabase
    .from('quote_orders')
    .select('id, status, total, delivery_charge, deposit_pct')
    .eq('pay_link_token', params.token)
    .single()
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: payments } = await supabase
    .from('payments')
    .select('amount, status, created_at')
    .eq('quote_order_id', order.id)
    .order('created_at', { ascending: false })
  const amounts = orderAmounts(order, payments ?? [])

  return NextResponse.json({
    status: order.status,
    paid: amounts.paid,
    balance: amounts.balance,
    lastPaymentStatus: payments?.[0]?.status ?? null,
  })
}
