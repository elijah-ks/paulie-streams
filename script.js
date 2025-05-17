

function openModal(title, description, videoURL) {
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalDescription").innerText = description;
  document.getElementById("modalVideo").src = videoURL;
  document.getElementById("videoModal").classList.remove("hidden");

  const likeBtn = document.getElementById("likeBtn");

firebase.auth().onAuthStateChanged(user => {
  if (!user) return;

  const docID = `${title}_${user.uid}`;
  const likeRef = firebase.firestore().collection("likes").doc(docID);

  // Get the initial like status
  likeRef.get().then(doc => {
    if (doc.exists) {
      likeBtn.classList.add("liked");
      likeBtn.innerText = "❤️";
    } else {
      likeBtn.classList.remove("liked");
      likeBtn.innerText = "♡";
    }
  });

  // Remove previous click listener
  const newLikeBtn = likeBtn.cloneNode(true);
  likeBtn.parentNode.replaceChild(newLikeBtn, likeBtn);

  newLikeBtn.addEventListener("click", () => {
    // Optimistically update the button instantly
    const isLiked = newLikeBtn.classList.contains("liked");

    if (isLiked) {
      // Instant visual update
      newLikeBtn.classList.remove("liked");
      newLikeBtn.innerText = "♡";

      // Background DB removal
      likeRef.delete().catch((error) => {
        console.error("Error unliking movie:", error);
        // Revert if there's an error
        newLikeBtn.classList.add("liked");
        newLikeBtn.innerText = "❤️";
      });

    } else {
      // Instant visual update
      newLikeBtn.classList.add("liked");
      newLikeBtn.innerText = "❤️";

      // Background DB add
      likeRef.set({
        movieID: title,
        title,
        description,
        videoURL,
        thumbnail: getThumbnailForTitle(title),
        userID: user.uid,
        likedAt: new Date()
      }).catch((error) => {
        console.error("Error liking movie:", error);
        // Revert if there's an error
        newLikeBtn.classList.remove("liked");
        newLikeBtn.innerText = "♡";
      });
    }
  });
});
}

function toggleSettingsDropdown() {
  const dropdown = document.getElementById("settingsDropdown");
  dropdown.classList.toggle("hidden");
}

function toggleTheme() {
  const body = document.body;
  const isLight = body.classList.contains("light-theme");

  body.classList.toggle("light-theme");

  const newTheme = isLight ? "dark" : "light";
  localStorage.setItem("theme", newTheme);

  updateThemeLabel(); // Update the text
}

function updateThemeLabel() {
  const label = document.getElementById("themeToggle");
  const isLight = document.body.classList.contains("light-theme");

  if (label) {
    label.innerText = isLight ? "☀️ Theme: Light" : "🌙 Theme: Dark";
  }
}


function getThumbnailForTitle(title) {
  switch (title.trim().toLowerCase()) {
    case "matrix attack":
      return "assets/matrix-attack.jpg";
    case "matrix attack 1": // just in case this ever gets stored
      return "assets/matrix-attack.jpg";
    case "matrix attack 2":
      return "assets/matrix-attack2.jpg";
    case "colin: the backstory":
      return "assets/colin-backstory-cover.jpg";
    case "the sigma male":
      return "assets/the-sigma-male.jpg";
    default:
      return "assets/default-thumbnail.jpg";
  }
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
  
function toggleSearch() {
  const wrapper = document.getElementById("searchWrapper");
  const input = document.getElementById("searchInput");
  const navBar = document.querySelector(".nav-bar");

  wrapper.classList.toggle("active");

  if (wrapper.classList.contains("active")) {
    input.focus();
    navBar.classList.add("search-active");
  } else {
    input.value = "";
    navBar.classList.remove("search-active");
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const searchWrapper = document.getElementById("searchWrapper");
  const searchInput = document.getElementById("searchInput");
  const searchIcon = searchWrapper?.querySelector(".search-icon");

  if (!searchWrapper || !searchInput || !searchIcon) {
    console.warn("Search bar elements not found.");
    return;
  }

  document.addEventListener("click", (e) => {
    if (!searchWrapper.contains(e.target)) {
      searchWrapper.classList.remove("active");
      searchInput.value = "";
      document.querySelector(".nav-bar").classList.remove("search-active");
      filterMovies("");
    }
  });

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const navBar = document.querySelector(".nav-bar");

    if (query.trim()) {
      navBar.classList.add("search-active");
    } else {
      navBar.classList.remove("search-active");
    }

    filterMovies(query);
  });

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  }
  updateThemeLabel(); // <-- Update the theme text
});

});


  
  function filterMovies(query) {
    const overlay = document.getElementById("searchResultsOverlay");
    const movieContainer = document.getElementById("searchResultsMovies");
    const gameContainer = document.getElementById("searchResultsGames");
  
    if (!query) {
      overlay.classList.remove("visible");
      setTimeout(() => overlay.classList.add("hidden"), 250); // match CSS fade time
      document.body.classList.remove("no-scroll");
      movieContainer.innerHTML = "";
      gameContainer.innerHTML = "";
      return;
    }
  
    const allCards = document.querySelectorAll(".video-card, .game-card");
    const seenTitles = new Set();
    movieContainer.innerHTML = "";
    gameContainer.innerHTML = "";
  
    allCards.forEach(card => {
      const titleElement = card.querySelector("p");
      if (!titleElement) return;
  
      const title = titleElement.innerText.toLowerCase();
      if (title.includes(query) && !seenTitles.has(title)) {
        seenTitles.add(title);
        const clone = card.cloneNode(true);
  
        if (card.classList.contains("game-card") || card.classList.contains("hidden-search-clone")) {
          gameContainer.appendChild(clone);
        } else {
          movieContainer.appendChild(clone);
        }
      }
    });
  
    if (!movieContainer.children.length && !gameContainer.children.length) {
      movieContainer.innerHTML = "<p style='color: white;'>No matches found.</p>";
    }
  
    // ✅ Show/hide each section based on results
    document.querySelector(".search-group:nth-of-type(1)").style.display =
      movieContainer.children.length ? "block" : "none";
  
    document.querySelector(".search-group:nth-of-type(2)").style.display =
      gameContainer.children.length ? "block" : "none";
  
    // ✅ Fade in the search overlay
    overlay.classList.remove("hidden");
    setTimeout(() => overlay.classList.add("visible"), 10);
    document.body.classList.add("no-scroll");
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
  
  window.addEventListener("load", () => {
    // Other banner/setup logic...
    injectGameSearchClones();
  });
  
  function injectGameSearchClones() {
    const searchArea = document.querySelector(".video-grid"); // Or wherever video cards live
    const games = document.querySelectorAll(".game-card");
  
    games.forEach(card => {
      const title = card.dataset.title?.toLowerCase() || card.querySelector("p")?.innerText?.toLowerCase();
      const image = card.querySelector("img").src;
      const link = card.href;
  
      const clone = document.createElement("div");
      clone.className = "video-card hidden-search-clone";
      clone.onclick = () => window.location.href = link;
      clone.innerHTML = `<img src="${image}" alt="${title}"><p>${title}</p>`;
  
      searchArea?.appendChild(clone);
    });
  }
  
  // 🧠 Run after page loads
  window.addEventListener("load", () => {
    injectGameSearchClones();
  });
  
  function organizeSearchResultsByCategory() {
    const movieContainer = document.getElementById("searchResultsMovies");
    const gameContainer = document.getElementById("searchResultsGames");
    const movieGroup = movieContainer.closest(".search-group");
    const gameGroup = gameContainer.closest(".search-group");
  
    // Clear both before filling
    movieContainer.innerHTML = "";
    gameContainer.innerHTML = "";
  
    // Reset visibility
    movieGroup.style.display = "none";
    gameGroup.style.display = "none";
  
    const allResults = document.querySelectorAll("#searchResults .video-card");
    allResults.forEach(card => {
      const isGame = card.classList.contains("game-card") || card.classList.contains("hidden-search-clone");
      if (isGame) {
        gameContainer.appendChild(card);
      } else {
        movieContainer.appendChild(card);
      }
    });
  
    if (movieContainer.children.length > 0) movieGroup.style.display = "block";
    if (gameContainer.children.length > 0) gameGroup.style.display = "block";
  }
  
  document.getElementById("openAccountOptions").addEventListener("click", () => {
  document.getElementById("settingsMain").classList.add("hidden");
  document.getElementById("accountOptionsView").classList.remove("hidden");
});

document.getElementById("backToMain").addEventListener("click", () => {
  document.getElementById("accountOptionsView").classList.add("hidden");
  document.getElementById("settingsMain").classList.remove("hidden");
});


  