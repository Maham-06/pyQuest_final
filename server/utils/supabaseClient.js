const { createClient } = require("@supabase/supabase-js")

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY // Use service key for admin operations

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Please check your environment variables.")
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

module.exports = { supabase }
