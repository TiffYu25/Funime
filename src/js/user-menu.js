// user-menu.js
function toggleDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}
// Close the dropdown if clicked outside
window.onclick = function (event) {
    const dropdown = document.getElementById('userDropdown');
    if (!event.target.matches('.user-icon')) {
        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
        }
    }
};