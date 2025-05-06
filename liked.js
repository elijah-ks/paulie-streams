// liked.js

// ✅ Firebase already loaded via <script> tags in liked.html

firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const userID = user.uid;
      const db = firebase.firestore();
  
      // 🔄 Fetch all documents in "likes" where userID matches
      db.collection("likes")
        .where("userID", "==", userID)
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
      window.location.href = "login.html"; // Redirect if not signed in
    }
  });
  
  
  // ✅ Renders each liked movie card
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
      card.onclick = () => openModal(movie.title, movie.description, movie.videoURL);
  
      card.innerHTML = `
        <img src="${movie.thumbnail}" alt="${movie.title}">
        <p>${movie.title}</p>
      `;
  
      container.appendChild(card);
    });
  }
  