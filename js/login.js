document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert("Login failed");
    return;
  }

  // Check role
  const { data: { user } } = await client.auth.getUser();

  if (user.user_metadata.role === "admin") {
    window.location.href = "admin/admin-affairs.html";
  } else {
    window.location.href = "index.html";
  }
});
