/// NOTE!!!! Delete after July 27TH!

const matrixAttack2ReleaseDate = new Date("2025-07-27T00:00:00-04:00");
const earlyAccessCode = "PAULIEEARLYACCESS";

function handleMatrixAttack2() {
  const now = new Date();
  const videoURL = "https://drive.google.com/file/d/1O3bBy9Yi5-69pitWo8_dW-Cb7nDUEdXR/preview";

  if (now < matrixAttack2ReleaseDate) {
    const countdownModal = `
      <h2>Matrix Attack 2</h2>
      <p>This movie unlocks on July 27, 2025 @ 12:00 AM ET</p>
      <p id="countdownTimer"></p>
      <button onclick="showCodePrompt('${videoURL}')">Enter Access Code</button>
    `;
    document.getElementById("modalContent").innerHTML = countdownModal;
    document.getElementById("videoModal").classList.remove("hidden");
    updateCountdown(matrixAttack2ReleaseDate);
  } else {
    showVideo(
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
    showVideo("Matrix Attack 2 (Early Access)", "You're in!", videoURL);
  } else {
    alert("Incorrect code.");
  }
}
