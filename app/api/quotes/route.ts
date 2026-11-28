// app/api/quotes/route.ts — Create quote / order record
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { generateRef, normalizePhone, formatPrice } from '@/lib/utils'
import { sendSMS } from '@/lib/africas-talking/sms'
import { sendEmail } from '@/lib/resend/email'
import { priceLines, linesTotal, addDays } from '@/lib/orders'
import { SITE, ALL_DELIVERY_AREAS, DEFAULT_DEPOSIT_PCT, QUOTE_VALIDITY_DAYS, FREE_DELIVERY_MINIMUM } from '@/lib/constants'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      customerName, phone, email, location, deliveryDate,
      siteContact, notes, lines: rawLines, boqFiles, mode,
    } = body

    if (!customerName || !phone || !location) {
      return NextResponse.json({ error: 'Name, phone and delivery location are required.' }, { status: 400 })
    }

    const lines = await priceLines(Array.isArray(rawLines) ? rawLines : [])
    const hasBoq = Array.isArray(boqFiles) && boqFiles.length > 0
    if (!lines.length && !hasBoq) {
      return NextResponse.json({ error: 'Your Quote List is empty.' }, { status: 400 })
    }

    const total = linesTotal(lines)
    const area = ALL_DELIVERY_AREAS.find(a => a.label === location)
    const inTown = area?.inTown ?? false
    // Pay now only when delivery is free and every line has a price; otherwise staff price it first
    const payNow =
      mode === 'pay' && inTown && !hasBoq && lines.every(l => l.unit_price > 0) &&
      (FREE_DELIVERY_MINIMUM === 0 || total >= FREE_DELIVERY_MINIMUM)

    const supabase = createAdminClient()
    const normalizedPhone = normalizePhone(phone)

    const { data: customer, error: custErr } = await supabase
      .from('customers')
      .upsert(
        { phone: normalizedPhone, name: customerName, email: email || null, default_location: location },
        { onConflict: 'phone' }
      )
      .select()
      .single()
    if (custErr) console.error('Customer upsert error:', custErr)

    const refNo = generateRef()
    const noteParts = [
      deliveryDate && `Preferred delivery date: ${deliveryDate}`,
      siteContact && `Site contact: ${siteContact}`,
      notes,
    ].filter(Boolean)

    const { data: order, error: orderErr } = await supabase
      .from('quote_orders')
      .insert({
        ref_no: refNo,
        customer_id: customer?.id ?? null,
        lines,
        boq_files: hasBoq ? boqFiles.map((f: { path: string }) => f.path) : [],
        location_text: location,
        in_nakuru_town: inTown,
        delivery_charge: 0,
        deposit_pct: DEFAULT_DEPOSIT_PCT,
        total,
        validity_date: payNow ? addDays(QUOTE_VALIDITY_DAYS) : null,
        status: payNow ? 'quote_sent' : 'quote_requested',
        source: 'web',
        notes: noteParts.length ? noteParts.join('\n') : null,
      })
      .select()
      .single()

    if (orderErr || !order) {
      console.error('Order error:', orderErr)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    if (!payNow) {
      const smsText = `ChumaHardware: Hi ${customerName}! Your quote request ${refNo} has been received. We'll send you a priced quote within 2 hours. Questions? Call ${SITE.phone}`
      await sendSMS(normalizedPhone, smsText)
      if (email) {
        await sendEmail({
          to: email,
          subject: `Quote Request Received – ${refNo}`,
          text: `Hi ${customerName},\n\nYour quote request (${refNo}) has been received. We'll send you a priced quote with a payment link within 2 hours.\n\nSubtotal: ${formatPrice(total)}\nDelivery: ${inTown ? 'Free (Nakuru town)' : 'To be agreed'}\n\nQuestions? Call or WhatsApp ${SITE.phone}\n\nChumaHardware`,
        })
      }
    }

    return NextResponse.json({ refNo, token: order.pay_link_token, payNow })
  } catch (err: any) {
    console.error('Quote API error:', err)
    return NextResponse.json({ error: err.message ?? 'Server error' }, { status: 500 })
  }
}
