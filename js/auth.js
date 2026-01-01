import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
    signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* =====================
   ELEMENTS
===================== */
const email = document.getElementById("email");
const password = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

/* =====================
   HELPERS
===================== */
function clearErrors() {
  document.querySelectorAll(".field-alert").forEach(e => {
    e.innerText = "";
    e.style.display = "none";
  });
  document.querySelectorAll("input").forEach(i => i.classList.remove("error"));
}

function showError(input, errorEl, msg) {
  input.classList.add("error");
  errorEl.innerText = msg;
  errorEl.style.display = "block";
}

/* =====================
   LOGIN
===================== */
window.login = async () => {
  clearErrors();

  const remember = document.getElementById("rememberMe")?.checked;
  const btn = document.getElementById("loginBtn");

  if (!email.value.trim())
    return showError(email, emailError, "Email is required");

  if (!password.value)
    return showError(password, passwordError, "Password is required");

  btn.classList.add("loading");

  try {
    await setPersistence(
      auth,
      remember ? browserLocalPersistence : browserSessionPersistence
    );

    const res = await signInWithEmailAndPassword(
      auth,
      email.value.trim(),
      password.value
    );

    /* ✅ CHECK ONLY – DO NOT SEND AGAIN */
    if (!res.user.emailVerified) {
      showError(
        email,
        emailError,
        "Please verify your email before logging in"
      );
      btn.classList.remove("loading");
      return;
    }

    window.location.href = "index.html";

  } catch (err) {
    showError(email, emailError, "Invalid email or password");
    btn.classList.remove("loading");
  }
};

/* =====================
   SIGNUP
===================== */
window.signup = async () => {
  clearErrors();

  const confirmPassword = document.getElementById("confirmPassword");
  const confirmPasswordError =
    document.getElementById("confirmPasswordError");
  const btn = document.getElementById("signupBtn");

  if (!email.value.trim())
    return showError(email, emailError, "Email is required");

  if (password.value.length < 6)
    return showError(
      password,
      passwordError,
      "Password must be at least 6 characters"
    );

  if (password.value !== confirmPassword.value)
    return showError(
      confirmPassword,
      confirmPasswordError,
      "Passwords do not match"
    );

  btn.classList.add("loading");

  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email.value.trim(),
      password.value
    );

    /* ✅ SEND VERIFICATION ONLY ON SIGNUP */
    await sendEmailVerification(userCred.user);

    alert("Verification email sent. Please check your inbox.");
    window.location.href = "login.html";

  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      showError(email, emailError, "Email already registered");
    } else {
      showError(email, emailError, err.message);
    }
    btn.classList.remove("loading");
  }
};

/* =====================
   RESET PASSWORD
===================== */
window.resetPassword = async () => {
  clearErrors();

  if (!email.value.trim())
    return showError(email, emailError, "Enter your email first");

  await sendPasswordResetEmail(auth, email.value.trim());

  emailError.style.display = "block";
  emailError.style.color = "green";
  emailError.innerText = "Password reset email sent";
};

/* LOGOUT */
window.logout = () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};

/* =====================
   TOGGLE PASSWORD
===================== */
window.togglePassword = () => {
  password.type =
    password.type === "password" ? "text" : "password";
};
