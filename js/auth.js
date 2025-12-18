import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const provider = new GoogleAuthProvider();
const getErrorBox = () => document.getElementById("error");

/* LOGIN */
window.login = () => {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;
  const errorBox = getErrorBox();

  signInWithEmailAndPassword(auth, email, password)
    .then(() => window.location.href = "index.html")
    .catch(err => {
      if (errorBox) errorBox.innerText = err.message;
      else alert(err.message);
    });
};

/* SIGNUP */
window.signup = () => {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;
  const errorBox = getErrorBox();

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => window.location.href = "index.html")
    .catch(err => {
      if (errorBox) errorBox.innerText = err.message;
      else alert(err.message);
    });
};

/* GOOGLE LOGIN */
window.googleLogin = () => {
  signInWithPopup(auth, provider)
    .then(() => window.location.href = "index.html")
    .catch(err => alert(err.message));
};

/* 🔑 FORGOT PASSWORD */
window.resetPassword = () => {
  const email = document.getElementById("email")?.value;
  const errorBox = getErrorBox();

  if (!email) {
    errorBox.innerText = "Please enter your email first.";
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      errorBox.style.color = "green";
      errorBox.innerText = "Password reset email sent. Check your inbox.";
    })
    .catch(err => {
      errorBox.style.color = "red";
      errorBox.innerText = err.message;
    });
};

/* LOGOUT */
window.logout = () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};

/* AUTH STATE */
onAuthStateChanged(auth, user => {
  if (!user && !location.pathname.includes("login")) {
    window.location.href = "login.html";
  }
  /* 👁️ TOGGLE PASSWORD VISIBILITY */
/* 👁️ Toggle Password Visibility */
window.togglePassword = () => {
  const input = document.getElementById("password");
  const icon = document.getElementById("eyeIcon");

  if (!input || !icon) return;

  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";

  // Change icon (open / closed eye)
  icon.innerHTML = isHidden
    ? `<path d="M2 12s3 7 10 7c2.1 0 3.9-.6 5.4-1.5L3.5 3.6 2 5l4.3 4.3C4 10.6 2 12 2 12zm10-7c7 0 10 7 10 7s-1.2 2.8-4 4.9L9.1 7.1C10 6.5 11 6 12 6z"/>`
    : `<path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/><circle cx="12" cy="12" r="2.5"/>`;
};


});

