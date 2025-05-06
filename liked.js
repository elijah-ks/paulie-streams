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
  