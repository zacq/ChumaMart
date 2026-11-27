// app/(site)/terms/page.tsx — Terms of sale
import type { Metadata } from 'next'
import { DEFAULT_DEPOSIT_PCT, QUOTE_VALIDITY_DAYS, SITE } from '@/lib/constants'

export const metadata: Metadata = { title: 'Terms of Sale' }

export default function TermsPage() {
  return (
    <div className="container-site py-10 max-w-3xl space-y-5 text-gray-700">
      <h1 className="text-3xl font-black text-gray-900">Terms of Sale</h1>

      <h2 className="text-lg font-bold text-gray-900">Prices</h2>
      <p>Prices are per the unit shown on each product. Website prices can change; the price is locked once you pay, or for the validity period on a quotation.</p>

      <h2 className="text-lg font-bold text-gray-900">Quotations</h2>
      <p>Quotations are valid for {QUOTE_VALIDITY_DAYS} days unless stated otherwise. Expired quotes can be re-issued at current prices.</p>

      <h2 className="text-lg font-bold text-gray-900">Payment</h2>
      <p>We accept M-Pesa online (STK Push) and Paybill using your order number as the account. Large or out-of-town orders may be paid with a deposit (usually {DEFAULT_DEPOSIT_PCT}%); the balance is due before dispatch.</p>

      <h2 className="text-lg font-bold text-gray-900">Delivery</h2>
      <p>Delivery is free within Nakuru town. Delivery outside Nakuru town is charged at a rate agreed and shown on your quote before you pay. Offloading is the buyer&apos;s responsibility unless agreed otherwise, and the site must be accessible by a delivery truck. Collection from our yard is free.</p>

      <h2 className="text-lg font-bold text-gray-900">Cancellations and refunds</h2>
      <p>Contact us as soon as possible to cancel. Orders not yet dispatched can be cancelled and refunded to the paying M-Pesa number. Goods must be checked on delivery; report any shortage or damage to the driver and to us on the same day.</p>

      <p>Questions? Call {SITE.phone} or email <a className="underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
    </div>
  )
}
