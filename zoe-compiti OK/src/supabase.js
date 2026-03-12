import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://elpvsadyzdwienilfjf.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVscHZzYWR5emR3dmllbmlsZmpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMDE3NDksImV4cCI6MjA4ODg3Nzc0OX0.VAa1FNRp87xxzukoxc0oE8vzj_ZJ_N0mifLe7n4dLSI"

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
