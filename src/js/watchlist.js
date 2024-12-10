// Containers for each section
const currentDiv = document.getElementById("current-section");
const reviewDiv = document.getElementById("reviewed-section");

// Buttons for each section
const currentButton = document.getElementById("current-button");
const reviewButton = document.getElementById("reviewed-button");

let myuser = JSON.parse(localStorage.getItem("myuser")); // user data


// List of animes containing mal_ids
const currentList = myuser.animeList;
const reviewList = Object.keys(myuser.animeRatings);


function createAnimeItem(id, image, title, rating, container) {
    // Create a new div
    const animeItem = document.createElement("div");
    animeItem.classList.add("anime-item");
    animeItem.id = id
    animeItem.onclick = function () {
        localStorage.setItem("anime_id", id);
        window.location.href = "desc.html";
    }

    // Create an image
    const newImg = document.createElement("img");
    newImg.src = image;
    animeItem.appendChild(newImg)

    const animeInfo = document.createElement("div");
    animeInfo.classList.add("anime-info")
    // Create the title
    const newTitle = document.createElement("h3");
    newTitle.innerText = title;
    animeInfo.appendChild(newTitle)

    // Create the rating
    const newRating = document.createElement("p");
    if (container == reviewDiv) {
        newRating.innerText = `Your Rating: ${rating || "(N/A)"}/10`;
    } else {
        newRating.innerText = `Rating: ${rating || "(N/A)"}/10`;
    }
    animeInfo.appendChild(newRating)

    // Append anime information
    animeItem.appendChild(animeInfo)

    // Further styling
    animeItem.onmouseout = function () {
        animeItem.style.transition = "background-color 0.3s ease"
        animeItem.style.backgroundColor = "white"
    }
    animeItem.onmouseover = function () {
        animeItem.style.transition = "background-color 0.3s ease"
        animeItem.style.backgroundColor = "#cccccc"
        animeItem.style.cursor = "pointer"
    }
    
    // Add the new div to our recommend container
    container.appendChild(animeItem)
}

async function fetchAnimes(animeList, container, reviewed) {
    for (let i = 0; i < animeList.length; i++) {
        let response = await fetch(`https://api.jikan.moe/v4/anime/${animeList[i]}`);
        let res = await response.json();
        
        let data = res.data;
        if (data == null) {
            console.error("Anime list contains invalid MAL id");
            return;
        }

        let id = data.mal_id;
        let image = data.images.jpg.image_url;
        let title = data.title;
        let rating = data.score;
        if (reviewed) {
            rating = myuser.animeRatings[animeList[i]];
        }
        createAnimeItem(id, image, title, rating, container);
    }
}

function setupCurrentSection() {
    currentDiv.style.visibility = "visible";
    reviewDiv.style.visibility = "hidden";
    currentButton.style.backgroundColor = "#ff778a";
    reviewButton.style.backgroundColor = "white";
}

function setupReviewSection() {
    currentDiv.style.visibility = "hidden";
    reviewDiv.style.visibility = "visible";
    currentButton.style.backgroundColor = "white";
    reviewButton.style.backgroundColor = "#ff778a";
}

// run the function when the page is loaded
window.onload = function() {
    setupCurrentSection();
    fetchAnimes(currentList, currentDiv, false);
    fetchAnimes(reviewList, reviewDiv, true);
};

currentButton.addEventListener("click", (event) => {
    setupCurrentSection();
})
reviewButton.addEventListener("click", (event) => {
    setupReviewSection();
})