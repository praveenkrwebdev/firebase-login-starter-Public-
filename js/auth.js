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

/* =======================
   PROVIDER
======================= */
const provider = new GoogleAuthProvider();

/* =======================
   ELEMENTS
======================= */
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

/* =======================
   ERROR HELPERS
======================= */
function clearErrors() {
  if (emailError) emailError.style.display = "none";
  if (passwordError) passwordError.style.display = "none";

  emailInput?.classList.remove("error");
  passwordInput?.classList.remove("error");
}

function showError(input, errorEl, message) {
  if (!input || !errorEl) return;

  errorEl.innerText = message;
  errorEl.style.display = "block";
  input.classList.add("error");
}

/* =======================
   LOGIN
======================= */
window.login = () => {
  clearErrors();

  const email = emailInput?.value.trim();
  const password = passwordInput?.value;

  if (!email) {
    showError(emailInput, emailError, "Email is required");
    return;
  }

  if (!password) {
    showError(passwordInput, passwordError, "Password is required");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch(err => {
      if (err.code.includes("email")) {
        showError(emailInput, emailError, err.message);
      } else if (err.code.includes("password")) {
        showError(passwordInput, passwordError, err.message);
      }
    });
};

/* =======================
   SIGNUP
======================= */
window.signup = () => {
  clearErrors();

  const email = emailInput?.value.trim();
  const password = passwordInput?.value;

  if (!email) {
    showError(emailInput, emailError, "Email is required");
    return;
  }

  if (!password || password.length < 6) {
    showError(
      passwordInput,
      passwordError,
      "Password must be at least 6 characters"
    );
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch(err => {
      if (err.code.includes("email")) {
        showError(emailInput, emailError, err.message);
      } else {
        showError(passwordInput, passwordError, err.message);
      }
    });
};

/* =======================
   GOOGLE LOGIN
======================= */
window.googleLogin = () => {
  signInWithPopup(auth, provider)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch(err => alert(err.message));
};

/* =======================
   FORGOT PASSWORD
======================= */
window.resetPassword = () => {
  clearErrors();

  const email = emailInput?.value.trim();

  if (!email) {
    showError(emailInput, emailError, "Enter your email to reset password");
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      emailError.style.display = "block";
      emailError.style.color = "green";
      emailError.innerText = "Password reset email sent. Check your inbox.";
    })
    .catch(err => {
      showError(emailInput, emailError, err.message);
    });
};

/* =======================
   LOGOUT
======================= */
window.logout = () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};

/* =======================
   AUTH GUARD
======================= */
onAuthStateChanged(auth, user => {
  if (!user && !location.pathname.includes("login")) {
    window.location.href = "login.html";
  }
});

/* =======================
   UI HELPERS
======================= */
window.togglePassword = () => {
  if (!passwordInput) return;
  passwordInput.type =
    passwordInput.type === "password" ? "text" : "password";
};

emailInput?.addEventListener("input", clearErrors);
passwordInput?.addEventListener("input", clearErrors);
