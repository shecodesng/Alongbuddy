document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = document.getElementById("close-menu");
    const sideMenu = document.getElementById("side-menu");
  
    // Wallet connection logic
    const walletBtn = document.getElementById("wallet-btn");
    let walletConnected = false;
  
    if (walletBtn) {
      walletBtn.addEventListener("click", () => {
        if (!walletConnected) {
          walletBtn.textContent = "Daniel.base.eth (20 BASE)";
          walletConnected = true;
        } else {
          alert("Wallet already connected.");
        }
      });
    }
  
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
  
    // Navigation buttons
    const homeBtn = document.getElementById("home-btn");
    const activityBtn = document.getElementById("activity-btn");
    const profileBtn = document.getElementById("profile-btn");
  
    if (homeBtn) {
      homeBtn.addEventListener("click", () => {
        window.location.href = "home.html";
      });
    }
  
    if (activityBtn) {
      activityBtn.addEventListener("click", () => {
        window.location.href = "activity.html";
      });
    }
  
    if (profileBtn) {
      profileBtn.addEventListener("click", () => {
        window.location.href = "profile.html";
      });
    }

    const menuProfileBtn = document.getElementById("menu-profile-btn");

if (menuProfileBtn) {
  menuProfileBtn.addEventListener("click", () => {
    window.location.href = "profile.html";
  });
}

  
    // Profile image
    const profileImageUrl = ""; // Replace with dynamic value if available
    const imgElement = document.getElementById("profileImage");
    if (profileImageUrl && imgElement) {
      imgElement.src = profileImageUrl;
    }
  });
  