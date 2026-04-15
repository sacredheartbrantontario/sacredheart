const supabaseUrl = "https://wlzlysgufuucqyepsyvb.supabase.co"; 
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsemx5c2d1ZnV1Y3F5ZXBzeXZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjEzODM5NiwiZXhwIjoyMDkxNzE0Mzk2fQ.msih2agjusdG31IGDIWzb3umRyFZbA8WGPgVOEfq_go"; 
const client = supabase.createClient(supabaseUrl, supabaseKey);

// AUTH CHECK
async function checkAdmin() {
  const { data: { user } } = await client.auth.getUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  if (user.user_metadata.role !== "admin") {
    window.location.href = "dashboard.html";
    return;
  }

  document.getElementById("admin-email").innerText = user.email;
}

checkAdmin();

// SIDEBAR TOGGLE
document.getElementById("menu-btn").onclick = () => {
  document.getElementById("sidebar").style.left = "0";
};

document.getElementById("close-sidebar").onclick = () => {
  document.getElementById("sidebar").style.left = "-260px";
};

// LOGOUT
document.getElementById("logout-btn").onclick = async () => {
  await client.auth.signOut();
  window.location.href = "login.html";
};

// ------------------------------
// ANNOUNCEMENTS
// ------------------------------
async function loadAnnouncements() {
  const { data } = await client.from("homepage").select("*");

  const list = document.getElementById("announcement-list");
  list.innerHTML = "";

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <p>${item.announcement}</p>
      <button onclick="deleteAnnouncement(${item.id})">Delete</button>
    `;
    list.appendChild(div);
  });
}

document.getElementById("announcement-form").onsubmit = async (e) => {
  e.preventDefault();
  const text = document.getElementById("announcement-text").value;

  await client.from("homepage").insert({ announcement: text });
  document.getElementById("announcement-text").value = "";
  loadAnnouncements();
};

async function deleteAnnouncement(id) {
  await client.from("homepage").delete().eq("id", id);
  loadAnnouncements();
}

// ------------------------------
// CURRENT AFFAIRS
// ------------------------------
async function loadAffairs() {
  const { data } = await client.from("affairs").select("*");

  const list = document.getElementById("affair-list");
  list.innerHTML = "";

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <p>${item.update}</p>
      <button onclick="deleteAffair(${item.id})">Delete</button>
    `;
    list.appendChild(div);
  });
}

document.getElementById("affair-form").onsubmit = async (e) => {
  e.preventDefault();
  const text = document.getElementById("affair-text").value;

  await client.from("affairs").insert({ update: text });
  document.getElementById("affair-text").value = "";
  loadAffairs();
};

async function deleteAffair(id) {
  await client.from("affairs").delete().eq("id", id);
  loadAffairs();
}

// ------------------------------
// PRESENTATIONS
// ------------------------------
async function loadPresentations() {
  const { data } = await client.from("presentations").select("*");

  const list = document.getElementById("presentation-list");
  list.innerHTML = "";

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <p>${item.title}</p>
      <a href="${item.file_url}" target="_blank">Open</a>
      <button onclick="deletePresentation(${item.id})">Delete</button>
    `;
    list.appendChild(div);
  });
}

document.getElementById("presentation-form").onsubmit = async (e) => {
  e.preventDefault();

  const title = document.getElementById("presentation-title").value;
  const file = document.getElementById("presentation-file").files[0];

  const filePath = `presentations/${Date.now()}-${file.name}`;
  await client.storage.from("presentations").upload(filePath, file);

  const { data } = client.storage.from("presentations").getPublicUrl(filePath);

  await client.from("presentations").insert({
    title,
    file_url: data.publicUrl
  });

  loadPresentations();
};

async function deletePresentation(id) {
  await client.from("presentations").delete().eq("id", id);
  loadPresentations();
}

// ------------------------------
// HOMEPAGE IMAGES
// ------------------------------
async function loadHomepageImages() {
  const { data } = await client.from("homepage_images").select("*");

  const list = document.getElementById("homepage-image-list");
  list.innerHTML = "";

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${item.file_url}" style="max-width:150px;">
      <button onclick="deleteHomepageImage(${item.id})">Delete</button>
    `;
    list.appendChild(div);
  });
}

document.getElementById("homepage-image-form").onsubmit = async (e) => {
  e.preventDefault();

  const file = document.getElementById("homepage-image-file").files[0];
  const filePath = `homepage/${Date.now()}-${file.name}`;

  await client.storage.from("homepage").upload(filePath, file);

  const { data } = client.storage.from("homepage").getPublicUrl(filePath);

  await client.from("homepage_images").insert({
    file_url: data.publicUrl
  });

  loadHomepageImages();
};

async function deleteHomepageImage(id) {
  await client.from("homepage_images").delete().eq("id", id);
  loadHomepageImages();
}

// ------------------------------
// USER UPLOADS
// ------------------------------
async function loadUserUploads() {
  const { data } = await client.from("uploads").select("*");

  const list = document.getElementById("user-upload-list");
  list.innerHTML = "";

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <p><strong>${item.file_name}</strong></p>
      <p>User: ${item.user_email}</p>
      <a href="${item.file_url}" target="_blank">Open</a>
      <button onclick="deleteUserFile(${item.id})">Delete</button>
    `;
    list.appendChild(div);
  });
}

async function deleteUserFile(id) {
  await client.from("uploads").delete().eq("id", id);
  loadUserUploads();
}

// INITIAL LOAD
loadAnnouncements();
loadAffairs();
loadPresentations();
loadHomepageImages();
loadUserUploads();
