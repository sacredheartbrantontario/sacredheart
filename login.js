const supabaseUrl = "https://wlzlysgufuucqyepsyvb.supabase.co"; 
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsemx5c2d1ZnV1Y3F5ZXBzeXZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjEzODM5NiwiZXhwIjoyMDkxNzE0Mzk2fQ.msih2agjusdG31IGDIWzb3umRyFZbA8WGPgVOEfq_go"; 
onst supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("message");

  message.innerText = "Logging in...";

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    message.innerText = error.message;
    return;
  }

  // Redirect to dashboard
  window.location.href = "dashboard.html";
});
