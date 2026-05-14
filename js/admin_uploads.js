// SAFETY CHECK
if (!window.supabase) {
  console.error("Supabase not loaded");
}

/* ------------------ FILTER LISTENER ------------------ */
document.addEventListener("DOMContentLoaded", () => {
  const filter = document.getElementById("sacramentFilter");
  if (filter) {
    filter.addEventListener("change", loadUploads);
  }
});

/* ------------------ LOAD ALL UPLOADS ------------------ */
loadUploads();

async function loadUploads() {
  const container = document.getElementById("uploads-container");
  container.innerHTML = "<p>Loading uploads...</p>";

  // ⭐ Get selected filter value
  const filterValue = document.getElementById("sacramentFilter")?.value || "all";

  // 1. Get all uploads
  const { data: uploadsData, error } = await supabase
    .from("uploads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    container.innerHTML = "<p>Error loading uploads.</p>";
    return;
  }

  if (!uploadsData || uploadsData.length === 0) {
    container.innerHTML = "<p>No uploads found.</p>";
    return;
  }

  let uploads = uploadsData;

  // 2. Get all users (admin API)
  const { data: usersData } = await supabase.auth.admin.listUsers();
  const users = usersData?.users || [];

  // ⭐ FILTER BY SACRAMENT
  uploads = uploads.filter(upload => {
    const user = users.find(u => u.id === upload.user_id);
    const sacrament = user?.user_metadata?.sacrament || "Not specified";

    if (filterValue === "all") return true;
    return sacrament === filterValue;
  });

  // 3. Build table
  let html = `
    <table border="1" cellpadding="6">
      <tr>
        <th>User Email</th>
        <th>Sacrament</th> <!-- ⭐ NEW -->
        <th>File Name</th>
        <th>Download</th>
        <th>Uploaded At</th>
        <th>Delete</th>
      </tr>
  `;

  uploads.forEach(upload => {
    const user = users.find(u => u.id === upload.user_id);
    const email = user ? user.email : "Unknown";
    const sacrament = user?.user_metadata?.sacrament || "Not specified"; // ⭐ NEW

    html += `
      <tr>
        <td>${email}</td>
        <td>${sacrament}</td> <!-- ⭐ NEW -->
        <td>${upload.file_name}</td>
        <td><a href="${upload.file_url}" target="_blank">Download</a></td>
        <td>${new Date(upload.created_at).toLocaleString()}</td>
        <td><button onclick="deleteUpload(${upload.id})">Delete</button></td>
      </tr>
    `;
  });

  html += "</table>";

  container.innerHTML = html;
}

/* ------------------ DELETE UPLOAD ------------------ */
async function deleteUpload(id) {
  if (!confirm("Delete this upload?")) return;

  await supabase.from("uploads").delete().eq("id", id);

  loadUploads();
}
