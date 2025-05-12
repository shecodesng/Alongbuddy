// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCbh1J1DILrTp_Pr8VJQ7U66n9kVzZbDuQ",
  authDomain: "alongbuddy2024.firebaseapp.com",
  projectId: "alongbuddy2024",
  storageBucket: "alongbuddy2024.appspot.com",
  messagingSenderId: "920270734316",
  appId: "1:920270734316:web:d3116e1fc237390915b6c9",
  measurementId: "G-SN5JZLL878"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Your existing map initialization function
function initMap() {
  const defaultCoords = [9.05785, 7.49508]; // Abuja
  const map = L.map('map').setView(defaultCoords, 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords = [
          position.coords.latitude,
          position.coords.longitude
        ];
        map.setView(userCoords, 15);
        L.marker(userCoords).addTo(map).bindPopup("You are here!").openPopup();
      },
      () => {
        L.marker(defaultCoords).addTo(map).bindPopup("Default location").openPopup();
      }
    );
  }
}

// Only run when DOM is ready
document.addEventListener("DOMContentLoaded", () => {

  // 🔒 Check user login status
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        document.getElementById("profileName").textContent = userData.name || "No Name";
      } else {
        console.warn("No user data found.");
      }
    } catch (err) {
      console.error("Error loading user data:", err);
    }
  });

  // 🗺️ Initialize the map
  initMap();

  // 📱 Menu toggle
  const menuToggle = document.querySelector(".menu-icon");
  const closeMenu = document.getElementById("close-menu");
  const sideMenu = document.getElementById("side-menu");

  if (menuToggle && closeMenu && sideMenu) {
    menuToggle.addEventListener("click", () => sideMenu.classList.add("show"));
    closeMenu.addEventListener("click", () => sideMenu.classList.remove("show"));
  }

  // 🔘 Navigation buttons
  document.getElementById("home-btn")?.addEventListener("click", () => {
    window.location.href = "home.html";
  });

  document.getElementById("activity-btn")?.addEventListener("click", () => {
    window.location.href = "activity.html";
  });

  document.getElementById("profile-btn")?.addEventListener("click", () => {
    window.location.href = "profile.html";
  });

  document.getElementById("menu-profile-btn")?.addEventListener("click", () => {
    window.location.href = "profile.html";
  });

  // 🔍 Search input
  document.getElementById("searchInput")?.addEventListener("click", () => {
    window.location.href = "search.html";
  });
});

//buddy points
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid); // or user.email if your doc ID is email
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      const points = data.points || 0;

      document.getElementById("pointsDisplay").innerHTML = `
        <img src="assets/group.png" class="icon" /> ${points} Buddy Points
      `;
    } else {
      document.getElementById("pointsDisplay").innerHTML = `
        <img src="assets/group.png" class="icon" /> 0 Buddy Points
      `;
    }
  } else {
    document.getElementById("pointsDisplay").innerHTML = `
      <img src="assets/group.png" class="icon" /> Please log in
    `;
  }
});

//base name update
async function checkBaseName(address) {
  try {
    const response = await fetch(`https://deep-index.moralis.io/api/v2/${address}/resolve`, {
      method: 'GET',
      headers: {
        'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjRhZjI4YjUyLTgxMWQtNGQ2Yi1iOWM1LTk2NmY1MzNlMzUyNiIsIm9yZ0lkIjoiNDQ2MzEwIiwidXNlcklkIjoiNDU5MTkyIiwidHlwZUlkIjoiNzVmMjc5YmUtZTRmZS00MDI4LTk1YTMtOThkMjAyZGMyMGJiIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDY4ODIxMDcsImV4cCI6NDkwMjY0MjEwN30.2RfEpVrcq-n9hf3Ox-KvGX5WjHJXBkI5oeCTsyyzZuY',
        'accept': 'application/json'
      }
    });

    const data = await response.json();

    if (data?.name) {
      showPopup(`🎉 Your Base Name is: <b>${data.name}</b>`);
    } else {
      showBaseNameModal(); // Show modal if name doesn't exist
    }
  } catch (err) {
    console.error("Error fetching base name:", err);
    showPopup("❌ Error fetching Base Name.");
  }
}