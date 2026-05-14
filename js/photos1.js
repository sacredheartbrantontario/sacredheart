/* ------------------ PHOTOS CAROUSEL ------------------ */
async function loadPhotosCarousel() {
  const { data } = await supabase
    .from("homepage_photos")
    .select("*")
    .order("id", { ascending: true });

  const container = document.getElementById("photosCarousel");
  if (!container) return;

  container.innerHTML = "";
  container.classList.add("carousel");

  if (!data || data.length === 0) {
    container.innerHTML = "<p>No photos available.</p>";
    return;
  }

  data.forEach((photo, index) => {
    const img = document.createElement("img");
    img.src = photo.image_url;
    img.className = index === 0 ? "active" : "";
    container.appendChild(img);
  });

  startCarousel();
}

function startCarousel() {
  let current = 0;
  const slides = document.querySelectorAll("#photosCarousel img");

  setInterval(() => {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
  }, 4000);
}

loadPhotosCarousel();
