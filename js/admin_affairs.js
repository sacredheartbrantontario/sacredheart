async function loadAffairs() {
  const { data, error } = await client.from("affairs").select("*").order("id", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  const list = document.getElementById("affairsList");
  list.innerHTML = "";

  data.forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      ${item.link ? `<a href="${item.link}" target="_blank">Link</a>` : ""}
      ${item.image_url ? `<img src="${item.image_url}" width="200">` : ""}
      <button onclick="deleteAffair(${item.id})">Delete</button>
      <hr>
    `;
    list.appendChild(div);
  });
}

document.getElementById("affairsForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const link = document.getElementById("link").value;
  const imageFile = document.getElementById("image").files[0];

  let image_url = null;

  if (imageFile) {
    const filePath = `affairs/${Date.now()}-${imageFile.name}`;
    const { data: uploadData, error: uploadError } = await client.storage
      .from("homepage_media")
      .upload(filePath, imageFile);

    if (!uploadError) {
      image_url = client.storage.from("homepage_media").getPublicUrl(filePath).data.publicUrl;
    }
  }

  await client.from("affairs").insert([{ title, description, link, image_url }]);

  loadAffairs();
});

async function deleteAffair(id) {
  await client.from("affairs").delete().eq("id", id);
  loadAffairs();
}

loadAffairs();
