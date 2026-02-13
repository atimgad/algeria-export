import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1)

    return NextResponse.json({ data, error })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}