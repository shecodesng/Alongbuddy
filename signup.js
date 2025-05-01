import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCbh1J1DILrTp_Pr8VJQ7U66n9kVzZbDuQ",
  authDomain: "alongbuddy2024.firebaseapp.com",
  projectId: "alongbuddy2024",
  storageBucket: "alongbuddy2024.appspot.com", 
  messagingSenderId: "920270734316",
  appId: "1:920270734316:web:d3116e1fc237390915b6c9",
  measurementId: "G-SN5JZLL878"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore
const auth = getAuth(app); // Initialize Firebase Authentication

const signupForm = document.getElementById("signup-form");

// Handle form submission
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get form values
  const name = signupForm[0].value;
  const email = signupForm[1].value;
  const password = signupForm[2].value;

  try {
    // Create user with email and password using Firebase Authentication
    await createUserWithEmailAndPassword(auth, email, password);

    // Add user data to Firestore
    await addDoc(collection(db, "users"), {
      name: name,
      email: email,
      password: password, // Make sure not to store plain text passwords in production
    });

    console.log('User created and data added to Firestore!');

    // You can redirect or show success message
  } catch (error) {
    console.error("Error: ", error);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const backBtn = document.querySelector(".back-btn");

  if (backBtn) {
    backBtn.addEventListener("click", function () {
      history.back();
    });
  }
  // Google Sign-In
const googleBtn = document.getElementById("google-signup-btn");
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Optional: Add to Firestore
      await addDoc(collection(db, "users"), {
        name: user.displayName,
        email: user.email,
        uid: user.uid
      });

      alert("Signed in with Google!");
      console.log("User:", user);
    } catch (error) {
      console.error("Google sign-in failed", error);
      alert("Google sign-in failed: " + error.message);
    }
  });
}

});

