document.addEventListener("DOMContentLoaded", () => {
    const fromInput = document.getElementById("pickup");
    const toInput = document.getElementById("dropoff");
  
    // Function to convert coordinates to a more detailed address (reverse geocoding)
    function getAddressFromCoordinates(lat, lon) {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&zoom=18`; // Added zoom for more details
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data && data.address) {
            const address = data.address;
            let formattedAddress = '';
  
            // Prioritize road and house number
            if (address.house_number) formattedAddress += `${address.house_number} `;
            if (address.road) formattedAddress += `${address.road}, `;
            if (address.suburb) formattedAddress += `${address.suburb}, `;
            if (address.city) formattedAddress += `${address.city}, `;
            if (address.country) formattedAddress += `${address.country}`;
  
            // If the address is still too general, display a more specific message
            if (!formattedAddress) {
              formattedAddress = "Could not retrieve detailed address";
            }
  
            fromInput.value = formattedAddress; // Set the input to the detailed address
          } else {
            fromInput.placeholder = "Could not retrieve address";
          }
        })
        .catch(error => {
          fromInput.placeholder = "Error fetching address";
          console.error("Error:", error);
        });
    }
  
    // Get current location with high accuracy and update the "Your Location" input
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getAddressFromCoordinates(latitude, longitude); // Convert coordinates to address
        },
        () => {
          fromInput.placeholder = "Could not detect location";
        },
        {
          enableHighAccuracy: true, // Request high accuracy
          timeout: 10000, // Timeout after 10 seconds
          maximumAge: 0 // Don't use cached position
        }
      );
    } else {
      fromInput.placeholder = "Geolocation not supported";
    }
  
    // Handle "Go" button click event for the destination
    document.getElementById("go-btn").addEventListener("click", () => {
      const from = fromInput.value;
      const to = toInput.value;
  
      if (from && to) {
        alert(`Searching directions from:\n${from}\nto:\n${to}`);
        // Add your logic to load route or directions here
      } else {
        alert("Please enter both locations.");
      }
    });
  });
  