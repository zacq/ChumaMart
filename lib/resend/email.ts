// lib/resend/email.ts — Transactional email via Resend
import { Resend } from 'resend'

let resendClient: Resend | null = null

function getResend() {
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY!)
  return resendClient
}

interface SendEmailParams {
  to: string
  subject: string
  text: string
  html?: string
  attachments?: { filename: string; content: Buffer }[]
}

export async function sendEmail(params: SendEmailParams): Promise<void> {
  try {
    await getResend().emails.send({
      from: process.env.RESEND_FROM ?? 'orders@chumamarthardware.com',
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
      attachments: params.attachments,
    })
  } catch (err) {
    console.error('Email send error:', err)
  }
}
