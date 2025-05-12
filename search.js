import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore, collection, getDocs, query, where
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase config and Firestore initialization
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

// Load bus stops for a specific city
async function loadBusStops(city) {
  const fromSelect = document.getElementById("pickup");
  const toSelect = document.getElementById("dropoff");

  console.log("Loading bus stops for:", city);
  const q = query(collection(db, "Routes"), where("city", "==", city));
  const querySnapshot = await getDocs(q);

  const busStops = new Set();

  querySnapshot.forEach(doc => {
    const start = doc.data().start;
    const end = doc.data().end;
    if (start) busStops.add(start);
    if (end) busStops.add(end);
  });

  fromSelect.innerHTML = "";
  toSelect.innerHTML = "";

  busStops.forEach(stop => {
    const optionFrom = document.createElement("option");
    optionFrom.value = stop;
    optionFrom.textContent = stop;
    fromSelect.appendChild(optionFrom);

    const optionTo = document.createElement("option");
    optionTo.value = stop;
    optionTo.textContent = stop;
    toSelect.appendChild(optionTo);
  });
}

// Get user's city and load bus stops
async function getCityFromGeoLocation() {
  try {
    const pos = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );
    const { latitude, longitude } = pos.coords;
    console.log(`User's Location: Latitude: ${latitude}, Longitude: ${longitude}`);

    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
    const data = await response.json();

    const city = data.address.city || data.address.state || data.address.county;
    console.log("Detected city:", city);

    await loadBusStops(city);
  } catch (error) {
    console.error("Error getting city from geolocation:", error);
  }
}

// Run when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  await getCityFromGeoLocation();

  document.getElementById("go-btn").addEventListener("click", () => {
    const from = document.getElementById("pickup").value;
    const to = document.getElementById("dropoff").value;

    if (from && to) {
     window.location.href = `result.html?start=${encodeURIComponent(from)}&end=${encodeURIComponent(to)}`;
    } else {
      alert("Please select both locations.");
    }
  });
});
