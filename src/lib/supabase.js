import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wcigbtzsuzxgkncwdxgl.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjaWdidHpzdXp4Z2tuY3dkeGdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNzIzNTcsImV4cCI6MjA2Nzg0ODM1N30.v2SGXPIa8ReKL1rr_x4DPFuxcM8tRmEhAkZPRPsl-4A'

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// For now, we'll use mock data instead of Supabase
// This allows the app to work without database setup
export const supabaseClient = {
  // Mock implementation that doesn't actually connect to Supabase
  from: (table) => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: [], error: null }),
    update: () => Promise.resolve({ data: [], error: null }),
    delete: () => Promise.resolve({ data: [], error: null })
  }),
  auth: {
    user: () => null,
    signIn: () => Promise.resolve({ user: null, error: null }),
    signOut: () => Promise.resolve({ error: null })
  },
  storage: supabase.storage
};

export default supabaseClient;