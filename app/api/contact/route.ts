// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/resend/email'
import { SITE } from '@/lib/constants'

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, message } = await req.json()
    await sendEmail({
      to: SITE.email,
      subject: `Enquiry from ${name} – ChumaHardware Website`,
      text: `New enquiry from the ChumaHardware website:\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email || 'not provided'}\n\nMessage:\n${message}`,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
