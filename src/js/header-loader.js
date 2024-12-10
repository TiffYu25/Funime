// header-loader.js

function loadHeader() {
    const headerContainer = document.querySelector('header');
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            headerContainer.innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading the header:', error);
        });
}

window.onload = loadHeader;
