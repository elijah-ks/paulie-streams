

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
  const normalized = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `assets/${normalized}.jpg`;
}


function closeModal(trigger = null) {
  let modal;

  if (trigger instanceof HTMLElement) {
    // Find the closest parent with class "modal"
    modal = trigger.closest(".modal");
  } else {
    // Fallback: close all modals (emergency case)
    document.querySelectorAll(".modal").forEach(el => el.classList.add("hidden"));
    return;
  }

  if (modal) {
    modal.classList.add("hidden");

    // Cleanup video if needed
    const video = modal.querySelector("iframe, video");
    if (video) {
      video.src = "";
      video.style.display = "block";
    }

    // Cleanup lockBox if present
    const lockBox = modal.querySelector("#lockBox");
    if (lockBox) lockBox.remove();
  }
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
  const isMobile = window.innerWidth <= 600;
  const overlay = document.getElementById("searchResultsOverlay");
  const navBar = document.querySelector(".nav-bar");

  if (isMobile) {
    // Toggle mobile overlay
    const isVisible = overlay.classList.contains("visible");

    if (isVisible) {
      // Hide overlay
      overlay.classList.remove("visible");
      setTimeout(() => overlay.classList.add("hidden"), 200);
      document.body.classList.remove("no-scroll");
    } else {
      // Show overlay
      overlay.classList.remove("hidden");
      setTimeout(() => overlay.classList.add("visible"), 10);
      document.body.classList.add("no-scroll");

      const newSearchInput = document.getElementById("mobileSearchInput");
      if (newSearchInput) newSearchInput.focus();
    }
    return;
  }

  // Desktop logic
  const searchWrapper = document.getElementById("searchWrapper");
  const input = document.getElementById("searchInput");

  if (!searchWrapper || !input) return;

  searchWrapper.classList.toggle("active");

  if (searchWrapper.classList.contains("active")) {
    input.focus();
    navBar.classList.add("search-active");
  } else {
    input.value = "";
    navBar.classList.remove("search-active");
    filterMovies("");
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
  const isMobile = window.innerWidth <= 600;

  // Skip this logic on mobile so mobile overlay isn't closed
  if (isMobile) return;

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

  const mobileSearch = document.getElementById("mobileSearchInput");
if (mobileSearch) {
  mobileSearch.addEventListener("input", () => {
    const query = mobileSearch.value.toLowerCase();
    filterMovies(query);
  });
}


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

  // If query is empty, clear everything and hide the overlay
  if (!query.trim()) {
    overlay.classList.remove("visible");
    setTimeout(() => overlay.classList.add("hidden"), 250);
    document.body.classList.remove("no-scroll");
    movieContainer.innerHTML = "";
    gameContainer.innerHTML = "";
    return;
  }

  const allCards = Array.from(document.querySelectorAll(".video-card, .game-card"))
    .filter(card => !card.closest("#searchResultsOverlay"));

  const seenTitles = new Set();
  movieContainer.innerHTML = "";
  gameContainer.innerHTML = "";

  allCards.forEach(card => {
    // Use data-title if available, otherwise fallback to text inside <p>
    const rawTitle = card.dataset.title || card.querySelector("p")?.innerText || "";
    const title = rawTitle.trim().toLowerCase();
    const normalizedQuery = query.trim().toLowerCase();

    if (title.includes(normalizedQuery) && !seenTitles.has(title)) {
      seenTitles.add(title);
      const clone = card.cloneNode(true);
      clone.addEventListener("click", () => card.click());

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

  // Toggle display of category headers based on results
  const movieGroup = document.querySelector(".search-group:nth-of-type(1)");
  const gameGroup = document.querySelector(".search-group:nth-of-type(2)");

  if (movieGroup) {
    movieGroup.style.display = movieContainer.children.length ? "block" : "none";
  }

  if (gameGroup) {
    gameGroup.style.display = gameContainer.children.length ? "block" : "none";
  }

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
  
  window.addEventListener("load", () => {
    // Other banner/setup logic...
    injectGameSearchClones();
  });
  
function injectGameSearchClones() {
  const searchArea = document.querySelector(".video-grid"); // Or wherever your movie/game cards live
  const games = document.querySelectorAll(".game-card");

  games.forEach(card => {
    const title = card.dataset.title || card.querySelector("p")?.innerText || "Untitled";
    const image = card.querySelector("img").src;
    const link = card.href;

    const clone = document.createElement("div");
    clone.className = "video-card hidden-search-clone";

    // ✅ Add the proper title for search indexing
    clone.setAttribute("data-title", title);
    
    // ✅ Display the proper title with original casing
    clone.innerHTML = `<img src="${image}" alt="${title}"><p>${title}</p>`;

    // ✅ Add click behavior
    clone.onclick = () => window.location.href = link;

    // ✅ Append to grid
    searchArea?.appendChild(clone);
  });
}

  
  // 🧠 Run after page loads
  window.addEventListener("load", () => {
    injectGameSearchClones();
  });
  
  function showVideo(title, description, videoURL) {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalDescription").innerText = description;
    document.getElementById("modalVideo").src = videoURL;
    document.getElementById("videoModal").classList.remove("hidden");
  }


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

function showOnlySettingsModal(modalId) {
  const modals = [
    "accountOptionsView",
    "changePasswordModal",
    "changeEmailModal",
    "deleteAccountModal",
    "accountDetailsModal" // ✅ Add this here!
  ];
  modals.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
  document.getElementById(modalId).classList.remove("hidden");
}

function goBackToAccountOptions() {
  showOnlySettingsModal("accountOptionsView");
}

function openSubscriberApplication() {
  document.getElementById("settingsDropdown").classList.add("hidden");
  resetSubscriberModal();

  const user = firebase.auth().currentUser;
  if (!user) return;

  const docRef = db.collection("subscriberApplications").doc(user.uid);
  docRef.get().then(doc => {
    if (doc.exists) {
      document.getElementById("alreadyAppliedModal").classList.remove("hidden");
      return;
    }



    // ✅ Only show modal if not already submitted
    document.getElementById("subscriberModal").classList.remove("hidden");

    // ✅ Attach Accept listener *only once*
    const acceptBtn = document.getElementById("subscriberAcceptBtn");
    if (acceptBtn && !acceptBtn.dataset.listenerAttached) {
      acceptBtn.addEventListener("click", () => {
        document.getElementById("subscriberTerms").classList.add("hidden");
        document.getElementById("subscriberLoading").classList.remove("hidden");

        const form = document.getElementById("subscriberForm");
        const formData = new FormData(form);

        const submissionData = {
          first_name: formData.get("firstName") || "N/A",
          last_name: formData.get("lastName") || "N/A",
          heard_from: formData.get("heardFrom") || "N/A",
          email: user?.email || "Not signed in",
          uid: user?.uid || "No UID",
          submitted_at: new Date().toLocaleString()
        };

        emailjs.send("service_si7weeo", "template_2ty7k9l", submissionData)
          .then(() => {
            db.collection("subscriberApplications").doc(user.uid).set(submissionData)
              .then(() => console.log("📦 Firestore saved"))
              .catch(err => console.error("⚠️ Firestore error:", err));

            document.getElementById("subscriberLoading").classList.add("hidden");
            document.getElementById("subscriberSuccess").classList.remove("hidden");
          })
          .catch((error) => {
            console.error("❌ EmailJS Error:", error);
            alert("There was an issue submitting your application. Please try again.");
            document.getElementById("subscriberModal").classList.add("hidden");
          });
      });

      acceptBtn.dataset.listenerAttached = "true";
    }
  });
}



function resetSubscriberModal() {
  ['subscriberStep1', 'subscriberLoading', 'subscriberTerms', 'subscriberSuccess']
    .forEach(id => document.getElementById(id).classList.add('hidden'));
  document.getElementById('subscriberStep1').classList.remove('hidden');
  const acceptBtn = document.getElementById("subscriberAcceptBtn");
  if (acceptBtn) acceptBtn.disabled = true;

  const form = document.getElementById('subscriberForm');
  if (form) form.reset();
}


document.getElementById("submitSubscriberBtn").addEventListener("click", () => {
  document.getElementById("subscriberStep1").classList.add("hidden");
  document.getElementById("subscriberTerms").classList.remove("hidden");

  const termsBox = document.getElementById("termsBox");
  if (termsBox) termsBox.scrollTop = 0;
  const acceptBtn = document.getElementById("subscriberAcceptBtn");
  if (acceptBtn) acceptBtn.disabled = true;
});

// Enable Accept button once scrolled
const termsBox = document.getElementById("termsBox");
const acceptBtn = document.getElementById("subscriberAcceptBtn");
if (termsBox && acceptBtn) {
  termsBox.addEventListener("scroll", () => {
    const isScrolled = termsBox.scrollTop + termsBox.clientHeight >= termsBox.scrollHeight;
    if (isScrolled) {
      acceptBtn.disabled = false;
    }
  });
}

// Handle Decline
const declineBtn = document.getElementById("declineTermsBtn");
if (declineBtn) {
  declineBtn.addEventListener("click", () => {
    // Reset to step 1 and hide modal
    resetSubscriberModal();
    document.getElementById("subscriberModal").classList.add("hidden");
  });
}



function submitNewPassword() {
  const oldPassword = document.getElementById("oldPasswordInput").value;
  const newPassword = document.getElementById("newPasswordInput").value;
  const user = firebase.auth().currentUser;

  if (!user || newPassword.length < 6) {
    document.getElementById("passwordMsg").innerText = "Invalid input.";
    return;
  }

  const credential = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword);

  user.reauthenticateWithCredential(credential).then(() => {
    return user.updatePassword(newPassword);
  }).then(() => {
    document.getElementById("passwordMsg").innerText = "Password updated successfully.";
  }).catch(error => {
    document.getElementById("passwordMsg").innerText = "Error: " + error.message;
  });
}

function submitNewEmail() {
  const user = firebase.auth().currentUser;
  const newEmail = document.getElementById("newEmailInput").value;
  const password = document.getElementById("currentEmailPassword").value;

  if (!user || !newEmail.includes("@")) {
    document.getElementById("emailMsg").innerText = "Please enter a valid email and password.";
    return;
  }

  const credential = firebase.auth.EmailAuthProvider.credential(user.email, password);

  user.reauthenticateWithCredential(credential).then(() => {
    return user.updateEmail(newEmail);
  }).then(() => {
    document.getElementById("emailMsg").innerText = "Email updated successfully.";
  }).catch(error => {
    document.getElementById("emailMsg").innerText = "Error: " + error.message;
  });
}

function submitDeleteAccount() {
  const user = firebase.auth().currentUser;

  if (!user) return;

  user.delete().then(() => {
    alert("Your account has been deleted.");
    window.location.href = "login.html";
  }).catch(error => {
    document.getElementById("deleteMsg").innerText = "Error: " + error.message;
  });
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    const emailDisplay = document.getElementById("accountEmailDisplay");
    if (emailDisplay) emailDisplay.innerText = user.email;
  }
});

function confirmDeleteWithPassword() {
  const user = firebase.auth().currentUser;
  const password = document.getElementById("deletePasswordInput").value;

  if (!user || !password) {
    alert("Please enter your password.");
    return;
  }

  const credential = firebase.auth.EmailAuthProvider.credential(
    user.email,
    password
  );

  // Re-authenticate before deletion
  user.reauthenticateWithCredential(credential)
    .then(() => {
      // Now safe to delete
      return user.delete();
    })
    .then(() => {
      alert("Account deleted successfully.");
      window.location.href = "login.html"; // or landing page
    })
    .catch((error) => {
      console.error("Delete error:", error);
      alert("Error deleting account: " + error.message);
    });
}

function openSettings() {
  document.getElementById("settingsModal").classList.remove("hidden");
}


function handleVideoClick(title, description, videoURL) {

  if (title === "Matrix Attack 2") return;

  const modal = document.getElementById("videoModal");
  modal.classList.remove("hidden");

  // Reset modal content
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalDescription").innerText = description || "";

  const video = document.getElementById("modalVideo");
  video.style.display = "block";
  video.src = videoURL;

  // ✅ Remove lockBox if it exists
  const lockBox = document.getElementById("lockBox");
  if (lockBox) lockBox.remove();

  updateLikeButtonState(title, description, videoURL);

}

function updateLikeButtonState(title, description, videoURL) {
  const likeBtn = document.getElementById("likeBtn");
  const newLikeBtn = likeBtn.cloneNode(true);
  likeBtn.parentNode.replaceChild(newLikeBtn, likeBtn);

  firebase.auth().onAuthStateChanged(user => {
    if (!user) return;

    const docID = `${title}_${user.uid}`;
    const likeRef = firebase.firestore().collection("likes").doc(docID);
    const thumbnail = getThumbnailForTitle(title);

    likeRef.get().then(doc => {
      const isViewer = window.userRole === "viewer";
      const isLocked = !videoURL || videoURL === "";

      // 🔒 Viewer looking at a locked video — force unliked display, no click
      if (isViewer && isLocked) {
        newLikeBtn.classList.remove("liked");
        newLikeBtn.innerText = "♡";
        return;
      }

      // Normal behavior
      if (doc.exists) {
        newLikeBtn.classList.add("liked");
        newLikeBtn.innerText = "❤️";
      } else {
        newLikeBtn.classList.remove("liked");
        newLikeBtn.innerText = "♡";
      }

      newLikeBtn.addEventListener("click", () => {
        const isLiked = newLikeBtn.classList.contains("liked");

        if (isLiked) {
          newLikeBtn.classList.remove("liked");
          newLikeBtn.innerText = "♡";
          likeRef.delete().catch(err => {
            console.error("Error unliking:", err);
            newLikeBtn.classList.add("liked");
            newLikeBtn.innerText = "❤️";
          });
        } else {
          newLikeBtn.classList.add("liked");
          newLikeBtn.innerText = "❤️";
          likeRef.set({
            movieID: title,
            title,
            description,
            videoURL,
            thumbnail,
            userID: user.uid,
            likedAt: firebase.firestore.FieldValue.serverTimestamp()
          }).catch(err => {
            console.error("Error liking:", err);
            newLikeBtn.classList.remove("liked");
            newLikeBtn.innerText = "♡";
          });
        }
      });
    });
  });
}



function openModal(title, description, videoURL) {
  const modal = document.getElementById("videoModal");
  modal.classList.remove("hidden");

  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalDescription").innerText = description;
  document.getElementById("modalVideo").src = videoURL;
  document.getElementById("modalVideo").style.display = "block";

  // 🧼 Remove lockBox if present
  const lockBox = document.getElementById("lockBox");
  if (lockBox) lockBox.remove();
}


// Neutralize the login/register Accept button
const basicTermsBtn = document.getElementById("acceptTerms");
if (basicTermsBtn) {
  basicTermsBtn.addEventListener("click", () => {
    document.getElementById("termsModal").style.display = "none";
    document.getElementById("auth-status").textContent = "Please log in or register to continue.";
  });
}
