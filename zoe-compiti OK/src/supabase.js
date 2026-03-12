import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://elpvsadyzdwienilfjf.supabase.co"
const SUPABASE_KEY = "sb_publishable_lQhB9u7ESFqw1mRQyjP0GA_-RKMNcsB"

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
