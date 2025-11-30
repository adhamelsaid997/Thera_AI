// 🌗 Toggle Theme
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

// 💬 Chat
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

function addMessage(content, sender) {
  const msg = document.createElement("div");
  msg.classList.add(sender === "user" ? "user-message" : "bot-message");
  msg.textContent = content;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = userInput.value.trim();
  if (text === "") return;

  addMessage(text, "user");
  userInput.value = "";

  // 🧠 إرسال النص إلى السيرفر المحلي Flask
  fetch("https://thu-metaphytic-edna.ngrok-free.dev/chat", { // هنا اكتب عنوان السيرفر المحلي بتاعك
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: text }),
  })
    .then((response) => response.json())
    .then((data) => {
      addMessage( data.reply, "bot");
    })
    .catch((error) => {
      console.error("Error:", error);
      addMessage(" Server not responding. Make sure Flask is running.", "bot");
    });
}

// 👤 Dropdown Menu
const userAvatar = document.getElementById("user-avatar");
const dropdownMenu = document.getElementById("dropdown-menu");
let isLoggedIn = false;

userAvatar.addEventListener("click", () => {
  dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
});

// Close dropdown if clicked outside
window.addEventListener("click", (e) => {
  if (!userAvatar.contains(e.target) && !dropdownMenu.contains(e.target)) {
    dropdownMenu.style.display = "none";
  }
});

// 👤 Login / Signup functionality
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");

loginBtn.addEventListener("click", () => {
  const name = prompt("Enter your name:");
  if (name && name.trim() !== "") {
    const firstLetter = name.trim().charAt(0).toUpperCase();
    userAvatar.innerHTML = `<div class="dynamic-avatar">${firstLetter}</div>`;
    isLoggedIn = true;
    dropdownMenu.innerHTML = `<button id="logout-btn">Logout</button>`;
    dropdownMenu.style.display = "none";
  }
});

signupBtn.addEventListener("click", () => {
  alert("Signup form coming soon!");
});

document.addEventListener("click", (e) => {
  if (e.target.id === "logout-btn") {
    userAvatar.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="28" height="28">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zM12 14.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
      </svg>`;
    dropdownMenu.innerHTML = `
      <button id="login-btn">Login</button>
      <button id="signup-btn">Sign Up</button>`;
    isLoggedIn = false;
  }
});
