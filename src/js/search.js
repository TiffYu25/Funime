// Searching
let result_items = document.getElementsByClassName("result-item");
let results = document.getElementById("results");

// Take the MyAnimeList API and search the anime based on the search input
// Fetch the MyAnimeList API (Jikan API allows for no authentication access to MAL API)
async function search(input) {
    let response = await fetch(`https://api.jikan.moe/v4/anime?q=${input}&limit=12&filter=favorite&type=tv`);
    let res = await response.json();
    // First four search results
    let data = res.data;
    if (data == null) {
        return [];
    }

    let searched = [];
    // We check for duplicates. Don't ask me why but this API gives dupicates for some reason :/
    for (let i = 0; i < data.length; i++) {
        // We check for duplicates. Don't ask me why but this API gives dupicates for some reason :/
        if (searched.length !== 0) {
            // If duplicate we skip it
            if (searched[searched.length - 1].mal_id == data[i].mal_id) {
                continue;
            }
        }

        searched.push(data[i]);
        if (searched.length == result_items.length) break;
    }
    return searched;
}


// We want to send the input request once the user stops typing hence the debounce
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

function hideAllResult() {
    results.style.pointerEvents = "none";
    for (let i = 0; i < result_items.length; i++) {
        result_items[i].style.visibility = "hidden";
    }
}

// We now handle our input once user stops typing
async function handleSearchInput() {
    let searchbar = document.getElementById('search-input');
    
    if (searchbar.value !== "") {
        // Call the async function and modify the result container to be visible with the found data
        await search(searchbar.value).then((searched_result) => {
            // We now populate our result items with the API data
            results.style.pointerEvents = "auto";
            for (let i = 0; i < result_items.length; i++) {
                if (i < searched_result.length) {
                    let item_image = result_items[i].getElementsByTagName("img")[0];
                    let item_paragraph = result_items[i].getElementsByTagName("p")[0];

                    result_items[i].style.visibility = "visible";
                    item_image.src = searched_result[i].images.jpg.image_url;
                    item_paragraph.textContent = searched_result[i].title;
                    result_items[i].id = searched_result[i].mal_id;


                    // Further styling
                    result_items[i].onmouseout = function () {
                        result_items[i].style.transition = "background-color 0.3s ease"
                        result_items[i].style.backgroundColor = "white"
                    }
                    result_items[i].onmouseover = function () {
                        result_items[i].style.transition = "background-color 0.3s ease"
                        result_items[i].style.backgroundColor = "#cccccc"
                        result_items[i].style.cursor = "pointer"
                    }

                    result_items[i].onclick = function () {
                        localStorage.setItem("anime_id", result_items[i].id);
                        window.location.href = "desc.html";
                    }
                    
                } else {
                    // Must reset the other items to be hidden
                    result_items[i].style.visibility = "hidden";
                }
            }
        });
    } else {
        // If there is no input we set everything back to nothing
        hideAllResult();
    }
}

const processChange = debounce(() => handleSearchInput());