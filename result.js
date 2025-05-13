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
  initMap();
  loadRouteSteps();



  // 🔘 Navigation buttons
  document.getElementById("home-btn")?.addEventListener("click", () => {
    window.location.href = "home.html";
  });

  document.getElementById("activity-btn")?.addEventListener("click", () => {
    window.location.href = "search.html";
  });

  document.getElementById("profile-btn")?.addEventListener("click", () => {
    window.location.href = "profile.html";
  });

  document.getElementById("menu-profile-btn")?.addEventListener("click", () => {
    window.location.href = "profile.html";
  });
  document.getElementById("menu-logout-btn")?.addEventListener("click", () => {
    window.location.href = "login.html";
  });
});

// === Menu Toggle ===
const menuToggle = document.getElementById("menu-toggle");
const closeMenu = document.getElementById("close-menu");
const sideMenu = document.getElementById("side-menu");

// === Menu visibility ===
if (menuToggle && closeMenu && sideMenu) {
  menuToggle.addEventListener('click', () => {
    sideMenu.classList.remove('hidden');
    sideMenu.classList.add('show');
  });
  
  closeMenu.addEventListener('click', () => {
    sideMenu.classList.remove('show');
    sideMenu.classList.add('hidden');
  });
  
}

import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Retrieve the parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
const start = urlParams.get("start")?.trim().toLowerCase();
const end = urlParams.get("end")?.trim().toLowerCase();


console.log("Start:", start, "End:", end);

// Utility: Get image filename from step type
function getStepIcon(type) {
  const map = {
    bike: "Bike.png",
    walking: "Walking.png",
    bus: "bus.png",
    keke: "Keke.png",
    car: "assets/Images/Car.png",
  };

  // Use default if type is missing or not a string
  if (!type || typeof type !== "string") {
    return "assets/Images/Walking.png";
  }

  // Match against the map
  const icon = map[type.toLowerCase()];
  return `assets/Images/${icon || 'Walking.png'}`;
}



// Step card renderer
function renderStepCards(steps) {
  const container = document.querySelector('.step-card-container');
  container.innerHTML = ""; // Clear old cards

  steps.forEach((step) => {
    const card = document.createElement('div');
    card.classList.add('step-card');

    card.innerHTML = `
      <div class="step-icon">
        <img src="${getStepIcon(step.Type)}" alt="Step Icon" />
      </div>
      <div class="step-info">
        <p class="step-text">${step.Instruction}</p>
        <p class="step-time">
          <img src="assets/Images/clock.png" alt="Clock Icon" />
          ${step.Time || step.time}
        </p>
      </div>
    `;

    container.appendChild(card);
  });
}

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    start: params.get("start"),
    end: params.get("end")
  };
}


// Main logic: fetch steps based on start and end
async function loadRouteSteps() {
  const start = urlParams.get("start");
  const end = urlParams.get("end");

  if (!start || !end) {
    console.warn("Start or End not provided");
    return;
  }

  const routesRef = collection(db, "Routes");
  const q = query(routesRef, where("start", "==", start.trim()),
  where("end", "==", end.trim()));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const routeData = querySnapshot.docs[0].data();
    renderStepCards(routeData.Steps);
  } else {
    alert("No route found for selected start and end points.");
  }
  if (!querySnapshot.empty) {
  const routeData = querySnapshot.docs[0].data();
  console.log("Route data:", routeData); // 🔍 Confirm it has a Steps array
  renderStepCards(routeData.Steps);
} else {
  console.warn("No matching route found.");
}
}


