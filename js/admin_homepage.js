// Load existing homepage data
loadBanner();
loadPhotos();
loadLinks();
loadAnnouncements();

/* ------------------ BANNER ------------------ */
async function loadBanner() {
  const { data, error } = await client
    .from("homepage_banner")
    .select("*")
    .single();

  if (data && data.image_url) {
    document.getElementById("bannerPreview").innerHTML =
      `<img src="${data.image_url}" width="300">`;
  }
}

document.getElementById("bannerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = document.getElementById("bannerImage").files[0];
  const filePath = `banner/${Date.now()}-${file.name}`;

  const { error: uploadError } = await client.storage
    .from("homepage_media")
    .upload(filePath, file);

  if (uploadError) return alert("Upload failed");

  const image_url = client.storage
    .from("homepage_media")
    .getPublicUrl(filePath).data.publicUrl;

  await client.from("homepage_banner").upsert({ id: 1, image_url });

  loadBanner();
});

/* ------------------ PHOTOS ------------------ */
async function loadPhotos() {
  const { data } = await client.from("homepage_photos").select("*");

  const list = document.getElementById("photosList");
  list.innerHTML = "";

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
  const filePath = `photos/${Date.now()}-${file.name}`;

  await client.storage.from("homepage_media").upload(filePath, file);

  const image_url = client.storage
    .from("homepage_media")
    .getPublicUrl(filePath).data.publicUrl;

  await client.from("homepage_photos").insert([{ image_url }]);

  loadPhotos();
});

async function deletePhoto(id) {
  await client.from("homepage_photos").delete().eq("id", id);
  loadPhotos();
}

/* ------------------ LINKS ------------------ */
async function loadLinks() {
  const { data } = await client.from("homepage_links").select("*");

  const list = document.getElementById("linksList");
  list.innerHTML = "";

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

  await client.from("homepage_links").insert([{ title, url }]);

  loadLinks();
});

async function deleteLink(id) {
  await client.from("homepage_links").delete().eq("id", id);
  loadLinks();
}

/* ------------------ ANNOUNCEMENTS ------------------ */
async function loadAnnouncements() {
  const { data } = await client.from("homepage_announcements").select("*");

  const list = document.getElementById("announcementList");
  list.innerHTML = "";

  data.forEach(a => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${a.title}</h3>
      <p>${a.text}</p>
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

  await client.from("homepage_announcements").insert([{ title, text }]);

  loadAnnouncements();
});

async function deleteAnnouncement(id) {
  await client.from("homepage_announcements").delete().eq("id", id);
  loadAnnouncements();
}
