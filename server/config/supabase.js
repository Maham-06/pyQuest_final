/*
const { createClient } = require("@supabase/supabase-js")
const dotenv = require("dotenv")

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables")
}

const supabase = createClient(supabaseUrl, supabaseKey)

/*
// Log the client to verify it's created
console.log("Supabase client created:", supabase)


// Check if the client is working by querying a simple table
async function checkClient() {
  try {
    const { data, error } = await supabase.from('chapters').select('*').limit(1)
    
    if (error) {
      console.error('Error checking Supabase client:', error)
    } else {
      console.log('Supabase client is working. Data:', data)
    }
  } catch (error) {
    console.error('Error performing query:', error)
  }
}

checkClient()
*/

//module.exports = supabase

const { createClient } = require("@supabase/supabase-js")
const dotenv = require("dotenv")

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables")
}

// Create a Supabase client with the service role key for server-side operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Create a Supabase client with the anon key for client-side operations
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

module.exports = { supabase, supabaseClient }
