let allLikedMovies = [];


firebase.auth().onAuthStateChanged(user => {
  if (user) {
    const db = firebase.firestore();
    db.collection("likes")
      .where("userID", "==", user.uid)
      .get()
      .then(querySnapshot => {
        const movies = [];
        querySnapshot.forEach(doc => {
          movies.push(doc.data());
        });
        allLikedMovies = movies; // Save globally
        displayLikedMovies(movies);
      })
      .catch(error => {
        console.error("Error fetching liked movies:", error);
        displayLikedMovies([]);
      });
  } else {
    window.location.href = "login.html";
  }
});

  
  function displayLikedMovies(movies) {
    const container = document.getElementById("likedMovies");
    container.innerHTML = "";
  
    if (movies.length === 0) {
      container.innerHTML = "<p>You haven't liked any movies yet.</p>";
      return;
    }
  
    movies.forEach(movie => {
      const card = document.createElement("div");
      card.className = "video-card";
  
      card.innerHTML = `
        <img src="${movie.thumbnail}" alt="${movie.title}">
        <p>${movie.title}</p>
      `;
  
      // ✅ Optional: support modal if available
      card.onclick = () => {
        if (typeof openModal === "function") {
          openModal(movie.title, movie.description, movie.videoURL);
        } else {
          alert(`${movie.title}\n\n${movie.description}`);
        }
      };
  
      container.appendChild(card);
    });
  }

  function filterLikedMovies(query) {
  const filtered = allLikedMovies.filter(movie =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  );
  displayLikedMovies(filtered);
}

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
    displayLikedMovies(allLikedMovies); // Reset view
  }
}

  document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.getElementById("searchWrapper");
    const input = document.getElementById("searchInput");

    input.addEventListener("input", () => {
      const query = input.value.toLowerCase();
      if (query.trim()) {
        document.querySelector(".nav-bar").classList.add("search-active");
      } else {
        document.querySelector(".nav-bar").classList.remove("search-active");
      }
      filterLikedMovies(query);
    });

    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target)) {
        wrapper.classList.remove("active");
        input.value = "";
        document.querySelector(".nav-bar").classList.remove("search-active");
        displayLikedMovies(allLikedMovies); // Reset
      }
    });
  });


  