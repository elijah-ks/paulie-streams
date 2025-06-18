// ✅ Check role once at login and store it globally
firebase.auth().onAuthStateChanged(user => {
  if (!user) return;

  const rolesRef = firebase.firestore().collection("roles").doc(user.uid);
  rolesRef.get().then(doc => {
    const role = doc.exists ? doc.data().role : "viewer";
    window.userRole = role; // 🌍 Store for use in video clicks

    console.log("User role:", role);

    // 🔓 Optional: Reveal subscriber-only elements if needed
    if (role === "subscriber") {
      document.querySelectorAll(".subscriber-only").forEach(el => el.classList.remove("hidden"));
    }
  });
});

// 🎬 Centralized click handler for videos
function handleVideoClick(title, description, videoURL) {
  const clickedCard = document.querySelector(`[data-title="${title}"]`);
  const isRestricted = clickedCard?.dataset.subscriberOnly === "true";

  if(isRestricted && !["subscriber", "admin"].includes(window.userRole)) {
    showSubscriberLockModal(title);
  } else {
    openModal(title, description, videoURL);
  }
}

// 🔒 Modal for restricted videos
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
