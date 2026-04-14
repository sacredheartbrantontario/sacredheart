// Placeholder — will connect to Supabase in the next step
document.getElementById("announcement-text").innerText = "Loading announcements...";
document.getElementById("current-affairs-text").innerText = "Loading parish updates...";


// Initialize Supabase
const supabaseUrl = "https://wlzlysgufuucqyepsyvb.supabase.co"; 
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsemx5c2d1ZnV1Y3F5ZXBzeXZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjEzODM5NiwiZXhwIjoyMDkxNzE0Mzk2fQ.msih2agjusdG31IGDIWzb3umRyFZbA8WGPgVOEfq_go"; 
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Load homepage content
async function loadHomepage() {
  // 1. Load announcements (multiple)
  const { data: announcements } = await supabase
    .from("homepage")
    .select("announcement")
    .not("announcement", "is", null);

  const announcementContainer = document.getElementById("announcement-list");
  announcementContainer.innerHTML = "";

  announcements.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerText = item.announcement;
    announcementContainer.appendChild(card);
  });

  // 2. Load current affairs (multiple)
  const { data: affairs } = await supabase
    .from("homepage")
    .select("current_affairs")
    .not("current_affairs", "is", null);

  const affairsContainer = document.getElementById("affairs-list");
  affairsContainer.innerHTML = "";

  affairs.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerText = item.current_affairs;
    affairsContainer.appendChild(card);
  });

  // 3. Load homepage photo
  const { data: photoRow } = await supabase
    .from("homepage")
    .select("photo_url")
    .limit(1)
    .single();

  if (photoRow && photoRow.photo_url) {
    document.getElementById("homepage-photo").src = photoRow.photo_url;
  }

  // 4. Load homepage link
  const { data: linkRow } = await supabase
    .from("homepage")
    .select("link_url")
    .limit(1)
    .single();

  if (linkRow && linkRow.link_url) {
    document.getElementById("homepage-link").href = linkRow.link_url;
  }
}

loadHomepage();
