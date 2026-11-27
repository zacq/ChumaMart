// app/(site)/privacy/page.tsx — Privacy notice (SE-3, Kenya Data Protection Act 2019)
import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = { title: 'Privacy Notice' }

export default function PrivacyPage() {
  return (
    <div className="container-site py-10 max-w-3xl prose-sm space-y-5 text-gray-700">
      <h1 className="text-3xl font-black text-gray-900">Privacy Notice</h1>
      <p>ChumaMart Hardware (&ldquo;we&rdquo;) processes personal data in line with the Kenya Data Protection Act, 2019.</p>

      <h2 className="text-lg font-bold text-gray-900">What we collect</h2>
      <p>Your name, phone number, optional email, delivery location, site contact, order details, any BOQ files you upload, and M-Pesa payment references.</p>

      <h2 className="text-lg font-bold text-gray-900">Why we use it</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>To prepare quotations, take payment, and schedule and deliver your order.</li>
        <li>To send order messages: acknowledgements, quotes, receipts and dispatch notices by SMS, WhatsApp or email.</li>
        <li>To keep records required for accounting and tax.</li>
      </ul>
      <p>We only send marketing messages if you have agreed to receive them, and you can opt out at any time.</p>

      <h2 className="text-lg font-bold text-gray-900">Who we share it with</h2>
      <p>Only the service providers needed to run the service: Safaricom (M-Pesa), our SMS and email providers, and our hosting and database provider. We do not sell your data.</p>

      <h2 className="text-lg font-bold text-gray-900">Your rights</h2>
      <p>You may ask to see, correct or delete your personal data, or object to its use. Contact us at <a className="underline" href={`mailto:${SITE.email}`}>{SITE.email}</a> or call {SITE.phone}.</p>
    </div>
  )
}
