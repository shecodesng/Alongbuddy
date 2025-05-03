import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyCbh1J1DILrTp_Pr8VJQ7U66n9kVzZbDuQ",
  authDomain: "alongbuddy2024.firebaseapp.com",
  projectId: "alongbuddy2024",
  storageBucket: "alongbuddy2024.appspot.com", 
  messagingSenderId: "920270734316",
  appId: "1:920270734316:web:d3116e1fc237390915b6c9",
  measurementId: "G-SN5JZLL878"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginForm[0].value;
  const password = loginForm[1].value;


  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Logged in user:", userCredential.user);
    alert("Nice to have you back!");

     // Redirect to the home page on successful login
     window.location.href = 'home.html';  // Make sure 'home.html' is the correct path to your home page
    
  } catch (error) {
    switch (error.code) {
        case "auth/user-not-found":
          alert("Looks like you haven't created your account yet!");
          break;
        case "auth/wrong-password":
          alert("Oops, incorrect password!");
          break;
        case "auth/invalid-email":
          alert("seems like that email address is invalid.");
          break;
        case "auth/invalid-credential":
          alert("Something’s off. Please check your credentials.");
          break;
        default:
          alert("Login failed: " + error.message);
      }
    }
  });
  

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".back-btn").addEventListener("click", () => history.back());

  const googleBtn = document.getElementById("google-login-btn");
  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Google login successful", user);
        alert("Logged in with Google!");
        // Redirect or load next page
      } catch (error) {
        console.error("Google login failed", error);
        alert("Google login failed: " + error.message);
      }
    });
  }
});
