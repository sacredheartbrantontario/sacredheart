const supabaseUrl = "https://wlzlysgufuucqyepsyvb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsemx5c2d1ZnV1Y3F5ZXBzeXZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjEzODM5NiwiZXhwIjoyMDkxNzE0Mzk2fQ.msih2agjusdG31IGDIWzb3umRyFZbA8WGPgVOEfq_go";
const client = supabase.createClient(supabaseUrl, supabaseKey);

document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const file = document.getElementById("file").files[0];

  const message = document.getElementById("message");
  message.innerText = "Registering...";

  // 1. Create user
  const { data: authData, error: authError } = await client.auth.signUp({
    email,
    password
  });

  if (authError) {
    message.innerText = authError.message;
    return;
  }

  const userId = authData.user.id;

  // 2. Save profile info
  await client.from("profiles").insert({
    id: userId,
    is_admin: false,
    name,
    address
  });

  // 3. Upload file if provided
  if (file) {
    const filePath = `${userId}/${file.name}`;

    const { data: uploadData, error: uploadError } = await client.storage
      .from("public_uploads")
      .upload(filePath, file);

    if (!uploadError) {
      const fileUrl = `${supabaseUrl}/storage/v1/object/public/public_uploads/${filePath}`;

      await client.from("uploads").insert({
        user_id: userId,
        file_name: file.name,
        file_url: fileUrl
      });
    }
  }

  message.innerText = "Registration successful! You may now log in.";
});
