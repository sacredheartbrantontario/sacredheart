// js/reset_password.js

async function updatePassword() {
  const newPassword = document.getElementById("newPassword").value;
  const message = document.getElementById("message");
  const error = document.getElementById("error");

  message.textContent = "";
  error.textContent = "";

  if (!newPassword) {
    error.textContent = "Please enter a new password.";
    return;
  }

  // Update password using Supabase
  const { data, error: updateError } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (updateError) {
    error.textContent = updateError.message;
    return;
  }

  message.textContent = "Password updated successfully! Redirecting...";
  setTimeout(() => {
    window.location.href = "reset_success.html";
  }, 1500);
}
