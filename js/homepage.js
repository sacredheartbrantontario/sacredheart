/* ------------------ BANNER ------------------ */
async function loadBanner() {
  const { data } = await client
    .from("homepage_banner")
    .select("*")
    .single();

  if (data && data.image_url) {
    document.getElementById("bannerSection").innerHTML =
      `<img src="${data.image_url}" class="banner-image">`;
  }
}

/* ------------------ CURRENT AFFAIRS ------------------ */
async function loadAffairs() {
  const { data } = await client
    .from("affairs")
    .select("*")
    .order("id", { ascending: false });

  const list = document.getElementById("affairsList");
  list.innerHTML = "";

  data.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      ${item.link ? `<a href="${item.link}" target="_blank">Read More</a>` : ""}
      ${item.image_url ? `<img src="${item.image_url}" class="affair-image">` : ""}
    `;
    list.appendChild(div);
  });
}

/* ------------------ PRESENTATIONS ------------------ */
async function loadPresentations() {
  const { data } = await client
    .from("presentations")
    .select("*")
    .order("id", { ascending: false });

  const list = document.getElementById("presentationsList");
  list.innerHTML = "";

  data.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.description || ""}</p>
      <a href="${item.file_url}" target="_blank">Download</a>
    `;
    list.appendChild(div);
  });
}

/* ------------------ LINKS ------------------ */
async function loadLinks() {
  const { data } = await client.from("homepage_links").select("*");

  const list = document.getElementById("linksList");
  list.innerHTML = "";

  data.forEach(link => {
    const div = document.createElement("div");
    div.classList.add("link-item");
    div.innerHTML = `
      <a href="${link.url}" target="_blank">${link.title}</a>
    `;
    list.appendChild(div);
  });
}

/* ------------------ PHOTOS ------------------ */
async function loadPhotos() {
  const { data } = await client.from("homepage_photos").select("*");

  const gallery = document.getElementById("photosGallery");
  gallery.innerHTML = "";

  data.forEach(photo => {
    const img = document.createElement("img");
    img.src = photo.image_url;
    img.classList.add("gallery-photo");
    gallery.appendChild(img);
  });
}

/* ------------------ LOAD EVERYTHING ------------------ */
loadBanner();
loadAffairs();
loadPresentations();
loadLinks();
loadPhotos();
