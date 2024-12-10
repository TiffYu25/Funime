// Licensor-to-URL Mapping
const licensorUrls = {
    "Crunchyroll": "https://www.crunchyroll.com/",
    "Funimation": "https://www.funimation.com/",
    "Netflix": "https://www.netflix.com/",
    "Hulu": "https://www.hulu.com/",
    "Amazon Prime Video": "https://www.primevideo.com/",
    "Disney+": "https://www.disneyplus.com/"
};

// Jikan API: Fetch Random Anime Details
//const apiUrl = `https://api.jikan.moe/v4/random/anime`;

let anime;

let myuser = JSON.parse(localStorage.getItem("myuser"));
let anime_id = localStorage.getItem("anime_id") || 1;
const apiUrl = `https://api.jikan.moe/v4/anime/${anime_id}`;

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        anime = data.data;
        console.log(myuser);

        // Update title, image, description, and genres
        document.getElementById("anime-title").innerText = anime.title;
        document.getElementById("anime-image").src = anime.images.jpg.image_url;
        document.getElementById("anime-desc").innerText = anime.synopsis || "No description available.";
        document.getElementById("anime-genres").innerText = anime.genres.map(genre => genre.name).join(", ") || "Unknown";

        // Update rating
        document.getElementById("anime-rating").innerText = `Rating: ${anime.score || "N/A"}/10`;

        // Update "Where to Watch" with licensor links
        const whereToWatch = document.getElementById("anime-sites");
        const licensors = anime.licensors; // Licensors list from the API
        if (licensors.length > 0) {
            whereToWatch.innerHTML = licensors.map(licensor => {
                const licensorUrl = licensorUrls[licensor] || "#"; // Use mapped URL or fallback
                return `<a href="${licensorUrl}" target="_blank">${licensor}</a>`;
            }).join(" | ");
        } else {
            whereToWatch.innerText = "No licensor information available.";
        }
    })
    .catch(error => {
        console.error("Error fetching anime details:", error);
        document.getElementById("anime-title").innerText = "Error loading anime.";
        document.getElementById("anime-desc").innerText = "Please try reloading the page.";
        document.getElementById("anime-sites").innerText = "No licensor information available.";
    });

document.getElementById("add-anime-button").addEventListener("click", (event) => {
    console.log("pretend anime got added to list...")
    if (anime.mal_id in myuser.animeList) {
        alert("Anime already in list");
        return;
    }
    myuser.animeList.push(anime.mal_id);
    fetch("https://cs409-final-project-3k3e.onrender.com/api/users/" + myuser._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(myuser)
    }).then(response => {
        console.log(response);
        return response.json();
    }
    ).then(data => {
        if (data.error) {
            alert("Error adding anime to list");
            return;
        }
        console.log(data.data);
        localStorage.setItem("myuser", JSON.stringify(myuser));
        alert("Anime added to list");
    })
        
    // Replace "insertlistnamehere" with user anime list
    // insertlistnamehere.push(anime.mal_id);
})

document.getElementById("review-score-submit").addEventListener("click", (event) => {
    const reviewScore = document.getElementById("review-score").value;
    myuser.animeRatings[anime.mal_id] = reviewScore;
    fetch("https://cs409-final-project-3k3e.onrender.com/api/users/" + myuser._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(myuser)
    }).then(response => {
        console.log(response);
        return response.json();
    }
    ).then(data => {
        if (data.error) {
            alert("Error adding review score");
            return;
        }
        console.log(data.data);
        localStorage.setItem("myuser", JSON.stringify(myuser));
        alert("Review score added");
    })
})
