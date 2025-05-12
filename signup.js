import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
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


const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
const auth = getAuth(app); 

const signupForm = document.getElementById("signup-form");


signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = signupForm[0].value;
  const email = signupForm[1].value;
  const password = signupForm[2].value;

  try {
    // Step 1: Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Step 2: Save user info in Firestore under their UID
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email
    });

    console.log('User created and data added to Firestore!');
    alert("We have been expecting you!");

    // Step 3: Redirect
    window.location.href = 'home.html';

  } catch (error) {
    console.error("Error: ", error);
    alert("Sign up failed: " + error.message);
  }
});


document.addEventListener("DOMContentLoaded", function () {
  const backBtn = document.querySelector(".back-btn");

  if (backBtn) {
    backBtn.addEventListener("click", function () {
      history.back();
    });
  }
  
const googleBtn = document.getElementById("google-signup-btn");
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      
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

