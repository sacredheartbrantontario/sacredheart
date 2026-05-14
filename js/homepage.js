// SAFETY: Ensure supabase exists
if (!window.supabase) {
  console.error("Supabase not loaded");
}

/* ------------------ LOAD EVERYTHING ------------------ */
loadHeader();
loadBanner();
/* loadPhotos(); */
loadLinks();
loadAnnouncements();

/* ------------------ HEADER ------------------ */
/* ------------------ HEADER ------------------ */
async function loadHeader() {
  try {
    const res = await fetch("header.html?cache=" + Date.now());
    if (!res.ok) {
      console.error("Failed to load header.html");
      return;
    }

    const html = await res.text();
    document.getElementById("navbar").innerHTML = html;

    // Wait for DOM to update
    await new Promise(resolve => setTimeout(resolve, 50));

    // HAMBURGER MENU
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");

    if (hamburger && navLinks) {
      hamburger.addEventListener("click", () => {
        const isOpen = navLinks.style.display === "flex";
        navLinks.style.display = isOpen ? "none" : "flex";
      });
    }

    /* ------------------ LOGIN / LOGOUT TOGGLE ------------------ */
    const loginLink = document.getElementById("loginLink");
    if (!loginLink) return;

    // Create logout link right after login
    const logoutLink = document.createElement("a");
    logoutLink.id = "logoutLink";
    logoutLink.href = "#";
    logoutLink.textContent = "Logout";
    logoutLink.style.display = "none"; // hidden by default

    loginLink.insertAdjacentElement("afterend", logoutLink);

    // Check current user
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Logged in → hide Login, show Logout
      loginLink.style.display = "none";
      logoutLink.style.display = "inline-block";

      logoutLink.addEventListener("click", async (e) => {
        e.preventDefault();
        await supabase.auth.signOut();
        window.location.href = "index.html";
      });
    }

  } catch (err) {
    console.error("HEADER LOAD ERROR:", err);
  }
}


/* ------------------ BANNER (PARISH HEADER HERO) ------------------ */
async function loadBanner() {
  const { data } = await supabase
    .from("homepage_banner")
    .select("*")
    .maybeSingle();

  const header = document.querySelector(".parish-header");
  if (!header) return;

  if (data && data.image_url) {
    header.style.backgroundImage = `url('${data.image_url}')`;
  }

  // Add hero class
  header.classList.add("hero-header");
}




/* ------------------ OLD BANNER ------------------ */
/*
async function loadBanner() {
  const { data } = await supabase
    .from("homepage_banner")
    .select("*")
    .maybeSingle();

  const bannerDiv = document.getElementById("homepageBanner");
  if (!bannerDiv) return;

  bannerDiv.innerHTML = "";

  if (data && data.image_url) {
    bannerDiv.innerHTML = `
      <img src="${data.image_url}" class="banner-img">
    `;
  }
}
  */

/* ------------------ PHOTOS ------------------ */
async function loadPhotos() {
  const { data } = await supabase
    .from("homepage_photos")
    .select("*");

  const container = document.getElementById("homepagePhotos");
  if (!container) return;

  container.innerHTML = "";

  if (!data || data.length === 0) return;

  data.forEach(photo => {
    const img = document.createElement("img");
    img.src = photo.image_url;
    img.className = "homepage-photo";
    container.appendChild(img);
  });
}

/* ------------------ LINKS ------------------ */
async function loadLinks() {
  const { data } = await supabase
    .from("homepage_links")
    .select("*");

  const container = document.getElementById("homepageLinks");
  if (!container) return;

  container.innerHTML = "";

  if (!data || data.length === 0) return;

  data.forEach(link => {
    const div = document.createElement("div");
    div.className = "homepage-link";

    div.innerHTML = `
      <a href="${link.url}" target="_blank">${link.title}</a>
    `;

    container.appendChild(div);
  });
}

/* ------------------ ANNOUNCEMENTS ------------------ */
/* ------------------ ANNOUNCEMENTS ------------------ */
async function loadAnnouncements() {
  const { data } = await supabase
    .from("homepage_announcements")
    .select("*")
    .order("created_at", { ascending: false });

  const container = document.getElementById("homepageAnnouncements");
  if (!container) return;

  container.innerHTML = "";

  if (!data || data.length === 0) return;

  data.forEach((a, index) => {
    const date = new Date(a.created_at);
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();

    const div = document.createElement("div");
    div.className = "announcement-card";
    if (index === 0) div.classList.add("newest");

    div.innerHTML = `
  <div class="date-badge">${month} ${day}</div>
  <h3>${a.title}</h3>
  <ul class="announcement-list">
  ${a.text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter(line => line.trim() !== "")
    .map(line => `<li>${line.trim()}</li>`)
    .join('')}
</ul>

  ${a.image_url ? `<img src="${a.image_url}" class="announcement-img">` : ""}
`;


    container.appendChild(div);
  });
}


/* ANNOUCEMENTS OLD VERSION ***/
/*
async function loadAnnouncements() {
  const { data } = await supabase
    .from("homepage_announcements")
    .select("*")
    .order("created_at", { ascending: false });

  const container = document.getElementById("homepageAnnouncements");
  if (!container) return;

  container.innerHTML = "";

  if (!data || data.length === 0) return;

  data.forEach(a => {
    const div = document.createElement("div");
    div.className = "announcement-item";

    div.innerHTML = `
      <h3>${a.title}</h3>
      <p>${a.text}</p>
      ${a.image_url ? `<img src="${a.image_url}" class="announcement-img">` : ""}
      <hr>
    `;

    container.appendChild(div);
  });
}
*/