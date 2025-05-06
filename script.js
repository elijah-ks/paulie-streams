

function openModal(title, description, videoURL) {
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalDescription").innerText = description;
  document.getElementById("modalVideo").src = videoURL;
  document.getElementById("videoModal").classList.remove("hidden");

  const likeBtn = document.getElementById("likeBtn");
  const docID = `${title}_${window.currentUserID}`;
  const likeRef = db.collection("likes").doc(docID);

  likeRef.get().then(doc => {
    if (doc.exists) {
      likeBtn.classList.add("liked");
      likeBtn.innerText = "❤️";
    } else {
      likeBtn.classList.remove("liked");
      likeBtn.innerText = "♡";
    }

    // ✅ NEW LIKE FUNCTION
    likeBtn.onclick = () => {
      const user = firebase.auth().currentUser;
      if (user) {
        likeMovie({
          title: title,
          description: description,
          videoURL: videoURL,
          thumbnail: "assets/" + title.toLowerCase().replace(/ /g, "-") + "-cover.jpg"
        }, user.uid);
      } else {
        window.location.href = "login.html";
      }
    };
  });
}



function closeModal() {
    document.getElementById("videoModal").classList.add("hidden");
    document.getElementById("modalVideo").src = ""; // clears video
}



const banners = [
  {
    title: "Welcome to Paulie Streams",
    description: "This is your personal streaming hub for everything Paulie-made — from legendary originals to wild cinematic experiments. Enjoy the ride.",
    rating: "Version 1.0",
    age: "All Access",
    background: "assets/paulie-banner.jpg",
    trailerLink: "https://drive.google.com/file/d/19li5eEKxTm7_fRFQnP4-mjomhhRwcUYs/preview"
  },
  

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
    }
    
  ];
  
  let currentBanner = 0;
  
  function updateBanner() {
    const banner = banners[currentBanner];
    const bannerContent = document.getElementById("banner-content");
    const bannerImage = document.getElementById("banner-image");
  
    // Step 1: Fade out both
    bannerContent.classList.add("fade-out");
    bannerImage.classList.add("fade-out");
  
    setTimeout(() => {
      // Step 2: Replace content
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
  
      bannerContent.innerHTML = content;
      bannerImage.style.backgroundImage = `url('${banner.background}')`;
  
      // Step 3: Fade back in
      bannerContent.classList.remove("fade-out");
      bannerImage.classList.remove("fade-out");
    }, 800); // Match CSS transition duration
  
    currentBanner = (currentBanner + 1) % banners.length;
  }
  
  
  function playBannerTrailer(link) {
    if (!link) return;
    openModal("Paulie Streams Trailer", "Official intro trailer to Paulie Streams.", link);
  }
  
  
  window.addEventListener("load", () => {
    // Hide loading screen and show content
    setTimeout(() => {
      document.getElementById("loading-screen").style.display = "none";
      document.getElementById("main-content").classList.remove("hidden");
    }, 2200);
  
    // Start banner rotation after page loads
    updateBanner(); // Show first banner
    setInterval(updateBanner, 12000); // Rotate every 12 sec
  });
  

  function goToSearch() {
    alert("Search feature coming soon!");
  }
  
  function goToLiked() {
    window.location.href = "liked.html"; // Or change when page is ready
  }
  
  function goToExtras() {
    alert("Extras page coming soon!");
  }
  
  
  function likeMovie(movieData, userID) {
    const db = firebase.firestore();
    const movieID = movieData.title.replace(/\s+/g, "_"); // Unique key
  
    db.collection("likes")
      .doc(`${movieID}_${userID}`)
      .set({
        movieID: movieData.title,
        title: movieData.title,
        description: movieData.description,
        videoURL: movieData.videoURL,
        thumbnail: movieData.thumbnail,
        userID: userID,
        likedAt: new Date()
      })
      .then(() => {
        console.log("Movie liked and saved.");
        document.getElementById("likeBtn").classList.add("liked");
        document.getElementById("likeBtn").innerText = "❤️";
      })
      .catch(error => {
        console.error("Error saving liked movie:", error);
      });
  }
  