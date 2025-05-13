// === Firebase Imports ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// === Firebase Config ===
const firebaseConfig = {
  apiKey: "AIzaSyCbh1J1DILrTp_Pr8VJQ7U66n9kVzZbDuQ",
  authDomain: "alongbuddy2024.firebaseapp.com",
  projectId: "alongbuddy2024",
  storageBucket: "alongbuddy2024.appspot.com",
  messagingSenderId: "920270734316",
  appId: "1:920270734316:web:d3116e1fc237390915b6c9",
  measurementId: "G-SN5JZLL878"
};

// === Menu Toggle ===
const menuToggle = document.getElementById("menu-toggle");
const closeMenu = document.getElementById("close-menu");
const sideMenu = document.getElementById("side-menu");


// === Initialize Firebase ===
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let currentUser = null;

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

// === Navigation Buttons ===
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

// === Auth State & Profile Population ===
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUser = user;

  try {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      document.getElementById("profileName").textContent = userData.name || currentUser.displayName || "No Name";
      document.getElementById("profileEmail").textContent = userData.email || currentUser.email || "No Email";
      // Handle other profile data like handle and points as well if you have them
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
});

// Selecting the elements for the modal
const editProfileBtn = document.getElementById("editProfileBtn");
const editModal = document.getElementById("editModal");
const closeEditModal = document.getElementById("closeEditModal");
const confirmEditBtn = document.getElementById("confirmEditBtn");
const newNameInput = document.getElementById("newNameInput");
const nameErrorMsg = document.getElementById("nameErrorMsg");

// Handle Edit Profile button click
editProfileBtn?.addEventListener("click", () => {
  // Get the current profile name (you might need to update this based on your actual data)
  const currentName = document.getElementById("profileName").textContent || "No Name";
  newNameInput.value = currentName;

  // Hide any error messages
  nameErrorMsg.style.display = "none";

  // Show the modal
  editModal.classList.remove("hidden");
});

// Close the modal when clicking the close button
closeEditModal?.addEventListener("click", () => {
  editModal.classList.add("hidden");
});

// Confirm the name change when clicking Save
confirmEditBtn?.addEventListener("click", async () => {
  const newName = newNameInput.value.trim();
  
  if (!newName) {
    nameErrorMsg.textContent = "Name cannot be empty.";
    nameErrorMsg.style.display = "block";
    return;
  }

  try {
    // If the new name is different, update it
    if (newName !== currentUser.name) {
      // Assuming `currentUser` is the logged-in user object from Firebase Auth
      await setDoc(doc(db, "users", currentUser.uid), { name: newName }, { merge: true });

      // Update the profile name on the page
      document.getElementById("profileName").textContent = newName;

      // Hide the modal after saving the name
      editModal.classList.add("hidden");
    } else {
      nameErrorMsg.textContent = "This is already your current name.";
      nameErrorMsg.style.display = "block";
    }
  } catch (error) {
    console.error("Error updating name:", error);
    nameErrorMsg.textContent = "Something went wrong. Please try again.";
    nameErrorMsg.style.display = "block";
  }
});

// === Wallet Connection Logic ===
let provider; // Global reference to the connected provider

// WalletConnect options
const providerOptions = {
  walletconnect: {
    package: window.WalletConnectProvider.default,
    options: {
      infuraId: "c7ab82e3eb1f421a845e2b3f06c5c6d0",
    },
  },
};

// Web3Modal setup
const web3Modal = new window.Web3Modal.default({
  cacheProvider: true, // keep connection info for disconnect
  providerOptions,
});

// Connect Wallet
document.getElementById("walletbuttonBtn")?.addEventListener("click", async () => {
  try {
    provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];

    console.log("Connected Address:", address);
    showPopup("✅ Connected successfully.");
    toggleWalletButtons(true);

    checkBaseName(address);

    provider.on("disconnect", () => {
      showPopup("🔌 Wallet disconnected.");
      toggleWalletButtons(false);
    });
  //store data in firebase
// After getting address:
const auth = getAuth();
const user = auth.currentUser;

if (user) {
  const userRef = doc(db, "users", user.uid); // or user.email if you're using email as the doc ID
  await setDoc(userRef, { walletAddress: address }, { merge: true });
}

  } catch (err) {
    console.error("Connection error:", err);
    showPopup("❌ Connection failed. Please try again.");
  }
});

// Proper Disconnect
document.getElementById("disconnectBtn")?.addEventListener("click", async () => {
  try {
    if (provider?.disconnect) {
      // For WalletConnect and similar providers
      await provider.disconnect();
    }

    // For WalletConnect v2: manually close and reset the session
    if (provider?.wc?.uri) {
      provider.wc = null;
    }

    await web3Modal.clearCachedProvider();
    provider = null;

    // Delete wallet address from Firebase
    const auth = getAuth(); // Make sure Firebase Auth is imported
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { walletAddress: "" }, { merge: true });
    }

    toggleWalletButtons(false);
    showPopup("🔌 Wallet disconnected successfully.");
  } catch (err) {
    console.error("Disconnect error:", err);
    showPopup("❌ Error disconnecting wallet.");
  }
});



// Toggle visibility of buttons
function toggleWalletButtons(connected) {
  document.getElementById("walletbuttonBtn").style.display = connected ? "none" : "block";
  document.getElementById("disconnectBtn").style.display = connected ? "block" : "none";
}

// Popup message function
function showPopup(message) {
  const statusPopup = document.getElementById('connectionPopup');
  if (statusPopup) {
    statusPopup.innerHTML = message;
    statusPopup.style.display = 'block';
    clearTimeout(statusPopup.timeoutId);
    statusPopup.timeoutId = setTimeout(() => {
      statusPopup.style.display = 'none';
    }, 4000);
  }
}

// Base Name check using fetch
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

function showBaseNameModal() {
  const modal = document.getElementById('baseNameModal');
  if (modal) modal.style.display = 'flex';
}

document.getElementById("closeBaseNameModal")?.addEventListener("click", () => {
  const modal = document.getElementById("baseNameModal");
  if (modal) modal.style.display = "none";
});

//Buddy points 
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

