import { createClient } from '@supabase/supabase-js' 
const supabaseUrl = 'https://uoaafekflbksvkzulclt.supabase.co' 
const supabaseKey = 'sb_publishable_0rxwFGFxcGZqqcOBaQT4Rg_5N7fHR22' 
const supabase = createClient(supabaseUrl, supabaseKey) 
const { data, error } = await supabase.from('products').select('*').limit(1) 
console.log({ data, error }) 
