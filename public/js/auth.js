import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
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

/* LOGOUT */
window.logout = () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};

/* AUTH STATE (OPTIONAL BUT BEST PRACTICE) */
onAuthStateChanged(auth, user => {
  if (!user && !location.pathname.includes("login")) {
    window.location.href = "login.html";
  }
});
