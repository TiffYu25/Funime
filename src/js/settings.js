// settings.js

// Change Profile Picture
// const userId = "testUserD"; // Replace with actual user ID from your application logic

// document.getElementById('profileForm').addEventListener('submit', function(event) {
//     event.preventDefault();
//     const fileInput = document.getElementById('fileInput');
//     const formData = new FormData();
//     formData.append('userIcon', fileInput.files[0]);

//     // Submit the form data to the server for file upload
//     fetch(`/users/${userId}`, {
//         method: 'PATCH',
//         body: formData
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.message === "User information updated successfully") {
//             const previewImage = document.getElementById('previewImage');
//             previewImage.src = `/uploads/${data.data.userIcon}`; // Use the correct path to the image
//         } else {
//             alert("Failed to update profile picture: " + data.message);
//         }
//     })
//     .catch(error => console.error('Error:', error));
// });


// Change Username
document.getElementById('usernameForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('usernameInput').value;
    let myuser = JSON.parse(localStorage.getItem("myuser"));
    myuser.name = username;
    fetch("https://cs409-final-project-3k3e.onrender.com/api/users/" + myuser._id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(myuser)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);  // Show success message
        localStorage.setItem("myuser", JSON.stringify(myuser));
        document.getElementById("username").innerText = username;
    })
    .catch(error => console.error('Error:', error));
});

// Change Password
document.getElementById('passwordForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    let myuser = JSON.parse(localStorage.getItem("myuser"));
    if (currentPassword !== myuser.password) {
        alert("Current password is incorrect");
        return;
    }
    const userId = myuser._id;
    myuser.password = newPassword;

    fetch('https://cs409-final-project-3k3e.onrender.com/api/users/' + userId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(myuser)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        alert(data.message);  // Show success message
        localStorage.setItem("myuser", JSON.stringify(myuser));
    })
    .catch(error => console.error('Error:', error));
});

// Delete Account
document.getElementById('deleteAccountBtn').addEventListener('click', function() {
    const confirmation = confirm("Are you sure you want to delete your account?");
    if (confirmation) {
        fetch('/users/' + userId, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);  // Show success message
            window.location.href = '/';  // Redirect to homepage
        })
        .catch(error => console.error('Error:', error));
    }
});

// settings.js

document.addEventListener("DOMContentLoaded", () => {
    const myuser = JSON.parse(localStorage.getItem("myuser"));
    const currname = document.getElementById("username");
    currname.innerText = myuser.name;
    const accordionHeaders = document.querySelectorAll(".accordion-header");
    
    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const body = header.nextElementSibling;

            // Toggle the current accordion item
            const isOpen = body.style.display === "block";
            body.style.display = isOpen ? "none" : "block";

            // Optionally close other accordions (for single active accordion style)
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    const otherBody = otherHeader.nextElementSibling;
                    otherBody.style.display = "none";
                }
            });
        });
    });


});
