// pages/api/auth/callback.ts
import { createClient } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query

  if (code) {
    await supabase.auth.exchangeCodeForSession(String(code))
  }

  res.redirect('/')
}