const matrixAttack2ReleaseDate = new Date("2025-07-27T00:00:00-04:00");
const earlyAccessCode = "ryan";

function handleMatrixAttack2() {
  const now = new Date();
  const videoURL = "https://drive.google.com/file/d/1O3bBy9Yi5-69pitWo8_dW-Cb7nDUEdXR/preview";

  if (now < matrixAttack2ReleaseDate) {
    // ⏳ Show countdown modal
document.getElementById("matrixModalInner").innerHTML = `
  <div class="matrix-modal-content">
    <button class="close-matrix" onclick="document.getElementById('matrixModal').classList.add('hidden')">&times;</button>
    <div class="premiere-container">
      <img src="assets/matrix-attack2.jpg" alt="Matrix Attack 2 Cover" class="premiere-cover">
      <p class="premiere-heading">🎬 PREMIERES IN…</p>
      <p id="countdownTimer" class="digital-timer"></p>
      <button onclick="showCodePrompt('${videoURL}')">🔓 Enter Access Code</button>
      <p class="premiere-date">Unlocks July 27, 2025 @ 12:00 AM ET</p>
    </div>
  </div>
`;


    document.getElementById("matrixModal").classList.remove("hidden");
    updateCountdown(matrixAttack2ReleaseDate);
  } else {
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
      timerEl.innerText = `${hours}h ${minutes}m ${seconds}s`;

      // ✅ Add this line once the timer has content
      if (!timerEl.classList.contains("visible")) {
        timerEl.classList.add("visible");
      }
    }
  }, 1000);
}


function showCodePrompt(videoURL) {
  const code = prompt("Enter the early access code:");
  if (code === earlyAccessCode) {
    document.getElementById("matrixModal").classList.add("hidden");
    openModal(
      "Matrix Attack 2 (Early Access)",
      "You're in!",
      videoURL
    );
  } else {
    alert("Incorrect code.");
  }
}
