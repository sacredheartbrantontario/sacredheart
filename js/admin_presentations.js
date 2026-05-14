// SAFETY CHECK
if (!window.supabase) {
  console.error("Supabase not loaded");
}

/* ------------------ LOAD PRESENTATIONS ------------------ */
loadPresentations();

async function loadPresentations() {
  const { data } = await supabase
    .from("presentations")
    .select("*")
    .order("created_at", { ascending: false });

  const list = document.getElementById("presentationsList");
  list.innerHTML = "";

  if (!data || data.length === 0) {
    list.innerHTML = "<p>No presentations uploaded yet.</p>";
    return;
  }

  data.forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${item.title}</strong><br>
      <a href="${item.file_url}" target="_blank">Download / View</a>
      <br>
      <button onclick="deletePresentation(${item.id})">Delete</button>
      <hr>
    `;
    list.appendChild(div);
  });
}

/* ------------------ UPLOAD PRESENTATION ------------------ */
/* ------------------ UPLOAD PRESENTATION ------------------ */
document.getElementById("presentationForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = document.getElementById("presentationFile").files[0];
  const title = document.getElementById("presentationTitle").value;

  if (!file) return alert("Please select a file");

  const filePath = `presentations/${Date.now()}-${file.name}`;

  // Upload to the correct bucket
  const { error: uploadError } = await supabase.storage
    .from("presentations")
    .upload(filePath, file);

  if (uploadError) {
    alert("Upload failed");
    console.error(uploadError);
    return;
  }

  const file_url = supabase.storage
    .from("presentations")
    .getPublicUrl(filePath).data.publicUrl;

  // Insert into database
  await supabase.from("presentations").insert([{ title, file_url }]);

  loadPresentations();
});


/* ------------------ DELETE PRESENTATION ------------------ */
async function deletePresentation(id) {
  await supabase.from("presentations").delete().eq("id", id);
  loadPresentations();
}
