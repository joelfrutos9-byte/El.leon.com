import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xzcrbogvfizadoarlmme.supabase.co'
const supabaseAnonKey = 'sb_publishable_TyguTTrj1g_7X3ZSRXpMvg_QeijvM2z'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
