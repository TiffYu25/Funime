const recContainer = document.getElementById("recommend-container");

async function top3Genres() {
    let myuser = JSON.parse(localStorage.getItem("myuser"));
    let genrecount = {};
    let animeList = myuser.animeList;
    let sorted = [];
    for (let i = 0; i < animeList.length; i++) {
        let anime = animeList[i];
        await fetch(`https://api.jikan.moe/v4/anime/${anime}`).then(response => {
            return response.json();
        }).then(data => {
            let genres = data.data.genres;
            for (let j = 0; j < genres.length; j++) {
                let genre = genres[j].name;
                if (genrecount[genre] == undefined) {
                    genrecount[genre] = 1;
                } else {
                    genrecount[genre] += 1;
                }
            }
            sorted = Object.entries(genrecount).sort((a, b) => b[1] - a[1]);

            
        });
    }
    return [sorted[0][0], sorted[1][0], sorted[2][0]];
}




// Feel free to modify this to replace with recommended anime
async function fetchAnime(genres,limit) {
    const genreMap = {
        "Action": 1,
        "Adventure": 2,
        "Cars": 3,
        "Comedy": 4,
        "Avante Garde": 5,
        "Demons": 6,
        "Mystery": 7,
        "Drama": 8,
        "Ecchi": 9,
        "Fantasy": 10,
        "Game": 11,
        "Hentai": 12,
        "Historical": 13,
        "Horror": 14,
        "Kids": 15,
        "Martial Arts": 17,
        "Mecha": 18,
        "Music": 19,
        "Parody": 20,
        "Samurai": 21,
        "Romance": 22,
        "School": 23,
        "Sci Fi": 24,
        "Shoujo": 25,
        "Girls Love": 26,
        "Shounen": 27,
        "Boys Love": 28,
        "Space": 29,
        "Sports": 30,
        "Super Power": 31,
        "Vampire": 32,
        "Harem": 35,
        "Slice Of Life": 36,
        "Supernatural": 37,
        "Military": 38,
        "Police": 39,
        "Psychological": 40,
        "Suspense": 41,
        "Seinen": 42,
        "Josei": 43,
        "Doujinshi": 44,
        "Gender Bender": 45,
        "Award Winning": 46,
        "Gourmet": 47,
        "Work Life": 48,
        "Erotica": 49
    };
    let recommend = [];
    let response = await fetch(`https://api.jikan.moe/v4/anime?order_by=popularity&genres=${genreMap[genres[0]]},${genreMap[genres[1]]},${genreMap[genres[2]]}&type=tv&limit=${limit}`);
    let res = await response.json();
    let data = res.data;

    return data

};

// Populate recommend container with anime
async function populateRec() {
    let limit = 20;
    let myuser = JSON.parse(localStorage.getItem("myuser"));
    await top3Genres().then((genres) => {
        console.log(genres);
        fetchAnime(genres,limit).then((animeList) => {
            for (let i = 0; i < limit; i++) {
                let anime = animeList[i];
                if (anime.mal_id in myuser.animeList) {
                    continue;
                }
                // Create a new div
                const newDiv = document.createElement("div");
                newDiv.id = anime.mal_id;

                // Further styling
                newDiv.onmouseout = function () {
                    newDiv.style.transition = "transform 0.3s ease"
                    newDiv.style.transform = "scale(1)"
                }
                newDiv.onmouseover = function () {
                    newDiv.style.transition = "transform 0.3s ease"
                    newDiv.style.transform = "scale(1.05)"
                    newDiv.style.cursor = "pointer"
                }

                newDiv.onclick = function () {
                    localStorage.setItem("anime_id", anime.mal_id);
                    window.location.href = "desc.html";
                }
                newDiv.classList.add("recommend");
        
                // Create an image
                const newImg = document.createElement("img");
                newImg.src = anime.images.jpg.image_url;
                
                newDiv.appendChild(newImg)
        
                // Add the new div to our recommend container
                recContainer.appendChild(newDiv)
            }
        });
    });
}

// run the function when the page is loaded
window.onload = function() {
    populateRec();
};