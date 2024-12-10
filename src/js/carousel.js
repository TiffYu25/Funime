// Trending Carousel
// Get our trending item classlist
const trending_items = document.getElementsByClassName("carousel-item");

// Take the MyAnimeList API and populate the Top 10 trending
// Fetch the MyAnimeList API (Jikan API allows for no authentication access to MAL API)
async function fetchTrending() {
    let t10_trending = [];
    let response = await fetch("https://api.jikan.moe/v4/top/anime?type=tv&filter=airing&limit=20");
    let res = await response.json();

    // This is our top 20 airing anime
    let data = res.data;

    for (let i = 0; i < data.length; i++) {
        // We check for duplicates. Don't ask me why but this API gives dupicates for some reason :/
        if (t10_trending.length !== 0) {
            // If duplicate we skip it
            if (t10_trending[t10_trending.length - 1].mal_id == data[i].mal_id) {
                continue;
            }
        }

        t10_trending.push(data[i]);
        if (t10_trending.length == trending_items.length) break;
    }
    return t10_trending;
}

// Call the async function and log the size after completion
fetchTrending().then((t10_trending) => {
    // We now populate our trending items with the API data
    for (let i = 0; i < trending_items.length; i++) {
        // console.log(t10_trending[i].title_english)
        let item_image = trending_items[i].getElementsByTagName("img")[0];
        let item_paragraph = trending_items[i].getElementsByTagName("p")[0];

        item_image.src = t10_trending[i].images.jpg.image_url;
        item_paragraph.textContent = t10_trending[i].title;
        item_image.id = t10_trending[i].mal_id;

        // Further styling
        item_image.onmouseout = function () {
            item_image.style.transition = "transform 0.3s ease"
            item_image.style.transform = "scale(1)"
            item_paragraph.style.textDecoration = "none";
        }
        item_image.onmouseover = function () {
            item_image.style.transition = "transform 0.3s ease"
            item_image.style.transform = "scale(1.05)"
            item_image.style.cursor = "pointer"
            item_paragraph.style.textDecoration = "underline"
        }
        item_paragraph.onmouseout = function () {
            item_paragraph.style.textDecoration = "none";
        }
        item_paragraph.onmouseover = function () {
            item_paragraph.style.textDecoration = "underline";
            item_paragraph.style.cursor = "pointer"
        }
        item_image.onclick = function () {
            console.log("clicked");
            localStorage.setItem("anime_id", item_image.id);
            window.location.href = "desc.html";
        }
        item_paragraph.onclick = function () {
            console.log("clicked");
            localStorage.setItem("anime_id", item_image.id);
            window.location.href = "desc.html";
        }
    }
});

// Provide carousel functionality
let carousel = document.querySelector('.carousel');
let left = document.querySelector('.left');
let right = document.querySelector('.right');
let item = document.querySelector('.carousel-item');

right.addEventListener('click', function () {
    carousel.scrollLeft += item.clientWidth;
});
left.addEventListener('click', function () {
    carousel.scrollLeft -= item.clientWidth;
});