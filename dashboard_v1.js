const supabaseUrl = "https://wlzlysgufuucqyepsyvb.supabase.co"; 
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsemx5c2d1ZnV1Y3F5ZXBzeXZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjEzODM5NiwiZXhwIjoyMDkxNzE0Mzk2fQ.msih2agjusdG31IGDIWzb3umRyFZbA8WGPgVOEfq_go"; 
const client = supabase.createClient(supabaseUrl, supabaseKey);

async function loadDashboard() {
  const { data: { user } } = await client.auth.getUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userId = user.id;

  const emailEl = document.getElementById("user-email");
if (emailEl) {
  emailEl.innerText = `You are logged in as: ${user.email}`;
}


  // 1. Load parish messages
  const { data: messages } = await client.from("homepage").select("announcement").not("announcement", "is", null);

  const msgContainer = document.getElementById("parish-messages");
  msgContainer.innerHTML = "";

  messages.forEach(m => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerText = m.announcement;
    msgContainer.appendChild(card);
  });

  // 2. Load user files
  const { data: files } = await client.from("uploads").select("*").eq("user_id", userId);

  const fileContainer = document.getElementById("user-files");
  fileContainer.innerHTML = "";

  files.forEach(f => {
    const link = document.createElement("a");
    link.href = f.file_url;
    link.innerText = f.file_name;
    link.target = "_blank";
    fileContainer.appendChild(link);
  });

  // 3. Load presentations
  const { data: presentations } = await client.from("presentations").select("*");

  const presContainer = document.getElementById("presentations");
  presContainer.innerHTML = "";

  presentations.forEach(p => {
    const link = document.createElement("a");
    link.href = p.file_url;
    link.innerText = p.title;
    link.target = "_blank";
    presContainer.appendChild(link);
  });
}

loadDashboard();
