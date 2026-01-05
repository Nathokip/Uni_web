// Main JavaScript for UniStay

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initSearch();
    initHostelCards();
    initImageSliders();
    initMobileMenu();
    initScrollEffects();
});

// Navbar scroll effect
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
            
            if (currentScroll > lastScroll && currentScroll > 400) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

// Search functionality
function initSearch() {
    const searchForm = document.getElementById('searchForm');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const location = document.getElementById('location').value;
            const price = document.getElementById('price').value;
            const roommate = document.getElementById('roommate').value;
            
            // In a real app, this would make an API call
            // For demo, we'll show a loading state
            const searchBtn = searchForm.querySelector('button[type="submit"]');
            const originalText = searchBtn.innerHTML;
            
            searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
            searchBtn.disabled = true;
            
            // Simulate search delay
            setTimeout(() => {
                searchBtn.innerHTML = originalText;
                searchBtn.disabled = false;
                
                // Show search results
                alert(`Searching for hostels in ${location || 'any location'} with price range ${price || 'any price'} and roommate preference: ${roommate || 'any'}`);
                
                // Redirect to hostels page with search params
                const params = new URLSearchParams();
                if (location) params.append('location', location);
                if (price) params.append('price', price);
                if (roommate) params.append('roommate', roommate);
                
                window.location.href = `hostels.html?${params.toString()}`;
            }, 1500);
        });
    }
}

// Hostel cards functionality
function initHostelCards() {
    const hostelGrid = document.getElementById('featuredHostels');
    
    if (hostelGrid) {
        // Sample hostel data
        const hostels = [
            {
                id: 1,
                name: "Maisha Hostel",
                location: "Dedan Kimathi University, Boma, opposite Sunrise hostel",
                currentPrice: "KES 6,000",
                originalPrice: "KES 12,000",
                discount: "17% off",
                savings: "Save KES 6,000",
                roommate: "Stay Alone",
                rating: 4.5,
                reviews: 24,
                images: [
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                ]
            },
            {
                id: 2,
                name: "Paradise Hostels",
                location: "DeKUT, Gate A",
                currentPrice: "KES 7,200",
                originalPrice: "KES 8,500",
                discount: "15% off",
                savings: "Save KES 1,300",
                roommate: "Share with Roommate",
                rating: 4.0,
                reviews: 18,
                images: [
                    "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                ]
            },
            {
                id: 3,
                name: "Catholic Hostel",
                location: "DeKUT, Gate B, Nyeri View",
                currentPrice: "KES 2,999",
                originalPrice: "KES 4,000",
                discount: "25% off",
                savings: "Save KES 1,001",
                roommate: "Stay Alone",
                rating: 3.5,
                reviews: 12,
                images: [
                    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                ]
            }
        ];
        
        // Render hostel cards
        hostelGrid.innerHTML = hostels.map(hostel => createHostelCard(hostel)).join('');
        
        // Add event listeners to book buttons
        document.querySelectorAll('.btn-book').forEach(button => {
            button.addEventListener('click', function() {
                const hostelId = this.getAttribute('data-id');
                bookHostel(hostelId);
            });
        });
        
        // Add event listeners to view details buttons
        document.querySelectorAll('.btn-details').forEach(button => {
            button.addEventListener('click', function() {
                const hostelId = this.getAttribute('data-id');
                viewHostelDetails(hostelId);
            });
        });
    }
}

// Create hostel card HTML
function createHostelCard(hostel) {
    const stars = generateStarRating(hostel.rating);
    const roommateIcon = hostel.roommate.includes('Share') ? 'fa-users' : 'fa-user';
    
    return `
        <div class="hostel-card" data-id="${hostel.id}">
            <div class="discount-badge">${hostel.discount}</div>
            <div class="hostel-images">
                <div class="image-slider" id="slider-${hostel.id}">
                    ${hostel.images.map(img => `<img src="${img}" alt="${hostel.name}">`).join('')}
                </div>
                <div class="image-nav" id="nav-${hostel.id}">
                    ${hostel.images.map((_, i) => `<div class="image-dot ${i === 0 ? 'active' : ''}" data-slide="${i}"></div>`).join('')}
                </div>
            </div>
            
            <div class="hostel-info">
                <div class="hostel-header">
                    <div>
                        <h3 class="hostel-title">${hostel.name}</h3>
                        <p class="hostel-location">
                            <i class="fas fa-map-marker-alt"></i> ${hostel.location}
                        </p>
                    </div>
                </div>
                
                <div class="hostel-price">
                    <span class="current-price">${hostel.currentPrice}</span>
                    <span class="original-price">${hostel.originalPrice}</span>
                    <span class="save-badge">${hostel.savings}</span>
                </div>
                
                <div class="hostel-meta">
                    <span class="roommate-tag">
                        <i class="fas ${roommateIcon}"></i> ${hostel.roommate}
                    </span>
                    <div class="rating">
                        ${stars}
                        <span>${hostel.rating} (${hostel.reviews})</span>
                    </div>
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

// Generate star rating HTML
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

// Initialize image sliders
function initImageSliders() {
    document.querySelectorAll('.hostel-images').forEach(container => {
        const slider = container.querySelector('.image-slider');
        const dots = container.querySelectorAll('.image-dot');
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
    slider.style.transform = `translateX(-${slideIndex * 25}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[slideIndex].classList.add('active');
}

// Mobile menu functionality
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            const isVisible = navLinks.style.display === 'flex';
            
            if (isVisible) {
                navLinks.style.display = 'none';
                authButtons.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.backgroundColor = 'var(--white)';
                navLinks.style.padding = '2rem';
                navLinks.style.boxShadow = 'var(--shadow-lg)';
                navLinks.style.gap = '1rem';
                
                authButtons.style.display = 'flex';
                authButtons.style.flexDirection = 'column';
                authButtons.style.position = 'absolute';
                authButtons.style.top = 'calc(100% + 250px)';
                authButtons.style.left = '0';
                authButtons.style.right = '0';
                authButtons.style.backgroundColor = 'var(--white)';
                authButtons.style.padding = '2rem';
                authButtons.style.boxShadow = 'var(--shadow-lg)';
                authButtons.style.gap = '1rem';
            }
        });
    }
}

// Scroll effects
function initScrollEffects() {
    // Add fade-in animation for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.hostel-card, .feature-card, .step-card').forEach(card => {
        observer.observe(card);
    });
}

// Book hostel function
function bookHostel(hostelId) {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('unistay_user') !== null;
    
    if (!isLoggedIn) {
        // Redirect to login page
        window.location.href = `login.html?redirect=booking&hostel=${hostelId}`;
        return;
    }
    
    // Redirect to booking page
    window.location.href = `booking.html?hostel=${hostelId}`;
}

// View hostel details
function viewHostelDetails(hostelId) {
    window.location.href = `hostel-details.html?id=${hostelId}`;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0
    }).format(amount);
}

// Add fade-in animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-in {
        animation: fadeIn 0.6s ease-out forwards;
    }
`;
document.head.appendChild(style);