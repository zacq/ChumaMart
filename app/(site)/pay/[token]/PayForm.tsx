'use client'
import { useEffect, useRef, useState } from 'react'
import { CheckCircle, CreditCard, Loader2 } from 'lucide-react'
import { Button, Input } from '@/components/ui'

interface Props {
  token: string
  defaultPhone: string
  grand: number
  balance: number
  deposit: number | null
  depositPct: number
}

type State = 'form' | 'waiting' | 'paid' | 'failed'

function ksh(n: number) {
  return `KSh ${n.toLocaleString('en-KE')}`
}

export default function PayForm({ token, defaultPhone, grand, balance, deposit, depositPct }: Props) {
  const [phone, setPhone] = useState(defaultPhone)
  const [option, setOption] = useState<'full' | 'deposit'>('full')
  const [state, setState] = useState<State>('form')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const startPaid = useRef(grand - balance)
  const timer = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => () => clearInterval(timer.current), [])

  const amount = balance < grand ? balance : option === 'deposit' && deposit ? deposit : grand

  async function pay(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/mpesa/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, phone, option }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'M-Pesa request failed')
      setState('waiting')
      poll()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function poll() {
    const started = Date.now()
    clearInterval(timer.current)
    timer.current = setInterval(async () => {
      const res = await fetch(`/api/pay/${token}`, { cache: 'no-store' })
      const data = await res.json().catch(() => null)
      if (data && data.paid > startPaid.current) {
        clearInterval(timer.current)
        setState('paid')
      } else if (data?.lastPaymentStatus === 'failed') {
        clearInterval(timer.current)
        setState('failed')
      } else if (Date.now() - started > 120_000) {
        clearInterval(timer.current)
        setState('failed')
      }
    }, 4000)
  }

  if (state === 'paid') {
    return (
      <div className="card p-6 text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-1">Payment received</h2>
        <p className="text-gray-500 text-sm">A receipt has been sent by SMS. We&apos;ll confirm your delivery date shortly.</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>View updated order</Button>
      </div>
    )
  }

  if (state === 'waiting') {
    return (
      <div className="card p-6 text-center">
        <Loader2 className="h-10 w-10 text-brand-600 animate-spin mx-auto mb-3" />
        <h2 className="text-lg font-bold text-gray-900 mb-1">Check your phone</h2>
        <p className="text-gray-500 text-sm">Enter your M-Pesa PIN to pay {ksh(amount)}. This page updates when the payment is confirmed.</p>
      </div>
    )
  }

  return (
    <form onSubmit={pay} className="card p-5 space-y-4">
      <h2 className="font-semibold text-gray-900">Pay with M-Pesa</h2>
      {state === 'failed' && (
        <p className="text-sm bg-amber-50 text-amber-800 rounded-lg p-3">
          We didn&apos;t receive a confirmation. If you were charged, it will update shortly; otherwise try again.
        </p>
      )}
      {deposit && balance === grand && (
        <div className="grid gap-2 sm:grid-cols-2">
          {([['full', `Pay in full — ${ksh(grand)}`], ['deposit', `Pay ${depositPct}% deposit — ${ksh(deposit)}`]] as const).map(([val, label]) => (
            <label key={val} className={`flex items-center gap-2 rounded-lg border p-3 text-sm cursor-pointer ${option === val ? 'border-brand-600 bg-brand-50' : 'border-gray-200'}`}>
              <input type="radio" name="option" checked={option === val} onChange={() => setOption(val)} />
              {label}
            </label>
          ))}
        </div>
      )}
      {deposit && balance === grand && option === 'deposit' && (
        <p className="text-xs text-gray-500">The balance is due before dispatch.</p>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa phone number</label>
        <Input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="0712 345 678" required />
      </div>
      {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg p-3">{error}</p>}
      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        <CreditCard className="h-5 w-5" /> {loading ? 'Sending prompt…' : `Pay ${ksh(amount)}`}
      </Button>
    </form>
  )
}
