// app/api/boq/route.ts — BOQ upload to private Supabase storage (QL-4)
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { createAdminClient } from '@/lib/supabase/server'

const MAX_BYTES = 10 * 1024 * 1024
const ALLOWED = /\.(pdf|xlsx|xls|csv|png|jpe?g|webp|heic)$/i

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }
  if (!ALLOWED.test(file.name)) {
    return NextResponse.json({ error: 'Upload a photo, PDF or Excel file.' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File is larger than 10 MB.' }, { status: 400 })
  }

  const safeName = file.name.replace(/[^\w.-]+/g, '_').slice(-80)
  const path = `${new Date().toISOString().slice(0, 7)}/${randomUUID()}-${safeName}`
  const supabase = createAdminClient()
  const { error } = await supabase.storage
    .from('boq')
    .upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type || 'application/octet-stream' })

  if (error) {
    console.error('BOQ upload error:', error)
    return NextResponse.json({ error: 'Upload failed. Please try again or send it on WhatsApp.' }, { status: 500 })
  }
  return NextResponse.json({ path, name: file.name })
}
