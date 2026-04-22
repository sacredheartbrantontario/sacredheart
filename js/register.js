document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        role: "user"
      }
    }
  });

  if (error) {
    alert("Registration failed");
    console.log(error);
    return;
  }

  alert("Registration successful! Please log in.");
  window.location.href = "login.html";
});
