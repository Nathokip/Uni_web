// hostels.js - Search Algorithm and Hostel Management

document.addEventListener('DOMContentLoaded', function() {
    // Initialize
    initHostelsPage();
    initSearchAlgorithm();
    initFilters();
    initPagination();
});

// Hostel Data (In real app, this would come from API)
const hostelsData = [
    {
        id: 1,
        name: "Maisha Hostel",
        location: "Dedan Kimathi University, Boma, opposite Sunrise hostel",
        price: 6000,
        originalPrice: 12000,
        discount: 50,
        roommateOption: "alone",
        rating: 4.5,
        reviews: 24,
        images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        ],
        amenities: ["WiFi", "Security", "Laundry", "Study Room"],
        description: "Modern hostel with great views of the campus. Each room has ensuite bathroom and high-speed WiFi.",
        landlord: "John Kamau",
        verified: true,
        available: true
    },
    {
        id: 2,
        name: "Paradise Hostels",
        location: "DeKUT, Gate A",
        price: 7200,
        originalPrice: 8500,
        discount: 15,
        roommateOption: "share",
        rating: 4.0,
        reviews: 18,
        images: [
            "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        ],
        amenities: ["WiFi", "Common Kitchen", "Security", "TV Room"],
        description: "Affordable shared accommodation with common study areas and 24/7 security.",
        landlord: "Sarah Wambui",
        verified: true,
        available: true
    },
    {
        id: 3,
        name: "Catholic Hostel",
        location: "DeKUT, Gate B, Nyeri View",
        price: 2999,
        originalPrice: 4000,
        discount: 25,
        roommateOption: "alone",
        rating: 3.5,
        reviews: 12,
        images: [
            "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        ],
        amenities: ["WiFi", "Security", "Prayer Room"],
        description: "Budget-friendly accommodation with quiet environment perfect for studying.",
        landlord: "Catholic Diocese",
        verified: true,
        available: true
    },
    // Add more hostels as needed...
];

let currentHostels = [...hostelsData];
let currentPage = 1;
const hostelsPerPage = 6;

function initHostelsPage() {
    displayHostels(currentHostels);
    updateResultsCount();
}

// Display hostels in grid
function displayHostels(hostels) {
    const hostelsGrid = document.getElementById('hostelsGrid');
    const loadingState = document.getElementById('loadingState');
    const noResults = document.getElementById('noResults');
    
    // Show loading
    loadingState.style.display = 'block';
    hostelsGrid.innerHTML = '';
    
    // Simulate loading delay
    setTimeout(() => {
        loadingState.style.display = 'none';
        
        if (hostels.length === 0) {
            noResults.style.display = 'block';
            hostelsGrid.style.display = 'none';
            return;
        }
        
        noResults.style.display = 'none';
        hostelsGrid.style.display = 'grid';
        
        // Calculate pagination
        const startIndex = (currentPage - 1) * hostelsPerPage;
        const endIndex = startIndex + hostelsPerPage;
        const paginatedHostels = hostels.slice(startIndex, endIndex);
        
        // Create hostel cards
        hostelsGrid.innerHTML = paginatedHostels.map(hostel => createHostelCard(hostel)).join('');
        
        // Add event listeners
        addHostelCardListeners();
    }, 500);
}

// Create hostel card HTML
function createHostelCard(hostel) {
    const savings = hostel.originalPrice - hostel.price;
    const roommateIcon = hostel.roommateOption === 'alone' ? 'fa-user' : 'fa-users';
    const stars = generateStarRating(hostel.rating);
    
    return `
        <div class="hostel-card" data-id="${hostel.id}">
            <div class="discount-badge">${hostel.discount}% off</div>
            <div class="hostel-images">
                <div class="image-slider" id="slider-${hostel.id}">
                    ${hostel.images.map(img => `<img src="${img}" alt="${hostel.name}">`).join('')}
                </div>
                ${hostel.images.length > 1 ? `
                    <div class="image-nav" id="nav-${hostel.id}">
                        ${hostel.images.map((_, i) => `<div class="image-dot ${i === 0 ? 'active' : ''}" data-slide="${i}"></div>`).join('')}
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
                    <span class="current-price">KES ${hostel.price.toLocaleString()}</span>
                    <span class="original-price">KES ${hostel.originalPrice.toLocaleString()}</span>
                    <span class="save-badge">Save KES ${savings.toLocaleString()}</span>
                </div>
                
                <div class="hostel-meta">
                    <span class="roommate-tag">
                        <i class="fas ${roommateIcon}"></i> ${hostel.roommateOption === 'alone' ? 'Stay Alone' : 'Share Room'}
                    </span>
                    <div class="rating">
                        ${stars}
                        <span>${hostel.rating} (${hostel.reviews})</span>
                    </div>
                </div>
                
                <div class="amenities-preview">
                    ${hostel.amenities.slice(0, 3).map(amenity => 
                        `<span class="amenity-tag"><i class="fas fa-check"></i> ${amenity}</span>`
                    ).join('')}
                    ${hostel.amenities.length > 3 ? 
                        `<span class="amenity-tag">+${hostel.amenities.length - 3} more</span>` : ''
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
        
        // Auto slide every 5 seconds
        const slideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % dots.length;
            updateSlider(slider, dots, currentSlide);
        }, 5000);
        
        // Click on dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateSlider(slider, dots, currentSlide);
                clearInterval(slideInterval);
            });
        });
        
        // Pause on hover
        container.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        container.addEventListener('mouseleave', () => {
            slideInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % dots.length;
                updateSlider(slider, dots, currentSlide);
            }, 5000);
        });
    });
}

function updateSlider(slider, dots, slideIndex) {
    if (!slider || !dots) return;
    
    slider.style.transform = `translateX(-${slideIndex * 100}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[slideIndex].classList.add('active');
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
            document.getElementById('locationSearch').value = location;
            performSearch(location);
        });
    });
}

function performSearch(searchTerm) {
    // Advanced search algorithm
    const filteredHostels = hostelsData.filter(hostel => {
        // Search in multiple fields
        const searchFields = [
            hostel.name.toLowerCase(),
            hostel.location.toLowerCase(),
            hostel.description.toLowerCase()
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
    const minPriceDisplay = document.getElementById('minPrice');
    const maxPriceDisplay = document.getElementById('maxPrice');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const sortSelect = document.getElementById('sortBy');
    
    if (priceSlider) {
        priceSlider.addEventListener('input', function() {
            maxPriceDisplay.textContent = this.value.toLocaleString();
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
    document.getElementById('clearAllFilters')?.addEventListener('click', resetAllFilters);
}

function applyFilters() {
    const maxPrice = parseInt(document.getElementById('priceSlider').value);
    const roommateOption = document.querySelector('input[name="roommate"]:checked').value;
    
    let filteredHostels = hostelsData.filter(hostel => {
        // Price filter
        if (hostel.price > maxPrice) return false;
        
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
    const filteredHostels = hostelsData.filter(hostel => hostel.rating >= minRating);
    
    currentHostels = filteredHostels;
    currentPage = 1;
    displayHostels(currentHostels);
    updateResultsCount();
}

function sortHostels(sortBy) {
    let sortedHostels = [...currentHostels];
    
    switch(sortBy) {
        case 'price-low':
            sortedHostels.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedHostels.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sortedHostels.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            // Assuming newer hostels have higher IDs
            sortedHostels.sort((a, b) => b.id - a.id);
            break;
        default:
            // Featured (original order)
            break;
    }
    
    currentHostels = sortedHostels;
    displayHostels(currentHostels);
}

function resetAllFilters() {
    // Reset price slider
    document.getElementById('priceSlider').value = 20000;
    document.getElementById('maxPrice').textContent = '20,000';
    
    // Reset roommate selection
    document.querySelector('input[name="roommate"][value="any"]').checked = true;
    
    // Reset search
    document.getElementById('locationSearch').value = '';
    
    // Reset rating
    document.querySelector('.rating-text').textContent = '4+ stars';
    
    // Reset sort
    document.getElementById('sortBy').value = 'featured';
    
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
                goToPage(parseInt(this.textContent));
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
    const nextBtn = document.getElementById('prevPage');
    const pageNumbers = document.querySelectorAll('.page-number');
    const totalPages = Math.ceil(currentHostels.length / hostelsPerPage);
    
    // Update previous button
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    
    // Update next button
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
    }
    
    // Update page numbers
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
    const isLoggedIn = localStorage.getItem('unistay_user') !== null;
    
    if (!isLoggedIn) {
        // Redirect to login
        window.location.href = `login.html?redirect=booking&hostel=${hostelId}`;
        return;
    }
    
    // Show booking modal or redirect to booking page
    const hostel = hostelsData.find(h => h.id === hostelId);
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
    const bookingForm = document.getElementById('bookingForm');
    
    if (!modal || !bookingForm) return;
    
    // Create booking form
    bookingForm.innerHTML = `
        <div class="booking-summary">
            <h4>${hostel.name}</h4>
            <p><i class="fas fa-map-marker-alt"></i> ${hostel.location}</p>
            <div class="price-breakdown">
                <div class="price-item">
                    <span>Monthly Rent:</span>
                    <span>KES ${hostel.price.toLocaleString()}</span>
                </div>
                <div class="price-item total">
                    <span>First Month Total:</span>
                    <span>KES ${hostel.price.toLocaleString()}</span>
                </div>
            </div>
        </div>
        
        <form id="quickBookingForm">
            <div class="form-group">
                <label for="moveInDate">Move-in Date</label>
                <input type="date" id="moveInDate" class="form-control" required>
            </div>
            
            <div class="form-group">
                <label for="duration">Duration</label>
                <select id="duration" class="form-control">
                    <option value="1">1 Month</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                </select>
            </div>
            
            <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 1rem;">
                <i class="fas fa-lock"></i> Confirm Booking
            </button>
        </form>
    `;
    
    // Show modal
    modal.style.display = 'block';
    
    // Close modal when clicking X
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Handle booking form submission
    document.getElementById('quickBookingForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        // Process booking
        alert(`Booking confirmed for ${hostel.name}! Redirecting to payment...`);
        modal.style.display = 'none';
    });
}