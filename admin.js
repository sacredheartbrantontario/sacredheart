const supabaseUrl = "https://wlzlysgufuucqyepsyvb.supabase.co"; 
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsemx5c2d1ZnV1Y3F5ZXBzeXZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjEzODM5NiwiZXhwIjoyMDkxNzE0Mzk2fQ.msih2agjusdG31IGDIWzb3umRyFZbA8WGPgVOEfq_go"; 
const supabase = supabase.createClient(supabaseUrl, supabaseKey);



async function checkAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.is_admin) {
    alert("Access denied.");
    window.location.href = "index.html";
  }
}

checkAdmin();

// Save announcement
document.getElementById("announcement-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const announcement = document.getElementById("announcement").value;

  await supabase.from("homepage").insert({ announcement });
  alert("Announcement saved.");
});

// Save current affairs
document.getElementById("affairs-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const affairs = document.getElementById("affairs").value;

  await supabase.from("homepage").insert({ current_affairs: affairs });
  alert("Update saved.");
});

// Upload homepage photo
document.getElementById("photo-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = document.getElementById("photo").files[0];
  const filePath = `homepage/${file.name}`;

  await supabase.storage.from("homepage_media").upload(filePath, file);

  const photoUrl = `${supabaseUrl}/storage/v1/object/public/homepage_media/${filePath}`;

  await supabase.from("homepage").insert({ photo_url: photoUrl });

  alert("Homepage photo uploaded.");
});

// Save homepage link
document.getElementById("link-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const link = document.getElementById("homepage-link-input").value;

  await supabase.from("homepage").insert({ link_url: link });
  alert("Homepage link saved.");
});

// Upload presentation
document.getElementById("presentation-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("presentation-title").value;
  const file = document.getElementById("presentation-file").files[0];
  const filePath = `presentations/${file.name}`;

  await supabase.storage.from("presentations").upload(filePath, file);

  const fileUrl = `${supabaseUrl}/storage/v1/object/public/presentations/${filePath}`;

  await supabase.from("presentations").insert({
    title,
    file_url: fileUrl
  });

  alert("Presentation uploaded.");
});

// Load all user files
async function loadUserFiles() {
  const { data: files } = await supabase.from("uploads").select("*");

  const container = document.getElementById("user-files");
  container.innerHTML = "";

  files.forEach(f => {
    const link = document.createElement("a");
    link.href = f.file_url;
    link.innerText = `${f.file_name} (User: ${f.user_id})`;
    link.target = "_blank";
    container.appendChild(link);
  });
}

loadUserFiles();
