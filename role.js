firebase.auth().onAuthStateChanged(user => {
  if (!user) return;

  const rolesRef = firebase.firestore().collection("roles").doc(user.uid);
  rolesRef.get().then(doc => {
    const role = doc.exists ? doc.data().role : "viewer";
    window.userRole = role;

    console.log("User role:", role);

    if (["subscriber", "admin"].includes(role)) {
      document.querySelectorAll(".subscriber-only").forEach(el => el.classList.remove("hidden"));
    }

    // ✅ Assign video click handlers based on role
    document.querySelectorAll(".video-card[data-title]").forEach(card => {
      const title = card.dataset.title;
      const description = card.dataset.description;
      const videoURL = card.dataset.videourl;

      card.addEventListener("click", () => {
        const isRestricted = card.dataset.subscriberOnly === "true";
        if (isRestricted && !["subscriber", "admin"].includes(window.userRole)) {
          showSubscriberLockModal(title);
        } else {
          handleVideoClick(title, description, videoURL);
        }
      });
    });
  });
});

// 🎬 Centralized modal opening
function handleVideoClick(title, description, videoURL) {
  openModal(title, description, videoURL);
}

// 🔒 Modal for locked videos
function showSubscriberLockModal(title) {
  const modal = document.getElementById("videoModal");
  modal.classList.remove("hidden");
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalDescription").innerHTML = `
    <div class="locked-overlay">
      🔒<br><span>Paulie Subscribers Only</span>
    </div>
  `;
  document.getElementById("modalVideo").src = "";
}
