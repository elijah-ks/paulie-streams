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
      const isRestricted = card.dataset.subscriberOnly === "true";


      card.addEventListener("click", () => {
        const modalContent = document.querySelector("#videoModal .modal-content");
        if (isRestricted && !["subscriber", "admin"].includes(window.userRole)) {
          modalContent.classList.add("restricted-modal-content");
          showSubscriberLockModal(title, description);
        } else {
          modalContent.classList.remove("restricted-modal-content");
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
function showSubscriberLockModal(title, description) {
  const modal = document.getElementById("videoModal");
  modal.classList.remove("hidden");

  // Set title + description
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalDescription").innerHTML = description || "";

  // Replace iframe with lock box
  document.getElementById("modalVideo").outerHTML = `
    <div id="modalVideo" class="locked-overlay subscriber-lock-box">
      🔒<br><span>Paulie Subscribers Only</span>
    </div>
  `;
}


