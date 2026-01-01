import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const provider = new GoogleAuthProvider();

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const rememberMe = document.getElementById("rememberMe");

function clearErrors() {
  emailError.style.display = "none";
  passwordError.style.display = "none";
  emailInput.classList.remove("error");
  passwordInput.classList.remove("error");
}

function showError(input, el, msg) {
  el.innerText = msg;
  el.style.display = "block";
  input.classList.add("error");
}

function setLoading(btn, state) {
  btn.classList.toggle("loading", state);
  btn.disabled = state;
}

/* LOGIN */
window.login = async () => {
  clearErrors();
  const btn = document.getElementById("loginBtn");

  if (!emailInput.value) return showError(emailInput, emailError, "Email required");
  if (!passwordInput.value) return showError(passwordInput, passwordError, "Password required");

  setLoading(btn, true);

  await setPersistence(
    auth,
    rememberMe?.checked
      ? browserLocalPersistence
      : browserSessionPersistence
  );

  signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
    .then(({ user }) => {
      if (!user.emailVerified) {
        signOut(auth);
        showError(emailInput, emailError, "Please verify your email first");
        setLoading(btn, false);
        return;
      }
      location.href = "index.html";
    })
    .catch(() => {
      showError(passwordInput, passwordError, "Invalid credentials");
      setLoading(btn, false);
    });
};

/* SIGNUP + EMAIL VERIFICATION */
window.signup = () => {
  clearErrors();
  const btn = document.getElementById("signupBtn");

  if (passwordInput.value.length < 6)
    return showError(passwordInput, passwordError, "Min 6 characters");

  setLoading(btn, true);

  createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
    .then(({ user }) => {
      sendEmailVerification(user).then(() => {
        alert("Verification email sent. Please verify before login.");
        signOut(auth);
        location.href = "login.html";
      });
    })
    .catch(() => {
      showError(emailInput, emailError, "Email already in use");
      setLoading(btn, false);
    });
};

/* GOOGLE LOGIN */
window.googleLogin = () => {
  signInWithPopup(auth, provider)
    .then(() => location.href = "index.html")
    .catch(alert);
};

/* RESET PASSWORD */
window.resetPassword = () => {
  if (!emailInput.value)
    return showError(emailInput, emailError, "Enter email first");

  sendPasswordResetEmail(auth, emailInput.value)
    .then(() => {
      emailError.style.display = "block";
      emailError.style.color = "green";
      emailError.innerText = "Password reset email sent";
    });
};

/* PASSWORD TOGGLE */
window.togglePassword = () => {
  passwordInput.type =
    passwordInput.type === "password" ? "text" : "password";
};

/* AUTH GUARD */
onAuthStateChanged(auth, user => {
  if (
    !user &&
    !location.pathname.includes("login") &&
    !location.pathname.includes("signup")
  ) {
    location.href = "login.html";
  }
});
