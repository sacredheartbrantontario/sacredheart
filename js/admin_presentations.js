async function loadPresentations() {
  const { data, error } = await client
    .from("presentations")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  const list = document.getElementById("presentationsList");
  list.innerHTML = "";

  data.forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.description || ""}</p>
      <a href="${item.file_url}" target="_blank">Download</a>
      <button onclick="deletePresentation(${item.id})">Delete</button>
      <hr>
    `;
    list.appendChild(div);
  });
}

document.getElementById("presentationForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const file = document.getElementById("file").files[0];

  if (!file) {
    alert("Please choose a file");
    return;
  }

  const filePath = `presentations/${Date.now()}-${file.name}`;

  const { data: uploadData, error: uploadError } = await client.storage
    .from("presentations")
    .upload(filePath, file);

  if (uploadError) {
    alert("Upload failed");
    console.log(uploadError);
    return;
  }

  const file_url = client.storage
    .from("presentations")
    .getPublicUrl(filePath).data.publicUrl;

  await client.from("presentations").insert([
    { title, description, file_url }
  ]);

  loadPresentations();
});

async function deletePresentation(id) {
  await client.from("presentations").delete().eq("id", id);
  loadPresentations();
}

loadPresentations();
