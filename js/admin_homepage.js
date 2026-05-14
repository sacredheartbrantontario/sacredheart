// SAFETY: Ensure supabase exists
if (!window.supabase) {
  console.error("Supabase not loaded");
}

// Wait for Supabase auth to load
supabase.auth.onAuthStateChange(async (event, session) => {
  if (!session) {
    window.location.href = "/login.html"
    return
  }

  // Only load data AFTER auth is ready
  loadBanner()
  loadPhotos()
  loadLinks()
  loadAnnouncements()
})


/* ------------------ BANNER ------------------ */
async function loadBanner() {
  const { data } = await supabase
    .from("homepage_banner")
    .select("*")
    .maybeSingle();

  const preview = document.getElementById("bannerPreview");
  preview.innerHTML = "";

  if (data && data.image_url) {
    preview.innerHTML = `<img src="${data.image_url}" width="300">`;
  }
}

document.getElementById("bannerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = document.getElementById("bannerImage").files[0];
  if (!file) return alert("Please select a file");

  const filePath = `banner/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("homepage_media")
    .upload(filePath, file, { upsert: true });

  if (uploadError) return alert("Upload failed");

  const image_url = supabase.storage
    .from("homepage_media")
    .getPublicUrl(filePath).data.publicUrl;

 // await supabase.from("homepage_banner").upsert({ id: 1, image_url });
await supabase.from("homepage_banner").upsert({
  id: 1,
  title: "Homepage Banner",
  image_url: image_url  ,
  updated_at: new Date().toISOString()
});

  loadBanner();
});

/* ------------------ PHOTOS ------------------ */
async function loadPhotos() {
  const { data } = await supabase.from("homepage_photos").select("*");

  const list = document.getElementById("photosList");
  list.innerHTML = "";

  if (!data) return;

  data.forEach(photo => {
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="${photo.image_url}" width="150">
      <button onclick="deletePhoto(${photo.id})">Delete</button>
      <hr>
    `;
    list.appendChild(div);
  });
}

document.getElementById("photosForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = document.getElementById("photoFile").files[0];
  if (!file) return alert("Select a file");

  const filePath = `photos/${Date.now()}-${file.name}`;

  await supabase.storage
    .from("homepage_media")
    .upload(filePath, file, { upsert: true });

  const image_url = supabase.storage
    .from("homepage_media")
    .getPublicUrl(filePath).data.publicUrl;

  await supabase.from("homepage_photos").insert([{ image_url }]);

  loadPhotos();
});

async function deletePhoto(id) {
  await supabase.from("homepage_photos").delete().eq("id", id);
  loadPhotos();
}

/* ------------------ LINKS ------------------ */

async function loadLinks() {
  const { data } = await supabase
    .from("homepage_links")
    .select("*");

  const container = document.getElementById("homepageLinks");
  if (!container) return;

  container.innerHTML = "";
  container.classList.add("links-grid");

  if (!data || data.length === 0) return;

  data.forEach(link => {
    const div = document.createElement("div");
    div.className = "link-card";

    div.innerHTML = `
      <i class="fas fa-link"></i>
      <h3>${link.title}</h3>
      <a href="${link.url}" target="_blank">Open</a>
    `;

    container.appendChild(div);
  });
}


/*
async function loadLinks() {
  const { data } = await supabase.from("homepage_links").select("*");

  const list = document.getElementById("linksList");
  list.innerHTML = "";

  if (!data) return;

  data.forEach(link => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${link.title}</strong> — <a href="${link.url}" target="_blank">${link.url}</a>
      <button onclick="deleteLink(${link.id})">Delete</button>
      <hr>
    `;
    list.appendChild(div);
  });
}

document.getElementById("linksForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("linkTitle").value;
  const url = document.getElementById("linkUrl").value;

  await supabase.from("homepage_links").insert([{ title, url }]);

  loadLinks();
});

async function deleteLink(id) {
  await supabase.from("homepage_links").delete().eq("id", id);
  loadLinks();
}

*/

/* ------------------ ANNOUNCEMENTS ------------------ */
async function loadAnnouncements() {
  const { data } = await supabase
    .from("homepage_announcements")
    .select("*")
    .order("created_at", { ascending: false });

  const list = document.getElementById("announcementList");
  list.innerHTML = "";

  if (!data) return;

  data.forEach(a => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${a.title}</h3>
      <p>${a.text}</p>
      ${a.image_url ? `<img src="${a.image_url}" width="200">` : ""}
      <button onclick="deleteAnnouncement(${a.id})">Delete</button>
      <hr>
    `;
    list.appendChild(div);
  });
}

document.getElementById("announcementForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("announcementTitle").value;
  const text = document.getElementById("announcementText").value;
  const file = document.getElementById("announcementImage").files[0];

  let image_url = null;

  if (file) {
    const filePath = `announcements/${Date.now()}-${file.name}`;

    await supabase.storage
      .from("homepage_media")
      .upload(filePath, file, { upsert: true });

    image_url = supabase.storage
      .from("homepage_media")
      .getPublicUrl(filePath).data.publicUrl;
  }

  await supabase.from("homepage_announcements").insert([{ title, text, image_url }]);

  loadAnnouncements();
});

async function deleteAnnouncement(id) {
  await supabase.from("homepage_announcements").delete().eq("id", id);
  loadAnnouncements();
}
