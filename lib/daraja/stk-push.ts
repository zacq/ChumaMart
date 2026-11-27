// lib/daraja/stk-push.ts — Safaricom Daraja STK Push (OQ-5 dummy credentials)
import axios from 'axios'

const ENV       = process.env.MPESA_ENVIRONMENT ?? 'sandbox'
const BASE_URL  = ENV === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke'

const CONSUMER_KEY    = process.env.MPESA_CONSUMER_KEY!
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!
const SHORTCODE       = process.env.MPESA_SHORTCODE!
const PASSKEY         = process.env.MPESA_PASSKEY!
const CALLBACK_URL    = process.env.MPESA_CALLBACK_URL!

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64')
  const { data } = await axios.get(
    `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${auth}` } }
  )
  return data.access_token
}

function getTimestamp(): string {
  return new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
}

function getPassword(timestamp: string): string {
  return Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64')
}

export interface StkPushParams {
  phone: string            // 254XXXXXXXXX
  amount: number
  accountReference: string
  transactionDesc: string
}

export async function stkPush(params: StkPushParams) {
  const token     = await getAccessToken()
  const timestamp = getTimestamp()
  const password  = getPassword(timestamp)

  const { data } = await axios.post(
    `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
    {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: params.amount,
      PartyA: params.phone,
      PartyB: SHORTCODE,
      PhoneNumber: params.phone,
      CallBackURL: CALLBACK_URL,
      AccountReference: params.accountReference,
      TransactionDesc: params.transactionDesc,
    },
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
  )

  if (data.ResponseCode !== '0') {
    throw new Error(data.ResponseDescription ?? 'STK Push failed')
  }

  return data as { CheckoutRequestID: string; MerchantRequestID: string }
}
