let myuser = null;

// Handle login button click
document.getElementById("login").onclick = function () {
  let username = document.getElementById("usernamelogin").value;
  let password = document.getElementById("passwordlogin").value;

  // Check if the user exists
  fetch('https://cs409-final-project-3k3e.onrender.com/api/users?where={"name": "' + username + '"}').then(response => {
    return response.json();
  }).then(data => {
    data = data.data;
    console.log(data);
    if (data.length > 0) {
      let user = data[0];
      if (user.password === password) {
        alert("Login successful");
        myuser = user;
        localStorage.setItem("myuser", JSON.stringify(myuser));
        window.location.href = "src/home.html";
      } else {
        alert("Invalid password");
      }
    } else {
      alert("User not found");
    }
  })
};

// Handle signin button click
document.getElementById("signup").onclick = function () {
  console.log("Signup clicked");
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let email = document.getElementById("email").value;

  // Check if the username is already taken
  fetch('https://cs409-final-project-3k3e.onrender.com/api/users?where={"name": "' + username + '"}').then(response => {
    return response.json();
  }).then(data => {
    data = data.data;
    console.log(data);
    if (data.length > 0) {
      alert("Username already taken");
    } else {
      // Create a new user
      fetch("https://cs409-final-project-3k3e.onrender.com/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: username,
          password: password,
          email: email
        })
      }).then(response => {
        return response.json();
      }).then(data => {
        console.log(data.data);
        myuser = data.data;
        localStorage.setItem("myuser", JSON.stringify(myuser));
        alert("User created");
        window.location.href = "src/home.html";
      })
    }
  })
};

