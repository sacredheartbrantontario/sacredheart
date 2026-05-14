// js/admin_supabase.js

// ⭐ ADMIN-ONLY SUPABASE CLIENT
// This file is ONLY for admin pages.
// It uses the service role key so the admin panel can read:
// - user emails
// - user metadata (sacrament, firstName, lastName, etc.)
// - full auth user list

const SUPABASE_URL = "https://nucufjvinwkrplegobnn.supabase.co";

// ⭐ IMPORTANT: paste your SERVICE ROLE KEY below
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Y3VmanZpbndrcnBsZWdvYm5uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg3MDYyMSwiZXhwIjoyMDkyNDQ2NjIxfQ.7KpT-wn0phP8MGESM5Alr8ySOuDynR9OaUrbfL5hq6c";

// Create the admin Supabase client
window.supabase = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
);
