async function loadUploads() {
  // 1. Get all uploads
  const { data: uploads, error: uploadsError } = await client
    .from("uploads")
    .select("*")
    .order("id", { ascending: false });

  if (uploadsError) {
    console.log(uploadsError);
    return;
  }

  // 2. Get all profiles (admin has permission)
  const { data: profiles, error: profilesError } = await client
    .from("profiles")
    .select("*");

  if (profilesError) {
    console.log(profilesError);
    return;
  }

  const tableBody = document.querySelector("#uploadsTable tbody");
  tableBody.innerHTML = "";

  uploads.forEach(upload => {
    const user = profiles.find(p => p.id === upload.user_id);

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${user ? user.first_name + " " + user.last_name : "Unknown"}</td>
      <td>${user ? user.email : ""}</td>
      <td>${user ? user.phone : ""}</td>
      <td>${upload.file_name}</td>
      <td>${new Date(upload.created_at).toLocaleString()}</td>
      <td><a href="${upload.file_url}" target="_blank">Download</a></td>
    `;

    tableBody.appendChild(row);
  });
}

loadUploads();
