// Initialize Supabase client safely
const client = supabase.createClient(
  "https://nucufjvinwkrplegobnn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Y3VmanZpbndrcnBsZWdvYm5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzA2MjEsImV4cCI6MjA5MjQ0NjYyMX0.Fnf6Gm-I2tmETiREI9Gqz4ipoPvWrx0OVSNpJklkvT0"
);

async function sendReset() {
  const email = document.getElementById("resetEmail").value;
  const message = document.getElementById("resetMessage");
  const error = document.getElementById("resetError");

  message.textContent = "";
  error.textContent = "";

  if (!email) {
    error.textContent = "Please enter your email.";
    return;
  }

  const { data, error: resetError } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + "/reset_success.html"
  });

  if (resetError) {
    error.textContent = resetError.message;
  } else {
    message.textContent = "A password reset link has been sent to your email.";
  }
}
