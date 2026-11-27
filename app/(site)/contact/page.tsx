// app/(site)/contact/page.tsx — FR-15
'use client'
import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react'
import { SITE, YARD } from '@/lib/constants'
import { whatsappUrl } from '@/lib/utils'
import { Button, Input, Textarea } from '@/components/ui'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSent(true)
    } catch {
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-site py-10">
      <h1 className="text-3xl font-black text-gray-900 mb-2">Contact Us</h1>
      <p className="text-gray-500 mb-10 max-w-xl">We&apos;re based in Nakuru Industrial Area. Call, WhatsApp or fill in the form — we respond to quote requests within 2 hours.</p>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Contact details */}
        <div className="space-y-6">
          <div className="card p-5 space-y-4">
            <a href={`tel:${SITE.phone.replace(/\s/g,'')}`} className="flex gap-3 items-start group">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-brand-700" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-brand-700">Call Us</div>
                <div className="text-brand-700">{SITE.phone}</div>
              </div>
            </a>
            <a href={whatsappUrl(SITE.whatsapp, 'Hello ChumaMart!')} target="_blank" rel="noopener noreferrer" className="flex gap-3 items-start group">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-green-700">WhatsApp</div>
                <div className="text-green-700">Chat with us on WhatsApp</div>
              </div>
            </a>
            <a href={`mailto:${SITE.email}`} className="flex gap-3 items-start group">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-brand-700" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-brand-700">Email</div>
                <div className="text-brand-700">{SITE.email}</div>
              </div>
            </a>
            <a href={YARD.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex gap-3 items-start group">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-brand-700" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-brand-700">Yard Address</div>
                <div className="text-gray-600">{YARD.address}</div>
                <div className="text-gray-400 text-xs">Plus code: {YARD.plusCode}</div>
              </div>
            </a>
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-brand-700" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Opening Hours</div>
                <div className="text-gray-600 text-sm">{YARD.hours}</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-video">
            <iframe
              src={YARD.mapsEmbedUrl}
              title="ChumaMart Hardware yard location"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Enquiry form */}
        {sent ? (
          <div className="card p-8 flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Message sent!</h2>
            <p className="text-gray-500">We&apos;ll get back to you within 2 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">Send an Enquiry</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your name *</label>
              <Input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="John Kamau" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone number *</label>
              <Input type="tel" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} placeholder="0712 345 678" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
              <Input type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} placeholder="you@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
              <Textarea value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))} placeholder="What materials do you need? We'll get back to you within 2 hours." rows={5} required />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              <Send className="h-5 w-5" /> {loading ? 'Sending…' : 'Send Message'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
