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

/* ELEMENTS */
const email = document.getElementById("email");
const password = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

/* HELPERS */
function clearErrors() {
  document.querySelectorAll(".field-alert").forEach(e => e.style.display = "none");
  document.querySelectorAll("input").forEach(i => i.classList.remove("error"));
}

function showError(input, errorEl, msg) {
  input.classList.add("error");
  errorEl.innerText = msg;
  errorEl.style.display = "block";
}

/* LOGIN */
window.login = async () => {
  clearErrors();

  const remember = document.getElementById("rememberMe")?.checked;
  const btn = document.getElementById("loginBtn");

  if (!email.value) return showError(email, emailError, "Email required");
  if (!password.value) return showError(password, passwordError, "Password required");

  btn.classList.add("loading");

  try {
    await setPersistence(auth, remember
      ? browserLocalPersistence
      : browserSessionPersistence
    );

    const res = await signInWithEmailAndPassword(auth, email.value, password.value);

    if (!res.user.emailVerified) {
      await sendEmailVerification(res.user);
      alert("Please verify your email. Verification link sent.");
      btn.classList.remove("loading");
      return;
    }

    location.href = "index.html";

  } catch (err) {
    showError(email, emailError, "Invalid email or password");
    btn.classList.remove("loading");
  }
};

/* SIGNUP */
window.signup = async () => {
  clearErrors();

  const confirmPassword = document.getElementById("confirmPassword");
  const confirmPasswordError = document.getElementById("confirmPasswordError");
  const btn = document.getElementById("signupBtn");

  if (!email.value) return showError(email, emailError, "Email required");
  if (password.value.length < 6)
    return showError(password, passwordError, "Minimum 6 characters");
  if (password.value !== confirmPassword.value)
    return showError(confirmPassword, confirmPasswordError, "Passwords do not match");

  btn.classList.add("loading");

  try {
    const user = await createUserWithEmailAndPassword(auth, email.value, password.value);
    await sendEmailVerification(user.user);

    alert("Account created! Verify your email before login.");
    location.href = "login.html";

  } catch (err) {
    showError(email, emailError, "Email already in use");
    btn.classList.remove("loading");
  }
};

/* RESET */
window.resetPassword = async () => {
  clearErrors();
  if (!email.value) return showError(email, emailError, "Enter email first");

  await sendPasswordResetEmail(auth, email.value);
  emailError.style.display = "block";
  emailError.style.color = "green";
  emailError.innerText = "Reset email sent";
};
/* LOGOUT */
window.logout = () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};

/* TOGGLE PASSWORD */
window.togglePassword = () => {
  password.type = password.type === "password" ? "text" : "password";
};
