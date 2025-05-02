window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("loading-screen").style.display = "none";
        document.getElementById("main-content").classList.remove("hidden");
    }, 2200);
});

function openModal(title, description, videoURL) {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalDescription").innerText = description;
    document.getElementById("modalVideo").src = videoURL;
    document.getElementById("videoModal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("videoModal").classList.add("hidden");
    document.getElementById("modalVideo").src = ""; // clears video
}
