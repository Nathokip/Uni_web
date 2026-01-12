// hostels.js - Search Algorithm and Hostel Management
document.addEventListener('DOMContentLoaded', function() {
    // Initialize
    fetchHostels();
    initSearchAlgorithm();
    initFilters();
    initPagination();
    
    // --- NEW: Global Event Listener (Event Delegation) ---
    // This fixes the unresponsive button issue
    const grid = document.getElementById('hostelsGrid');
    if(grid) {
        grid.addEventListener('click', function(e) {
            // Check if the clicked element (or its parent) has the class 'btn-book'
            const bookBtn = e.target.closest('.btn-book');
            const detailsBtn = e.target.closest('.btn-details');

            if (bookBtn) {
                const id = parseInt(bookBtn.getAttribute('data-id'));
                console.log("Book Button Clicked for ID:", id); // Debugging Log
                bookHostel(id);
            }
            
            if (detailsBtn) {
                const id = parseInt(detailsBtn.getAttribute('data-id'));
                viewHostelDetails(id);
            }
        });
    }
});

// Global Variables
let hostelsData = []; // Starts empty, fills from Database
let currentHostels = [];
let currentPage = 1;
const hostelsPerPage = 6;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize
    fetchHostels(); // Fetch data first
    initSearchAlgorithm();
    initFilters();
    initPagination();
});

// --- NEW: Fetch Data from Database ---
async function fetchHostels() {
    const loadingState = document.getElementById('loadingState');
    const hostelsGrid = document.getElementById('hostelsGrid');
    
    // Show loading spinner
    if(loadingState) loadingState.style.display = 'block';
    if(hostelsGrid) hostelsGrid.innerHTML = '';

    try {
        // Fetch from PHP backend
        const response = await fetch('../backend/get_hostels.php');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        // Update global data
        hostelsData = data;
        currentHostels = [...hostelsData];
        
        // Update UI
        displayHostels(currentHostels);
        updateResultsCount();
        
    } catch (error) {
        console.error('Error fetching hostels:', error);
        if(hostelsGrid) {
            hostelsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;">
                    <i class="fas fa-exclamation-circle fa-2x" style="margin-bottom: 1rem; color: #e74c3c;"></i>
                    <p>Failed to load hostels. Please make sure the backend is running.</p>
                </div>
            `;
        }
    } finally {
        if(loadingState) loadingState.style.display = 'none';
    }
}

// Display hostels in grid
function displayHostels(hostels) {
    const hostelsGrid = document.getElementById('hostelsGrid');
    const noResults = document.getElementById('noResults');
    
    if (!hostelsGrid) return;

    if (hostels.length === 0) {
        if(noResults) noResults.style.display = 'block';
        hostelsGrid.style.display = 'none';
        return;
    }
    
    if(noResults) noResults.style.display = 'none';
    hostelsGrid.style.display = 'grid';
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * hostelsPerPage;
    const endIndex = startIndex + hostelsPerPage;
    const paginatedHostels = hostels.slice(startIndex, endIndex);
    
    // Create hostel cards
    hostelsGrid.innerHTML = paginatedHostels.map(hostel => createHostelCard(hostel)).join('');
    
    // Add event listeners
    addHostelCardListeners();
}

// Create hostel card HTML
function createHostelCard(hostel) {
    // Safely handle missing or numeric data
    const price = Number(hostel.price) || 0;
    const originalPrice = Number(hostel.originalPrice) || (price + 2000); // Fallback logic
    const savings = originalPrice - price;
    const discount = hostel.discount || Math.round((savings / originalPrice) * 100);
    
    const roommateOption = hostel.roommateOption || 'share';
    const roommateIcon = roommateOption === 'alone' ? 'fa-user' : 'fa-users';
    const rating = Number(hostel.rating) || 4.5;
    const reviews = hostel.reviews || 0;
    const stars = generateStarRating(rating);
    
    // Ensure images is an array
    let images = hostel.images;
    if (typeof images === 'string') {
        try { images = JSON.parse(images); } catch(e) { images = ['assets/images/placeholder.jpg']; }
    }
    if (!Array.isArray(images) || images.length === 0) images = ['assets/images/placeholder.jpg'];

    // Ensure amenities is an array
    let amenities = hostel.amenities || ["WiFi", "Security"];
    
    return `
        <div class="hostel-card" data-id="${hostel.id}">
            <div class="discount-badge">${discount}% off</div>
            <div class="hostel-images">
                <div class="image-slider" id="slider-${hostel.id}">
                    ${images.map(img => `<img src="${img}" alt="${hostel.name}" onerror="this.src='assets/images/placeholder.jpg'">`).join('')}
                </div>
                ${images.length > 1 ? `
                    <div class="image-nav" id="nav-${hostel.id}">
                        ${images.map((_, i) => `<div class="image-dot ${i === 0 ? 'active' : ''}" data-slide="${i}"></div>`).join('')}
                    </div>
                ` : ''}
            </div>
            
            <div class="hostel-info">
                <div class="hostel-header">
                    <div>
                        <h3 class="hostel-title">${hostel.name}</h3>
                        <p class="hostel-location">
                            <i class="fas fa-map-marker-alt"></i> ${hostel.location}
                        </p>
                    </div>
                    ${hostel.verified ? '<span class="verified-badge"><i class="fas fa-check-circle"></i> Verified</span>' : ''}
                </div>
                
                <div class="hostel-price">
                    <span class="current-price">KES ${price.toLocaleString()}</span>
                    <span class="original-price">KES ${originalPrice.toLocaleString()}</span>
                    <span class="save-badge">Save KES ${savings.toLocaleString()}</span>
                </div>
                
                <div class="hostel-meta">
                    <span class="roommate-tag">
                        <i class="fas ${roommateIcon}"></i> ${roommateOption === 'alone' ? 'Stay Alone' : 'Share Room'}
                    </span>
                    <div class="rating">
                        ${stars}
                        <span>${rating} (${reviews})</span>
                    </div>
                </div>
                
                <div class="amenities-preview">
                    ${amenities.slice(0, 3).map(amenity => 
                        `<span class="amenity-tag"><i class="fas fa-check"></i> ${amenity}</span>`
                    ).join('')}
                    ${amenities.length > 3 ? 
                        `<span class="amenity-tag">+${amenities.length - 3} more</span>` : ''
                    }
                </div>
                
                <div class="card-actions">
                    <button class="btn btn-primary btn-book" data-id="${hostel.id}">
                        <i class="fas fa-calendar-check"></i> Book Now
                    </button>
                    <button class="btn btn-outline btn-details" data-id="${hostel.id}">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Generate star rating
function generateStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Add event listeners to hostel cards
function addHostelCardListeners() {
    // Book Now buttons
    document.querySelectorAll('.btn-book').forEach(button => {
        button.addEventListener('click', function() {
            const hostelId = parseInt(this.getAttribute('data-id'));
            bookHostel(hostelId);
        });
    });
    
    // View Details buttons
    document.querySelectorAll('.btn-details').forEach(button => {
        button.addEventListener('click', function() {
            const hostelId = parseInt(this.getAttribute('data-id'));
            viewHostelDetails(hostelId);
        });
    });
    
    // Image sliders
    initImageSliders();
}

// Initialize image sliders
function initImageSliders() {
    document.querySelectorAll('.hostel-images').forEach(container => {
        const slider = container.querySelector('.image-slider');
        const dots = container.querySelectorAll('.image-dot');
        
        if (!slider || !dots.length) return;
        
        let currentSlide = 0;
        let slideInterval;

        const startSlide = () => {
            slideInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % dots.length;
                updateSlider(slider, dots, currentSlide);
            }, 5000);
        };
        
        startSlide();
        
        // Click on dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateSlider(slider, dots, currentSlide);
                clearInterval(slideInterval);
                startSlide(); // Restart timer after manual click
            });
        });
        
        // Pause on hover
        container.addEventListener('mouseenter', () => clearInterval(slideInterval));
        container.addEventListener('mouseleave', startSlide);
    });
}

function updateSlider(slider, dots, slideIndex) {
    if (!slider || !dots) return;
    slider.style.transform = `translateX(-${slideIndex * 100}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    if(dots[slideIndex]) dots[slideIndex].classList.add('active');
}

// SEARCH ALGORITHM
function initSearchAlgorithm() {
    const searchInput = document.getElementById('locationSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            if (searchTerm.length >= 2) {
                performSearch(searchTerm);
            } else if (searchTerm.length === 0) {
                resetSearch();
            }
        });
    }
    
    // Popular locations
    document.querySelectorAll('.location-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const location = this.getAttribute('data-location');
            const searchBox = document.getElementById('locationSearch');
            if(searchBox) {
                searchBox.value = location;
                performSearch(location.toLowerCase());
            }
        });
    });
}

function performSearch(searchTerm) {
    // Advanced search algorithm
    const filteredHostels = hostelsData.filter(hostel => {
        // Search in multiple fields
        const searchFields = [
            (hostel.name || '').toLowerCase(),
            (hostel.location || '').toLowerCase(),
            (hostel.description || '').toLowerCase()
        ];
        
        // Check if search term appears in any field
        return searchFields.some(field => field.includes(searchTerm));
    });
    
    currentHostels = filteredHostels;
    currentPage = 1;
    displayHostels(currentHostels);
    updateResultsCount();
}

function resetSearch() {
    currentHostels = [...hostelsData];
    currentPage = 1;
    displayHostels(currentHostels);
    updateResultsCount();
}

// FILTERS
function initFilters() {
    const priceSlider = document.getElementById('priceSlider');
    const maxPriceDisplay = document.getElementById('maxPrice');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const sortSelect = document.getElementById('sortBy');
    
    if (priceSlider) {
        priceSlider.addEventListener('input', function() {
            if(maxPriceDisplay) maxPriceDisplay.textContent = parseInt(this.value).toLocaleString();
        });
    }
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetAllFilters);
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortHostels(this.value);
        });
    }
    
    // Rating filter
    document.querySelectorAll('.rating-filter .stars i').forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            filterByRating(rating);
        });
    });
    
    // Clear all filters button
    const clearBtn = document.getElementById('clearAllFilters');
    if(clearBtn) clearBtn.addEventListener('click', resetAllFilters);
}

function applyFilters() {
    const slider = document.getElementById('priceSlider');
    const maxPrice = slider ? parseInt(slider.value) : 20000;
    
    const roommateInput = document.querySelector('input[name="roommate"]:checked');
    const roommateOption = roommateInput ? roommateInput.value : 'any';
    
    let filteredHostels = hostelsData.filter(hostel => {
        // Price filter
        if (Number(hostel.price) > maxPrice) return false;
        
        // Roommate filter
        if (roommateOption !== 'any' && hostel.roommateOption !== roommateOption) {
            return false;
        }
        
        return true;
    });
    
    currentHostels = filteredHostels;
    currentPage = 1;
    displayHostels(currentHostels);
    updateResultsCount();
}

function filterByRating(minRating) {
    const filteredHostels = hostelsData.filter(hostel => Number(hostel.rating) >= minRating);
    
    currentHostels = filteredHostels;
    currentPage = 1;
    displayHostels(currentHostels);
    updateResultsCount();
}

function sortHostels(sortBy) {
    let sortedHostels = [...currentHostels];
    
    switch(sortBy) {
        case 'price-low':
            sortedHostels.sort((a, b) => Number(a.price) - Number(b.price));
            break;
        case 'price-high':
            sortedHostels.sort((a, b) => Number(b.price) - Number(a.price));
            break;
        case 'rating':
            sortedHostels.sort((a, b) => Number(b.rating) - Number(a.rating));
            break;
        case 'newest':
            sortedHostels.sort((a, b) => b.id - a.id);
            break;
        default:
            // Featured (original order - usually by ID in fetch)
            break;
    }
    
    currentHostels = sortedHostels;
    displayHostels(currentHostels);
}

function resetAllFilters() {
    // Reset price slider
    const slider = document.getElementById('priceSlider');
    if(slider) {
        slider.value = 20000;
        const maxDisplay = document.getElementById('maxPrice');
        if(maxDisplay) maxDisplay.textContent = '20,000';
    }
    
    // Reset roommate selection
    const anyRoommate = document.querySelector('input[name="roommate"][value="any"]');
    if(anyRoommate) anyRoommate.checked = true;
    
    // Reset search
    const searchBox = document.getElementById('locationSearch');
    if(searchBox) searchBox.value = '';
    
    // Reset rating text
    const ratingText = document.querySelector('.rating-text');
    if(ratingText) ratingText.textContent = '4+ stars';
    
    // Reset sort
    const sortBox = document.getElementById('sortBy');
    if(sortBox) sortBox.value = 'featured';
    
    // Reset display
    currentHostels = [...hostelsData];
    currentPage = 1;
    displayHostels(currentHostels);
    updateResultsCount();
}

function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    const totalHostels = document.getElementById('totalHostels');
    
    if (resultsCount) {
        resultsCount.textContent = currentHostels.length;
    }
    
    if (totalHostels) {
        totalHostels.textContent = hostelsData.length;
    }
}

// PAGINATION
function initPagination() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageNumbers = document.querySelectorAll('.page-number');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', goToPreviousPage);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', goToNextPage);
    }
    
    pageNumbers.forEach(number => {
        number.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                const val = parseInt(this.textContent);
                if(!isNaN(val)) goToPage(val);
            }
        });
    });
}

function goToPreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayHostels(currentHostels);
        updatePaginationUI();
    }
}

function goToNextPage() {
    const totalPages = Math.ceil(currentHostels.length / hostelsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayHostels(currentHostels);
        updatePaginationUI();
    }
}

function goToPage(page) {
    currentPage = page;
    displayHostels(currentHostels);
    updatePaginationUI();
}

function updatePaginationUI() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageNumbers = document.querySelectorAll('.page-number');
    const totalPages = Math.max(1, Math.ceil(currentHostels.length / hostelsPerPage));
    
    // Update previous button
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    
    // Update next button
    if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages;
    }
    
    // Update page numbers (Simple Logic)
    pageNumbers.forEach(number => {
        number.classList.remove('active');
        if (parseInt(number.textContent) === currentPage) {
            number.classList.add('active');
        }
    });
}

// BOOKING & DETAILS
function bookHostel(hostelId) {
    // Check if user is logged in
    // In a real app, check session or token. Here we check if the flag is in localStorage
    // OR we just let the PHP backend reject the request if not logged in.
    
    // Show booking modal or redirect to booking page
    const hostel = hostelsData.find(h => Number(h.id) === hostelId);
    if (hostel) {
        showBookingModal(hostel);
    }
}

function viewHostelDetails(hostelId) {
    // Redirect to hostel details page
    window.location.href = `hostel-details.html?id=${hostelId}`;
}

function showBookingModal(hostel) {
    const modal = document.getElementById('quickBookingModal');
    // FIX: Target the container correctly
    const bookingFormContainer = document.getElementById('bookingForm'); 
    
    if (!modal || !bookingFormContainer) return;
    
    // 1. Render the Booking Form HTML
    bookingFormContainer.innerHTML = `
        <div class="booking-summary">
            <h4 style="color: #2563eb; margin-bottom: 5px;">${hostel.name}</h4>
            <p style="color: #666; font-size: 0.9rem; margin-bottom: 15px;">
                <i class="fas fa-map-marker-alt"></i> ${hostel.location}
            </p>
            <div class="price-breakdown" style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <div class="price-item" style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>Monthly Rent:</span>
                    <span>KES ${parseInt(hostel.price).toLocaleString()}</span>
                </div>
                <div class="price-item total" style="display: flex; justify-content: space-between; font-weight: bold; color: #1e293b; border-top: 1px solid #e2e8f0; padding-top: 5px; margin-top: 5px;">
                    <span>Total First Payment:</span>
                    <span id="displayTotal">KES ${parseInt(hostel.price).toLocaleString()}</span>
                </div>
            </div>
        </div>
        
        <div id="bookingMsg" style="display:none; padding: 10px; border-radius: 5px; margin-bottom: 10px; text-align: center;"></div>

        <form id="quickBookingForm">
            <input type="hidden" name="hostel_id" value="${hostel.id}">
            <input type="hidden" name="hostel_name" value="${hostel.name}">
            <input type="hidden" name="price" value="${hostel.price}">

            <div class="form-group">
                <label for="moveInDate">Move-in Date</label>
                <input type="date" id="moveInDate" name="move_in_date" class="form-control" required>
            </div>
            
            <div class="form-group">
                <label for="duration">Duration (Months)</label>
                <select id="duration" name="duration" class="form-control">
                    <option value="1">1 Month</option>
                    <option value="3">3 Months</option>
                    <option value="4">1 Semester (4 Months)</option>
                    <option value="6">6 Months</option>
                    <option value="12">1 Year</option>
                </select>
            </div>
            
            <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 1rem;">
                <i class="fas fa-lock"></i> Confirm Booking
            </button>
        </form>
    `;
    
    // 2. Dynamic Price Calculation
    const durationSelect = document.getElementById('duration');
    const totalDisplay = document.getElementById('displayTotal');
    const basePrice = parseInt(hostel.price);
    
    durationSelect.addEventListener('change', function() {
        const months = parseInt(this.value);
        const total = months * basePrice;
        totalDisplay.textContent = `KES ${total.toLocaleString()}`;
    });

    // Show modal
    modal.style.display = 'block';
    
    // Close Logic
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
    
    // 3. Handle Form Submission
    const form = document.getElementById('quickBookingForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const btn = this.querySelector('button[type="submit"]');
        const msgBox = document.getElementById('bookingMsg');
        const formData = new FormData(this);

        // UI Feedback
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        btn.disabled = true;
        msgBox.style.display = 'none';

        try {
            const response = await fetch('../backend/hostel.php', { 
                method: 'POST',
                body: formData
            });
            
            const text = await response.text();
            let data;
            
            try {
                data = JSON.parse(text);
            } catch (err) {
                console.error("PHP Error:", text); 
                throw new Error("Server returned invalid data.");
            }

            if (data.status === 'success') {
                msgBox.textContent = "Booking Successful! Redirecting...";
                msgBox.style.color = '#155724';
                msgBox.style.background = '#d4edda';
                msgBox.style.display = 'block';
                
                setTimeout(() => {
                    modal.style.display = 'none';
                    // Optional: Redirect to dashboard
                }, 2000);
            } else {
                msgBox.textContent = data.message;
                msgBox.style.color = '#721c24';
                msgBox.style.background = '#f8d7da';
                msgBox.style.display = 'block';
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        } catch (err) {
            console.error(err);
            msgBox.textContent = "Connection failed. Please try again.";
            msgBox.style.color = '#721c24';
            msgBox.style.background = '#f8d7da';
            msgBox.style.display = 'block';
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });
}