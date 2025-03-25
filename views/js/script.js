function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const form = document.getElementById("loginform");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        localStorage.setItem("accessToken", data.accessToken);
      }
    } catch (error) {
      console.log(error);
    }
  });
}

async function getAllWords() {
  let accessToken = localStorage.getItem("accessToken");
  console.log("accessToken", accessToken);
  const accessTokenExpTime = getTokenExpiration(accessToken);
  console.log("accessTokenExpTime:", accessTokenExpTime);
  const currentTime = new Date();
  if (currentTime < accessTokenExpTime) {
    console.log("accessToken faol");
  } else {
    console.log("accessToken vaqti chiqib ketgan");
    accessToken = await refreshToken();
    console.log("new accessToken:", accessToken);
  }
  fetch("http://localhost:3001/api/words", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    mode: "cors",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log("Request failed");
      }
    })
    .then((words) => {
      console.log(words);
      printWords(words.words);
    })
    .catch((error) => {
      console.log("error:", error);
    });
}

function printWords(words) {
  const wordsContainer = document.getElementById("words-list");
  words.forEach((word) => {
    const listItem = document.createElement("li");
    listItem.textContent = word.word;
    wordsContainer.appendChild(listItem);
  });
}

function getTokenExpiration(token) {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  if (decodedToken.exp) {
    return new Date(decodedToken.exp * 1000);
  }
  return null;
}

async function refreshToken() {
  try {
    const response = await fetch("http://localhost:3001/api/users/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    // console.log(data);
    if (data.error && data.error == "jwt expired") {
      console.log("Refresh tokenni ham vaqti chiqib ketgan");
      return window.location.replace("/login");
    }
    console.log("Tokenlar yangilandi");
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.log(error);
  }
}
