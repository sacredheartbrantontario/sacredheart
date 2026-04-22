const SUPABASE_URL = "https://nucufjvinwkrplegobnn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Y3VmanZpbndrcnBsZWdvYm5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzA2MjEsImV4cCI6MjA5MjQ0NjYyMX0.Fnf6Gm-I2tmETiREI9Gqz4ipoPvWrx0OVSNpJklkvT0";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
