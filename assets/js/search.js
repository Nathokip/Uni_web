let map;
let markers = [];
let allHostels = []; // Store data locally for filtering

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    fetchHostels();
});

function initMap() {
    // 1. Initialize Map centered on University (Example coords: Nairobi)
    map = L.map('map').setView([-1.2921, 36.8219], 14);

    // 2. Add OpenStreetMap Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // 3. Add a Circle showing "Walkable Radius" (e.g., 2km)
    L.circle([-1.2921, 36.8219], {
        color: 'blue',
        fillColor: '#30f',
        fillOpacity: 0.1,
        radius: 2000
    }).addTo(map);
}

async function fetchHostels() {
    try {
        // Fetch from backend (Developer 1's work)
        // We use the "nearby" endpoint we built earlier
        const response = await fetch(`${API_BASE_URL}/hostels/nearby?lat=-1.2921&long=36.8219`);
        allHostels = await response.json();

        renderHostels(allHostels);
        addMapMarkers(allHostels);

    } catch (error) {
        console.error("Failed to load data:", error);
        document.getElementById('loading-msg').innerText = "Server is offline. Please try again.";
    }
}

function renderHostels(hostels) {
    const container = document.getElementById('hostel-list');
    
    // Clear existing content (except the filter header)
    // In a real app we'd be more careful, but this works for simple apps
    const loading = document.getElementById('loading-msg');
    if(loading) loading.remove();

    // Remove old cards
    document.querySelectorAll('.hostel-card').forEach(e => e.remove());

    if (hostels.length === 0) {
        container.insertAdjacentHTML('beforeend', '<p>No hostels found.</p>');
        return;
    }

    hostels.forEach(hostel => {
        // Safe access to image or placeholder
        const img = hostel.image_url || 'https://via.placeholder.com/150';
        
        // Create HTML Card
        const html = `
            <div class="hostel-card" onclick="location.href='booking.html?id=${hostel.id}'" onmouseover="highlightMarker(${hostel.id})">
                <img src="${img}" class="card-img" alt="${hostel.name}">
                <div class="card-info">
                    <div class="card-header">
                        <h4>${hostel.name}</h4>
                        <span class="price">${formatCurrency(hostel.price)}</span>
                    </div>
                    <div class="distance-badge">
                        📍 ${(hostel.distance_meters / 1000).toFixed(1)} km away
                    </div>
                    <div class="amenities">
                        ${(hostel.amenities || []).map(a => `<span>${a}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

function addMapMarkers(hostels) {
    // Clear existing markers
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    hostels.forEach(hostel => {
        // Check if lat/long exists
        if (hostel.lat && hostel.long) {
            const marker = L.marker([hostel.lat, hostel.long])
                .addTo(map)
                .bindPopup(`<b>${hostel.name}</b><br>${formatCurrency(hostel.price)}<br><a href="booking.html?id=${hostel.id}">Book Now</a>`);
            
            // Save ID to marker object for interaction
            marker.hostelId = hostel.id; 
            markers.push(marker);
        }
    });
}

function highlightMarker(id) {
    const marker = markers.find(m => m.hostelId === id);
    if (marker) {
        marker.openPopup();
    }
}