import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bgtytkbzwmjoxgcrwwlp.supabase.co'
const supabaseAnonKey = 'sb_publishable_rWXdKWtig4uA5KDNnzBfaw_vVrMi2Uk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)