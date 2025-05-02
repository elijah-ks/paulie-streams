window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("loading-screen").style.display = "none";
        document.getElementById("main-content").classList.remove("hidden");
    }, 2200);
});

function openModal(title, description, videoURL) {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalDescription").innerText = description;
    document.getElementById("modalVideo").src = videoURL;
    document.getElementById("videoModal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("videoModal").classList.add("hidden");
    document.getElementById("modalVideo").src = ""; // clears video
}



const banners = [
    {
      title: "Matrix Attack 2",
      description: "COMING SOON: After being captured by President Eli, the Sabado Brothers plan their escape but run into problems...",
      rating: "IMDb 8.2",
      age: "PG-13",
      background: "assets/banner.jpg"
    },
    {
      title: "The Sigma Male",
      description: "Two brothers work together until a conflict splits them apart...",
      rating: "IMDb 7.6",
      age: "PG",
      background: "assets/sigma-banner.jpg"
    },
    {
        title: "Welcome to Paulie Streams",
        description: "This is your personal streaming hub for everything Paulie-made — from legendary originals to wild cinematic experiments. Enjoy the ride.",
        rating: "Version 1.0",
        age: "All Access",
        background: "assets/welcome-banner.jpg",
        trailerLink: "https://drive.google.com/file/d/19li5eEKxTm7_fRFQnP4-mjomhhRwcUYs/preview"
      }
      
      
      
  ];
  
  let currentBanner = 0;
  
  function updateBanner() {
    const banner = banners[currentBanner];
  
    const content = `
  <div class="banner-brand-inline">
    <img src="assets/transparent.png" alt="Paulie Streams Logo" class="brand-logo-inline">
    <span class="brand-text-inline">Originals</span>
  </div>

  <h1 class="banner-title">${banner.title}</h1>
  <div class="banner-info">
    <span class="badge">${banner.rating}</span>
    <span class="badge red">${banner.age}</span>
  </div>
  <p class="banner-description">${banner.description}</p>
  <div class="banner-buttons">
    <button class="play-btn" onclick="playBannerTrailer('${banner.trailerLink || ''}')">▶ Play</button>
    <button class="trailer-btn">Watch Trailer</button>
  </div>
`;


  
    document.getElementById("banner-content").innerHTML = content;
    document.querySelector(".banner").style.backgroundImage = `url('${banner.background}')`;
  
    currentBanner = (currentBanner + 1) % banners.length;
  }
  function playBannerTrailer(link) {
    if (!link) return;
    openModal("Paulie Streams Trailer", "Official intro trailer to Paulie Streams.", link);
  }
  
  
  // Start rotation after site loads
  window.addEventListener("load", () => {
    updateBanner(); // Show first banner immediately
    setInterval(updateBanner, 12000); // Rotate every 12 seconds
  });
  