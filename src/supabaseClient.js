import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xxnufexhhegnoiuvphbn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4bnVmZXhoaGVnbm9pdXZwaGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyODI4MjksImV4cCI6MjA2MDg1ODgyOX0.dWYXrhjlxonRRU8oZ87fllCdTGnxUW6Ri75nd6PwuJw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)