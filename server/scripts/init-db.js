const { createClient } = require("@supabase/supabase-js")
const fs = require("fs")
const path = require("path")
require("dotenv").config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Check your .env file.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const initializeDatabase = async () => {
  try {
    console.log("Starting database initialization...")

    // Read SQL files
    const schemaSQL = fs.readFileSync(path.join(__dirname, "../db/schema.sql"), "utf8")
    const seedSQL = fs.readFileSync(path.join(__dirname, "../db/seed.sql"), "utf8")

    // Execute schema SQL
    console.log("Creating database schema...")
    const { error: schemaError } = await supabase.rpc("exec_sql", { sql: schemaSQL })

    if (schemaError) {
      throw new Error(`Error creating schema: ${schemaError.message}`)
    }

    // Execute seed SQL
    console.log("Seeding database with initial data...")
    const { error: seedError } = await supabase.rpc("exec_sql", { sql: seedSQL })

    if (seedError) {
      throw new Error(`Error seeding database: ${seedError.message}`)
    }

    console.log("Database initialization completed successfully!")
  } catch (error) {
    console.error("Database initialization failed:", error.message)
    process.exit(1)
  }
}

initializeDatabase()
