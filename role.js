
// ✅ Check role once at login and store it globally
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

    // ✅ Only assign video click handlers AFTER role is known
    document.querySelectorAll(".video-card[data-title]").forEach(card => {
      const title = card.dataset.title;
      const description = card.getAttribute("data-description");
      const videoURL = card.getAttribute("data-video");

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

// 🎬 Fallback click logic, kept clean
function handleVideoClick(title, description, videoURL) {
  openModal(title, description, videoURL);
}

// 🔒 Show modal lock
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