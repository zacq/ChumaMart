// lib/africas-talking/sms.ts — Africa's Talking SMS (OQ-5 dummy)
let atClient: any = null

function getClient() {
  if (!atClient) {
    const AfricasTalking = require('africastalking')
    const at = AfricasTalking({
      apiKey: process.env.AT_API_KEY!,
      username: process.env.AT_USERNAME!,
    })
    atClient = at.SMS
  }
  return atClient
}

export async function sendSMS(to: string, message: string): Promise<void> {
  // Normalize: 07xx → +2547xx
  const phone = to.startsWith('0')
    ? `+254${to.slice(1)}`
    : to.startsWith('254')
    ? `+${to}`
    : to

  try {
    await getClient().send({
      to: [phone],
      message,
      from: process.env.AT_SENDER_ID ?? 'ChumaMart',
    })
  } catch (err) {
    // Log but don't throw — SMS failure should not break the order flow
    console.error('SMS send error:', err)
  }
}
