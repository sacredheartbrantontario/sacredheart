async function loadDashboard() {
  const { data: { user } } = await client.auth.getUser();
  if (!user) return (window.location.href = "login.html");

  loadProfile(user);
  loadUploads(user);
  loadHistory(user);
  loadPresentations();
  setupButtons(user);
}

/* ---------------- PROFILE ---------------- */

function loadProfile(user) {
  document.getElementById("profileName").textContent =
    user.user_metadata.firstName + " " + user.user_metadata.lastName;

  document.getElementById("profileEmail").textContent = user.email;

  document.getElementById("profileDate").textContent =
    new Date(user.created_at).toLocaleDateString();
}

/* ---------------- UPLOAD LIST ---------------- */

async function loadUploads(user) {
  const { data: uploads } = await client
    .from("uploads")
    .select("*")
    .eq("user_id", user.id);

  const list = document.getElementById("filesList");
  list.innerHTML = "";

  if (!uploads || uploads.length === 0) {
    list.innerHTML = "<p>No files uploaded yet.</p>";
    return;
  }

  uploads.forEach(file => {
    list.innerHTML += `
      <div class="file-item">
        <a href="${file.file_url}" target="_blank">${file.file_name}</a>
        <button class="delete-btn" onclick="deleteFile('${file.id}', '${file.file_path}')">Delete</button>
      </div>
    `;
  });
}

/* ---------------- DELETE FILE ---------------- */

async function deleteFile(id, path) {
  await client.storage.from("public_uploads").remove([path]);
  await client.from("uploads").delete().eq("id", id);
  loadDashboard();
}

/* ---------------- HISTORY ---------------- */

async function loadHistory(user) {
  const { data: uploads } = await client
    .from("uploads")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const history = document.getElementById("historyList");
  history.innerHTML = "";

  if (!uploads || uploads.length === 0) {
    history.innerHTML = "<p>No upload history yet.</p>";
    return;
  }

  uploads.forEach(file => {
    history.innerHTML += `
      <div class="history-entry">
        <strong>${file.file_name}</strong><br>
        Uploaded on: ${new Date(file.created_at).toLocaleString()}
      </div>
    `;
  });
}

/* ---------------- PRESENTATIONS ---------------- */

async function loadPresentations() {
  const { data: presentations, error } = await client
    .from("presentations")
    .select("*")
    .order("id", { ascending: false });

  const container = document.getElementById("presentationsList");
  container.innerHTML = "";

  if (error) {
    container.innerHTML = "<p>Error loading presentations.</p>";
    console.log(error);
    return;
  }

  if (!presentations || presentations.length === 0) {
    container.innerHTML = "<p>No presentations available.</p>";
    return;
  }

  presentations.forEach(p => {
    container.innerHTML += `
      <p>
        <strong>${p.title || "Untitled Presentation"}</strong><br>
        <a href="${p.file_url}" target="_blank">View Presentation</a>
      </p>
    `;
  });
}

/* ---------------- BUTTON SETUP ---------------- */

function setupButtons(user) {
  document.getElementById("uploadBtn").onclick = () => uploadFiles(user);
  document.getElementById("downloadAllBtn").onclick = () => downloadAll(user);
  document.getElementById("logoutBtn").onclick = async () => {
    await client.auth.signOut();
    window.location.href = "login.html";
  };
}

/* ---------------- UPLOAD FILES ---------------- */

async function uploadFiles(user) {
  const files = document.getElementById("fileUpload").files;
  const message = document.getElementById("uploadMessage");

  if (!files.length) {
    message.textContent = "Select a file first.";
    return;
  }

  for (let file of files) {
    const filePath = `${user.id}/${Date.now()}-${file.name}`;

    // Upload to correct bucket
    const { error: uploadError } = await client.storage
      .from("public_uploads")
      .upload(filePath, file);

    if (uploadError) {
      console.log(uploadError);
      message.textContent = "Upload failed.";
      return;
    }

    // Get public URL
    const { data: urlData } = client.storage
      .from("public_uploads")
      .getPublicUrl(filePath);

    // Fix Supabase URL bug
    const fixedUrl = urlData.publicUrl.replace(
      "/object/public_uploads/",
      "/object/public/public_uploads/"
    );

    // Save to DB
    await client.from("uploads").insert({
      user_id: user.id,
      file_name: file.name,
      file_url: fixedUrl,
      file_path: filePath
    });
  }

  message.textContent = "Upload successful!";
  loadDashboard();
}

/* ---------------- DOWNLOAD ALL ---------------- */

async function downloadAll(user) {
  const { data: uploads } = await client
    .from("uploads")
    .select("*")
    .eq("user_id", user.id);

  if (!uploads || uploads.length === 0) return;

  uploads.forEach(file => {
    const a = document.createElement("a");
    a.href = file.file_url;
    a.download = file.file_name;
    a.click();
  });
}

/* ---------------- INIT ---------------- */

loadDashboard();
