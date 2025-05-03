function initMap() {
    // Default coordinates if geolocation fails
    const defaultCoords = [9.05785, 7.49508]; // Abuja, Nigeria
  
    // Create the map centered at the default coordinates
    const map = L.map('map').setView(defaultCoords, 15);
  
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
  
    // Attempt to get the user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = [
            position.coords.latitude,
            position.coords.longitude,
          ];
  
          // Center map on the user's location
          map.setView(userCoords, 15);
  
          // Add a marker for the user's location
          L.marker(userCoords).addTo(map).bindPopup('You are here!').openPopup();
        },
        () => {
          // Fallback if geolocation fails
          console.warn('Geolocation failed, using default location.');
          L.marker(defaultCoords).addTo(map).bindPopup('Default location').openPopup();
        }
      );
    } else {
      // Fallback if geolocation is not supported
      console.warn('Geolocation is not supported by this browser.');
      L.marker(defaultCoords).addTo(map).bindPopup('Geolocation not supported').openPopup();
    }
  }
  
  
  // Set profile image dynamically if available
  const profileImageUrl = ""; // Replace with dynamic value if you have one
  const imgElement = document.getElementById("profileImage");
  if (profileImageUrl) {
    imgElement.src = profileImageUrl;
  }
  
  initMap(); // Call the map init directly for Leaflet
  document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector('.menu-icon'); // Changed to query by class
    const closeMenu = document.getElementById('close-menu');
    const sideMenu = document.getElementById('side-menu');
  
    if (menuToggle && closeMenu && sideMenu) {
      menuToggle.addEventListener('click', () => {
        sideMenu.classList.add('show');
      });
  
      closeMenu.addEventListener('click', () => {
        sideMenu.classList.remove('show');
      });
    } else {
      console.warn("One or more elements not found: menu-toggle, close-menu, side-menu");
    }
  });
  document.addEventListener("DOMContentLoaded", () => {
    const homeBtn = document.getElementById("home-btn");
    const activityBtn = document.getElementById("activity-btn");
    const profileBtn = document.getElementById("profile-btn");
  
    if (homeBtn) {
      homeBtn.addEventListener("click", () => {
        window.location.href = "home.html";
      });
    }
  
    if (locationBtn) {
      activityBtn.addEventListener("click", () => {
        window.location.href = "activity.html";
      });
    }
  
    if (profileBtn) {
      profileBtn.addEventListener("click", () => {
        window.location.href = "profile.html";
      });
    }
  });
  document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
  
    searchInput.addEventListener("click", () => {
      window.location.href = "search.html"; // Navigate to search page
    });
  });
  