/// NOTE!!!! Delete after July 27TH!

const matrixAttack2ReleaseDate = new Date("2025-07-27T00:00:00-04:00");
const earlyAccessCode = "ryan";

function handleMatrixAttack2() {
  const now = new Date();
  const videoURL = "https://drive.google.com/file/d/1O3bBy9Yi5-69pitWo8_dW-Cb7nDUEdXR/preview";

  if (now < matrixAttack2ReleaseDate) {
    // ⏳ Locked: show countdown and access prompt
    document.getElementById("modalTitle").innerText = "Matrix Attack 2";
    document.getElementById("modalDescription").innerHTML = `
    <div class="premiere-container">
        <p class="premiere-heading">🎬 PREMIERES IN…</p>
        <p id="countdownTimer" class="digital-timer"></p>
        <button onclick="showCodePrompt('${videoURL}')">🔓 Enter Access Code</button>
        <p class="premiere-date">Unlocks July 27, 2025 @ 12:00 AM ET</p>
    </div>
    `;

    document.getElementById("modalVideo").src = ""; // clear video
    document.getElementById("videoModal").classList.remove("hidden");

    updateCountdown(matrixAttack2ReleaseDate);
  } else {
    // 🔓 Already released: show video
    openModal(
    "Matrix Attack 2",
    "After being captured by President Eli, the Sabado Brothers attempt their escape...",
     videoURL
    );

  }
}

function updateCountdown(releaseDate) {
  const timerEl = document.getElementById("countdownTimer");
  const interval = setInterval(() => {
    const now = new Date();
    const diff = releaseDate - now;

    if (diff <= 0) {
      timerEl.innerText = "Unlocked!";
      clearInterval(interval);
    } else {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      timerEl.innerText = `Releases in ${hours}h ${minutes}m ${seconds}s`;
    }
  }, 1000);
}

function showCodePrompt(videoURL) {
  const code = prompt("Enter the early access code:");
  if (code === earlyAccessCode) {
    openModal(
      "Matrix Attack 2",
      "After being captured by President Eli, the Sabado Brothers attempt their escape...",
      videoURL
    );
  } else {
    alert("Incorrect code.");
  }
}

