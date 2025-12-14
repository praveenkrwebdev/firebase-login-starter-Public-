import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAmmMXeR4phiAxFLeI_tAA_CftH11Zm9rA",
  authDomain: "stammering-words.firebaseapp.com",
  projectId: "stammering-words",
  storageBucket: "stammering-words.firebasestorage.app",
  messagingSenderId: "921650228054",
  appId: "1:921650228054:web:0f7c8fd85e7dc11f31c4f7"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
